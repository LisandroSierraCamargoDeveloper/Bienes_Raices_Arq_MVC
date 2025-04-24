import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 20,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El Limite es 1 Archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',

    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector("#publicar")
    
        btnPublicar.addEventListener('click', function(){
            // inhabilitar el botón para evitar clicks adicionales
            btnPublicar.disabled = true
            // opcional: cambiar estilo para indicar que está deshabilitado
            btnPublicar.classList.add('opacity-50', 'cursor-not-allowed')
    
            dropzone.processQueue()
        })
    
        dropzone.on('queuecomplete', function(){
            if (dropzone.getActiveFiles().length === 0) {
                window.location.href = './mis-propiedades'
            }
        })
    }
    
}
