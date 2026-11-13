# Chuleta de examen – Juego de sumas (Unidad 3)

Cada cambio dice **dónde va** (función + línea exacta del código original), **qué escribir** y, si hace falta, **qué más adaptar**.
Los números de línea son los del código original (último commit con código `c457f89`). **Se mueven en cuanto añades código**,
así que busca el texto entre comillas con **Ctrl+F**. Al final del PDF tienes el código original **con números de línea**.

## Cómo trabajar en el examen

1. Abre el juego con **Live Server** y la consola a la vez (**F12 → Consola**).
2. Haz un cambio cada vez: guarda, pulsa **F5**, prueba y solo entonces sigue con el siguiente.
3. La partida queda guardada en `sessionStorage`. Para volver a ver el formulario, pulsa **Nueva partida**.
4. Si al recargar se pierde la partida, la culpa es de `cargarPartida`, que rechaza los datos guardados que ya no encajan con tu cambio.

> ⚠️ **TRAMPA – `cargarPartida` (líneas 217–223)**: solo acepta partidas con **puntos enteros**, con
> **`puntos === historial.length`** y con **`numero1`/`numero2` del 1 al 10**. Si cambias los puntos por acierto,
> pones puntos decimales, restas puntos o cambias el rango, **adapta esas líneas**. Si no, al pulsar F5 vuelve el formulario.
> `cargarRecord` (línea 272) también exige `Number.isInteger(guardado)`, así que rechaza récords con decimales.

## Mapa del código (juego.js original)

| Línea | Función / dato | Qué hace |
| --- | --- | --- |
| 4–23 | `const ... = document.getElementById(...)` | Elementos del HTML |
| 25 | `EDAD_MINIMA = 12` | Edad mínima |
| 29–38 | `let` | nombreJugador, edadJugador, numero1, numero2, resuelta, puntuacion, record, historial |
| 40 | `calcularEdad` | Edad con Date (resta 1 si no ha cumplido) |
| 55 | `cambiarColorPanel` | Azul si ≥18, verde si no |
| 65 | `mostrarPanel` | Nombre en mayúsculas y edad |
| 76 | `validarPerfil` | Valida el formulario, "Acceso denegado"/"permitido" |
| 120 | `siguienteMision` | Genera la suma con Math.random |
| 138 | `comprobarRespuesta` | Compara (línea 152), historial, +1 punto, récord |
| 175 | `abrirAyuda` | window.open + document.write |
| 192 / 208 | `guardarPartida` / `cargarPartida` | sessionStorage `partidaSumas` |
| 253 | `reiniciarPartida` | removeItem + reload |
| 269 / 281 | `cargarRecord` / `actualizarRecord` | localStorage `recordSumas` + Math.max |
| 303 / 311 / 323 | `aplicarLetra` / `cargarPreferencia` / `guardarPreferencia` | Cookie `letraSumas` 30 días |

index.html: línea 11 es el `<script ... defer>`, la 15 el `<h1>`, la 22 el `</select>`, la 35 "Debes tener al menos 12 años", la 63 el botón Ayuda y la 67 `<p id="historial">`.

---

## 1. Mostrar info por consola

La consola se ve en **F12 → Consola**, no en la página. `console.log` sirve para datos normales, `console.warn` para avisos, `console.error` para errores y `console.table` para arrays y objetos.

**Edad del jugador**: en `mostrarPanel`, **debajo de la línea 71** `textoEdad.textContent = "Edad: " ...`:
```js
console.log("Edad del jugador:", edadJugador);
```

**Acceso permitido**: en `validarPerfil`, **debajo de la línea 114** `mensaje.textContent = "Acceso permitido. Perfil creado.";`:
```js
console.log("Acceso permitido para", nombre);
```

**Acceso denegado**: ⚠️ **no** lo pongas debajo de la línea 85 (`"Acceso denegado"`), porque esa línea se ejecuta **siempre**: la función empieza denegando. Ponlo **antes de cada `return;`** de `validarPerfil` (**líneas 88, 102 y 107**):
```js
console.error("Acceso denegado");
return;
```

**Números generados**: en `siguienteMision`, **debajo de la línea 129** `textoSuma.textContent = ...`:
```js
console.log(`Nueva suma: ${numero1} + ${numero2} = ${numero1 + numero2}`);
```

