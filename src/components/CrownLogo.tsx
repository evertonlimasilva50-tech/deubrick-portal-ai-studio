import React from 'react';

interface CrownLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  cityName?: string;
}

export const CrownLogo: React.FC<CrownLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  cityName,
}) => {
  return (
    <div className="flex flex-col items-center select-none text-center">
      {/* Gold Crown Emblem - Exact 3-pointed crown from street flyer */}
      <div className={`text-[#FFE500] drop-shadow-[0_2px_14px_rgba(255,229,0,0.55)] ${
        size === 'sm' ? 'w-6 h-5 mb-0.5' :
        size === 'md' ? 'w-9 h-6 mb-1' :
        size === 'lg' ? 'w-12 h-8 mb-1.5' :
        'w-16 h-11 mb-2'
      }`}>
        <svg viewBox="0 0 100 65" className="w-full h-full fill-current filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {/* Three-pointed crown shape matching the Deu-Brick reference */}
          <polygon points="10,60 14,24 35,42 50,6 65,42 86,24 90,60" />
          <circle cx="14" cy="20" r="5.5" />
          <circle cx="50" cy="5" r="5.5" />
          <circle cx="86" cy="20" r="5.5" />
          <rect x="10" y="54" width="80" height="7" rx="3.5" />
        </svg>
      </div>

      {/* Main DEU-BRICK text with crisp vector outline and sharp 3D depth */}
      <div className="relative inline-block leading-none">
        <span
          className={`font-bebas tracking-tight uppercase italic transform -rotate-2 inline-block select-none ${
            size === 'sm' ? 'text-2xl' :
            size === 'md' ? 'text-4xl' :
            size === 'lg' ? 'text-6xl sm:text-7xl' :
            'text-7xl sm:text-8xl'
          }`}
          style={{
            WebkitTextStroke: size === 'sm' ? '0.8px #000' : size === 'md' ? '1.4px #000' : '2.2px #000',
            paintOrder: 'stroke fill',
            textShadow: size === 'sm'
              ? '0 2px 0 #000, 1px 2px 0 rgba(0,0,0,0.9), 0 0 12px rgba(255,229,0,0.4)'
              : size === 'md'
              ? '0 3px 0 #000, 2px 3px 0 rgba(0,0,0,0.9), 0 0 18px rgba(255,229,0,0.4)'
              : '0 4px 0 #000, 3px 5px 0 rgba(0,0,0,0.95), 0 0 28px rgba(255,229,0,0.45)',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <span className="text-white">DEU</span>
          <span className="text-[#FFE500] mx-0.5">-</span>
          <span className="text-[#FFE500]">BRICK</span>
        </span>
      </div>

      {/* "GRUPO DE WHATSAPP" sticker banner from flyer */}
      {showSubtitle && (
        <div className={`mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0A0B0E] border-2 border-[#FFE500] text-[#FFE500] font-bebas tracking-widest uppercase transform -rotate-1 shadow-lg shadow-black/80 ${
          size === 'sm' ? 'text-xs' :
          size === 'md' ? 'text-sm' :
          'text-base sm:text-lg'
        }`}>
          {/* WhatsApp Mini Icon */}
          <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
            <path d="M12.031 2C6.505 2 2.016 6.489 2.016 12.016c0 1.765.46 3.488 1.332 5.009L2 22.031l5.148-1.328a9.986 9.986 0 0 0 4.883 1.313h.004c5.526 0 10.015-4.489 10.015-10.016 0-2.678-1.043-5.197-2.936-7.09A9.95 9.95 0 0 0 12.031 2zm0 18.336h-.003a8.318 8.318 0 0 1-4.242-1.163l-.304-.18-3.156.816.844-3.076-.197-.314a8.31 8.31 0 0 1-1.272-4.403c0-4.595 3.738-8.333 8.335-8.333 2.226 0 4.318.867 5.892 2.441a8.27 8.27 0 0 1 2.44 5.895c0 4.597-3.739 8.334-8.334 8.334zm4.569-6.236c-.25-.125-1.48-.73-1.71-.813-.23-.083-.397-.125-.564.125-.167.25-.646.813-.792.98-.146.167-.292.188-.542.063s-1.057-.39-2.013-1.242c-.744-.664-1.247-1.484-1.393-1.734-.146-.25-.016-.385.109-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.313-.021-.438s-.564-1.356-.772-1.856c-.203-.487-.41-.42-.564-.428-.146-.008-.313-.01-.48-.01s-.438.063-.667.313c-.23.25-.876.855-.876 2.085s.896 2.418 1.021 2.585c.125.167 1.764 2.693 4.273 3.777.597.258 1.064.412 1.428.528.6.191 1.146.164 1.578.1.481-.072 1.48-.605 1.688-1.189.208-.584.208-1.084.146-1.189-.063-.104-.23-.167-.48-.292z" />
          </svg>
          <span>GRUPO DE WHATSAPP</span>
        </div>
      )}

      {/* Optional City Tag from Flyer (e.g. 📍 CANOAS - RS) */}
      {cityName && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFE500] text-black font-bebas text-sm sm:text-base tracking-wider uppercase shadow-md font-black transform rotate-1">
          <span>📍</span>
          <span>{cityName} - RS</span>
        </div>
      )}
    </div>
  );
};
