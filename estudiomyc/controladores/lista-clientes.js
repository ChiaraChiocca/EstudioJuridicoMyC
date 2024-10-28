import { seleccionarClientes, insertarClientes, actualizarClientes, eliminarClientes } from '../modelos/clientes.js';

/* Objetos del DOM*/
// Listado de clientes
const listado = document.querySelector("#listado");

// Alerta
const alerta = document.querySelector("#alerta");

// Formulario
const formulario = document.querySelector("#formulario");
const formularioModal = new bootstrap.Modal(document.querySelector("#formularioModal"));
const btnNuevoCliente = document.querySelector("[data-bs-target='#formularioModal']");

// Inputs
const inputId = document.querySelector("#id");
const inputTipoPersona = document.querySelector("#tipoPersona");
const inputTipoDni = document.querySelector("#tipoDni");
const inputApellidoRsocial = document.querySelector("#apellidoRsocial");
const inputNombres = document.querySelector("#nombres");
const inputDomicilio = document.querySelector("#domicilio");
const inputTelefono = document.querySelector("#telefono");
const inputEmail = document.querySelector("#email");
const inputLocalidad = document.querySelector("#localidad");
const inputCpostal = document.querySelector("#cpostal");
const inputFnacimiento = document.querySelector("#fnacimiento");
const inputFalta = document.querySelector("#falta");
const inputFbaja = document.querySelector("#fbaja");

// Variables 
let opcion = '';
let id;
let mensajeAlerta;

let clientes = [];

/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */
document.addEventListener('DOMContentLoaded', async () => {
    clientes = await obtenerClientes();
    mostrarClientes();
});

/**
 * Obtiene los clientes
 */
async function obtenerClientes() {
    clientes = await seleccionarClientes();
    return clientes;
}

/**
 * Muestra los clientes en formato tabla
 */
function mostrarClientes() {
    listado.innerHTML = '';
    clientes.forEach((cliente) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.tipoPersona === '1' ? 'Física' : 'Jurídica'}</td>
            <td>${cliente.tipoDni}</td>
            <td>${cliente.apellidoRsocial}</td>
            <td>${cliente.nombres}</td>
            <td>${cliente.domicilio}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.email}</td>
            <td>${cliente.localidad}</td>
            <td>${cliente.cpostal}</td>
            <td>${cliente.fnacimiento}</td>
            <td>${cliente.falta}</td>
            <td>${cliente.fbaja || '-'}</td>
        `;
        listado.appendChild(row);
    });
}

/**
 * Ejecuta el evento click del botón Nuevo
 */
btnNuevoCliente.addEventListener('click', () => {
    // Limpiamos los inputs
    inputId.value = null;
    inputTipoPersona.value = null;
    inputTipoDni.value = null;
    inputApellidoRsocial.value = null;
    inputNombres.value = null;
    inputDomicilio.value = null;
    inputTelefono.value = null;
    inputEmail.value = null;
    inputLocalidad.value = null;
    inputCpostal.value = null;
    inputFnacimiento.value = null;
    inputFalta.value = null;
    inputFbaja.value = null;

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
            await insertarClientes(datos);
            mensajeAlerta = 'Cliente agregado correctamente';
        } else {
            await actualizarClientes(datos, id);
            mensajeAlerta = 'Cliente actualizado correctamente';
        }

        formularioModal.hide();
        clientes = await obtenerClientes();
        mostrarClientes();
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
 * Maneja los eventos de edición
 */
document.addEventListener('click', async (e) => {
    if (e.target.closest('.btn-editar')) {
        const button = e.target.closest('.btn-editar');
        id = button.dataset.id;
        const cliente = clientes.find(c => c.id == id);

        if (cliente) {
            Object.entries(cliente).forEach(([key, value]) => {
                const input = document.querySelector(`#${key}`);
                if (input) input.value = value;
            });

            opcion = 'actualizar';
            formularioModal.show();
        }
    }

    if (e.target.closest('.btn-borrar')) {
        const button = e.target.closest('.btn-borrar');
        id = button.dataset.id;
        const cliente = clientes.find(c => c.id == id);

        if (cliente && confirm(`¿Realmente desea eliminar a ${cliente.apellidoRsocial} ${cliente.nombres}?`)) {
            try {
                await eliminarClientes(id);
                clientes = await obtenerClientes();
                mostrarClientes();
                insertarAlerta('Cliente eliminado correctamente', 'success');
            } catch (error) {
                insertarAlerta('Error al eliminar el cliente', 'danger');
            }
        }
    }
});