**Acierto y fallo**: en `comprobarRespuesta`. Las dos primeras líneas van **debajo de la línea 161** (`"¡Correcto! ..."`):
```js
console.log("Acierto:", numero1 + " + " + numero2 + " = " + respuesta);
console.table(historial);                 // el array como tabla
```
Y esta **debajo de la línea 165** (`"No es correcto. ..."`):
```js
console.warn("Fallo: la respuesta correcta era", numero1 + numero2);
```

**Lo guardado en sessionStorage**: en `guardarPartida`, **debajo de la línea 200** `sessionStorage.setItem(...)`:
```js
console.log("Guardado:", sessionStorage.getItem("partidaSumas"));
console.table(partida);                   // o el objeto como tabla
```

**Errores al guardar o leer**: dentro de los `catch (error) {` (**líneas 202, 248, 258, 275 y 290**): `console.error(error);`

**Cookies**: en `cargarPreferencia`, **debajo de la línea 320** `aplicarLetra();`: `console.log("Cookies:", document.cookie);`

Otros: `console.info("...")`, `console.group("Misión"); ... console.groupEnd();`, `console.count("aciertos")`, `console.time("t"); ... console.timeEnd("t")` y `console.clear()`.

---

## 2. Redondear la puntuación (Math)

| Método | 2.5 | 2.4 | -2.5 | Qué hace |
| --- | --- | --- | --- | --- |
| `Math.round(x)` | 3 | 2 | -2 | al más cercano |
| `Math.floor(x)` | 2 | 2 | -3 | hacia abajo |
| `Math.ceil(x)` | 3 | 3 | -2 | hacia arriba |
| `Math.trunc(x)` | 2 | 2 | -2 | quita los decimales |
| `x.toFixed(2)` | "2.50" | "2.40" | "-2.50" | **devuelve String** (solo para mostrar) |

Para redondear a 2 decimales y seguir teniendo un número: `Math.round(x * 100) / 100`.

**Puntos con bonus aleatorio redondeado a 1 decimal**: en `comprobarRespuesta`, **sustituye las líneas 159 y 160** (`puntuacion = puntuacion + 1;` y la de `textoPuntuacion`):
```js
const bonus = Math.random();                                   // 0 … 0.999
puntuacion = Math.round((puntuacion + 1 + bonus) * 10) / 10;   // 1 decimal
textoPuntuacion.textContent = "Puntos: " + puntuacion.toFixed(1);
```
y la línea 161 (el mensaje):
```js
mensajeJuego.textContent = "¡Correcto! +" + (1 + bonus).toFixed(1) + " puntos.";
```
Adapta también:
- `cargarPartida`, **línea 219**: cambia `!Number.isInteger(partida.puntos)` por `typeof partida.puntos !== "number"`.
- **Línea 223**: borra `partida.puntos !== partida.historial.length` y deja `!Array.isArray(partida.historial)) {` al final de la línea 222.
- `cargarRecord`, **línea 272**: cambia `Number.isInteger(guardado)` por `!isNaN(guardado)`.

**Puntos según la dificultad** (las sumas grandes dan más): sustituye la línea 159 por `puntuacion = puntuacion + Math.ceil((numero1 + numero2) / 5);` y quita la condición de la línea 223.

**Otro redondeo para los números del 1 al 10** (líneas 127–128):
```js
numero1 = Math.ceil(Math.random() * 10);       // ceil hacia arriba
numero1 = Math.round(Math.random() * 9) + 1;   // round al más cercano
```

---

## 3. Fechas (Date)

Métodos de Date:
- `getFullYear()`: el año.
- `getMonth()`: el mes, **de 0 a 11** (suma 1 para mostrarlo).
- `getDate()`: el día del mes.
- `getDay()`: el día de la semana, **0 = domingo**.
- `getHours()`, `getMinutes()`, `getSeconds()`: hora, minutos y segundos.
- `getTime()`: milisegundos desde 1970.
- `toLocaleDateString("es-ES")` y `toLocaleTimeString("es-ES")`: fecha y hora con formato español.

**Mostrar la fecha actual**. Son dos partes.
- En `index.html`, **debajo de la línea 15** `<h1>Juego de misiones</h1>`:
```html
<p id="fecha-actual"></p>
```
- **Al final de `juego.js`**:
```js
const textoFecha = document.getElementById("fecha-actual");
function mostrarFechaActual() {
    const ahora = new Date();
    textoFecha.textContent = "Hoy es " + ahora.toLocaleDateString("es-ES", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
}
mostrarFechaActual();
```
Formato manual `dd/mm/aaaa` (para meterlo dentro de la función, en lugar de la línea de `toLocaleDateString`):
```js
const dia = String(ahora.getDate()).padStart(2, "0");
const mes = String(ahora.getMonth() + 1).padStart(2, "0");   // ¡+1!
textoFecha.textContent = "Hoy es " + dia + "/" + mes + "/" + ahora.getFullYear();
```

