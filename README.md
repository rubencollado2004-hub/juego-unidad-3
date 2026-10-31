# Juego de misiones - Unidad 3

Práctica de Desarrollo web en entorno cliente con HTML, CSS y JavaScript puro.
El proyecto se construye por avances pequeños para entender y comprobar cada parte.

## Estado actual

Formulario de nombre y fecha de nacimiento. Al enviarlo, muestra los datos introducidos.
La comprobación de edad y fecha se añadirá en el siguiente avance.
El juego completo todavía no está implementado.

## Cómo probar este avance

1. Descarga el repositorio y descomprime los archivos.
2. Abre index.html en el navegador.
3. Introduce un nombre y una fecha de nacimiento.
4. Pulsa Comenzar: deben aparecer los datos sin recargar la página.

También puedes abrir la carpeta con Visual Studio Code y usar Live Server.
Cuando se añadan cookies, usaremos un servidor local para probarlas correctamente.

## Archivos

- index.html: contenido de la página y carga del script en head con defer.
- estilos.css: aspecto visual.
- juego.js: lectura del formulario y modificación del texto mediante el DOM.

## Avances previstos

- [x] 1. Estructura HTML, CSS y script en head con defer.
- [x] 2. Formulario de nombre y fecha de nacimiento.
- [ ] 3. Validación de nombre, fecha anterior a la actual y edad mínima; mensaje "Acceso denegado".
- [ ] 4. Panel con nombre formateado mediante String y edad calculada mediante Date.
- [ ] 5. Estilos dinámicos según los datos del jugador.
- [ ] 6. Misiones en un array e interacción con clics.
- [ ] 7. Puntuación con números aleatorios, redondeo y otra función de Math o Number.
- [ ] 8. Ventana adicional con información del jugador.
- [ ] 9. Guardado de la partida actual en sessionStorage.
- [ ] 10. Persistencia de récord o progreso en localStorage.
- [ ] 11. Preferencia guardada y recuperada mediante cookies.
- [ ] 12. Comprobación final, correcciones y documentación.

## Seguimiento

El enunciado exige al menos 10 commits y un commit cada semana desde su publicación.
Los cambios deben subirse a GitHub de forma gradual.
Entrega prevista: 9 de noviembre de 2026 a las 10:13 (hora de Madrid).
Próximos avances: 2, 4, 6 y 8 de noviembre. La revisión final queda para el día 8.
Cada avance debe comprenderse para poder modificarlo y explicarlo en el examen.

## Idea del juego

Una misión será resolver una suma de dos números del 1 al 10.
Cada acierto dará un punto y el botón Siguiente mostrará otra suma.
Usaremos funciones cortas y comentarios claros, sin librerías.
