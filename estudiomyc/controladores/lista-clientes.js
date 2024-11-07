import { seleccionarClientes, insertarClientes, actualizarClientes, eliminarClientes } from '../modelos/clientes.js';

/* Objetos del DOM*/
// Listado de clientes
const listado = document.querySelector("#listado");

// Alerta
const alerta = document.querySelector("#alerta");

// Formulario
const formulario = document.querySelector("#formulario");
let formularioModal; // Declaramos la variable pero no la inicializamos aquí
const btnNuevo = document.querySelector("#btnNuevo");

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
let cliente = {};

/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializamos el modal después de que el DOM esté cargado
    formularioModal = new bootstrap.Modal(document.querySelector("#formularioModal"));
    clientes = await obtenerClientes();
    mostrarClientes();
});

// El resto del código permanece igual...

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
btnNuevo.addEventListener('click', () => {
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
            insertarClientes(datos);
            break;

        case 'actualizar':
            mensajeAlerta = 'Datos actualizados';
            actualizarClientes(datos, id);
            break;
    }
    insertarAlerta(mensajeAlerta, 'success');
    mostrarClientes();
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

    // Guardamos los valores del card del cliente
    id = cardFooter.querySelector('.id-cliente').value;
    cliente = clientes.find(item => item.id == id);

    // Asignamos los valores a los input del formulario
    inputId.value = cliente.id;
    inputTipoPersona.value = cliente.tipoPersona;
    inputTipoDni.value = cliente.tipoDni;
    inputApellidoRsocial.value = cliente.apellidoRsocial;
    inputNombres.value = cliente.nombres;
    inputDomicilio.value = cliente.domicilio;
    inputTelefono.value = cliente.telefono;
    inputEmail.value = cliente.email;
    inputLocalidad.value = cliente.localidad;
    inputCpostal.value = cliente.cpostal;
    inputFnacimiento.value = cliente.fnacimiento;
    inputFalta.value = cliente.falta;
    inputFbaja.value = cliente.fbaja;

    // Mostramos el formulario
    formularioModal.show();
    opcion = 'actualizar';
})

/**
 * Función para el botón Borrar
 */
on(document, 'click', '.btn-borrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-cliente').value;

    let aceptar = confirm(`¿Realmente desea eliminar el cliente ${cliente.nombreCliente}?`);
    if (aceptar) {
        eliminarClientes(id);
        insertarAlerta(`${cliente.nombreCliente} borrado`, 'danger');
        mostrarClientes();
    }
})