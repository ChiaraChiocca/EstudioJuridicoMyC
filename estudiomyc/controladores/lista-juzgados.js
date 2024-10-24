import { seleccionarJuzgados, insertarJuzgados, actualizarJuzgados, eliminarJuzgados } from '../modelos/juzgados.js';

/* Objetos del DOM*/
// Listado de juzgados
const listado = document.querySelector("#listado");

// Alerta
const alerta = document.querySelector("#alerta");

// Formulario
const formulario = document.querySelector("#formulario");
const formularioModal = new bootstrap.Modal(document.querySelector("#formularioModal"));
const btnNuevo = document.querySelector("#btnNuevo");

// Inputs
const inputCodigo = document.querySelector("#codigo");
const inputNroJuzgado = document.querySelector("#nroJuzgado");
const inputNombreJuzgado = document.querySelector("#nombreJuzgado");
const inputJuezTram = document.querySelector("#juezTram");
const inputSecretario = document.querySelector("#secretario");
const inputTelefono = document.querySelector("#telefono");

// Variables 
let buscar = '';
let opcion = '';
let id;
let mensajeAlerta;

let juzgados = [];
let juzgadosFiltrados = [];
let juzgado = {};

/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */
document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    juzgados = await obtenerJuzgados();
    juzgadosFiltrados = filtrarPorNombreJuzgado('');
    mostrarJuzgados();
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
 * Obtiene los juzgados
 */
async function obtenerJuzgados() {
    juzgados = await seleccionarJuzgados();
    return juzgados;
}

/**
 * Filtra los juzgados por nombre 
 * @param n el nombre del juzgado 
 * @return juzgados filtrados 
 */
function filtrarPorNombreJuzgado(n) {
    juzgadosFiltrados = juzgados.filter(item => item.nombreJuzgado.includes(n));
    return juzgadosFiltrados;
}

/**
 * Muestra los juzgados 
 */
function mostrarJuzgados() {
    listado.innerHTML = '';
    juzgadosFiltrados.map((juzgado) =>
    (listado.innerHTML += `
            <div class="col">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">
                            <span name="spancodigo">${juzgado.codigo}</span> - <span name="spannombre">${juzgado.nombreJuzgado}</span>
                        </h5>
                        <p class="card-text">
                            <strong>Nro. Juzgado:</strong> <span name="spannroJuzgado">${juzgado.nroJuzgado}</span><br>
                            <strong>Juez:</strong> <span name="spanjuez">${juzgado.juezTram}</span><br>
                            <strong>Secretario:</strong> <span name="spansecretario">${juzgado.secretario}</span><br>
                            <strong>Teléfono:</strong> <span name="spantelefono">${juzgado.telefono}</span><br>
                        </p>
                    </div>
                    <div class ="card-footer ${logueado ? 'd-flex' : 'none'};">
                        <a class="btn-editar btn btn-primary">Editar</a>
                        <a class="btn-borrar btn btn-danger">Borrar</a>
                        <input type="hidden" class="id-juzgado" value="${juzgado.id}">
                    </div>
                </div>
            </div>
        `)
    );
}

/**
 * Filtro de los juzgados
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
        if (buscar === 'Todos') {
            buscar = '';
        }
        filtrarPorNombreJuzgado(buscar);
        mostrarJuzgados();
    })
});

/**
 * Ejecuta el evento click del botón Nuevo
 */
btnNuevo.addEventListener('click', () => {
    // Limpiamos los inputs
    inputCodigo.value = null;
    inputNroJuzgado.value = null;
    inputNombreJuzgado.value = null;
    inputJuezTram.value = null;
    inputSecretario.value = null;
    inputTelefono.value = null;

    // Mostrar el formulario Modal
    formularioModal.show();

    opcion = 'insertar';
});

/**
 *  Ejecuta el evento submit del formulario
 */
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenimos la acción por defecto

    const datos = new FormData(formulario); // Guardamos los datos del formulario

    switch (opcion) {
        case 'insertar':
            mensajeAlerta = 'Datos guardados';
            insertarJuzgados(datos);
            break;

        case 'actualizar':
            mensajeAlerta = 'Datos actualizados';
            actualizarJuzgados(datos, id);
            break;
    }
    insertarAlerta(mensajeAlerta, 'success');
    mostrarJuzgados();
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
};

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
};

/**
 * Función para el botón Editar
 */
on(document, 'click', '.btn-editar', e => {
    const cardFooter = e.target.parentNode; // Guardamos el elemento padre del botón

    // Guardamos los valores del card del juzgado
    id = cardFooter.querySelector('.id-juzgado').value;
    juzgado = juzgados.find(item => item.id == id);

    // Asignamos los valores a los input del formulario
    inputCodigo.value = juzgado.codigo;
    inputNroJuzgado.value = juzgado.nroJuzgado;
    inputNombreJuzgado.value = juzgado.nombreJuzgado;
    inputJuezTram.value = juzgado.juezTram;
    inputSecretario.value = juzgado.secretario;
    inputTelefono.value = juzgado.telefono;

    // Mostramos el formulario
    formularioModal.show();
    opcion = 'actualizar';
});

/**
 * Función para el botón Borrar
 */
on(document, 'click', '.btn-borrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-juzgado').value;

    let aceptar = confirm(`¿Realmente desea eliminar el juzgado ${juzgado.nombreJuzgado}?`);
    if (aceptar) {
        eliminarJuzgados(id);
        insertarAlerta(`${juzgado.nombreJuzgado} borrado`, 'danger');
        mostrarJuzgados();
    }
});