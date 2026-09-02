'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Trophy, Navigation, Search, Menu, X, CheckCircle2, Calculator, Info, MousePointer2 } from 'lucide-react';
import NicknameForm from '@/components/NicknameForm';
import MapViewer from '@/components/MapViewer';
import PlaceAutocompleteInput from '@/components/PlaceAutocompleteInput';
import { joinRoom, updateParticipantLocation, getParticipants, proposeDestination, getDestinations, calculateBestDestination } from '@/lib/actions';
import { createClient } from '@/utils/supabase/client';

interface Participant {
  id: string;
  nickname: string;
  lat: number | null;
  lng: number | null;
}

interface Destination {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  individualDurations?: { nickname: string; text: string; value: number }[];
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const supabase = createClient();
  
  const [participant, setParticipant] = useState<{ nickname: string; sessionId: string } | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [geometricCenter, setGeometricCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [winnerDestination, setWinnerDestination] = useState<Destination | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const calculateCenter = useCallback((parts: Participant[]) => {
    const validParts = parts.filter(p => p.lat !== null && p.lng !== null);
    if (validParts.length === 0) return null;
    const latSum = validParts.reduce((sum, p) => sum + (p.lat || 0), 0);
    const lngSum = validParts.reduce((sum, p) => sum + (p.lng || 0), 0);
    return { lat: latSum / validParts.length, lng: lngSum / validParts.length };
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [partsData, destsData] = await Promise.all([
        getParticipants(roomId),
        getDestinations(roomId)
      ]);
      setParticipants(partsData);
      setDestinations(destsData);
      setGeometricCenter(calculateCenter(partsData));
    } catch (error) {
      console.error('Error al refrescar datos:', error);
    }
  }, [roomId, calculateCenter]);

