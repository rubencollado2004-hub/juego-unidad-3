"use strict";

// Buscamos los elementos por su id para poder utilizarlos desde JavaScript.
// const indica que estas referencias no se van a reasignar.
const botonInicio = document.getElementById("boton-inicio");
const mensaje = document.getElementById("mensaje");

// Una función agrupa instrucciones. Estas se ejecutan cuando llamamos a la función.
function mostrarInicio() {
    // textContent cambia únicamente el texto del párrafo.
    // Por ahora mostramos un aviso: el formulario llegará en el siguiente avance.
    mensaje.textContent = "Inicio preparado. El siguiente paso será crear tu perfil.";
}

// Registramos la función que debe ejecutarse al hacer clic.
// No escribimos mostrarInicio() porque eso la ejecutaría al cargar la página.
botonInicio.addEventListener("click", mostrarInicio);
