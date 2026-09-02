# Requerimientos: Salas por URL y Centro Geométrico

## Visión General
Permitir a un grupo de usuarios unirse a una sesión compartida mediante una URL única, ingresar un apodo, colocar su ubicación de origen en un mapa y visualizar de forma reactiva el centro geométrico óptimo para su encuentro.

## Flujo de Usuario (UX)
1. **Creación:** Un usuario (Anfitrión) crea una nueva sala. Se genera un ID único (ej. `meetingfinder.com/room/abc-123`).
2. **Ingreso/Unión:** Al entrar a la URL, la aplicación solicita al usuario que ingrese un **Apodo** (nickname) antes de ver el mapa (no requiere registro, sesión manejada vía `localStorage` o Cookies).
3. **Interacción con el Mapa:** El usuario ve un mapa impulsado por **Google Maps API**. 
4. **Colocación de Pin:** El usuario busca o hace clic en el mapa para fijar su "punto de origen".
5. **Cálculo y Sincronización:** El mapa muestra los pines de todos los participantes de la sala en tiempo real (o mediante polling corto de ~3-5 segundos) y calcula/dibuja un marcador destacado indicando el "Centro Geométrico" (el punto más equitativo).

## Requerimientos Funcionales
- **Mapas:** Integración obligatoria con Google Maps API para la renderización, geocodificación (búsqueda de lugares) y cálculo de coordenadas.
- **Sincronización:** Reactiva. La UI debe reflejar de inmediato (o con retraso mínimo) los nuevos pines agregados por otros usuarios mediante Server Actions + Polling o WebSockets (a definir en plan).
- **Gestión de Sesión:** El apodo y un ID de participante local deben almacenarse en el cliente para mantener la identidad si se recarga la página.
- **Centro Geométrico:** Algoritmo que promedie las latitudes y longitudes de todos los pines activos para encontrar el centro.

## Fuera de Alcance (MVP)
- Trazado de rutas desde los orígenes al centro.
- Información de tráfico en tiempo real.
- Autenticación persistente (Oauth, Email/Password).
