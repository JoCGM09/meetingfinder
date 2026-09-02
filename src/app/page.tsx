import MapViewer from "@/components/MapViewer";
import { createRoom } from "@/lib/actions";
import Link from "next/link";
import { User } from "lucide-react";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-6 bg-[#121212] overflow-hidden relative">
      <div className="absolute top-6 right-6 z-20">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-5 py-3 bg-[#222222] hover:bg-white/10 text-white rounded-full font-bold text-sm border border-white/10 transition-all shadow-lg"
        >
          <User className="w-4 h-4 text-[#E31C5F]" />
          <span>Mi Perfil</span>
        </Link>
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-8 text-center">
        <h1 className="text-6xl font-black text-[#E31C5F] tracking-tighter">MeetingFinder</h1>
        <p className="text-lg text-gray-400 font-medium max-w-lg">
          Encuentra el punto de encuentro perfecto para todos de forma equitativa.
        </p>
        
        <div className="w-full aspect-video lg:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 relative">
          <MapViewer center={{ lat: -12.0464, lng: -77.0428 }} zoom={13} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        <form action={createRoom} className="w-full max-w-xs">
          <button 
            type="submit"
            className="w-full bg-[#E31C5F] text-white px-8 py-5 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(227,28,95,0.4)]"
          >
            Crear sala de encuentro
          </button>
        </form>
      </div>
    </main>
  );
}
