# Juego de misiones - Unidad 3

Práctica de Desarrollo web en entorno cliente con HTML, CSS y JavaScript puro.
El proyecto se construye por avances pequeños para entender y comprobar cada parte.

## Estado actual

Formulario con validación de nombre, fecha de nacimiento y edad mínima de 12 años.
Con datos correctos, se oculta el formulario y aparece el panel del jugador.
El panel muestra el nombre en mayúsculas (toUpperCase) y la edad calculada con Date.
Su fondo es azul claro a partir de 18 años y verde claro entre 12 y 17 años.
Si los datos no son válidos, aparece exactamente "Acceso denegado" y no se continúa.
Ya se pueden resolver sumas del 1 al 10 y consultar las acertadas en un historial.
Cada acierto da 1 punto. Fallar o saltar una suma no resta puntos.
El botón Ayuda abre una ventana con las instrucciones, tu nombre y los puntos actuales.
La partida se recupera al recargar la misma pestaña mediante sessionStorage.
El récord se conserva con localStorage. La preferencia de letra se conserva con una cookie. La revisión de lógica y la guía final están terminadas; queda la comprobación visual manual.

## Cómo probar este avance

1. Descarga el repositorio y descomprime los archivos.
2. Abre la carpeta en VS Code y ejecuta index.html con Live Server (servidor local).
3. Introduce un nombre y una fecha de nacimiento de alguien mayor de 12 años.
4. Pulsa Comenzar: debe aparecer "Acceso permitido. Perfil creado." y el panel.
   Si escribes "  Rubén  ", el panel muestra "Jugador: RUBÉN" y su edad en años.
5. Pulsa Nueva partida para probar otro caso: nombre vacío o solo espacios, fecha vacía,
   fecha de hoy, fecha futura o una persona menor de 12 años.
6. En todos esos casos debe aparecer "Acceso denegado" y mantenerse el formulario, sin mostrar el panel.
7. Prueba también alguien que cumple 12 años hoy (permitido) y mañana (denegado).
8. Pulsa Nueva partida y prueba una persona de 17 años: el panel debe ser verde claro.
   Con una persona que cumple 18 hoy, debe ser azul claro.

El formulario usa novalidate para que JavaScript muestre el mensaje del enunciado,
en lugar del aviso automático del navegador. Se puede enviar con el botón o con Enter.
La edad se calcula teniendo en cuenta si el cumpleaños ya ha pasado este año.

Usa Live Server también para comprobar las cookies; abrir el archivo directamente no basta.

## Archivos

- index.html: contenido de la página y carga del script en head con defer.
- estilos.css: aspecto visual.
- juego.js: perfil, sumas, puntos, ayuda, almacenamiento y preferencia de letra.
- CHULETA.md / Chuleta_Juego_Unidad3.pdf: chuleta de examen con posibles cambios al código.

## Avances previstos

- [x] 1. Estructura HTML, CSS y script en head con defer.
- [x] 2. Formulario de nombre y fecha de nacimiento.
- [x] 3. Validación de nombre, fecha anterior a la actual y edad mínima; mensaje "Acceso denegado".
- [x] 4. Panel con nombre formateado mediante String y edad calculada mediante Date.
- [x] 5. Estilos dinámicos según los datos del jugador.
- [x] 6. Misiones en un array e interacción con clics.
- [x] 7. Puntuación con números aleatorios, redondeo y otra función de Math o Number.
- [x] 8. Ventana adicional con información del jugador.
- [x] 9. Guardado de la partida actual en sessionStorage.
- [x] 10. Persistencia de récord o progreso en localStorage.
- [x] 11. Preferencia guardada y recuperada mediante cookies.
- [x] 12. Revisión de lógica y documentación final (prueba visual manual pendiente).

## Seguimiento

El enunciado exige al menos 10 commits y un commit cada semana desde su publicación.
Los cambios deben subirse a GitHub de forma gradual.
Entrega prevista: 9 de noviembre de 2026 a las 10:13 (hora de Madrid).
Revisión final realizada el 8 de noviembre de 2026.
El número de commits no demuestra actividad en semanas anteriores: solo cuenta el historial real.
Cada avance debe comprenderse para poder modificarlo y explicarlo en el examen.

