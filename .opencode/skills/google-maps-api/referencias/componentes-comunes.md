# Componentes Comunes de Google Maps

## AutocompleteInput
Componente reutilizable para buscar direcciones.

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export const AutocompleteInput = ({ onPlaceSelect }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);

    autocomplete.addListener('place_changed', () => {
      onPlaceSelect(autocomplete.getPlace());
    });
  }, [places, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="Buscar una ubicación..."
    />
  );
};
```

## MapControl
Cómo añadir controles personalizados al mapa.

```tsx
import { MapControl, ControlPosition } from '@vis.gl/react-google-maps';

export const CustomControl = () => {
  return (
    <MapControl position={ControlPosition.TOP_LEFT}>
      <div className="m-2 p-2 bg-white rounded shadow text-black">
        Mi Control
      </div>
    </MapControl>
  );
};
```
