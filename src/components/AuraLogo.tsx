import React from 'react';

interface AuraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({ size = 'md', showText = true }) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  const textStyles = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className="flex items-center gap-2.5 select-none" id="aura-maker-logo-container">
      <div
        className={`${iconDimensions} relative flex items-center justify-center bg-gradient-to-tr from-orange-600 via-red-600 to-rose-500 rounded-xl shadow-lg shadow-orange-600/30 p-1.5 border border-orange-400/40`}
      >
        {/* Dynamic Apex Athletic Symbol (Aura A) */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          <path
            d="M20 4L7 34H14.5L20 20.5L25.5 34H33L20 4Z"
            fill="currentColor"
          />
          <path
            d="M13 26H27L20 9L13 26Z"
            fill="white"
            fillOpacity="0.35"
          />
          <circle cx="20" cy="27.5" r="3" fill="#FFE5D9" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-bold tracking-tight uppercase text-white ${textStyles}`}>
              Aura<span className="text-orange-500 font-extrabold ml-1">Maker</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded">
              PRO
            </span>
          </div>
          <span className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold mt-0.5">
            FITNESS & TELEMETRY
          </span>
        </div>
      )}
    </div>
  );
};
