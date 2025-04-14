import {check , validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import   Usuario from '../models/Usuario.js'
import {generarId, generarJWT} from '../helpers/tokens.js'
import { emailRegistro , emailOlvidePassword} from '../helpers/emails.js'



const formularioLogin = (req , res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',//Datos hacia la vista
        csrfToken : req.csrfToken() 
    })
   
}


const autenticar = async (req,res) => {
 //validacion:
    await check('email').isEmail().withMessage('No ha Ingresado un email').run(req)
    await check('password').notEmpty().withMessage('Debe Ingresar Su Password').run(req)
    let resultado = validationResult(req) 

 //Verificar que el resultado este vacio :

    if(!resultado.isEmpty()){
        //errores
            return res.render('auth/login',{
            pagina: 'Inicial Sesion',
            csrfToken : req.csrfToken(),
            errores:  resultado.array(),
        })
    }
     

 const {email , password}  = req.body
 //Comprobar Si el Usuario Existe : 
 const usuario = await Usuario.findOne({where:  {email}})
    if(!usuario) {
        return res.render('auth/login',{
            pagina: 'Inicial Sesion',
            csrfToken : req.csrfToken(),
            errores: [{msg:'El  Usuario No Existe '}]
        })
    }

    //Comprobar si el Usuario esta Confirmado : 

    if(!usuario.confirmado) {
        return res.render('auth/login',{
            pagina: 'Inicial Sesion',
            csrfToken : req.csrfToken(),
            errores: [{msg:'No Esta Confirmado  '}]
        })
    }

    //Revisar Password:D
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Inicial Sesion',
            csrfToken : req.csrfToken(),
            errores: [{msg:' El Password No Corresponde a ese Usuario '}]
        })
    }
    
    //Autenticar al Usuario:
    const token = generarJWT( {id:usuario.id ,nombre:  usuario.nombre } )

    console.log(token);

    //Almacenar Cookie:
    return res.cookie('_token', token , {
        httpOnly:true,
        //secure:true,
    }).redirect('/mis-propiedades')

}


//ceerar sesión:
const cerrarSesion = (req, res) => {

return res.clearCookie('_token').status(200).redirect('/auth/login')

}


//Controllers Pagina de Registro
const formularioRegistro = (req , res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',//Datos hacia la vista .
        csrfToken : req.csrfToken()
    })
}

const registrar = async(req, res) => {
    //Valicacion: 
    await check('nombre').notEmpty().withMessage('El Nombre No Puede Ir Vacio').run(req)
    await check('email').isEmail().withMessage('Eso no se parece a un email').run(req)
    await check('password').isLength({min:6}).withMessage(' Debe tener al menos 6 digitos').run(req)
    await check('repitaClave').equals(req.body.password).withMessage('las claves deben ser iguales').run(req)



    let resultado = validationResult(req) 
    //Verificar que el resultado este vacio 
    if(!resultado.isEmpty()){
    //errores
        return res.render('auth/registro',{
        pagina: 'Crear Cuenta',
        csrfToken : req.csrfToken(),
        errores:  resultado.array(),
        usuario:{
            nombre: req.body.nombre,
            email: req.body.email
        }
        })

    }
    //Extraer los Datos :
    const { email , nombre , password } = req.body ;

    //Verificar que es usuario no este dublicado:
    const  existeCorreo = await Usuario.findOne({ where:{email }  });
    if(existeCorreo){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: [{msg:'El email ya esta asignado a una cuenta',}],
            usuario: {
                nombre:req.body.nombre,
                email:req.body.email
            }
        })
    }  
    const  existeUsuario = await Usuario.findOne({ where:{nombre} });
    if(existeUsuario){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: [{msg:'Nombre de usuario en uso pruebe con otro'}],
            usuario: {
                nombre:req.body.nombre,
                email:req.body.email
            }
        })
    } 

    //Almacenar Usuario:
    const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token:generarId()
   })
   
   //Envia email de Confirmacion:
   emailRegistro({
    nombre:usuario.nombre,
    email:usuario.email,
    token:usuario.token
   })


   
  //Montrar mensaje De Confirmacion :
  res.render('templates/mensaje', {
    pagina:"Cuenta Creada Correctamente",
    mensaje:"Hemos enviado un mensaje de confirmacion , Presiona en el enlace"
  })

}


//Funcion que comprueba una cuenta:
const confirmar = async ( req , res  ) => {

    const { token } = req.params;
    
        //Verificar si el token es valido :
    const usuario = await Usuario.findOne({where: {token}})

        if(!usuario){
            return res.render('auth/confirmar-cuenta' ,{
                pagina: 'error al confirmar tu cuenta ',
                mensaje:'Hubo un error al confirmar tu cuenta intenta nuevamente',
                
                error:true
            } )
       
         
        }

        //Confirmar la cuenta: 
        usuario.token  = null;
        usuario.confirmado = true;
        await usuario.save();

        return res.render('auth/confirmar-cuenta' ,{
            pagina: 'Cuenta Confirmada ',
            mensaje:' Ve a inicio y disfruta de nuestros servicios ',
    
        } )     

}


//Reinicio de Password:

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken : req.csrfToken(),
    })
}

const resetPassword = async (req, res) => {
    // Validación
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
 
    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()) {
        // Errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken : req.csrfToken(),
            errores: resultado.array()
        })
    }

    // Buscar el usuario

    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email}} )
    if(!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El Email no Pertenece a ningún usuario'}]
        })
    }


    // Generar un token y enviar el email
    usuario.token = generarId();
    await usuario.save();

    // Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

     // Mostrar mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })

}

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablece Tu Password',
        csrfToken: req.csrfToken()
    })

}

const nuevoPassword = async (req, res) => {
    // Validar el password
    await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de al menos 6 caracteres').run(req)
    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()) {
        // Errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken : req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { token } = req.params
    const { password } = req.body;

    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})
    
    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El Password se guardó correctamente'
    })

}




export{
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}

