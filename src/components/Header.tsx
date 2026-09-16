import React from 'react';

interface HeaderProps {
  lang: 'pt' | 'en';
  setLang: (lang: 'pt' | 'en') => void;
  subtitle: string;
}

const LOGO_SRC = `${import.meta.env.BASE_URL}logo-biza.png`;

export const Header: React.FC<HeaderProps> = ({ lang, setLang, subtitle }) => {
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

      {/* Logo Real da Biza Pizzas */}
      <img
        src={LOGO_SRC}
        alt="Biza Pizzas"
        className="h-14 sm:h-16 w-auto object-contain mx-auto drop-shadow-xl"
      />

      {/* Subtítulo Discreto */}
      <p className="text-xs font-semibold text-amber-200/90 tracking-widest uppercase mt-0.5 drop-shadow">
        {subtitle}
      </p>
    </header>
  );
};
