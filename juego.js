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
const botonAyuda = document.getElementById("boton-ayuda");
const botonReiniciar = document.getElementById("boton-reiniciar");
const mensajeGuardado = document.getElementById("mensaje-guardado");
const textoRecord = document.getElementById("record");
const mensajeRecord = document.getElementById("mensaje-record");
const EDAD_MINIMA = 12;

// Guardaremos estos datos solo cuando el perfil sea válido.
// let permite cambiar su valor; const se utiliza para valores que no reasignamos.
let nombreJugador = "";
let edadJugador = 0;
let numero1 = 0;
let numero2 = 0;
let resuelta = false;
let puntuacion = 0;
let record = 0;

// Un array guarda varios datos. Aquí añadiremos las sumas acertadas.
let historial = [];

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
    guardarPartida();
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
        actualizarRecord();
        guardarPartida();
    } else {
        mensajeJuego.textContent = "No es correcto. Inténtalo otra vez.";
    }
}

// La función se ejecuta al enviar el formulario, no al cargar la página.
formularioJugador.addEventListener("submit", validarPerfil);

formularioRespuesta.addEventListener("submit", comprobarRespuesta);
botonSiguiente.addEventListener("click", siguienteMision);

function abrirAyuda() {
    // Abrimos la ventana directamente desde el clic para evitar bloqueos.
    const ventana = window.open("", "_blank", "width=450,height=400");
    if (!ventana) {
        mensajeJuego.textContent = "Permite las ventanas emergentes para ver la ayuda.";
        return;
    }

    // El HTML es fijo. El nombre se escribe después con textContent, de forma segura.
    ventana.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Ayuda</title></head><body><h1>Cómo jugar</h1><p id="datos"></p><p>Suma los dos números y pulsa Comprobar. Cada acierto da 1 punto.</p><p>Si fallas, puedes volver a intentarlo. Siguiente muestra otra suma.</p><p>Cada suma solo puede dar un punto. Puedes cerrar esta ventana para seguir jugando.</p></body></html>');
    ventana.document.close();
    ventana.document.getElementById("datos").textContent =
        "Jugador: " + nombreJugador + ". Puntos actuales: " + puntuacion + ".";
}

botonAyuda.addEventListener("click", abrirAyuda);

function guardarPartida() {
    // Un objeto agrupa los datos de la partida con nombres fáciles de reconocer.
    const partida = {
        nombre: nombreJugador, edad: edadJugador, puntos: puntuacion,
        numero1: numero1, numero2: numero2, resuelta: resuelta, historial: historial
    };
    try {
        // sessionStorage guarda texto en esta pestaña. JSON.stringify convierte el objeto a texto.
        sessionStorage.setItem("partidaSumas", JSON.stringify(partida));
        mensajeGuardado.textContent = "Partida guardada en esta pestaña.";
    } catch (error) {
        // Si el navegador bloquea el almacenamiento, se puede seguir jugando.
        mensajeGuardado.textContent = "No se ha podido guardar la partida.";
    }
}

function cargarPartida() {
    try {
        const guardada = sessionStorage.getItem("partidaSumas");
        if (!guardada) {
            return; // Si no hay partida, dejamos visible el formulario inicial.
        }
        // JSON.parse convierte el texto guardado otra vez en un objeto.
        const partida = JSON.parse(guardada);
        // Comprobaciones básicas para no cargar datos incompletos o dañados.
        if (!partida || typeof partida.nombre !== "string" || partida.nombre.trim() === "" ||
            !Number.isInteger(partida.edad) || partida.edad < EDAD_MINIMA ||
            !Number.isInteger(partida.puntos) || partida.puntos < 0 ||
            !Number.isInteger(partida.numero1) || partida.numero1 < 1 || partida.numero1 > 10 ||
            !Number.isInteger(partida.numero2) || partida.numero2 < 1 || partida.numero2 > 10 ||
            typeof partida.resuelta !== "boolean" || !Array.isArray(partida.historial) ||
            partida.puntos !== partida.historial.length) {
            return;
        }

        nombreJugador = partida.nombre;
        edadJugador = partida.edad;
        puntuacion = partida.puntos;
        numero1 = partida.numero1;
        numero2 = partida.numero2;
        resuelta = partida.resuelta;
        historial = partida.historial;
        formularioJugador.hidden = true;
        mostrarPanel();
        zonaJuego.hidden = false;
        textoSuma.textContent = numero1 + " + " + numero2 + " = ?";
        textoPuntuacion.textContent = "Puntos: " + puntuacion;
        if (historial.length > 0) {
            textoHistorial.textContent = historial.join(" | ");
        }
        // Restaurar resuelta impide ganar otra vez el punto después de recargar.
        botonComprobar.disabled = resuelta;
        mensaje.textContent = "Partida recuperada.";
        if (resuelta) {
            mensajeJuego.textContent = "Esta suma ya está resuelta. Pulsa Siguiente.";
        }
    } catch (error) {
        mensaje.textContent = "No se pudo recuperar la partida. Introduce tus datos.";
    }
}

