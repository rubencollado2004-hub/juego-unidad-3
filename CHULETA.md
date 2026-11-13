# Chuleta de examen – Juego de sumas (Unidad 3)

Cambios típicos que pueden pedir sobre `juego.js`, `index.html` y `estilos.css`.
Cada bloque dice **dónde** tocar y **qué** escribir, usando los nombres reales del proyecto.

> ⚠️ **TRAMPA IMPORTANTE – `cargarPartida`**: valida la partida guardada con
> `Number.isInteger(partida.puntos)`, `partida.puntos === partida.historial.length`
> y `numero1`/`numero2` entre 1 y 10. Si cambias **puntos decimales**, **restar puntos**,
> **puntos por acierto** o **rango de números**, quita/adapta esas líneas o al recargar
> la partida no se recuperará (vuelve el formulario).
> Lo mismo en `cargarRecord`: `Number.isInteger(guardado)` rechaza récords decimales.

---

## 0. Mapa rápido del código

| Función | Qué hace |
| --- | --- |
| `validarPerfil(evento)` | submit del formulario: trim, fecha válida, edad ≥ `EDAD_MINIMA` |
| `calcularEdad(nacimiento, hoy)` | resta años y descuenta 1 si no ha llegado el cumpleaños |
| `mostrarPanel()` / `cambiarColorPanel()` | nombre en mayúsculas, edad, color azul (≥18) / verde |
| `siguienteMision()` | `Math.floor(Math.random() * 10) + 1` para dos números |
| `comprobarRespuesta(evento)` | compara, `push` al historial, +1 punto, récord, guarda |
| `abrirAyuda()` | `window.open` + `document.write` + `textContent` |
| `guardarPartida()` / `cargarPartida()` | `sessionStorage` + `JSON.stringify` / `JSON.parse` |
| `reiniciarPartida()` | `sessionStorage.removeItem` + `location.reload()` |
| `cargarRecord()` / `actualizarRecord()` | `localStorage` + `Math.max` |
| `aplicarLetra()` / `cargarPreferencia()` / `guardarPreferencia()` | cookie `letraSumas` 30 días |

Claves de almacenamiento: `partidaSumas` (session), `recordSumas` (local), cookie `letraSumas`.

---

## 1. Redondear la puntuación (Math)

| Método | 2.5 | 2.4 | -2.5 | Uso |
| --- | --- | --- | --- | --- |
| `Math.round(x)` | 3 | 2 | -2 | al más cercano |
| `Math.floor(x)` | 2 | 2 | -3 | hacia abajo |
| `Math.ceil(x)` | 3 | 3 | -2 | hacia arriba |
| `Math.trunc(x)` | 2 | 2 | -2 | quita decimales |
| `x.toFixed(2)` | "2.50" | "2.40" | "-2.50" | **devuelve String**, para mostrar |

Redondear a 2 decimales como número: `Math.round(x * 100) / 100`.

**Ejemplo: puntos con bonus aleatorio y redondeo** (en `comprobarRespuesta`, sustituye la línea `puntuacion = puntuacion + 1;`):

```js
const bonus = Math.random();                 // 0 … 0.999
puntuacion = Math.round((puntuacion + 1 + bonus) * 10) / 10; // 1 decimal
textoPuntuacion.textContent = "Puntos: " + puntuacion.toFixed(1);
mensajeJuego.textContent = "¡Correcto! +" + (1 + bonus).toFixed(1) + " puntos.";
```
Adaptar: en `cargarPartida` cambiar `!Number.isInteger(partida.puntos)` por
`typeof partida.puntos !== "number"` y **borrar** `partida.puntos !== partida.historial.length`.
En `cargarRecord` cambiar `Number.isInteger(guardado)` por `!isNaN(guardado)`.

**Puntos según dificultad** (suma grande da más): `puntuacion += Math.ceil((numero1 + numero2) / 5);`

**Restar al fallar** (en el `else` de `comprobarRespuesta`):
```js
puntuacion = Math.max(0, puntuacion - 1);    // nunca negativo
textoPuntuacion.textContent = "Puntos: " + puntuacion;
guardarPartida();
```
(Quitar `partida.puntos !== partida.historial.length` en `cargarPartida`.)