  const handleManualCalculate = async () => {
    if (participants.filter(p => p.lat).length < 1 || destinations.length === 0) {
      return;
    }
    setIsCalculating(true);
    try {
      const winner = await calculateBestDestination(roomId);
      setWinnerDestination(winner as Destination | null);
      if (winner) setShowReport(true);
    } catch (error) {
      console.error("Error al calcular");
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (!/^[a-z0-9]{20,30}$/i.test(roomId) && !roomId.startsWith('c')) return;
    const savedSession = localStorage.getItem(`room_session_${roomId}`);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setParticipant(session);
        // Only join if not already in participants list to avoid duplicates
        joinRoom(roomId, session.nickname, session.sessionId).catch(console.error);
      } catch (e) {
        localStorage.removeItem(`room_session_${roomId}`);
      }
    }
    setLoading(false);
    refreshData();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Participant', filter: `roomId=eq.${roomId}` },
        () => refreshData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ProposedDestination', filter: `roomId=eq.${roomId}` },
        () => refreshData()
      )
      .subscribe();

    const handleMapProp = async (e: any) => {
      const { lat, lng } = e.detail;
      try {
        await proposeDestination({
          roomId, name: "Destino propuesto", address: "Ubicación en el mapa", lat, lng, placeId: `custom-${Date.now()}`
        });
        // refreshData is handled by Realtime
      } catch (error) { 
        console.error('Límite alcanzado');
      }
    };

    window.addEventListener('propose-map-destination', handleMapProp);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('propose-map-destination', handleMapProp);
    };
  }, [roomId, refreshData, supabase]);

  const handleJoin = async (nickname: string) => {
    try {
      const sessionId = crypto.randomUUID();
      const newParticipant = { nickname: nickname.trim().substring(0, 30), sessionId };
      await joinRoom(roomId, newParticipant.nickname, sessionId);
      localStorage.setItem(`room_session_${roomId}`, JSON.stringify(newParticipant));
      setParticipant(newParticipant);
      await refreshData();
    } catch (error) { alert('La sala está llena o hubo un error'); }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    if (!participant) return;
    try {
      console.log('Actualizando ubicación:', lat, lng);
      await updateParticipantLocation(participant.sessionId, lat, lng);
    } catch (error) { 
      console.error('Error al actualizar ubicación:', error);
      alert('Error al marcar ubicación. Verifica tu conexión.');
    }
  };

  if (loading) return null;
  if (!participant) return <NicknameForm onSubmit={handleJoin} />;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white dark:bg-[#121212] font-sans text-brand-text-main">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
        )}
      </AnimatePresence>

      <motion.aside initial={false} animate={{ x: isSidebarOpen ? 0 : '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-[#222222] z-[101] shadow-2xl flex flex-col border-r border-gray-100 dark:border-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-black text-[#E31C5F] tracking-tighter">MeetingFinder</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">Participantes ({participants.length}/20)</h3>
            <div className="space-y-2">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent">
                  <div className={`w-2.5 h-2.5 rounded-full ${p.lat ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300 dark:bg-white/20'}`} />
                  <span className="font-semibold truncate">{p.nickname}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">Destinos ({destinations.length}/5)</h3>
            {destinations.length >= 5 && (
              <p className="text-[10px] font-bold text-[#E31C5F] bg-[#E31C5F]/10 p-2 rounded-lg">Ya se han propuesto 5 destinos en esta sala</p>
            )}
            <PlaceAutocompleteInput 
              onPlaceSelect={async (place) => {
                if (place.geometry?.location) {
                  await proposeDestination({
                    roomId,
                    name: place.name || "Destino",
                    address: place.formatted_address || "",
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    placeId: place.place_id || ""
                  });
                }
              }}
              disabled={destinations.length >= 5}
              placeholder="¿A dónde quieren ir hoy? 🍕"
            />
            <div className="space-y-3">
              {destinations.map((d) => (
                <div key={d.id} className={`p-4 rounded-3xl border transition-all ${winnerDestination?.id === d.id ? 'bg-green-500/5 border-green-500' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-gray-800'}`}>
                  <p className="font-bold truncate text-sm">{d.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.aside>

      <div className="relative flex-1 h-screen w-full flex flex-col">
        <header className="absolute top-0 left-0 right-0 p-4 lg:p-6 z-50 flex items-start justify-between gap-3 pointer-events-none">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            aria-label="Menu"
            className="pointer-events-auto p-4 bg-white/95 dark:bg-[#222222]/95 backdrop-blur-md rounded-[1.25rem] shadow-xl border border-white/20 text-gray-800 dark:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex pointer-events-auto flex-col items-end gap-2 bg-white/95 dark:bg-[#222222]/95 backdrop-blur-md px-6 py-4 rounded-[1.25rem] shadow-xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="font-bold">{participant.nickname}</span>
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Personas: {participants.length}
            </div>
          </div>
        </header>

        <div className="absolute inset-0 z-0">
          <MapViewer center={{ lat: -12.0464, lng: -77.0428 }} zoom={13} participants={participants} destinations={destinations} winnerDestination={winnerDestination} onMapClick={handleMapClick} geometricCenter={geometricCenter} />
        </div>

        {/* Guía de Uso Flotante */}
        <div className="absolute top-24 left-6 z-40 hidden md:flex flex-col gap-3 pointer-events-none text-brand-text-main">
          <div className="bg-white/90 dark:bg-[#222222]/90 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white/20 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full text-blue-500"><MousePointer2 className="w-4 h-4" /></div>
            <span className="text-xs font-bold">Clic izquierdo: Marcar tu ubicación</span>
          </div>
          <div className="bg-white/90 dark:bg-[#222222]/90 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white/20 flex items-center gap-3">
            <div className="p-2 bg-[#E31C5F]/10 rounded-full text-[#E31C5F]"><Navigation className="w-4 h-4" /></div>
            <span className="text-xs font-bold">Clic derecho: Proponer un destino</span>
          </div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 px-4 lg:px-6 pointer-events-none z-50">
          <div className="flex flex-col items-center gap-4">
            <AnimatePresence>
              {showReport && winnerDestination && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pointer-events-auto bg-white dark:bg-[#222222] p-5 rounded-[2rem] shadow-2xl border border-green-500/30 max-w-sm w-full mb-2">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-sm text-green-600 flex items-center gap-2 text-brand-text-main">REPORTE DE EQUIDAD</h4>
                    <button onClick={() => setShowReport(false)}><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  <div className="space-y-2">
                    {winnerDestination.individualDurations?.map((d, i) => (
                      <div key={i} className="flex justify-between text-xs border-b border-gray-50 dark:border-white/5 pb-2">
                        <span className="text-gray-500 font-medium">{d.nickname}</span>
                        <span className="font-bold">{d.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-md w-full pointer-events-auto bg-white/95 dark:bg-[#222222]/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#E31C5F]/10 rounded-3xl shrink-0">
                  {winnerDestination ? <Trophy className="w-8 h-8 text-[#E31C5F]" /> : <Calculator className={`w-8 h-8 text-[#E31C5F] ${isCalculating ? 'animate-spin' : ''}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black truncate">
                    {winnerDestination ? winnerDestination.name : "Listos para calcular?"}
                  </h3>
                  <button 
                    onClick={handleManualCalculate}
                    disabled={isCalculating || destinations.length === 0}
                    className="mt-1 text-xs font-black text-[#E31C5F] hover:underline disabled:text-gray-400 disabled:no-underline"
                  >
                    {isCalculating ? "ANALIZANDO..." : winnerDestination ? "RE-CALCULAR DESTINO" : "CALCULAR PUNTO OPTIMO"}
                  </button>
                </div>
                {winnerDestination && (
                  <button onClick={() => setShowReport(!showReport)} className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                    <Info className="w-6 h-6" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