**Reloj que se actualiza cada segundo** (al final de `juego.js`, tras lo anterior):
```js
setInterval(function () {
    textoFecha.textContent = new Date().toLocaleString("es-ES");   // fecha y hora
}, 1000);
```

**Hora de cada acierto en el historial**: en `comprobarRespuesta`, **sustituye la línea 156**:
```js
const hora = new Date().toLocaleTimeString("es-ES");
historial.push(numero1 + " + " + numero2 + " = " + respuesta + " (" + hora + ")");
```

**Día de la semana y año en que nació**: en `validarPerfil`, **debajo de la línea 105** `const edad = calcularEdad(nacimiento, hoy);`:
```js
const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
console.log("Naciste un " + diasSemana[nacimiento.getDay()] + " del año " + nacimiento.getFullYear());
```

**Días que faltan para su cumpleaños**: va en el mismo sitio (debajo de la línea 105):
```js
let cumple = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
if (cumple < hoy) {
    cumple.setFullYear(hoy.getFullYear() + 1);
}
const dias = Math.round((cumple - hoy) / (1000 * 60 * 60 * 24));
console.log("Faltan " + dias + " días para tu cumpleaños");
```

**Edad mínima**: cambia la **línea 25** `const EDAD_MINIMA = 14;` y la **línea 35 de index.html** ("al menos 14 años").
**Edad máxima**: en la **línea 106**, cambia `if (edad < EDAD_MINIMA) {` por `if (edad < EDAD_MINIMA || edad > 99) {`.

---

## 4. Modificar el color de fondo y otros estilos

Se cambian con `elemento.style.propiedad = "valor"` (en camelCase): `backgroundColor`, `color`, `borderColor`, `fontSize`.
- `document.body` cambia **toda la página**.
- `document.querySelector("main")` cambia **la caja blanca**.
- `panelJugador` cambia **solo el perfil**.

**Menor de edad: fondo de la página rojo y aviso por consola**. Sustituye `cambiarColorPanel` entera (**líneas 55–63**):
```js
function cambiarColorPanel() {
    if (edadJugador >= 18) {
        panelJugador.style.backgroundColor = "#dbeafe";   // Azul claro.
        console.log("Es mayor de edad");
    } else {
        panelJugador.style.backgroundColor = "#dcfce7";   // Verde claro.
        document.body.style.backgroundColor = "#fecaca";  // Página rojo claro.
        console.log("Es menor de edad");
    }
}
```

**Tres tramos de edad, color del texto y borde según el nombre** (otra versión de la misma función):
```js
function cambiarColorPanel() {
    if (edadJugador >= 18) {
        panelJugador.style.backgroundColor = "#dbeafe";   // Azul: mayor de edad.
        panelJugador.style.color = "#1e3a8a";             // Texto azul oscuro.
    } else if (edadJugador >= 15) {
        panelJugador.style.backgroundColor = "#fef9c3";   // Amarillo: 15-17.
    } else {
        panelJugador.style.backgroundColor = "#dcfce7";   // Verde: 12-14.
    }
    if (nombreJugador.length > 6) {
        panelJugador.style.borderColor = "red";           // Borde según el nombre.
    }
}
```

**Fondo verde al acertar y rojo al fallar**: en `comprobarRespuesta`, la primera línea va **debajo de la línea 161** y la segunda **debajo de la línea 165**:
```js
document.body.style.backgroundColor = "#bbf7d0";   // acierto
document.body.style.backgroundColor = "#fecaca";   // fallo
```

**Puntos en verde al llegar a 5**: **debajo de la línea 161**:
```js
if (puntuacion >= 5) {
    textoPuntuacion.style.color = "green";
}
```

**Color aleatorio** (por ejemplo **debajo de la línea 129**, en cada suma nueva):
```js
const r = Math.floor(Math.random() * 256);
const g = Math.floor(Math.random() * 256);
const b = Math.floor(Math.random() * 256);
document.body.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
```

