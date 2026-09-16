import React from 'react';

interface HeaderProps {
  lang: 'pt' | 'en';
  setLang: (lang: 'pt' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  return (
    <header className="relative w-full pt-4 pb-3 px-4 text-center select-none">
      {/* Botão Seletor de Idioma (Topo Direito) */}
      <div className="absolute right-4 top-4 z-20">
        <button
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-amber-500/40 backdrop-blur-md text-xs font-semibold text-white shadow-lg transition-all active:scale-95"
          title={lang === 'pt' ? 'Mudar para Inglês' : 'Change to Portuguese'}
        >
          {lang === 'pt' ? (
            <>
              <span className="text-sm">🇧🇷</span>
              <span className="tracking-wider">PT</span>
            </>
          ) : (
            <>
              <span className="text-sm">🇺🇸</span>
              <span className="tracking-wider">EN</span>
            </>
          )}
        </button>
      </div>

      {/* Logo Estilizada Biza Pizzas com Queijo Escorrendo Sutileza */}
      <div className="flex justify-center items-center my-1">
        <svg
          viewBox="0 0 340 90"
          className="w-72 sm:w-80 h-auto filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.7)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente Vermelho Rubi do Texto */}
            <linearGradient id="bizaRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C51E28" />
              <stop offset="60%" stopColor="#9B111E" />
              <stop offset="100%" stopColor="#780812" />
            </linearGradient>

            {/* Gradiente Amarelo Dourado do Queijo Derretido */}
            <linearGradient id="meltedCheese" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Sombra / Contorno Externo Branco e Grosso */}
          <text
            x="170"
            y="56"
            textAnchor="middle"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="14"
            strokeLinejoin="round"
            style={{
              fontFamily: "'Fredoka', 'Titan One', 'Bungee', 'Impact', sans-serif",
              fontSize: '56px',
              fontWeight: '900',
              fontStyle: 'italic',
              letterSpacing: '1px'
            }}
          >
            Biza Pizzas
          </text>

          {/* Letras em Vermelho Rubi */}
          <text
            x="170"
            y="56"
            textAnchor="middle"
            fill="url(#bizaRed)"
            style={{
              fontFamily: "'Fredoka', 'Titan One', 'Bungee', 'Impact', sans-serif",
              fontSize: '56px',
              fontWeight: '900',
              fontStyle: 'italic',
              letterSpacing: '1px'
            }}
          >
            Biza Pizzas
          </text>

          {/* Fio de Queijo Escorrendo da letra 'z' */}
          <path
            d="M 124 54 C 124 64, 128 68, 130 68 C 132 68, 134 64, 134 54 Z"
            fill="url(#meltedCheese)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />

          {/* Fio de Queijo Escorrendo da letra 'P' */}
          <path
            d="M 166 55 C 166 67, 171 73, 173 73 C 175 73, 177 67, 177 55 Z"
            fill="url(#meltedCheese)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />

          {/* Gota de Queijo Suave na letra 'a' */}
          <path
            d="M 276 54 C 276 62, 279 66, 281 66 C 283 66, 285 62, 285 54 Z"
            fill="url(#meltedCheese)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />

          {/* Brilho Superior nas Gotas de Queijo */}
          <circle cx="130" cy="64" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
          <circle cx="173" cy="69" r="2" fill="#FFFFFF" fillOpacity="0.8" />
          <circle cx="281" cy="63" r="1.2" fill="#FFFFFF" fillOpacity="0.8" />
        </svg>
      </div>

      {/* Subtítulo Elegante e Limpo */}
      <p className="text-xs sm:text-sm font-medium text-amber-100/80 tracking-wide uppercase mt-1">
        {lang === 'pt' ? 'Cardápio do Salão' : 'Dine-in Menu'}
      </p>
    </header>
  );
};