function reiniciarPartida() {
    try {
        // Solo borramos nuestra partida, no otros datos de la pestaña.
        sessionStorage.removeItem("partidaSumas");
        window.location.reload();
    } catch (error) {
        mensajeGuardado.textContent = "No se ha podido borrar la partida guardada.";
    }
}

botonReiniciar.addEventListener("click", reiniciarPartida);
// Se ejecuta al cargar la página: recupera la misma suma sin generar otra.
cargarPartida();

// localStorage conserva el récord aunque cierres el navegador.
// Number convierte el texto guardado a número; rechazamos valores dañados.
function cargarRecord() {
    try {
        const guardado = Number(localStorage.getItem("recordSumas"));
        if (Number.isInteger(guardado) && guardado >= 0) {
            record = Math.max(record, guardado);
        }
    } catch (error) {
        mensajeRecord.textContent = "No se pudo leer el récord guardado.";
    }
    textoRecord.textContent = "Récord: " + record;
}

function actualizarRecord() {
    // Otra pestaña puede haber mejorado el récord: lo leemos antes de guardar.
    cargarRecord();
    // Math.max elige el mayor: una partida con menos puntos no reduce el récord.
    record = Math.max(record, puntuacion);
    textoRecord.textContent = "Récord: " + record;
    try {
        localStorage.setItem("recordSumas", String(record));
        mensajeRecord.textContent = "";
    } catch (error) {
        mensajeRecord.textContent = "El récord solo se conservará mientras esta página siga abierta.";
    }
}

// Se carga después de recuperar la partida para incluir sus puntos en el récord.
cargarRecord();
actualizarRecord();

// La cookie guarda solo una preferencia, nunca el nombre ni la fecha de nacimiento.
const selectorLetra = document.getElementById("tamano-letra");
const mensajePreferencia = document.getElementById("mensaje-preferencia");

function aplicarLetra() {
    if (selectorLetra.value === "grande") {
        document.body.style.fontSize = "20px";
    } else {
        document.body.style.fontSize = "16px";
    }
}

function cargarPreferencia() {
    // document.cookie devuelve las cookies juntas, separadas por punto y coma.
    // split crea un array; trim quita los espacios que separan cada cookie.
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i = i + 1) {
        if (cookies[i].trim() === "letraSumas=grande") {
            selectorLetra.value = "grande";
        }
    }
    aplicarLetra();
}

function guardarPreferencia() {
    aplicarLetra();
    // max-age son segundos: 30 días. path=/ permite leerla en todo este sitio.
    // SameSite=Lax limita el envío de esta cookie desde otros sitios.
    document.cookie = "letraSumas=" + selectorLetra.value + "; max-age=2592000; path=/; SameSite=Lax";
    const cookies = document.cookie.split(";");
    let guardada = false;
    for (let i = 0; i < cookies.length; i = i + 1) {
        if (cookies[i].trim() === "letraSumas=" + selectorLetra.value) {
            guardada = true;
        }
    }
    if (guardada) {
        mensajePreferencia.textContent = "Preferencia guardada durante 30 días.";
    } else {
        mensajePreferencia.textContent = "El navegador no ha guardado la preferencia.";
    }
}

selectorLetra.addEventListener("change", guardarPreferencia);
cargarPreferencia();