**Selector de color del usuario**. Son dos partes.
- En `index.html`, **debajo de la línea 22** (el `</select>` del tamaño de letra):
```html
<label for="color-fondo">Color de fondo</label>
<input id="color-fondo" type="color" value="#eef2f6">
```
- **Al final de `juego.js`**:
```js
const selectorColor = document.getElementById("color-fondo");
selectorColor.addEventListener("input", function () {
    document.body.style.backgroundColor = selectorColor.value;
    localStorage.setItem("colorFondo", selectorColor.value);   // opcional: recordarlo
});
const colorGuardado = localStorage.getItem("colorFondo");
if (colorGuardado) {
    document.body.style.backgroundColor = colorGuardado;
    selectorColor.value = colorGuardado;
}
```

**Con una clase CSS**. En `estilos.css` añade `.oscuro { background-color: #111827; color: white; }` y en JS: `document.body.classList.toggle("oscuro");` (también existen `add`, `remove` y `contains`).

---

## 5. Obtener y modificar elementos del DOM

| Obtener | Devuelve |
| --- | --- |
| `document.getElementById("mensaje")` | el elemento con ese id |
| `document.querySelector("#panel-jugador h2")` | el **primero** que cumple el selector CSS |
| `document.querySelectorAll("button")` | todos los que lo cumplen (se recorren con `forEach`) |
| `document.getElementsByTagName("p")` / `getElementsByClassName("x")` | colecciones |

| Modificar | Para qué |
| --- | --- |
| `el.textContent = "..."` | texto (seguro, no interpreta HTML) |
| `el.innerHTML = "<b>..</b>"` | HTML (nunca con datos que escribe el usuario) |
| `el.style.color = "red"` | estilos |
| `el.classList.add/remove/toggle("x")` | clases |
| `el.setAttribute("title", "...")` / `getAttribute` | atributos |
| `el.hidden = true` | ocultar o mostrar |
| `input.value`, `boton.disabled = true` | formularios |
| `document.createElement("p")`, `padre.appendChild(el)`, `el.remove()` | crear y quitar elementos |

**Cambiar el título con el nombre**: en `mostrarPanel`, **debajo de la línea 68**:
```js
document.querySelector("h1").textContent = "Juego de " + nombreJugador;
document.title = "Juego de " + nombreJugador;       // título de la pestaña
```

**Longitud del nombre en el panel**: **sustituye la línea 68**:
```js
textoNombre.textContent = "Jugador: " + nombreJugador.toUpperCase() + " (" + nombreJugador.length + " letras)";
```

**Historial como lista `<ul>` en lugar de `join`**:
- En `index.html`, **sustituye la línea 67** por `<ul id="historial"></ul>`.
- En `juego.js`, **al final**:
```js
function pintarHistorial() {
    textoHistorial.innerHTML = "";              // vaciar la lista
    historial.forEach(function (suma) {
        const li = document.createElement("li");
        li.textContent = suma;
        textoHistorial.appendChild(li);
    });
}
```
- **Sustituye las líneas 157 y 240** (`textoHistorial.textContent = historial.join(" | ");`) por `pintarHistorial();`.

**Cambiar todos los botones a la vez**: al final de `juego.js`:
```js
document.querySelectorAll("#zona-juego button").forEach(function (boton) {
    boton.style.backgroundColor = "#16a34a";
});
```

**Botón nuevo "Pista" (el resultado es par o impar)**:
- En `index.html`, **debajo de la línea 63** (el botón Ayuda):
```html
<button id="boton-pista" type="button">Pista</button>
```
- **Al final de `juego.js`**:
```js
const botonPista = document.getElementById("boton-pista");
function mostrarPista() {
    // % da el resto de dividir: 0 es par, 1 es impar.
    if ((numero1 + numero2) % 2 === 0) {
        mensajeJuego.textContent = "Pista: el resultado es par.";
    } else {
        mensajeJuego.textContent = "Pista: el resultado es impar.";
    }
}
botonPista.addEventListener("click", mostrarPista);
```
**Receta para cualquier botón**: botón con su `id` en el HTML → `getElementById` → función → `addEventListener("click", función)`.

**Botón creado solo con JavaScript** (sin tocar el HTML), al final de `juego.js`:
```js
const botonBorrar = document.createElement("button");
botonBorrar.type = "button";
botonBorrar.textContent = "Borrar récord";
botonBorrar.addEventListener("click", function () {
    localStorage.removeItem("recordSumas");
    record = 0;
    textoRecord.textContent = "Récord: 0";
});
zonaJuego.appendChild(botonBorrar);
```

Eventos: `click`, `submit` (con `evento.preventDefault()`), `change`, `input`, `keydown`, `load`, `DOMContentLoaded`, `message` y `storage`.

---

## 6. Cambiar entre localStorage y sessionStorage

