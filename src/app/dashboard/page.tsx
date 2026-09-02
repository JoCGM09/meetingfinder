import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { logout } from '@/lib/auth-actions';
import { MapPin, Calendar, Clock, ChevronRight, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const history = await prisma.roomHistory.findMany({
    where: { userId: user.id },
    include: {
      room: {
        include: {
          _count: {
            select: { participants: true }
          }
        }
      }
    },
    orderBy: { lastVisitedAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#E31C5F]/10 rounded-[2rem] flex items-center justify-center border border-[#E31C5F]/20">
              <User className="w-8 h-8 text-[#E31C5F]" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Mi Dashboard</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#222222] hover:bg-[#2a2222] text-gray-300 hover:text-red-400 rounded-[1.25rem] font-bold transition-all border border-white/5">
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </form>
        </header>

        {/* History Section */}
        <section className="space-y-6">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
            <Clock className="w-4 h-4" /> Historial de Salas
          </h2>

          <div className="grid gap-4">
            {history.map((item) => (
              <Link 
                key={item.id} 
                href={`/room/${item.roomId}`}
                className="group p-6 bg-[#222222] rounded-[2rem] border border-white/5 hover:border-[#E31C5F]/30 transition-all flex items-center justify-between shadow-xl"
              >
                <div className="flex items-center gap-6 min-w-0">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#E31C5F]/10 transition-colors">
                    <MapPin className="w-6 h-6 text-gray-400 group-hover:text-[#E31C5F]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg truncate">Sala {item.roomId.substring(0, 8)}...</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.lastVisitedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.room._count.participants} participantes
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            ))}

            {history.length === 0 && (
              <div className="py-20 text-center bg-[#222222] rounded-[3rem] border border-dashed border-white/5">
                <p className="text-gray-500 font-bold">Aún no has visitado ninguna sala.</p>
                <Link href="/" className="mt-4 inline-block text-[#E31C5F] font-black text-sm hover:underline">
                  ¡CREAR UNA AHORA!
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