---

## 2. Fechas (Date)

Métodos: `getFullYear()`, `getMonth()` (**0 = enero**, sumar 1 para mostrar), `getDate()` (día del mes),
`getDay()` (día de la semana, **0 = domingo**), `getHours()`, `getMinutes()`, `getSeconds()`,
`getTime()` (ms desde 1970), `setHours(0,0,0,0)`, `toLocaleDateString()`, `toLocaleTimeString()`.

**Mostrar la fecha actual** – en `index.html` debajo del `<h1>`: `<p id="fecha-actual"></p>`
y en `juego.js` (al final):

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

Formato manual `dd/mm/aaaa`:
```js
const d = new Date();
const dia = String(d.getDate()).padStart(2, "0");
const mes = String(d.getMonth() + 1).padStart(2, "0");   // +1 !!
textoFecha.textContent = dia + "/" + mes + "/" + d.getFullYear();
```

**Reloj que se actualiza cada segundo:**
```js
setInterval(function () {
    textoFecha.textContent = new Date().toLocaleTimeString("es-ES");
}, 1000);
```

**Fecha/hora en cada acierto del historial** (en `comprobarRespuesta`):
```js
const hora = new Date().toLocaleTimeString("es-ES");
historial.push(numero1 + " + " + numero2 + " = " + respuesta + " (" + hora + ")");
```

**Días que faltan para su cumpleaños** (guardar `nacimiento` en `validarPerfil`):
```js
function diasHastaCumple(nacimiento) {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    let cumple = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
    if (cumple < hoy) cumple.setFullYear(hoy.getFullYear() + 1);
    return Math.round((cumple - hoy) / (1000 * 60 * 60 * 24));
}
```

**Cambiar edad mínima**: `const EDAD_MINIMA = 16;` + texto de `index.html` ("al menos 16 años").
**Edad máxima**: en `validarPerfil` tras calcular la edad: `if (edad < EDAD_MINIMA || edad > 99) return;`

---

## 3. Modificar el color de fondo (style / classList)

Toda la página: `document.body.style.backgroundColor = "#fde68a";`
Solo la caja blanca: `document.querySelector("main").style.backgroundColor = "lightyellow";`

**Más tramos de edad** en `cambiarColorPanel`:
```js
if (edadJugador >= 65) {
    panelJugador.style.backgroundColor = "#fef3c7";   // amarillo
} else if (edadJugador >= 18) {
    panelJugador.style.backgroundColor = "#dbeafe";   // azul
} else {
    panelJugador.style.backgroundColor = "#dcfce7";   // verde
}
```

**Fondo según acierto/fallo** (en `comprobarRespuesta`):
```js
document.body.style.backgroundColor = "#bbf7d0";   // en el if (acierto)
document.body.style.backgroundColor = "#fecaca";   // en el else (fallo)
```

**Color aleatorio:**
```js
function colorAleatorio() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    document.body.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
}
```

**Selector de color del usuario** – HTML: `<input id="color-fondo" type="color" value="#eef2f6">`
```js
const selectorColor = document.getElementById("color-fondo");
selectorColor.addEventListener("input", function () {
    document.body.style.backgroundColor = selectorColor.value;
});
```

**Con clases CSS** – en `estilos.css`: `.oscuro { background-color: #111827; color: white; }`
```js
document.body.classList.toggle("oscuro");   // add / remove / toggle / contains
```

Guardar el color elegido (persistente): `localStorage.setItem("colorFondo", selectorColor.value);`
y al cargar: `const c = localStorage.getItem("colorFondo"); if (c) document.body.style.backgroundColor = c;`

---

## 4. Mostrar info por consola (F12 → Console)

