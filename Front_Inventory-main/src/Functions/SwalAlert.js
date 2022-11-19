import Swal from 'sweetalert2'

export function simpleAlert(text, responseHandler) {
    Swal.fire({
        title: '¿Estás seguro?',
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b31d1d',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            responseHandler();
        }
    })

}