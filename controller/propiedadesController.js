import {  unlink } from 'node:fs/promises'
import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from "../models/index.js"
import { esVendedor, formatearFecha } from '../middleware/index.js'
import { log } from 'node:console';



const admin = async (req, res) =>{

    //Leer Query String:

    const {pagina:paginaActual} = req.query
    
    const expresion = /^[1-20]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }
 
            

    try {

        const {id} = req.usuario
            //Limites y offset para el paginador:
            const limit = 5
            const offset = (( paginaActual * limit) - limit ) 
                

                const [propiedades, total] = await Promise.all([
                      Propiedad.findAll({
                        limit:limit,
                        offset,
                        where:{
                            UsuarioId : id,
                            
                        },
                        include: [
                            {model: Categoria, as:'categoria'},
                            {model: Precio, as:'precio'},
                            {model: Mensaje, as: 'mensajes'}
                        ],
                    }),
                    Propiedad.count({
                        where:{
                            usuarioId:id
                        }
                    })
                ])
              
               
                

                res.render('propiedades/admin',{
                    pagina: 'Mis Propiedades',
                    propiedades,
                    csrfToken: req.csrfToken(),
                    paginas:Math.ceil(total / limit),
                    paginaActual: Number(paginaActual),
                    total,
                    offset,
                    limit

                })
        
     }catch (error) {
        console.log(error);
        
     }
        
   
     }
    

    

 //formulario para crear una nueva propiedadgit 
 const crear = async (req, res) => {
    // Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {} //mantener datos ingresados
    })
}

const guardar = async (req, res) => {

    // Validación
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        // Consultar Modelo de Precio y Categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios, 
            errores: resultado.array(),
            datos: req.body //Mantener Datos Ingresados
        })
    }
    


    //Crear un registro :
    const  { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria :categoriaId} = req.body 
    
    const {id : usuarioId} = req.usuario;
    

    try {

        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            Imagen: ''
        })

        const { id } = propiedadGuardada 
        res.redirect(`/propiedades/agregar-imagen/${id}`)
        
        } catch (error) {
            console.log(error);
        }

    }

    const agregarImagen = async (req,res) => {

        //Extraer datos 

      const {id} =  req.params
      
      //Validar que la Propiedad Exista:

        const propiedad = await Propiedad.findByPk(id);

        if(!propiedad){
            return  res.redirect('/mis-propiedades');
        }

       
      //Comprobar que la Propiedad no este Publicada

        if(propiedad.publicado){
            return  res.redirect('/mis-propiedades');
        }  
        
      

      //Comprobar que la Propiedad Pertenece a quien visita esta pagina

        if( req.usuario.id.toString() !== propiedad.usuarioId.toString()){
            return  res.redirect('/mis-propiedades');
        }

      
        res.render('propiedades/agregar-imagen',{
            pagina:`Agregar Imagen ${propiedad.titulo} `,
            csrfToken: req.csrfToken(),
            propiedad
        })
    }


const almacenarImagen = async (req, res, next)  => {
   
         
    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    try {
        // console.log(req.file)

        // Almacenar la imagen y publicar propiedad
        propiedad.Imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()

        next()

    } catch (error) {
        console.log(error)
    }

}