```js
console.log("Jugador:", nombreJugador, "Edad:", edadJugador);
console.info("Partida recuperada");
console.warn("Respuesta vacía");
console.error("No se pudo guardar", error);       // dentro de los catch
console.table(historial);                          // arrays/objetos en tabla
console.table({ nombre: nombreJugador, puntos: puntuacion, record: record });
console.group("Misión"); console.log(numero1, numero2); console.groupEnd();
console.count("aciertos");                         // cuenta las veces que se llama
console.time("respuesta"); /* … */ console.timeEnd("respuesta");
console.clear();
```
Sitios típicos: final de `validarPerfil` (perfil válido), `siguienteMision` (números generados),
`comprobarRespuesta` (respuesta y si es correcta), `guardarPartida` (`console.log(partida)`),
los `catch (error)` → `console.error(error)`.
Plantilla literal: `` console.log(`Suma: ${numero1} + ${numero2} = ${numero1 + numero2}`); ``

---

## 5. Obtener y modificar elementos del DOM

**Obtener:**
```js
document.getElementById("mensaje");
document.querySelector("#panel-jugador h2");      // el primero que coincide (selector CSS)
document.querySelectorAll("button");              // NodeList → forEach
document.getElementsByTagName("p");
document.getElementsByClassName("clase");
```

**Modificar:**
```js
elemento.textContent = "texto";          // seguro (no interpreta HTML)
elemento.innerHTML = "<strong>hola</strong>";  // interpreta HTML (no con datos del usuario)
elemento.style.color = "red";            // propiedades CSS en camelCase
elemento.classList.add("activo");
elemento.setAttribute("title", "Ayuda"); elemento.getAttribute("id");
elemento.hidden = true;                  // ocultar / mostrar
campoRespuesta.value = "";               // inputs
botonComprobar.disabled = true;
```

**Crear / eliminar:**
```js
const nuevo = document.createElement("p");
nuevo.textContent = "Nuevo párrafo";
document.querySelector("main").appendChild(nuevo);   // o append / prepend
nuevo.remove();
```

**Historial como lista `<ul>` en vez de `join`** – HTML: cambiar `<p id="historial">` por `<ul id="historial"></ul>`
```js
function pintarHistorial() {
    textoHistorial.innerHTML = "";                 // vaciar
    historial.forEach(function (suma) {
        const li = document.createElement("li");
        li.textContent = suma;
        textoHistorial.appendChild(li);
    });
}
```
y llamar `pintarHistorial()` donde ahora está `textoHistorial.textContent = historial.join(" | ");`.

**Recorrer varios elementos:**
```js
document.querySelectorAll("#zona-juego button").forEach(function (b) {
    b.style.backgroundColor = "#16a34a";
});
```

**Cambiar el título:** `document.querySelector("h1").textContent = "Juego de " + nombreJugador;`
**Título de la pestaña:** `document.title = "Puntos: " + puntuacion;`

**Botón creado desde JS con evento:**
```js
const boton = document.createElement("button");
boton.type = "button";
boton.textContent = "Borrar récord";
boton.addEventListener("click", function () {
    localStorage.removeItem("recordSumas");
    record = 0;
    textoRecord.textContent = "Récord: 0";
});
zonaJuego.appendChild(boton);
```

Eventos útiles: `click`, `submit` (+ `evento.preventDefault()`), `change`, `input`, `keydown`, `load`, `message`, `storage`.

---

## 6. Cambiar entre localStorage y sessionStorage

| | `sessionStorage` | `localStorage` |
| --- | --- | --- |
| Dura | hasta cerrar la pestaña | permanente (hasta borrarlo) |
| Ámbito | solo esa pestaña | todas las pestañas del mismo origen |
| Ahora guarda | la partida (`partidaSumas`) | el récord (`recordSumas`) |

API idéntica: `setItem(clave, texto)`, `getItem(clave)`, `removeItem(clave)`, `clear()`, `length`, `key(i)`.
**Solo guarda texto** → objetos con `JSON.stringify` / `JSON.parse`; números con `String` / `Number`.

**Partida permanente** (que siga al cerrar el navegador): cambiar `sessionStorage` por `localStorage` en
`guardarPartida`, `cargarPartida` y `reiniciarPartida` (3 sitios). Texto del mensaje: "Partida guardada en este navegador."

**Récord solo de la sesión:** cambiar `localStorage` por `sessionStorage` en `cargarRecord` y `actualizarRecord` (2 sitios).

**Truco limpio:** una variable para elegir el almacén:
```js
const almacen = localStorage;   // o sessionStorage
almacen.setItem("partidaSumas", JSON.stringify(partida));
```

