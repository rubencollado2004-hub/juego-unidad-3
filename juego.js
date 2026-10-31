"use strict";

// defer hace que este código se ejecute después de crear los elementos del HTML.
const formularioJugador = document.getElementById("formulario-jugador");
const campoNombre = document.getElementById("nombre");
const campoFecha = document.getElementById("fecha-nacimiento");
const mensaje = document.getElementById("mensaje");
const EDAD_MINIMA = 12;

// Guardaremos estos datos solo cuando el perfil sea válido.
// let permite cambiar su valor; const se utiliza para valores que no reasignamos.
let nombreJugador = "";
let edadJugador = 0;

function calcularEdad(nacimiento, hoy) {
    // Primero restamos los años. Luego comprobamos si ya ha cumplido años.
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();

    // Si su cumpleaños todavía no ha llegado, restamos un año.
    if (mesActual < mesNacimiento ||
        (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
        edad = edad - 1;
    }

    return edad;
}

function validarPerfil(evento) {
    // Evita que el formulario recargue la página al pulsar Comenzar o Enter.
    evento.preventDefault();

    // trim elimina los espacios de los extremos: "   " se convierte en "".
    const nombre = campoNombre.value.trim();
    const fecha = campoFecha.value;

    // Empezamos denegando el acceso. Solo lo permitimos si pasan todas las pruebas.
    mensaje.textContent = "Acceso denegado";

    if (nombre === "" || fecha === "" || !campoFecha.validity.valid) {
        return; // Termina la función: no seguimos con un dato vacío o incorrecto.
    }

    // El campo date devuelve año-mes-día. Añadimos la hora para usar la fecha local.
    const nacimiento = new Date(fecha + "T00:00:00");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Quitamos la hora para comparar solo los días.

    // isNaN detecta una fecha que JavaScript no ha podido interpretar.
    // La comparación del día también rechaza fechas como el 30 de febrero,
    // que JavaScript puede convertir automáticamente en un día de marzo.
    const diaEscrito = Number(fecha.slice(8, 10));
    if (isNaN(nacimiento.getTime()) || nacimiento.getDate() !== diaEscrito ||
        nacimiento >= hoy) {
        return; // Rechazamos fechas imposibles, la fecha de hoy y fechas futuras.
    }

    const edad = calcularEdad(nacimiento, hoy);
    if (edad < EDAD_MINIMA) {
        return; // Debe haber cumplido al menos 12 años.
    }

    // Solo llegamos aquí si todos los datos son correctos.
    nombreJugador = nombre;
    edadJugador = edad;
    formularioJugador.hidden = true;
    mensaje.textContent = "Acceso permitido. Perfil creado.";
    // En el próximo avance mostraremos el panel con el nombre y la edad.
}

// La función se ejecuta al enviar el formulario, no al cargar la página.
formularioJugador.addEventListener("submit", validarPerfil);
