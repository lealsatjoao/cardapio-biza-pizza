import React from 'react';

interface HeaderProps {
  lang: 'pt' | 'en';
  setLang: (lang: 'pt' | 'en') => void;
}

const LOGO_SRC = `${import.meta.env.BASE_URL}logo-biza.png`;
const FALLBACK_SRC = `${import.meta.env.BASE_URL}bg-biza.jpg`;

export const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  return (
    <header className="relative w-full pt-3 pb-2 px-4 text-center select-none overflow-hidden">
      {/* Botão de Idioma (Topo Direito) */}
      <div className="absolute right-3 top-3 z-30">
        <button
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 hover:bg-black/90 border border-amber-500/50 backdrop-blur-md text-xs font-semibold text-white shadow-md active:scale-95 transition-all"
        >
          <span>{lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}</span>
        </button>
      </div>

      {/* Container da Logo com Queijo Animado */}
      <div className="relative inline-block mx-auto mt-1 mb-1">
        {/* Imagem Real da Logo Biza Pizzas */}
        <img
          src={LOGO_SRC}
          alt="Biza Pizzas"
          className="h-16 sm:h-20 w-auto object-contain mx-auto relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
          onError={(e) => {
            // Fallback caso logo-biza.png ainda esteja sendo gerada
            e.currentTarget.src = FALLBACK_SRC;
            e.currentTarget.className = "h-16 sm:h-20 w-36 object-cover object-top rounded-lg mx-auto relative z-10";
          }}
        />

        {/* Camada de Gotas de Queijo Escorrendo com Animação CSS */}
        <div className="absolute inset-x-0 bottom-1 h-8 pointer-events-none z-20 flex justify-center items-start gap-12 sm:gap-16">
          {/* Gota 1: Sob a letra 'z' */}
          <div className="relative flex flex-col items-center animate-cheese-drip-1">
            <span className="w-1.5 h-3 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-full shadow-sm" />
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-md -mt-1 animate-cheese-fall-1" />
          </div>

          {/* Gota 2: Sob a letra 'P' */}
          <div className="relative flex flex-col items-center animate-cheese-drip-2">
            <span className="w-2 h-4 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-full shadow-sm" />
            <span className="w-3 h-3 bg-amber-400 rounded-full shadow-md -mt-1 animate-cheese-fall-2" />
          </div>

          {/* Gota 3: Sob a letra 'a' */}
          <div className="relative flex flex-col items-center animate-cheese-drip-3">
            <span className="w-1.5 h-3 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-full shadow-sm" />
            <span className="w-2 h-2 bg-amber-400 rounded-full shadow-md -mt-1 animate-cheese-fall-3" />
          </div>
        </div>
      </div>

      {/* Subtítulo Discreto */}
      <p className="text-xs font-semibold text-amber-200/90 tracking-widest uppercase mt-0.5 drop-shadow">
        {lang === 'pt' ? 'Cardápio do Salão' : 'Dine-in Menu'}
      </p>

      {/* Estilos CSS da Animação do Queijo Pingando */}
      <style>{`
        @keyframes cheeseDrip {
          0%, 100% { transform: scaleY(0.8) translateY(0); }
          50% { transform: scaleY(1.4) translateY(3px); }
        }
        @keyframes cheeseFall {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          40% { transform: translateY(3px) scale(1.1); opacity: 1; }
          75% { transform: translateY(14px) scale(0.9); opacity: 1; }
          100% { transform: translateY(22px) scale(0.3); opacity: 0; }
        }
        .animate-cheese-drip-1 {
          animation: cheeseDrip 2.4s ease-in-out infinite;
        }
        .animate-cheese-fall-1 {
          animation: cheeseFall 2.4s cubic-bezier(0.4, 0, 1, 1) infinite;
        }
        .animate-cheese-drip-2 {
          animation: cheeseDrip 2.8s ease-in-out infinite 0.9s;
        }
        .animate-cheese-fall-2 {
          animation: cheeseFall 2.8s cubic-bezier(0.4, 0, 1, 1) infinite 0.9s;
        }
        .animate-cheese-drip-3 {
          animation: cheeseDrip 2.2s ease-in-out infinite 1.6s;
        }
        .animate-cheese-fall-3 {
          animation: cheeseFall 2.2s cubic-bezier(0.4, 0, 1, 1) infinite 1.6s;
        }
      `}</style>
    </header>
  );
};
