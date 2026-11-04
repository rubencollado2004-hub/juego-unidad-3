"use strict";

// defer hace que este código se ejecute después de crear los elementos del HTML.
const formularioJugador = document.getElementById("formulario-jugador");
const campoNombre = document.getElementById("nombre");
const campoFecha = document.getElementById("fecha-nacimiento");
const mensaje = document.getElementById("mensaje");
const panelJugador = document.getElementById("panel-jugador");
const textoNombre = document.getElementById("nombre-jugador");
const textoEdad = document.getElementById("edad-jugador");
const zonaJuego = document.getElementById("zona-juego");
const textoSuma = document.getElementById("suma");
const formularioRespuesta = document.getElementById("formulario-respuesta");
const campoRespuesta = document.getElementById("respuesta");
const botonComprobar = document.getElementById("boton-comprobar");
const botonSiguiente = document.getElementById("boton-siguiente");
const mensajeJuego = document.getElementById("mensaje-juego");
const textoHistorial = document.getElementById("historial");
const textoPuntuacion = document.getElementById("puntuacion");
const EDAD_MINIMA = 12;

// Guardaremos estos datos solo cuando el perfil sea válido.
// let permite cambiar su valor; const se utiliza para valores que no reasignamos.
let nombreJugador = "";
let edadJugador = 0;
let numero1 = 0;
let numero2 = 0;
let resuelta = false;
let puntuacion = 0;

// Un array guarda varios datos. Aquí añadiremos las sumas acertadas.
const historial = [];

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

function cambiarColorPanel() {
    // style.backgroundColor cambia el fondo del panel desde JavaScript.
    // Usamos un if/else sencillo: azul para mayores de edad y verde para menores.
    if (edadJugador >= 18) {
        panelJugador.style.backgroundColor = "#dbeafe"; // Azul claro.
    } else {
        panelJugador.style.backgroundColor = "#dcfce7"; // Verde claro.
    }
}

function mostrarPanel() {
    // toUpperCase es un método de String: convierte el nombre a mayúsculas.
    // textContent muestra texto, sin interpretar lo escrito como código HTML.
    textoNombre.textContent = "Jugador: " + nombreJugador.toUpperCase();

    // La edad ya se calculó con los métodos de Date en calcularEdad.
    textoEdad.textContent = "Edad: " + edadJugador + " años";
    cambiarColorPanel();
    panelJugador.hidden = false; // Hace visible el panel.
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
    mostrarPanel();
    zonaJuego.hidden = false;
    siguienteMision();
}

function siguienteMision() {
    if (nombreJugador === "") {
        return; // No generamos una misión sin un perfil válido.
    }

    // random da un decimal desde 0 hasta menos de 1.
    // Multiplicamos por 10, floor quita los decimales y +1 da un número del 1 al 10.
    numero1 = Math.floor(Math.random() * 10) + 1;
    numero2 = Math.floor(Math.random() * 10) + 1;
    textoSuma.textContent = numero1 + " + " + numero2 + " = ?";
    campoRespuesta.value = "";
    resuelta = false; // Esta nueva suma todavía no se ha acertado.
    botonComprobar.disabled = false;
    mensajeJuego.textContent = "";
    campoRespuesta.focus();
}

function comprobarRespuesta(evento) {
    evento.preventDefault();

    if (nombreJugador === "" || resuelta) {
        return; // Una suma ya acertada no se puede registrar dos veces.
    }

    // value es texto. Number lo convierte a un número para comparar la respuesta.
    const respuesta = Number(campoRespuesta.value);
    if (campoRespuesta.value.trim() === "" || !Number.isInteger(respuesta)) {
        mensajeJuego.textContent = "Escribe un número entero.";
        return;
    }

    if (respuesta === numero1 + numero2) {
        resuelta = true;
        botonComprobar.disabled = true;
        // push añade un dato al final del array; join une los datos para mostrarlos.
        historial.push(numero1 + " + " + numero2 + " = " + respuesta);
        textoHistorial.textContent = historial.join(" | ");
        // Solo sumamos aquí: el control de resuelta impide repetir el punto.
        puntuacion = puntuacion + 1;
        textoPuntuacion.textContent = "Puntos: " + puntuacion;
        mensajeJuego.textContent = "¡Correcto! Has ganado 1 punto. Pulsa Siguiente.";
    } else {
        mensajeJuego.textContent = "No es correcto. Inténtalo otra vez.";
    }
}

// La función se ejecuta al enviar el formulario, no al cargar la página.
formularioJugador.addEventListener("submit", validarPerfil);

formularioRespuesta.addEventListener("submit", comprobarRespuesta);
botonSiguiente.addEventListener("click", siguienteMision);
