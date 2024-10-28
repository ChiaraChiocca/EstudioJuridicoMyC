import { seleccionarExpedientes, insertarExpedientes, actualizarExpedientes, eliminarExpedientes } from '../modelos/expedientes.js';

/* Objetos del DOM */
// Listado de expedientes
const listado = document.querySelector("#listado");

// Alerta
const alerta = document.querySelector("#alerta");

// Formulario
const formulario = document.querySelector("#formulario");
const formularioModal = new bootstrap.Modal(document.querySelector("#formularioModal"));
const btnNuevo = document.querySelector("#btnNuevo");

// Inputs
const inputId = document.querySelector("#id");
const inputTipoExpediente = document.querySelector("#tipoExpediente");
const inputNroExpediente = document.querySelector("#nroExpediente");
const inputJuzgado = document.querySelector("#juzgado");
const inputCaratula = document.querySelector("#caratula");
const inputFechaInicio = document.querySelector("#fechaInicio");
const inputTipoJuicio = document.querySelector("#tipoJuicio");
const inputAcargode = document.querySelector("#acargode");
const inputFechaFin = document.querySelector("#fechaFin");
const inputEstado = document.querySelector("#estado");
const inputFechaBaja = document.querySelector("#fechaBaja");

// Variables 
let opcion = '';
let id;
let mensajeAlerta;

let expedientes = [];
let expediente = {};

/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */
document.addEventListener('DOMContentLoaded', async () => {
    expedientes = await obtenerExpedientes();
    mostrarExpedientes();
});

/**
 * Obtiene los expedientes
 */
async function obtenerExpedientes() {
    expedientes = await seleccionarExpedientes();
    return expedientes;
}

/**
 * Muestra los expedientes en formato tabla
 */
function mostrarExpedientes() {
    listado.innerHTML = '';
    expedientes.forEach((expediente) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expediente.id}</td>
            <td>${expediente.tipoExpediente}</td>
            <td>${expediente.nroExpediente}</td>
            <td>${expediente.juzgado}</td>
            <td>${expediente.caratula}</td>
            <td>${expediente.fechaInicio}</td>
            <td>${expediente.tipoJuicio}</td>
            <td>${expediente.acargode}</td>
            <td>${expediente.fechaFin || '-'}</td>
            <td>${expediente.estado}</td>
            <td>${expediente.fechaBaja || '-'}</td>
        `;
        listado.appendChild(row);
    });
}

/**
 * Ejecuta el evento click del botón Nuevo
 */
btnNuevo.addEventListener('click', () => {
    // Limpiamos los inputs
    inputId.value = null;
    inputTipoExpediente.value = null;
    inputNroExpediente.value = null;
    inputJuzgado.value = null;
    inputCaratula.value = null;
    inputFechaInicio.value = null;
    inputTipoJuicio.value = null;
    inputAcargode.value = null;
    inputFechaFin.value = null;
    inputEstado.value = null;
    inputFechaBaja.value = null;

    // Mostrar el formulario Modal
    formularioModal.show();
    opcion = 'insertar';
})

/**
 *  Ejecuta el evento submit del formulario
 */
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenimos la acción por defecto

    const datos = new FormData(formulario); // Guardamos los datos del formulario

    switch (opcion) {
        case 'insertar':
            mensajeAlerta = 'Datos guardados';
            insertarExpedientes(datos);
            break;

        case 'actualizar':
            mensajeAlerta = 'Datos actualizados';
            actualizarExpedientes(datos, id);
            break;
    }
    insertarAlerta(mensajeAlerta, 'success');
    mostrarExpedientes();
})

/**
 * Define los mensajes de alerta
 * @param mensaje el mensaje a mostrar
 * @param tipo el tipo de alerta
 */
const insertarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alerta.append(envoltorio);
}

/**
 * Determina en qué elemento se realiza un evento
 * @param elemento el elemento al que se le realiza el evento
 * @param evento el evento realizado
 * @param selector el selector seleccionado
 * @param manejador el método que maneja el evento
 */
const on = (elemento, evento, selector, manejador) => {
    elemento.addEventListener(evento, e => { // Agregamos el método para escuchar el evento
        if (e.target.closest(selector)) { // Si el objetivo del manejador es el selector 
            manejador(e); // Ejecutamos el método del manejador 
        }
    })
}

/**
 * Función para el botón Editar
 */
on(document, 'click', '.btn-editar', e => {
    const cardFooter = e.target.parentNode; // Guardamos el elemento padre del botón

    // Guardamos los valores del card del expediente
    id = cardFooter.querySelector('.id-expediente').value;
    expediente = expedientes.find(item => item.id == id);

    // Asignamos los valores a los input del formulario
    inputId.value = expediente.id;
    inputTipoExpediente.value = expediente.tipoExpediente;
    inputNroExpediente.value = expediente.nroExpediente;
    inputJuzgado.value = expediente.juzgado;
    inputCaratula.value = expediente.caratula;
    inputFechaInicio.value = expediente.fechaInicio;
    inputTipoJuicio.value = expediente.tipoJuicio;
    inputAcargode.value = expediente.acargode;
    inputFechaFin.value = expediente.fechaFin;
    inputEstado.value = expediente.estado;
    inputFechaBaja.value = expediente.fechaBaja;


    // Mostramos el formulario
    formularioModal.show();
    opcion = 'actualizar';
})

/**
 * Función para el botón Borrar
 */
on(document, 'click', '.btn-borrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-expediente').value;

    let aceptar = confirm(`¿Realmente desea eliminar el expediente ${expediente.nombreExpediente}?`);
    if (aceptar) {
        eliminarExpedientes(id);
        insertarAlerta(`${expediente.nombreExpediente} borrado`, 'danger');
        mostrarExpedientes();
    }
})