# Plan de Implementación: Distancias Reales y Destinos

Este documento detalla los pasos técnicos para implementar la lógica de destinos y algoritmos de punto céntrico.

## Tareas

### Tarea 2.1: Buscador Autocomplete y Límites UI (COMPLETADO)
- [x] Integrar Google Places Autocomplete en el frontend.
- [x] Configurar el componente para restringir los resultados exclusivamente a **Perú** (Restricción por país soportada nativamente).
- [x] Implementar la validación en el cliente: al detectar que la sala ya cuenta con 5 destinos propuestos, deshabilitar el input de búsqueda y renderizar un mensaje claro de límite alcanzado.

### Tarea 2.2: Actualización de Base de Datos (COMPLETADO)
- [x] Actualizar el esquema de Prisma (añadir modelo `ProposedDestination` en relación a la sala).
- [x] Generar y correr las migraciones correspondientes (`prisma db push`).
- [x] Actualizar los Server Actions asociados para soportar la creación de destinos, aplicando validación de límite de 5 destinos en el backend.
- [x] Sincronizar el frontend para cargar y persistir destinos propuestos.

### Tarea 2.3: Integración Distance Matrix API (COMPLETADO)
- [x] Implementar función de backend (Service/Server Action) para consultar la *Distance Matrix API* de Google Maps.
- [x] Estructurar la llamada de forma eficiente: enviar la matriz de orígenes (participantes) contra la matriz de destinos propuestos en un solo batch.
- [x] Manejar la comunicación básica y errores de la API.

### Tarea 2.4: Algoritmo de Decisión y Visualización en el Mapa (COMPLETADO)
- [x] Implementar el algoritmo en el backend:
  1. **Filtro:** Descartar destinos con al menos una ruta fallida.
  2. **Min-Max:** Encontrar los tiempos máximos por destino y seleccionar el menor.
  3. **Desempate:** Calcular el promedio en caso de colisión de máximos.
- [x] Exponer el destino "ganador" en la respuesta de la sala al frontend.
- [x] Actualizar los marcadores en el mapa del cliente integrando los tokens de color actualizados (Verde para el ganador, Azul para orígenes, Rosa para destinos).

### Tarea 2.5: Refactorización de las visuales
- Implementa un sistema de diseño frontend descente acorde al brand guide definido inicialmente.
- Aplica las buenas prácticas de UX-UI y frontend para generar una aplicación de alto impacto.
- Implementa un diseño responsivo y mobile frendly.