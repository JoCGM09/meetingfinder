# Requisitos: Distancias Reales y Destinos

## Objetivo
Implementar el cálculo de distancias reales utilizando la API de Google Maps (Distance Matrix) y seleccionar el punto de encuentro óptimo para todos los participantes basándose en una evaluación de tiempos de viaje.

## Alcance y Lógica de Negocio

### 1. Algoritmo de Selección (El Ganador)
- **Estrategia principal (Min-Max):** El sistema debe minimizar el tiempo de viaje del participante que más tarde en llegar. Es decir, el destino ganador será aquel cuyo tiempo máximo de viaje entre todos los participantes sea el menor.
- **Criterio de Desempate:** En caso de que dos o más destinos tengan el mismo tiempo máximo de viaje, ganará el que tenga el **menor tiempo promedio** de viaje de todos los participantes.

### 2. Manejo de Errores y Rutas Inviables
- Si la API no puede encontrar una ruta terrestre entre el punto de origen de **cualquier** participante y un destino propuesto, ese destino queda automáticamente **descartado** de las opciones posibles.

### 3. Restricciones de Búsqueda (Buscador)
- Todas las búsquedas de lugares y autocompletado estarán restringidas estrictamente a **Lima, Perú**.

### 4. Límites y Reglas de UI
- **Máximo de Destinos:** Se permite un máximo de 5 destinos propuestos por sala.
- **Comportamiento UI:** Al llegar a los 5 destinos propuestos, la barra de búsqueda de destinos debe deshabilitarse y mostrar un mensaje indicando que se ha alcanzado el límite.

### 5. Reglas Visuales y de Marca
- **Colores Semánticos (Mapa y UI):**
  - **Ganador (Winner):** Verde.
  - **Origen (Origin):** Azul.
  - **Destino Propuesto (Destination):** Rosa.
- **Iconografía:** Uso de iconos distintos o formas de pines claras en el mapa para asegurar que el usuario diferencie visualmente los tipos de ubicación al primer vistazo.