**Borrar todo:** `localStorage.clear(); sessionStorage.clear();`
**Ver en el navegador:** F12 → Application (Aplicación) → Storage → Local/Session Storage / Cookies.

**Cookies (recordatorio):**
```js
document.cookie = "clave=valor; max-age=2592000; path=/";   // crear (30 días)
document.cookie = "clave=; max-age=0; path=/";              // borrar
document.cookie.split(";")                                    // leer → array "clave=valor"
```

---

## 7. Mensajes entre ventanas (postMessage)

`otraVentana.postMessage(dato, origenDestino)` envía; quien recibe escucha `window.addEventListener("message", …)`.
- Desde la principal a la ayuda: `ventana.postMessage(...)` (referencia que devuelve `window.open`).
- Desde la ayuda a la principal: `window.opener.postMessage(...)`.
- Comprobar siempre `evento.origin === window.location.origin` y leer `evento.data`.

**Versión sin archivos nuevos** (todo en `juego.js`). Sustituir `abrirAyuda` por:

```js
let ventanaAyuda = null;   // guardamos la referencia para enviar mensajes después

function abrirAyuda() {
    ventanaAyuda = window.open("", "_blank", "width=450,height=400");
    if (!ventanaAyuda) {
        mensajeJuego.textContent = "Permite las ventanas emergentes para ver la ayuda.";
        return;
    }
    ventanaAyuda.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Ayuda</title></head><body><h1>Cómo jugar</h1><p id="datos"></p><button id="saludar">Enviar mensaje al juego</button></body></html>');
    ventanaAyuda.document.close();

    // La ayuda ESCUCHA mensajes de la principal
    ventanaAyuda.addEventListener("message", function (evento) {
        if (evento.origin !== window.location.origin) return;
        ventanaAyuda.document.getElementById("datos").textContent =
            "Jugador: " + evento.data.nombre + ". Puntos: " + evento.data.puntos;
    });

    // La ayuda ENVÍA un mensaje a la principal (opener)
    ventanaAyuda.document.getElementById("saludar").addEventListener("click", function () {
        ventanaAyuda.opener.postMessage("¡Hola desde la ayuda!", window.location.origin);
    });

    enviarDatosAyuda();
}

function enviarDatosAyuda() {
    if (ventanaAyuda && !ventanaAyuda.closed) {
        ventanaAyuda.postMessage({ nombre: nombreJugador, puntos: puntuacion },
                                 window.location.origin);
    }
}

// La principal ESCUCHA mensajes de la ayuda
window.addEventListener("message", function (evento) {
    if (evento.origin !== window.location.origin) return;
    if (typeof evento.data === "string") {
        mensajeJuego.textContent = "Mensaje recibido: " + evento.data;
    }
});
```
Y en `comprobarRespuesta`, tras sumar el punto, llamar `enviarDatosAyuda();` → la ayuda se actualiza en directo.

