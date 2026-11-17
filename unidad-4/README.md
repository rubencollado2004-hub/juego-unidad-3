# Escape de las tres salas — Unidad 4

Proyecto de preparación del examen práctico. Estado: en desarrollo.

## Idea
Tres salas consecutivas con pistas visibles y respuestas sencillas, sin temporizador, enemigos ni librerías. Se usarán HTML, CSS y JavaScript. Los comentarios explicarán qué hace cada bloque y por qué se utiliza.

1. Sala de la llave: escribir el color de la llave descrita por un objeto.
2. Sala de las pistas: ordenar tres números para descubrir un código mediante Array, Map y Set.
3. Sala de la puerta: abrir una puerta mediante clases y herencia.

## Requisitos y ubicación prevista
| Requisito | Aplicación |
| --- | --- |
| Propiedades simples, función y objeto anidado | Objeto llave de la sala 1 |
| Clonación | Copiar la llave y su objeto anidado con Object.assign |
| Tres métodos de Array | filter, sort y join en la sala 2 |
| Map y Set | Pistas numeradas y números sin repetir |
| Spread y desestructuración | Copiar pistas y extraer sus datos |
| Array.from | Convertir los valores del Map a un array |
| Herencia | PuertaConClave extiende Puerta |
| Miembros privados y estáticos | Clave privada y método estático de validación |
| Módulos | Cada clase en su propio archivo, export e import |
| Excepciones | try/catch y throw al comprobar respuestas |

## Desarrollo previsto: al menos 10 commits reales
1. Definir idea, requisitos y plan (hecho).
2. Crear la primera sala jugable con objetos, copia y excepciones.
3. Añadir segunda pantalla y navegación secuencial.
4. Incorporar pistas con Map y Set.
5. Resolver el código con métodos de Array, spread y desestructuración.
6. Crear la clase base Puerta en un módulo.
7. Crear PuertaConClave con herencia y miembros privados y estáticos.
8. Integrar la tercera sala y la pantalla de victoria.
9. Probar errores, reinicio y bloqueo de salas; corregir lo necesario.
10. Completar comentarios y guía de preguntas para defender el código.

El orden puede ajustarse según las pruebas. Cada commit debe aportar un cambio real. Se requiere al menos uno por semana desde la publicación del enunciado; las fechas de publicación y examen están pendientes de confirmar. No se modifican las fechas reales de los commits.

## Cómo abrirlo
Con VS Code: abrir esta carpeta y ejecutar index.html con Live Server. El servidor será obligatorio cuando se incorporen los módulos JavaScript. Alternativa si Python está instalado: ejecutar `python -m http.server 8000` en esta carpeta y abrir http://localhost:8000.

## Preparación del examen
El profesor pedirá modificar o explicar el código. Entender cada etapa, practicar un cambio pequeño y comprobar el resultado antes de continuar. El historial por sí solo no garantiza una nota.
