'use client';

import { useState } from 'react';

interface NicknameFormProps {
  onSubmit: (nickname: string) => void;
}

export default function NicknameForm({ onSubmit }: NicknameFormProps) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] p-4">
      <div className="w-full max-w-md bg-[#222222] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter">Hola</h2>
          <p className="text-gray-400 font-medium">
            ¿Cómo quieres que te vean en el mapa?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Tu apodo (ej. Juan)"
              required
              maxLength={30}
              className="w-full px-8 py-5 rounded-[1.5rem] bg-[#121212] border-2 border-transparent focus:border-[#E31C5F]/30 outline-none text-white text-lg font-bold transition-all placeholder:text-gray-600"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E31C5F] text-white py-5 rounded-[1.5rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(227,28,95,0.4)]"
          >
            Unirme a la reunión
          </button>
        </form>
      </div>
    </div>
  );
}