## Idea del juego

Una misión consiste en resolver una suma de dos números del 1 al 10.
Cada acierto da un punto y el botón Siguiente muestra otra suma.
Usaremos funciones cortas y comentarios claros, sin librerías.

## Cómo funciona el panel

- mostrarPanel usa toUpperCase para poner el nombre en mayúsculas y textContent para mostrarlo.
- calcularEdad usa getFullYear, getMonth y getDate para tener en cuenta el cumpleaños.
- cambiarColorPanel usa un if/else y style.backgroundColor para elegir el fondo según la edad.
- hidden mantiene el panel oculto hasta que se valida el formulario.

## Cómo probar las misiones

1. Crea un perfil válido: aparecerá una suma de dos números del 1 al 10.
2. Pulsa Comprobar sin responder: debe pedir un número entero.
3. Escribe una respuesta incorrecta: puedes volver a intentarlo.
4. Acierta: la suma se añade una sola vez al historial y Comprobar queda desactivado.
5. Pulsa Siguiente: aparece una nueva misión y se vacía la respuesta.
   Puedes saltar una suma; al ser aleatorias, dos misiones pueden coincidir.

El array historial guarda las sumas acertadas. push añade cada suma y join muestra la lista.
Comprobar también funciona con Enter. resuelta evita registrar dos veces la misma misión.

## Puntuación y números

- puntuacion empieza en 0 y aumenta en 1 al acertar una misión.
- resuelta impide sumar de nuevo al pulsar Enter o volver a comprobar la misma misión.
- Math.random genera el azar y Math.floor redondea hacia abajo para obtener enteros del 1 al 10.
- Number convierte la respuesta a número y Number.isInteger comprueba que sea un entero.
- Comprueba que dos aciertos den 2 puntos; fallar, dejar vacío o pulsar Siguiente no debe sumar.

## Ventana de ayuda

Pulsa Ayuda después de crear el perfil. Debe abrirse una ventana con tu nombre y puntuación.
Ciérrala, consigue otro punto y vuelve a abrirla para comprobar la actualización.
Si el navegador la bloquea, aparecerá un aviso para permitir ventanas emergentes.

## Guardado de la partida

sessionStorage conserva el perfil, los puntos, la suma actual, si está resuelta y el historial
al recargar la misma pestaña. No es un guardado permanente: la sesión normalmente termina
al cerrar la pestaña (el navegador puede recuperarla al restaurar una sesión).
La respuesta que aún estés escribiendo no se guarda.

1. Acierta una suma y recarga: debes conservar el punto y el historial.
2. Intenta comprobar esa misma suma: no debe sumar otro punto.
3. Pulsa Siguiente y recarga antes de contestar: debe conservarse esa nueva suma pendiente.
4. Pulsa Nueva partida: vuelve el formulario y se borran los puntos de esa partida.

Usa siempre el mismo servidor local y puerto para probar el almacenamiento.

## Récord permanente

localStorage guarda recordSumas como texto. Number lo convierte a número y Math.max
elige el mayor entre el récord anterior y los puntos actuales. Nueva partida no borra el récord.
Prueba dos aciertos, reinicia y comprueba que los puntos sean 0 y el récord siga en 2.
Cierra y vuelve a abrir el mismo servidor y puerto: el récord debe continuar.
Si el navegador bloquea el guardado, aparece un aviso y puedes seguir jugando.

## Preferencia con cookies

El selector Tamaño de letra cambia el texto entre 16 y 20 píxeles.
La cookie letraSumas guarda normal o grande durante 30 días y se lee al abrir la página.
Prueba Grande, recarga y comprueba que siga seleccionado. Después prueba Normal.
Nueva partida no borra esta preferencia. Usa HTTP con Live Server, no file://.

## Guía rápida para el examen

El juego no tiene niveles ni combates: escribe la suma, pulsa Comprobar y gana 1 punto.
Siguiente permite saltar o pasar a otra suma. Nueva partida borra solo la sesión actual.

