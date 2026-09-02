# Brand Definition: MeetingFinder

## 1. Identidad y Tono
- **Producto:** MeetingFinder es una app para coordinar puntos de encuentro equitativos de forma rápida y sin fricción mediante enlaces compartidos.
- **Tono de Voz:** Amigable, colorido, lúdico y accesible. Inspirado en productos como Airbnb y Life360.
- **Voz y Copy:** 
  - *Ejemplo de botón:* "¡Crear sala de encuentro!" (vs. "Inicializar sesión").
  - *Ejemplo de error:* "¡Ups! No pudimos encontrar ese lugar. ¿Intentamos de nuevo?" (vs. "Error 404: Ubicación no encontrada").
  - *Evitar:* Jerga técnica, mensajes corporativos fríos, flujos burocráticos.

## 2. Tipografía
- **Familia principal:** Inter (o similar sans-serif geométrica, amigable y muy legible).
- **Pesos:** Regular (400) para cuerpo, SemiBold (600) para botones y subtítulos, Bold (700) para encabezados.

## 3. Paleta de Color y Contraste
La app soporta Modo Claro y Modo Oscuro por defecto.

### Colores Semánticos (Mapa y UI)
- **Ganador (Winner):** Verde (Ej. `#10B981`) - Representa éxito y el punto de encuentro final.
- **Origen (Origin):** Azul (Ej. `#3B82F6`) - Representa a los participantes y sus puntos de partida.
- **Destino Propuesto (Destination):** Rosa/Rojo (Ej. `#E31C5F`) - Representa los lugares sugeridos por los usuarios.

### Modo Claro
- **Primario (Marca/Botones):** `#E31C5F` (Rosa/Rojo vibrante).
- **Fondo:** `#FFFFFF` (Blanco).
- **Superficies (Tarjetas):** `#F7F7F9` (Gris muy claro).
- **Texto Principal:** `#222222` (Gris casi negro).
- **Texto Secundario:** `#717171`.
- *Verificación de accesibilidad:* `#E31C5F` sobre `#FFFFFF` pasa AA para elementos grandes. Texto `#FFFFFF` sobre fondo `#E31C5F` tiene contraste > 4.5:1 (Pasa AA para texto normal).

### Modo Oscuro
- **Primario (Marca/Botones):** `#FF5A5F` (Rosa/Rojo ligeramente más claro para resaltar en oscuro).
- **Fondo:** `#121212` (Gris muy oscuro).
- **Superficies (Tarjetas):** `#222222`.
- **Texto Principal:** `#EBEBEB` (Gris muy claro).
- **Texto Secundario:** `#A0A0A0`.
- *Verificación de accesibilidad:* Texto `#121212` sobre fondo `#FF5A5F` tiene un contraste > 4.5:1 (Pasa AA).

## 4. Design Tokens (JSON)
```json
{
  "colors": {
    "primary": { "light": "#E31C5F", "dark": "#FF5A5F" },
    "background": { "light": "#FFFFFF", "dark": "#121212" },
    "surface": { "light": "#F7F7F9", "dark": "#222222" },
    "textMain": { "light": "#222222", "dark": "#EBEBEB" },
    "textMuted": { "light": "#717171", "dark": "#A0A0A0" },
    "semantic": {
      "winner": "#10B981",
      "origin": "#3B82F6",
      "destination": { "light": "#E31C5F", "dark": "#FF5A5F" }
    }
  },
  "typography": {
    "fontFamily": "Inter, sans-serif"
  }
}
```

## 5. Iconografía
- Usar iconos simples, de trazo limpio (ej. Lucide React).
- Asignar colores semánticos a los pines del mapa y a los iconos de la UI según el tipo de ubicación (Verde para Ganador, Azul para Origen, Rosa para Destinos).
- Emplear marcadores visualmente distintos (por forma o icono interno) para diferenciar rápidamente Orígenes de Destinos en el mapa.