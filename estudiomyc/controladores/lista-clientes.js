import { seleccionarClientes, insertarClientes, actualizarClientes, eliminarClientes } from '../modelos/clientes.js';

/* Objetos del DOM*/
// Listado de clientes
const listado = document.querySelector("#listado");

// Alerta
const alerta = document.querySelector("#alerta");

// Formulario
const formulario = document.querySelector("#formulario");
const formularioModal = new bootstrap.Modal(document.querySelector("#formularioModal"));
const btnNuevo = document.querySelector("#btnNuevo");

// Inputs
const inputCodigo = document.querySelector("#codigo");
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
let buscar = '';
let opcion = '';
let id;
let mensajeAlerta;

let clientes = [];
let clientesFiltrados = [];
let cliente = {};

// Control de usuario
let usuario = '';
let logueado = false;

/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */
document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    clientes = await obtenerClientes();
    clientesFiltrados = filtrarPorNombre('');
    mostrarClientes();
});

/**
 * Controla si el usuario está logueado
 */
const controlUsuario = () => {
    if (sessionStorage.getItem('usuario')) {
        usuario = sessionStorage.getItem('usuario');
        logueado = true;
    } else {
        logueado = false;
    }

    if (logueado) {
        btnNuevo.style.display = 'inline';
    } else {
        btnNuevo.style.display = 'none';
    }
};

/**
 * Obtiene los clientes
 */
async function obtenerClientes() {
    clientes = await seleccionarClientes();
    return clientes;
}

/**
 * Filtra los clientes por nombre 
 * @param n el nombre del cliente 
 * @return clientes filtrados 
 */
function filtrarPorNombre(n) {
    clientesFiltrados = clientes.filter(item => item.nombres.includes(n) || item.apellidoRsocial.includes(n));
    return clientesFiltrados;
}

/**
 * Muestra los clientes 
 */
function mostrarClientes() {
    listado.innerHTML = '';
    clientesFiltrados.map((cliente) =>
    (listado.innerHTML += `
            <div class="col">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">
                            <span name="spancodigo">${cliente.codigo}</span> - <span name="spannombre">${cliente.apellidoRsocial} ${cliente.nombres}</span>
                        </h5>
                        <p class="card-text">
                            <strong>Domicilio:</strong> ${cliente.domicilio}<br>
                            <strong>Email:</strong> ${cliente.email}<br>
                            <strong>Teléfono:</strong> ${cliente.telefono}<br>
                        </p>
                        <input type="hidden" class="id-cliente" value="${cliente.id}">
                    </div>
                    <div class="card-footer ${logueado ? 'd-flex' : 'none'};">
                        <a class="btn-editar btn btn-primary">Editar</a>
                        <a class="btn-borrar btn btn-danger">Borrar</a>
                    </div>
                </div>
            </div>
        `)
    );
}

/**
 * Filtro de los clientes
 */
const botonesFiltros = document.querySelectorAll('#filtros button');
botonesFiltros.forEach(boton => {
    boton.addEventListener('click', e => {
        boton.classList.add('active');
        boton.setAttribute('aria-current', 'page');

        botonesFiltros.forEach(otroBoton => {
            if (otroBoton !== boton) {
                otroBoton.classList.remove('active');
                otroBoton.removeAttribute('aria-current');
            }
        });

        buscar = boton.innerHTML;
        if (buscar == 'Todos') {
            buscar = '';
        }
        filtrarPorNombre(buscar);
        mostrarClientes();
    });
});

/**
 * Ejecuta el evento click del botón Nuevo
 */
btnNuevo.addEventListener('click', () => {
    // Limpiamos los inputs
    inputCodigo.value = null;
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
 * Ejecuta el evento submit del formulario
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
});

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
    });
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
    inputCodigo.value = cliente.codigo;
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
});

/**
 * Función para el botón Borrar
 */
on(document, 'click', '.btn-borrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-cliente').value;

    let aceptar = confirm(`¿Realmente desea eliminar a ${cliente.apellidoRsocial} ${cliente.nombres}?`);
    if (aceptar) {
        eliminarClientes(id);
        insertarAlerta(`${cliente.apellidoRsocial} ${cliente.nombres} borrado`, 'danger');
        mostrarClientes();
    }
});