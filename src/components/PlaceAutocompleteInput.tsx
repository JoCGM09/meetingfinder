'use client';

/// <reference types="google.maps" />
import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search, Info } from 'lucide-react';

interface PlaceAutocompleteInputProps {
  onPlaceSelect: (place: any) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function PlaceAutocompleteInput({
  onPlaceSelect,
  disabled = false,
  placeholder = "Busca un lugar de destino..."
}: PlaceAutocompleteInputProps) {
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    console.log('Places Library status:', !!placesLib);
    if (!placesLib || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address', 'place_id'],
      componentRestrictions: { country: 'pe' },
    };

    const ac = new (placesLib as any).Autocomplete(inputRef.current, options);
    setAutocomplete(ac);

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (place.geometry) {
        onPlaceSelect(place);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    });

    return () => {
      if (typeof window !== 'undefined' && (window as any).google?.maps) {
        (window as any).google.maps.event.removeListener(listener);
      }
    };
  }, [placesLib, onPlaceSelect]);

  return (
    <div className="w-full relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E31C5F] transition-colors z-10">
        <Search className="w-5 h-5" />
      </div>
      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        placeholder={disabled ? "Límite de destinos alcanzado" : placeholder}
        className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-white dark:bg-[#222222] border-2 border-transparent focus:border-[#E31C5F]/30 outline-none text-gray-800 dark:text-white text-base font-semibold transition-all shadow-xl placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {disabled && (
        <div className="absolute top-full mt-3 left-0 right-0 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-3 rounded-2xl flex items-center gap-2 text-yellow-700 dark:text-yellow-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <Info className="w-4 h-4" />
          <span>Máximo 5 destinos por sala</span>
        </div>
      )}
    </div>
  );
}