**Versión con archivo `ayuda.html` propio** (si lo piden):
```js
// juego.js
ventanaAyuda = window.open("ayuda.html", "ayuda", "width=450,height=400");
window.addEventListener("message", function (e) {
    if (e.origin !== window.location.origin) return;
    if (e.data === "lista") enviarDatosAyuda();   // la ayuda avisa cuando ha cargado
});
```
```html
<!-- ayuda.html -->
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
(Hace falta el "lista" porque si se envía antes de que `ayuda.html` cargue, el mensaje se pierde.)

**Otras formas de comunicar ventanas/pestañas:**
- Acceso directo (mismo origen): `ventana.document.getElementById("datos").textContent = …` (lo que ya hace el proyecto).
- `ventana.close()` cierra la ayuda; `ventana.closed` dice si está cerrada.
- Entre **pestañas**: evento `storage` (salta en las OTRAS pestañas cuando cambia localStorage):
```js
window.addEventListener("storage", function (e) {
    if (e.key === "recordSumas") textoRecord.textContent = "Récord: " + e.newValue;
});
```
- `BroadcastChannel`:
```js
const canal = new BroadcastChannel("sumas");
canal.postMessage({ puntos: puntuacion });
canal.onmessage = function (e) { console.log("Otra pestaña:", e.data); };
```

---

## 8. Otros cambios probables

**Cambiar la operación a resta / multiplicación** – en `siguienteMision` cambiar `" + "` por `" × "`
y en `comprobarRespuesta` `numero1 + numero2` por `numero1 * numero2` (y el texto del historial).
Operación aleatoria:
```js
const operaciones = ["+", "-", "*"];
operacion = operaciones[Math.floor(Math.random() * operaciones.length)];  // let operacion global
function resultado() {
    if (operacion === "+") return numero1 + numero2;
    if (operacion === "-") return numero1 - numero2;
    return numero1 * numero2;
}
```

**Rango de números** (ej. 1–20): `Math.floor(Math.random() * 20) + 1`.
Fórmula general entre `min` y `max`: `Math.floor(Math.random() * (max - min + 1)) + min`.
Adaptar `partida.numero1 > 10` → `> 20` en `cargarPartida`.

**Límite de intentos:**
```js
let intentos = 3;                        // global; en siguienteMision → intentos = 3;
// en el else de comprobarRespuesta:
intentos = intentos - 1;
if (intentos === 0) {
    mensajeJuego.textContent = "Sin intentos. Era " + (numero1 + numero2);
    botonComprobar.disabled = true;
} else {
    mensajeJuego.textContent = "Fallo. Te quedan " + intentos + " intentos.";
}
```

**Temporizador por suma** (`setTimeout` / `clearTimeout`):
```js
let temporizador;
// en siguienteMision:
clearTimeout(temporizador);
temporizador = setTimeout(function () {
    mensajeJuego.textContent = "¡Tiempo agotado!";
    botonComprobar.disabled = true;
}, 10000);
// en el acierto: clearTimeout(temporizador);
```

**Ganar al llegar a X puntos:** `if (puntuacion >= 10) { mensajeJuego.textContent = "¡Has ganado!"; botonComprobar.disabled = true; botonSiguiente.disabled = true; }`

**Confirmar antes de reiniciar:** al inicio de `reiniciarPartida`: `if (!confirm("¿Seguro?")) return;`

**Aviso de nuevo récord** (en `actualizarRecord`, antes de `record = Math.max(...)`):
`if (puntuacion > record) mensajeRecord.textContent = "¡Nuevo récord!";` (y quitar la línea que lo vacía).

**Nombre con primera letra mayúscula** (en `mostrarPanel`):
`nombreJugador.charAt(0).toUpperCase() + nombreJugador.slice(1).toLowerCase()`
Otros de String: `length`, `toLowerCase`, `includes`, `indexOf`, `slice`, `substring`, `replace`, `split`, `padStart`, `repeat`.

**Nombre mínimo 3 letras:** en `validarPerfil`: `if (nombre.length < 3) return;`

**Cookie 7 días en vez de 30:** `max-age=604800` (7 × 24 × 60 × 60) y cambiar el texto del mensaje.
**Tres tamaños de letra:** añadir `<option value="enorme">` y un `else if (selectorLetra.value === "enorme") document.body.style.fontSize = "24px";` (en `cargarPreferencia` comparar también con `"letraSumas=enorme"`).

**Media de puntos / estadísticas** (Number, Math):
`Math.max(...array)`, `Math.min(...array)`, `Math.abs`, `Math.pow(a, b)`, `Math.sqrt`, `parseInt("12px")`, `parseFloat`, `Number.isNaN`, `isNaN`.

---

## 9. Recordatorios rápidos

- `"use strict"` arriba: obliga a declarar variables.
- `defer` en el `<script>` del `head` → el DOM ya existe cuando se ejecuta el JS.
- `const` no se reasigna; `let` sí. `===` compara valor y tipo.
- `evento.preventDefault()` evita que el `submit` recargue la página.
- `return` corta la función (validaciones).
- `input.value` siempre es **String** → `Number(...)`.
- `try { … } catch (error) { … }` → seguir funcionando si falla el almacenamiento.
- Probar con **Live Server** (cookies y ventanas no van bien con `file://`).
- Tras cada cambio: F12 → Console para ver errores; Application para ver storage/cookies.
