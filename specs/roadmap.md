# Roadmap

<!-- Generado/actualizado por /constitution. Fases MUY pequeñas: cada una debe ser algo demostrable de punta a punta, no una capa técnica aislada ("no: crear toda la capa de BD" / "sí: usuario puede ver lista de horarios disponibles"). -->

- [x] Fase 1: **Salas por URL y Centro Geométrico**
  - Creación de salas instantáneas con acceso vía enlaces compartidos (anónimo/invitado).
  - Usuarios añaden su punto de origen (mapa básico).
  - Cálculo del centro geométrico matemático básico de todos los orígenes.
  - Implementación de UI inicial (TailwindCSS + shadcn/ui).
- [x] Fase 2: **Destinos Propuestos y Distancias Reales**
  - Integración completa con Google Maps API.
  - Usuarios pueden proponer lugares de destino específicos (casa, restaurantes, universidad).
  - Cálculo de centralidad utilizando distancias/tiempos reales.
  - Selección algorítmica del destino más justo/equitativo sin tiempos exagerados para ningún participante.
- [x] Fase 3: **Perfiles Opcionales y Gestión**
  - Autenticación opcional para perfiles de usuario.
  - Gestión de lugares favoritos (para no tener que ingresarlos cada vez).
  - Historial de reuniones/salas.
- [ ] Fase 4: **Despliegue**
  - Configuración de entornos y variables.
  - Despliegue en Vercel.
