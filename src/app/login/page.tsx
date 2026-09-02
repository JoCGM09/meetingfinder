'use client';

import { useState } from 'react';
import { loginWithGoogle, loginWithMagicLink } from '@/lib/auth-actions';
import { Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await loginWithMagicLink(formData);
      setIsEmailSent(true);
    } catch (error) {
      alert('Error al enviar el enlace mágico');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] p-4 font-sans text-white">
      <div className="w-full max-w-md bg-[#222222] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col gap-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black tracking-tighter">Acceso</h2>
          <p className="text-gray-400 font-medium">
            Gestiona tus salas y lugares favoritos
          </p>
        </div>

        {isEmailSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="bg-[#E31C5F]/10 text-[#E31C5F] p-4 rounded-2xl border border-[#E31C5F]/20">
              <p className="font-bold">Revisa tu bandeja de entrada</p>
              <p className="text-sm opacity-80 mt-1">Hemos enviado un enlace de acceso a tu correo.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => loginWithGoogle()}
              className="w-full bg-white text-black py-4 rounded-[1.5rem] font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.75c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#222222] px-4 text-gray-500 font-bold tracking-widest">o</span></div>
            </div>

            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#E31C5F] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Tu correo electrónico"
                  required
                  className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-[#121212] border-2 border-transparent focus:border-[#E31C5F]/30 outline-none text-white font-bold transition-all placeholder:text-gray-600"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E31C5F] text-white py-4 rounded-[1.5rem] font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_15px_30px_-10px_rgba(227,28,95,0.4)] disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? "Enviando..." : "Enviar enlace"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
