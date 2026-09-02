# Validación de QA (Playwright): Salas por URL

## Escenario 1: Creación de sala
- **Test:** Un usuario entra a la landing page, hace clic en "Crear sala".
- **Expectativa:** La URL cambia a `/room/[id]`, se muestra la pantalla de ingreso de apodo en el tono amigable de la marca.

## Escenario 2: Ingreso de usuario y persistencia
- **Test:** El usuario ingresa el apodo "Juan" y envía el formulario. Se recarga la página.
- **Expectativa:** El usuario accede a la vista del mapa sin que se le vuelva a pedir el apodo.

## Escenario 3: Colocación de pin y cálculo de centro
- **Test:** 
  1. El usuario "Juan" (Anfitrión) coloca un pin en el mapa.
  2. Un segundo usuario "Ana" (simulado en otro contexto de navegador o incognito) entra a la misma URL, ingresa su apodo y coloca otro pin.
- **Expectativa:**
  - El mapa de Juan se actualiza automáticamente mostrando el pin de Ana.
  - Aparece un marcador especial de "Centro Geométrico" exactamente en el promedio de las coordenadas de Juan y Ana.

## Escenario 4: Accesibilidad de Tema
- **Test:** Alternar la preferencia del sistema a Modo Oscuro.
- **Expectativa:** Los colores de fondo, texto y el tema del mapa de Google cambian adecuadamente a los tokens oscuros definidos en `brand-definition.md`.