| | `sessionStorage` | `localStorage` | Cookie |
| --- | --- | --- | --- |
| Dura | mientras la pestaña siga abierta | hasta que se borre | hasta `max-age` |
| Ámbito | solo esa pestaña | todas las pestañas del sitio | se envía al servidor |
| En tu juego | `partidaSumas` | `recordSumas` | `letraSumas` |

Todos usan los mismos métodos: `setItem(clave, texto)`, `getItem(clave)`, `removeItem(clave)` y `clear()`. **Solo guardan texto**: los objetos se pasan con `JSON.stringify` / `JSON.parse` y los números con `String` / `Number`.
Para verlo: **F12 → Aplicación → Almacenamiento de sesión / Almacenamiento local / Cookies.**

**Que la partida siga al cerrar el navegador** (de session a local): cambia `sessionStorage` por `localStorage` en **3 líneas**:
- **Línea 200** (`guardarPartida`): `localStorage.setItem("partidaSumas", ...)`
- **Línea 210** (`cargarPartida`): `localStorage.getItem("partidaSumas")`
- **Línea 256** (`reiniciarPartida`): `localStorage.removeItem("partidaSumas")`
- Y el mensaje de la **línea 201**: `"Partida guardada en este navegador."`

**Récord solo durante la sesión** (de local a session): cambia `localStorage` por `sessionStorage` en **2 líneas**:
- **Línea 271** (`cargarRecord`): `sessionStorage.getItem("recordSumas")`
- **Línea 288** (`actualizarRecord`): `sessionStorage.setItem("recordSumas", ...)`

**Truco**: declara una variable arriba (debajo de la línea 25), `const almacen = localStorage;`, y usa `almacen.setItem(...)`. Así solo cambias una palabra.

**Guardar el último jugador**: en `validarPerfil`, **debajo de la línea 111** `nombreJugador = nombre;`:
```js
localStorage.setItem("ultimoJugador", nombre);
```
Para rellenar el campo al abrir la página, al final de `juego.js`:
```js
campoNombre.value = localStorage.getItem("ultimoJugador") || "";
```

**Borrar todo**: `localStorage.clear(); sessionStorage.clear();`

**Cookies**:
- **Cookie de 7 días**: en la **línea 327** cambia `max-age=2592000` por `max-age=604800` (7 × 24 × 60 × 60) y en la línea 336 pon `"... durante 7 días."`.
- **Borrar la cookie**: `document.cookie = "letraSumas=; max-age=0; path=/";`
- **Tercer tamaño de letra**:
  - En el HTML, debajo de la línea 21: `<option value="enorme">Enorme</option>`.
  - En `aplicarLetra`, la **línea 306** `} else {` pasa a ser `} else if (selectorLetra.value === "enorme") { document.body.style.fontSize = "24px"; } else {`.
  - En `cargarPreferencia`, la **línea 316** pasa a ser `if (cookies[i].trim() === "letraSumas=grande" || cookies[i].trim() === "letraSumas=enorme") {` y la 317 a `selectorLetra.value = cookies[i].trim().split("=")[1];`.

---

## 7. Mensajes entre ventanas (postMessage)

- **Enviar**: `otraVentana.postMessage(dato, origen)`.
- **Recibir**: `window.addEventListener("message", function (evento) { ... evento.data ... })`.
- **De la principal a la ayuda**: `ventana.postMessage(...)`, usando la referencia que devuelve `window.open`.
- **De la ayuda a la principal**: `window.opener.postMessage(...)`.
- **Seguridad**: comprueba siempre `evento.origin === window.location.origin`.

**Más datos en la ventana de ayuda** (sin postMessage):
- **Línea 177**: `window.open("", "_blank", "width=300,height=250")` cambia el tamaño.
- **Sustituye las líneas 186–187**:
```js
ventana.document.getElementById("datos").textContent = "Jugador: " + nombreJugador +
    ". Edad: " + edadJugador + ". Puntos: " + puntuacion + ". Sumas: " + historial.join(", ") + ".";
```

**Ayuda que se actualiza en directo y responde con postMessage**. Son tres partes.

