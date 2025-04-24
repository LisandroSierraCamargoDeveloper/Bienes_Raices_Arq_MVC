import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 1,
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

    init: function () {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        let subiendo = false

        btnPublicar.addEventListener('click', function () {
            if (subiendo) return

            subiendo = true
            btnPublicar.disabled = true
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function () {
            subiendo = false
            btnPublicar.disabled = false

            if (dropzone.getActiveFiles().length === 0) {
                window.location.href = '/mis-propiedades'
            }
        })
    }
}