| Quiero cambiar… | Dónde hacerlo |
| --- | --- |
| Edad mínima | EDAD_MINIMA en juego.js (ahora 12) y el texto de index.html |
| Colores del perfil | cambiarColorPanel: el if elige azul o verde según la edad |
| Números de las sumas | siguienteMision: random * 10 y + 1 generan del 1 al 10; adaptar también la validación de cargarPartida |
| Puntos por acierto | comprobarRespuesta; si cambias 1 punto por suma, adapta también la relación puntos/historial en cargarPartida |
| Textos y etiquetas | index.html y los textContent de juego.js |
| Apariencia | estilos.css; aplicarLetra cambia el tamaño desde JavaScript |
| Duración de la cookie | max-age en guardarPreferencia (2592000 segundos = 30 días) |

Orden del programa:
1. defer espera a que el HTML esté preparado y se obtienen sus elementos por id.
2. Se conectan los eventos submit, click y change con sus funciones.
3. Se recuperan sesión, récord y preferencia al abrir la página.
4. validarPerfil comprueba los datos y calcularEdad descuenta un año si falta el cumpleaños.
5. siguienteMision genera dos números; comprobarRespuesta compara la suma con la respuesta.
6. Un acierto activa resuelta, añade la operación al array, suma el punto y guarda los datos.

Conceptos que debes saber explicar:
- const mantiene la misma referencia; let permite reasignar una variable.
- return termina la función para impedir que continúe con datos incorrectos.
- trim y toUpperCase son métodos de String.
- Date trabaja con fechas; getMonth empieza en 0 (enero). Se comparan meses entre sí.
- Math.random devuelve un decimal menor que 1; Math.floor redondea hacia abajo.
- Math.max conserva el mayor récord. Number convierte texto y Number.isInteger valida enteros.
- historial es un array: push añade una suma y join crea el texto de la lista.
- textContent escribe texto sin ejecutar HTML introducido por el jugador.
- JSON.stringify convierte el objeto de partida a texto; JSON.parse lo recupera.
- sessionStorage dura la sesión de la pestaña; localStorage conserva el récord.
- document.cookie guarda y lee la preferencia; no se guardan datos personales en cookies.
- try/catch muestra un aviso cuando el navegador impide guardar y permite seguir jugando.

## Revisión final del 8 de noviembre

Sintaxis de JavaScript comprobada con Node. Pruebas automáticas con DOM y almacenamiento
simulados superadas: nombre vacío, fechas inválidas/futuras, cumpleaños de 12 hoy y mañana,
colores por edad, respuesta vacía/decimal/incorrecta, dos aciertos, bloqueo de punto repetido,
100 generaciones dentro de 1–10, ayuda con datos, recarga de sesión, reinicio, récord,
lectura/escritura de ambas preferencias y almacenamiento bloqueado.

La prueba con Chromium no pudo arrancar por restricciones de permisos del entorno.
No se ha verificado visualmente en un navegador real ni el comportamiento real de cookies
y ventanas emergentes. Antes de entregar, sigue las pruebas manuales anteriores con Live Server,
incluyendo Ayuda, recarga, cierre/reapertura y tamaño de letra en móvil y ordenador.

Esta revisión cubre los requisitos enumerados en la conversación. El PDF original del enunciado
no está en el repositorio: conviene contrastarlo antes de entregar por si incluye condiciones adicionales.
No se han modificado fechas ni creado commits vacíos. La entrega en la plataforma del centro
debe realizarla el alumno antes del 9 de noviembre a las 10:13 (Europe/Madrid).

## Segunda revisión antes de entregar

Se corrigió un caso al jugar en dos pestañas: antes de guardar el récord se vuelve
a leer localStorage, para conservar un récord superior conseguido en la otra pestaña.
Prueba: consigue 5 puntos en una pestaña y después 2 en otra; el récord debe seguir en 5.

Se repitieron las pruebas de lógica con DOM y almacenamiento simulados:
validación, respuestas, bloqueo de puntos duplicados, recuperación de sesión, ayuda,
preferencia de letra, reinicio, rango de los números y récord entre pestañas.
La comprobación visual continúa pendiente por las restricciones de Chromium.