const editar = async (req,res) =>{

    const {id} = req.params

    //Validar que la Propiedad Exista:

        const propiedad = await Propiedad.findByPk(id);

        if(!propiedad){
            return  res.redirect('/mis-propiedades');
        }

    //Comprobar que la Propiedad Pertenece a quien visita esta pagina

    if( propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return  res.redirect('/mis-propiedades');
    }

    //Consultar Modelo de Precio y Categoria 
    const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
    ])
    
    res.render('propiedades/editar', {
        pagina: ` Editar Propiedad ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })

}



const guardarCambios = async (req, res) => {

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    // Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


            
    return  res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores : resultado.array(),
            datos: req.body
        })

    }

    const {id} = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URl, es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {

        return res.redirect('/mis-propiedades')
    }


    /////////////Reescribir el Objeto////////////////
    try {
    const  { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria :categoriaId} = req.body

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

        await propiedad.save();

    res.redirect('/mis-propiedades');
            
    } catch (error) {
        console.log(error); 
            
    }

}



//Eliminando Propiedad:

    const eliminar = async (req,res) =>{

       


        //Consultar la Base de Datos Mediante  "  ID "

        const {id} = req.params

        //Validar que la Propiedad Exista:

        const propiedad = await Propiedad.findByPk(id);

        if(!propiedad){
            return  res.redirect('/mis-propiedades');
        }

       //Comprobar que la Propiedad Pertenece a quien visita esta pagina

    if( propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return  res.redirect('/mis-propiedades');
     }

     //Eliminar Imagen
     await unlink(`public/uploads/${propiedad.Imagen}` )

     console.log(`Se Elimino La Imagen ${propiedad.Imagen}`)
     
     //Eliminar Propiedad:

     await propiedad.destroy()
     res.redirect('/mis-propiedades')
}



const cambiarEstado = async (req, res) => {

         

 //Consultar la Base de Datos Mediante  "  ID "
        const {id} = req.params

    //Validar que la Propiedad Exista:

    const propiedad = await Propiedad.findByPk(id);
        if(!propiedad){
            return  res.redirect('/mis-propiedades');
    }

    //Comprobar que la Propiedad Pertenece a quien visita esta pagina

    if( propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return  res.redirect('/mis-propiedades');
    }

    //actualizar:
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado: true
    })

}





//Area publica

const mostrarPropiedad = async (req , res) =>{

        const { id } = req.params

    
        //conprobar que la propiedad exista:

        const propiedad = await Propiedad.findByPk(id, {
            include: [
                {model: Categoria, as:'categoria'},
                {model: Precio, as:'precio'}
            ]
        })

        if(!propiedad || !propiedad.publicado){
            return res.redirect('/404');
        }

       
        res.render('propiedades/mostrar',{
            propiedad,
            pagina:propiedad.titulo,
            usuario: req.usuario,
            esVendedor:esVendedor(req.usuario?.id, propiedad.usuarioId),
            csrfToken: req.csrfToken()
            

            
        })

        

 }


    const enviarMensaje = async (req, res) => { 

        const { id } = req.params

        //conprobar que la propiedad exista:

        const propiedad = await Propiedad.findByPk(id,{
            include: [
                {model: Categoria, as:'categoria'},
                {model: Precio, as:'precio'}
            ]
        })

        if(!propiedad){
            return res.redirect('/404');
        }
        
        //Renderizar errores en caso de tener errores:
        // Validación
        let resultado = validationResult(req)

        if(!resultado.isEmpty()){
            return   res.render('propiedades/mostrar',{
                propiedad,
                pagina:propiedad.titulo,
                usuario: req.usuario,
                csrfToken: req.csrfToken(),
                esVendedor:esVendedor(req.usuario?.id, propiedad.usuarioId),
                errores: resultado.array()
            })
        }

        console.log(req.body)
        console.log(req.params)
        console.log(req.usuario)

        const { mensaje } = req.body
        const { id: propiedadId } = req.params
        const { id: usuarioId } = req.usuario
    

       // Obtener los datos del cuerpo de la solicitud const { mensaje } = req.body; const usuarioId = req.usuario.id; // Obtener el usuarioId desde req.usuario const propiedadId = id; // Asegurarse de obtener el id de la propiedad correctamente // Almacenar Mensaje

       
        //Almacenar Mensaje:

        await Mensaje.create({
            mensaje,
            propiedadId,
            usuarioId
        })


        res.render('propiedades/mostrar',{
            propiedad,
            pagina:propiedad.titulo,
            usuario: req.usuario,
            csrfToken: req.csrfToken(),
            esVendedor:esVendedor(req.usuario?.id, propiedad.usuarioId),
            enviado:true
        })  

    }

    //res.redirect('/')


    const verMensajes = async(req,res) => {

        const {id} = req.params

            // Validar que la propiedad exista
            const propiedad = await Propiedad.findByPk(id,{
                include: [
                    {model: Mensaje, as: 'mensajes',
                        include:[
                            {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                        ]
                    },
                ],
            })
            if(!propiedad) {
                return res.redirect('/mis-propiedades')
        }
    
        // Revisar que quien visita la URl, es quien creo la propiedad
        if(propiedad.usuarioId.toString() !== req.usuario.id.toString() ) {
            return res.redirect('/mis-propiedades')
        }
    


        res.render('propiedades/mensajes',{
            pagina:'Mensajes',
            mensajes:propiedad.mensajes,
            formatearFecha
        }

        )
    }

    

     

    




export{
    admin, 
    crear, 
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
 }