**Parte 1: sustituye `abrirAyuda` entera (líneas 175–188)** por:
```js
let ventanaAyuda = null;   // referencia para enviar mensajes después

function abrirAyuda() {
    ventanaAyuda = window.open("", "_blank", "width=450,height=400");
    if (!ventanaAyuda) {
        mensajeJuego.textContent = "Permite las ventanas emergentes para ver la ayuda.";
        return;
    }
    ventanaAyuda.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Ayuda</title></head><body><h1>Cómo jugar</h1><p id="datos"></p><button id="saludar">Enviar mensaje al juego</button></body></html>');
    ventanaAyuda.document.close();

    // La ayuda RECIBE mensajes de la principal
    ventanaAyuda.addEventListener("message", function (evento) {
        if (evento.origin !== window.location.origin) return;
        ventanaAyuda.document.getElementById("datos").textContent =
            "Jugador: " + evento.data.nombre + ". Puntos: " + evento.data.puntos;
    });
    // La ayuda ENVÍA un mensaje a la principal
    ventanaAyuda.document.getElementById("saludar").addEventListener("click", function () {
        ventanaAyuda.opener.postMessage("¡Hola desde la ayuda!", window.location.origin);
    });
    enviarDatosAyuda();
}

function enviarDatosAyuda() {
    if (ventanaAyuda && !ventanaAyuda.closed) {
        ventanaAyuda.postMessage({ nombre: nombreJugador, puntos: puntuacion }, window.location.origin);
    }
}

// La principal RECIBE mensajes de la ayuda
window.addEventListener("message", function (evento) {
    if (evento.origin !== window.location.origin) return;
    if (typeof evento.data === "string") {
        mensajeJuego.textContent = "Mensaje recibido: " + evento.data;
    }
});
```
**Parte 2**: en `comprobarRespuesta`, **debajo de la línea 162** `actualizarRecord();`:
```js
enviarDatosAyuda();
```
**Parte 3**: la línea 190 (`botonAyuda.addEventListener("click", abrirAyuda);`) se queda igual.

**Versión con un archivo `ayuda.html` propio**:
- En `abrirAyuda`: `ventanaAyuda = window.open("ayuda.html", "_blank", "width=450,height=400");` (quita el `document.write` y el `close`).
- Al final de `juego.js`:
```js
window.addEventListener("message", function (e) {
    if (e.origin !== window.location.origin) return;
    if (e.data === "lista") enviarDatosAyuda();     // la ayuda avisa cuando ha cargado
});
```
- `ayuda.html`:
```html
<p id="datos"></p>
<script>
  window.addEventListener("message", function (e) {
      if (e.origin !== window.location.origin) return;
      document.getElementById("datos").textContent =
          "Jugador: " + e.data.nombre + ". Puntos: " + e.data.puntos;
  });
  window.opener.postMessage("lista", window.location.origin);
</script>
```
(El aviso "lista" hace falta porque si envías antes de que `ayuda.html` cargue, el mensaje se pierde.)

**Entre pestañas**:
- **Evento `storage`**: salta en las **otras** pestañas cuando cambia localStorage.
```js
window.addEventListener("storage", function (e) {
    if (e.key === "recordSumas") textoRecord.textContent = "Récord: " + e.newValue;
});
```
- **BroadcastChannel**:
```js
const canal = new BroadcastChannel("sumas");
canal.postMessage({ puntos: puntuacion });
canal.onmessage = function (e) { console.log("Otra pestaña:", e.data); };
```
- **Cerrar la ayuda**: `ventanaAyuda.close()`. Para saber si está cerrada: `ventanaAyuda.closed`.

---

## 8. Cambiar las reglas del juego

**2 puntos por acierto**: hay que tocar tres líneas.
- **Línea 159**: `puntuacion = puntuacion + 2;`
- **Línea 161**: `mensajeJuego.textContent = "¡Correcto! Has ganado 2 puntos. Pulsa Siguiente.";`
- **Línea 223** (`cargarPartida`): `partida.puntos !== partida.historial.length * 2) {`

**Restar 1 punto al fallar, sin bajar de 0**:
- En `comprobarRespuesta`, **sustituye la línea 165** por:
```js
puntuacion = Math.max(0, puntuacion - 1);       // nunca negativo
textoPuntuacion.textContent = "Puntos: " + puntuacion;
mensajeJuego.textContent = "No es correcto. Pierdes 1 punto.";
guardarPartida();
```
- En `cargarPartida`, **líneas 222–223**:
```js
// ANTES
typeof partida.resuelta !== "boolean" || !Array.isArray(partida.historial) ||
    partida.puntos !== partida.historial.length) {
// DESPUÉS
typeof partida.resuelta !== "boolean" || !Array.isArray(partida.historial)) {
```

**Números del 1 al 20**: cambia `* 10` por `* 20` en las **líneas 127 y 128**, y en `cargarPartida` cambia `> 10` por `> 20` en las **líneas 220 y 221**.
Fórmula general: `Math.floor(Math.random() * (max - min + 1)) + min`.

