'use client';

import { Map, APIProvider, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Participant {
  id: string;
  nickname: string;
  lat: number | null;
  lng: number | null;
}

interface Destination {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface MapViewerProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  participants?: Participant[];
  destinations?: Destination[];
  winnerDestination?: Destination | null;
  onMapClick?: (lat: number, lng: number) => void;
  geometricCenter?: { lat: number; lng: number } | null;
}

export default function MapViewer({ 
  center = { lat: -12.0464, lng: -77.0428 }, 
  zoom = 13,
  participants = [],
  destinations = [],
  winnerDestination = null,
  onMapClick,
  geometricCenter
}: MapViewerProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-gray-50 dark:bg-[#121212] animate-pulse" />;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || '';

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full">
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId={mapId}
          colorScheme={resolvedTheme === 'dark' ? 'DARK' : 'LIGHT'}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onClick={(e) => {
            if (e.detail.latLng && onMapClick) {
              onMapClick(e.detail.latLng.lat, e.detail.latLng.lng);
            }
          }}
          onContextmenu={(e) => {
            if (e.detail.latLng) {
               window.dispatchEvent(new CustomEvent('propose-map-destination', { 
                 detail: { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng } 
               }));
            }
          }}
        >
          {participants.map((p) => (
            p.lat && p.lng && (
              <AdvancedMarker key={p.id} position={{ lat: p.lat, lng: p.lng }}>
                <div className="flex flex-col items-center">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-xl border border-blue-100 mb-2">
                    <span className="text-xs font-black text-blue-600 whitespace-nowrap">{p.nickname}</span>
                  </div>
                  <Pin background={'#2563eb'} borderColor={'#FFFFFF'} glyphColor={'#FFFFFF'} scale={1} />
                </div>
              </AdvancedMarker>
            )
          ))}

          {destinations.map((d) => (
            <AdvancedMarker key={d.id} position={{ lat: d.lat, lng: d.lng }}>
              <div className="flex flex-col items-center">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-xl border border-pink-100 mb-2">
                  <span className="text-xs font-black text-pink-600 whitespace-nowrap">{d.name}</span>
                </div>
                <Pin background={'#FFFFFF'} borderColor={'#db2777'} glyphColor={'#db2777'} scale={0.9} />
              </div>
            </AdvancedMarker>
          ))}

          {winnerDestination && (
            <AdvancedMarker position={{ lat: winnerDestination.lat, lng: winnerDestination.lng }}>
              <div className="flex flex-col items-center z-50">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-500 px-4 py-2 rounded-full shadow-2xl border-2 border-white mb-2">
                  <span className="text-sm font-black text-white whitespace-nowrap flex items-center gap-2">GANADOR</span>
                </motion.div>
                <div className="relative">
                   <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                   <Pin background={'#22c55e'} borderColor={'#FFFFFF'} glyphColor={'#FFFFFF'} scale={1.4} />
                </div>
              </div>
            </AdvancedMarker>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
