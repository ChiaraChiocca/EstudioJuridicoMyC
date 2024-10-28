import { seleccionarExpedientes, insertarExpedientes, actualizarExpedientes, eliminarExpedientes } from '../modelos/expedientes.js';

/* Objetos del DOM */
// Listado de expedientes
const listado = document.querySelector("#listado");

// Alerta
const alerta = document.querySelector("#alerta");

// Formulario
const formulario = document.querySelector("#formulario");
const formularioModal = new bootstrap.Modal(document.querySelector("#formularioModal"));
const btnNuevoExpediente = document.querySelector("[data-bs-target='#formularioModal']");

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
let buscar = '';
let opcion = '';
let id;
let mensajeAlerta;

let expedientes = [];

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
            <td class="text-center">
                ${logueado ? `
                    <button class="btn btn-sm btn-primary btn-editar me-1" data-id="${expediente.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-borrar" data-id="${expediente.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        `;
        listado.appendChild(row);
    });
}

/**
 * Ejecuta el evento click del botón Nuevo
 */
btnNuevoExpediente.addEventListener('click', () => {
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
});

/**
 * Limpia el formulario
 */
function limpiarFormulario() {
    formulario.reset();
}

/**
 * Ejecuta el evento submit del formulario
 */
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = new FormData(formulario);

    try {
        if (opcion === 'insertar') {
            await insertarExpedientes(datos);
            mensajeAlerta = 'Expediente agregado correctamente';
        } else {
            await actualizarExpedientes(datos, id);
            mensajeAlerta = 'Expediente actualizado correctamente';
        }

        formularioModal.hide();
        expedientes = await obtenerExpedientes();
        expedientesFiltrados = filtrarExpedientes(buscar);
        mostrarExpedientes();
        insertarAlerta(mensajeAlerta, 'success');
    } catch (error) {
        insertarAlerta('Error al procesar la operación', 'danger');
    }
});

/**
 * Define los mensajes de alerta
 */
const insertarAlerta = (mensaje, tipo) => {
    alerta.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
};

/**
 * Maneja los eventos de edición y eliminación
 */
document.addEventListener('click', async (e) => {
    if (e.target.closest('.btn-editar')) {
        const button = e.target.closest('.btn-editar');
        id = button.dataset.id;
        expediente = expedientes.find(exp => exp.id == id);

        if (expediente) {
            Object.entries(expediente).forEach(([key, value]) => {
                const input = document.querySelector(`#${key}`);
                if (input) input.value = value || '';
            });

            opcion = 'actualizar';
            formularioModal.show();
        }
    }

    if (e.target.closest('.btn-borrar')) {
        const button = e.target.closest('.btn-borrar');
        id = button.dataset.id;
        expediente = expedientes.find(exp => exp.id == id);

        if (expediente && confirm(`¿Realmente desea eliminar el expediente ${expediente.nroExpediente}?`)) {
            try {
                await eliminarExpedientes(id);
                expedientes = await obtenerExpedientes();
                expedientesFiltrados = filtrarExpedientes(buscar);
                mostrarExpedientes();
                insertarAlerta('Expediente eliminado correctamente', 'success');
            } catch (error) {
                insertarAlerta('Error al eliminar el expediente', 'danger');
            }
        }
    }
});