**Multiplicar en vez de sumar**: hay que tocar cuatro sitios.
- **Línea 129** y **línea 237**: `numero1 + " x " + numero2 + " = ?"`
- **Línea 152**: `if (respuesta === numero1 * numero2) {`
- **Línea 156**: `historial.push(numero1 + " x " + numero2 + " = " + respuesta);`

**Límite de 3 intentos**:
- Debajo de la línea 38: `let intentos = 3;`
- En `siguienteMision`, debajo de la línea 131 (`resuelta = false;`): `intentos = 3;`
- **Sustituye la línea 165**:
```js
intentos = intentos - 1;
if (intentos === 0) {
    mensajeJuego.textContent = "Sin intentos. Era " + (numero1 + numero2) + ". Pulsa Siguiente.";
    botonComprobar.disabled = true;
} else {
    mensajeJuego.textContent = "Fallo. Te quedan " + intentos + " intentos.";
}
```

**10 segundos por suma**:
- Debajo de la línea 38: `let temporizador;`
- En `siguienteMision`, debajo de la línea 134 (`campoRespuesta.focus();`):
```js
clearTimeout(temporizador);
temporizador = setTimeout(function () {
    mensajeJuego.textContent = "¡Tiempo agotado! Pulsa Siguiente.";
    botonComprobar.disabled = true;
}, 10000);
```
- Debajo de la línea 153 (`resuelta = true;`): `clearTimeout(temporizador);`

**Ganar al llegar a 10 puntos**: debajo de la línea 161:
```js
if (puntuacion >= 10) {
    mensajeJuego.textContent = "¡Has ganado!";
    botonSiguiente.disabled = true;
}
```

**Confirmar antes de reiniciar**: en `reiniciarPartida`, **debajo de la línea 253**: `if (!confirm("¿Seguro que quieres empezar de nuevo?")) return;`

**Aviso de nuevo récord**: en `actualizarRecord`, **debajo de la línea 283** `cargarRecord();`:
```js
if (puntuacion > record) {
    console.log("¡Nuevo récord!");
}
```

**Nombre de al menos 3 letras**: en `validarPerfil`, **línea 87**: `if (nombre.length < 3 || fecha === "" || !campoFecha.validity.valid) {`

**Contador de fallos que se conserva al recargar**: hay que tocar cuatro sitios.
- Debajo de la línea 35: `let fallos = 0;`
- **Sustituye la línea 165**:
```js
fallos = fallos + 1;
mensajeJuego.textContent = "No es correcto. Fallos: " + fallos;
guardarPartida();
```
- **Línea 196**: `numero1: numero1, numero2: numero2, resuelta: resuelta, historial: historial, fallos: fallos`
- **Debajo de la línea 233** `historial = partida.historial;`: `fallos = Number(partida.fallos) || 0;`

---

## 9. Métodos de String, Date, Math, Number y Array

| Tipo | Método | Qué hace |
| --- | --- | --- |
| String | `length` | número de letras |
| String | `trim()` | quita los espacios de los extremos |
| String | `toUpperCase()` / `toLowerCase()` | mayúsculas / minúsculas |
| String | `charAt(0)` / `slice(1)` | primera letra / desde la posición 1 |
| String | `includes("a")` / `indexOf("a")` | si contiene / en qué posición |
| String | `split(";")` / `replace("a","b")` / `padStart(2,"0")` | separar / reemplazar / rellenar |
| Date | `getFullYear()` `getMonth()` `getDate()` `getDay()` | año / mes 0-11 / día / día de la semana 0-6 |
| Math | `random()` | decimal de 0 a menos de 1 |
| Math | `floor()` `ceil()` `round()` `trunc()` | redondeos |
| Math | `max()` `min()` `abs()` `pow(a,b)` `sqrt()` | mayor / menor / sin signo / potencia / raíz |
| Number | `Number("5")` / `parseInt("12px")` / `parseFloat` | texto → número |
| Number | `Number.isInteger(5.5)` → false / `isNaN(x)` | comprueba si es entero / si no es un número |
| Number | `x.toFixed(2)` | 2 decimales (String) |
| Array | `push(x)` / `pop()` | añade al final / quita el último |
| Array | `length` / `[0]` / `[length - 1]` | tamaño / primero / último |
| Array | `join(", ")` / `forEach(f)` / `includes(x)` | une en texto / recorre / si contiene |

