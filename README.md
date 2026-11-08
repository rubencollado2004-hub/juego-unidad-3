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
El récord se conserva con localStorage. La preferencia de letra se conserva con una cookie. Falta la revisión final.

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

También puedes abrir la carpeta con Visual Studio Code y usar Live Server.
Cuando se añadan cookies, usaremos un servidor local para probarlas correctamente.

## Archivos

- index.html: contenido de la página y carga del script en head con defer.
- estilos.css: aspecto visual.
- juego.js: validación del formulario y cálculo de la edad. Los datos válidos se guardan en nombreJugador y edadJugador para mostrarlos en el panel.

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
- [ ] 12. Comprobación final, correcciones y documentación.

## Seguimiento

El enunciado exige al menos 10 commits y un commit cada semana desde su publicación.
Los cambios deben subirse a GitHub de forma gradual.
Entrega prevista: 9 de noviembre de 2026 a las 10:13 (hora de Madrid).
Próximo avance: 8 de noviembre. La revisión final queda para el día 8.
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
