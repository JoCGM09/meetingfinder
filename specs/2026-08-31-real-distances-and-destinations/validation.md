# Validación y Criterios de Aceptación

Para dar esta feature por completada, las siguientes pruebas manuales o automatizadas (E2E con Playwright) deben pasar exitosamente.

## Casos de Prueba

### 1. Límite de la Interfaz (Buscador)
- **Acción:** Un usuario añade 5 destinos en una sala.
- **Resultado Esperado:** La barra de búsqueda se deshabilita instantáneamente, se muestra el mensaje de límite alcanzado, y ya no es posible buscar ni agregar un sexto destino. Un intento directo a la API con un sexto destino debe devolver error (HTTP 400).

### 2. Restricción Geográfica
- **Acción:** Un usuario busca "Eiffel Tower" o cualquier lugar fuera de Lima, Perú en el autocompletado.
- **Resultado Esperado:** El sistema no sugiere el lugar, devolviendo únicamente coincidencias locales en Lima.

### 3. Filtro de Rutas Inviables
- **Acción:** Simular una sala donde hay 2 orígenes válidos terrestres, y un destino propuesto que resulta inaccesible por ruta (ej. ubicado en el mar profundo o un área donde Google Maps devuelve `ZERO_RESULTS`).
- **Resultado Esperado:** El algoritmo debe ignorar completamente dicho destino, incluso si su distancia en línea recta pareciera corta. No debe generar un error fatal en la app, simplemente elige el siguiente mejor destino válido.

### 4. Algoritmo Min-Max y Desempate
- **Acción:**
  - Origen A, Origen B.
  - Destino 1: Tiempo para A (20 min), Tiempo para B (10 min). -> Máx: 20 min. Promedio: 15 min.
  - Destino 2: Tiempo para A (25 min), Tiempo para B (5 min). -> Máx: 25 min.
  - Destino 3: Tiempo para A (12 min), Tiempo para B (20 min). -> Máx: 20 min. Promedio: 16 min.
- **Resultado Esperado:**
  - El Destino 1 debe ser seleccionado como ganador. Empata en tiempo máximo con el Destino 3 (20 min), pero gana por desempate debido a un mejor promedio (15 min vs 16 min).

### 5. Consistencia Visual (Marcas/Pins)
- **Acción:** Visualizar una sala calculada con múltiples orígenes y destinos.
- **Resultado Esperado:**
  - Los orígenes se ven de color Azul.
  - Los destinos que no ganaron se ven de color Rosa.
  - El destino elegido como ganador destaca en color Verde con un pin diferenciado, sin dejar duda de cuál es el punto de encuentro final.