**Primera letra mayúscula y el resto minúscula** (en `mostrarPanel`, sustituyendo `nombreJugador.toUpperCase()` en la línea 68):
`nombreJugador.charAt(0).toUpperCase() + nombreJugador.slice(1).toLowerCase()`

**Última suma resuelta**: debajo de la línea 156: `console.log("Última suma:", historial[historial.length - 1]);`
⚠️ Si quitas elementos del historial (por ejemplo con `pop`), recuerda que la línea 223 compara los puntos con `historial.length`.

---

## 10. Quitar `defer` (cargar el script sin defer)

Son dos cambios:
```html
<!-- index.html, línea 11: antes era <script src="juego.js" defer></script> -->
<script src="juego.js"></script>
```
```js
// juego.js, debajo de la línea 1 "use strict";
window.addEventListener("load", function () {
    // ... TODO el código que ya tenías ...
});   // ← esta línea va al FINAL del archivo
```
**Por qué**: sin `defer` el script se ejecuta antes de que existan los elementos. Entonces `getElementById` devuelve `null` y sale el error *Cannot read properties of null (reading 'addEventListener')*.
También vale `document.addEventListener("DOMContentLoaded", function () {`, que salta cuando el HTML está listo sin esperar a las imágenes.
Otra opción: mover el `<script src="juego.js"></script>` al final del `<body>`.

---

## 11. Preguntas de justificación

| Pregunta | Respuesta |
| --- | --- |
| ¿Por qué `defer`? | El script está en el `head`; `defer` espera a que el HTML esté listo para que `getElementById` encuentre los elementos. |
| ¿Para qué `preventDefault()`? | Evita que el formulario recargue la página al enviarse. |
| ¿Para qué `novalidate`? | Para validar con JS y mostrar nuestro "Acceso denegado" en vez del aviso del navegador. |
| ¿Para qué `trim()`? | Quita los espacios de los extremos: un nombre de solo espacios queda vacío y se rechaza. |
| ¿Por qué `return` en `validarPerfil`? | Termina la función para que no siga con datos incorrectos. |
| ¿Cómo se calcula la edad? | Se restan los años con `getFullYear`; si el cumpleaños de este año no ha llegado (comparando `getMonth` y `getDate`), se resta uno. |
| ¿Por qué `getMonth` cuenta desde 0? | En Date, enero es 0 y diciembre es 11. |
| ¿Por qué `textContent` y no `innerHTML`? | `textContent` escribe texto sin interpretar HTML, así que lo que escriba el jugador no se ejecuta. |
| ¿Cómo salen números del 1 al 10? | `Math.random()` da un decimal de 0 a menos de 1. Al multiplicar por 10 y aplicar `Math.floor` salen enteros de 0 a 9; con `+ 1`, de 1 a 10. |
| ¿Para qué `resuelta`? | Impide dar el punto dos veces por la misma suma (por ejemplo, pulsando Enter dos veces o al recargar). |
| ¿Para qué `Number.isInteger`? | Después de `Number(...)`, rechaza respuestas decimales o vacías. |
| ¿Para qué `Math.max` en el récord? | Conserva el mayor entre el récord anterior y los puntos actuales. |
| ¿Por qué se vuelve a leer el récord antes de guardarlo? | Por si otra pestaña lo ha mejorado mientras tanto. |
| ¿Diferencia entre sessionStorage, localStorage y cookie? | sessionStorage dura mientras la pestaña siga abierta; localStorage sigue al cerrar el navegador; la cookie tiene caducidad (`max-age`) y viaja al servidor en las peticiones. |
| ¿Para qué `JSON.stringify` / `JSON.parse`? | El almacenamiento solo guarda texto: `stringify` convierte el objeto en texto y `parse` lo recupera. |
| ¿Para qué `try/catch` al guardar? | El navegador puede bloquear el almacenamiento; así se avisa y se puede seguir jugando. |
| ¿Qué devuelve `window.open`? | La ventana nueva, o `null` si el navegador la bloquea. |
| ¿Para qué `postMessage`? | Para enviar datos entre ventanas de forma segura, comprobando `evento.origin`. |
| ¿Diferencia entre `let` y `const`? | `const` no se puede reasignar; `let` sí. |
| ¿Por qué `===`? | Compara el valor **y** el tipo (`"5" === 5` es false). |
| ¿Para qué `"use strict"`? | Obliga a declarar las variables y detecta más errores. |
| ¿Por qué Live Server? | Las cookies necesitan HTTP; con `file://` no funcionan bien. |
