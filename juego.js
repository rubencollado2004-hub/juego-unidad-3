"use strict";

// Buscamos los elementos del HTML por su id.
// defer permite hacerlo cuando el formulario ya está creado.
const formularioJugador = document.getElementById("formulario-jugador");
const campoNombre = document.getElementById("nombre");
const campoFecha = document.getElementById("fecha-nacimiento");
const mensaje = document.getElementById("mensaje");

function recogerDatos(evento) {
    // Evita que el envío del formulario recargue la página.
    evento.preventDefault();

    // value lee lo escrito en cada campo. textContent lo muestra como texto.
    mensaje.textContent = "Datos recogidos: " + campoNombre.value +
        ". Fecha de nacimiento: " + campoFecha.value + ".";
}

// submit funciona tanto al pulsar Comenzar como al pulsar Enter en un campo.
formularioJugador.addEventListener("submit", recogerDatos);
