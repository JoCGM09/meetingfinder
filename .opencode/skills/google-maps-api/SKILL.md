---
name: google-maps-api
description: Estándares y flujos de trabajo para integrar Google Maps en Next.js 15+ (App Router) usando @vis.gl/react-google-maps. Úsala cuando necesites configurar el mapa, añadir marcadores avanzados, buscar lugares con Places API o calcular rutas con Directions API.
---

# Google Maps API con @vis.gl/react-google-maps

Esta skill estandariza el uso de la librería oficial de Google Maps para React en entornos Next.js modernos, asegurando el cumplimiento de las mejores prácticas de rendimiento, tipado y seguridad.

## Configuración Inicial

### 1. Variables de Entorno
Asegúrate de tener la API Key en tu archivo `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aquí
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=tu_map_id_aquí (necesario para marcadores avanzados)
```

### 2. APIProvider (Root Layout o Componente Superior)
Envuelve tu aplicación o sección del mapa con `APIProvider`.

```tsx
import { APIProvider } from '@vis.gl/react-google-maps';

export default function RootLayout({ children }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      {children}
    </APIProvider>
  );
}
```

## Componentes de Mapa

### Mapa Básico y AdvancedMarker
Para usar `AdvancedMarker`, es **obligatorio** pasar un `mapId`.

```tsx
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export const MeetingMap = () => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Map
        defaultCenter={{ lat: -34.6037, lng: -58.3816 }}
        defaultZoom={13}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        colorScheme="light" // "light", "dark" o "follow_system"
      >
        <AdvancedMarker position={{ lat: -34.6037, lng: -58.3816 }}>
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      </Map>
    </div>
  );
};
```

## Workflows

### Workflow: Añadir Marcadores Dinámicos
1. Define el estado para tus ubicaciones.
2. Mapea sobre el estado para renderizar `AdvancedMarker`.
3. Usa el componente `Pin` para personalización rápida o contenido HTML personalizado dentro de `AdvancedMarker`.

### Workflow: Búsqueda de Lugares (Places API)
Usa el hook `useMapsLibrary` para cargar la librería `places`.

```tsx
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

const PlacesAutocomplete = () => {
  const placesLib = useMapsLibrary('places');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };

    setAutocomplete(new placesLib.Autocomplete(inputRef.current, options));
  }, [placesLib]);

  // Manejar el evento place_changed
};
```

### Workflow: Cálculo de Rutas (Directions API)
Carga la librería `routes`.

```tsx
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

const Directions = () => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLib || !map) return;
    setDirectionsService(new routesLib.DirectionsService());
    setDirectionsRenderer(new routesLib.DirectionsRenderer({ map }));
  }, [routesLib, map]);

  const calculateRoute = (origin, destination) => {
    directionsService?.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK') directionsRenderer?.setDirections(result);
    });
  };
};
```

## Gestión de Errores y Carga
- El `APIProvider` maneja la carga asíncrona. 
- Puedes usar el hook `useApiIsLoaded` para mostrar esqueletos o placeholders mientras la API carga.
- **Seguridad**: Asegúrate de restringir tu API Key en la consola de Google Cloud para que solo funcione en tu dominio y con las APIs específicas (Maps, Places, Directions).

## Personalización (Modo Claro/Oscuro)
El componente `Map` acepta la prop `colorScheme`. En Next.js con Tailwind y temas (ej. `next-themes`), puedes pasar el valor dinámicamente:
```tsx
const { theme } = useTheme();
<Map colorScheme={theme === 'dark' ? 'dark' : 'light'} ... />
```

## Referencias
- [Documentación oficial @vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/)
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript/overview)
