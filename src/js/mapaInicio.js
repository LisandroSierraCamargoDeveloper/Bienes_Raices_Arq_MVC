(function() {
    // Coordenadas iniciales
    const lat = 34.040967;
    const lng = -118.1618621;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 14)

    setTimeout(() => {
    mapa.invalidateSize();
    }, 200);


    let markers = new L.FeatureGroup().addTo(mapa)

   
    

    let propiedades = [];

    const filtros = {
        categoria: '',
       precio: ''
    }


    const categoriasSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios')

  
   
 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de categorias y precio

   categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
            filtrarPropiedades();
   })

   preciosSelect.addEventListener('change', e => {
    filtros.precio = +e.target.value
        filtrarPropiedades();
    })


  
 
   
 
    // Función para obtener las propiedades
    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades';
            const respuesta = await fetch(url);
            propiedades = await respuesta.json();
            console.log('Propiedades Obtenidas', propiedades);
 
            // Llamada a la función para mostrar los pines
            mostrarPropiedades(propiedades)
 
        } catch (error) {
            console.log(error);
        }
    }

     // Función para mostrar los pines de las propiedades
     const mostrarPropiedades = (propiedades) => {

        //Limpiar los markers
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            console.log(propiedad)
            
            // Agregar pines para cada propiedad
            let marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(
                `
                <p class="text-indigo-600 font-bold ">${propiedad?.categoria.nombre} </p>
                <h1 class="text-xl font-extrabold uppercase my-3">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.Imagen}" alt="Imagen de la Propiedad: ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold ">${propiedad?.precio.nombre} </p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-700 block p-2 text-center font-bold uppercase size-1 text-sm "> Ver Propiedad </a>
               
                `
            )


            markers.addLayer(marker)

        })
    }

   const filtrarPropiedades = () => {
       const resultado = propiedades.filter( filtrarCategoria).filter( filtrarPrecio)
        mostrarPropiedades(resultado)
      
   }


    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria :  propiedad

    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio :  propiedad
      
   

  
 
    // Ejecutar la función para obtener las propiedades
    obtenerPropiedades();
})();