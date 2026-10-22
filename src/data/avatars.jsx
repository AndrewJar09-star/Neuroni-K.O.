import React from 'react';

// ============================================================================
// 1. IL PRESENTATORE SHOWMAN (Cervello Antropomorfo con Smoking, Occhiali & Mic)
// ============================================================================
export function HostSvg({ className = "w-24 h-24", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 140 140"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="brainGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FF85B3" />
          <stop offset="70%" stopColor="#FF2A85" />
          <stop offset="100%" stopColor="#D9005B" />
        </radialGradient>
        <linearGradient id="suitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A2A36" />
          <stop offset="100%" stopColor="#0D0D12" />
        </linearGradient>
        <linearGradient id="lapelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD600" />
          <stop offset="100%" stopColor="#FFA000" />
        </linearGradient>
      </defs>

      {/* Tuxedo Shoulders & Chest */}
      <path
        d="M20 135 C20 105 38 98 70 98 C102 98 120 105 120 135 Z"
        fill="url(#suitGrad)"
        stroke="#000"
        strokeWidth="4"
      />
      {/* White Dress Shirt V */}
      <polygon
        points="52,98 88,98 70,128"
        fill="#FFFFFF"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Gold Satin Lapels */}
      <polygon
        points="40,98 56,128 70,128 54,98"
        fill="url(#lapelGrad)"
        stroke="#000"
        strokeWidth="3"
      />
      <polygon
        points="100,98 84,128 70,128 86,98"
        fill="url(#lapelGrad)"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Red Bow Tie */}
      <g>
        <polygon points="56,98 68,104 56,110" fill="#FF2A85" stroke="#000" strokeWidth="2.5" />
        <polygon points="84,98 72,104 84,110" fill="#FF2A85" stroke="#000" strokeWidth="2.5" />
        <circle cx="70" cy="104" r="5" fill="#FFD600" stroke="#000" strokeWidth="2.5" />
      </g>

      {/* The Brain Head - Left & Right Hemispheres with Lobes */}
      <g>
        {/* Brain main outline silhouette */}
        <path
          d="M70 20
             C56 12 30 18 28 38
             C18 42 16 62 26 74
             C20 84 32 94 48 94
             C58 94 66 90 70 86
             C74 90 82 94 92 94
             C108 94 120 84 114 74
             C124 62 122 42 112 38
             C110 18 84 12 70 20 Z"
          fill="url(#brainGlow)"
          stroke="#000"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Brain Gyri/Sulci (Comic Squiggles & Crevices) */}
        <path
          d="M70 22 C68 40 72 65 70 85"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Left Hemisphere Sulci */}
        <path
          d="M45 25 C35 32 38 46 48 48 C55 50 56 60 46 66 C38 70 42 82 52 82"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 44 C26 50 28 62 38 60"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Hemisphere Sulci */}
        <path
          d="M95 25 C105 32 102 46 92 48 C85 50 84 60 94 66 C102 70 98 82 88 82"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M108 44 C114 50 112 62 102 60"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Sunglasses (Wayfarer Style Showman Shades) */}
      <g>
        {/* Left Lens */}
        <path
          d="M36 50 L64 50 L60 68 C58 72 40 73 38 68 Z"
          fill="#111"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Right Lens */}
        <path
          d="M76 50 L104 50 L102 68 C100 73 82 72 80 68 Z"
          fill="#111"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Bridge */}
        <path d="M63 52 Q70 48 77 52" stroke="#000" strokeWidth="4" strokeLinecap="round" />
        {/* Sunglass Glare Streaks */}
        <polygon points="40,54 48,54 42,66 38,66" fill="#00E5FF" opacity="0.8" />
        <polygon points="80,54 88,54 82,66 78,66" fill="#00E5FF" opacity="0.8" />
        <circle cx="58" cy="55" r="2" fill="#FFF" />
        <circle cx="98" cy="55" r="2" fill="#FFF" />
      </g>

      {/* Big Comic Grin */}
      <g>
        <path
          d="M48 74 Q70 92 92 74 Z"
          fill="#59001D"
          stroke="#000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Teeth */}
        <path
          d="M52 74 Q70 82 88 74"
          fill="#FFF"
          stroke="#000"
          strokeWidth="2"
        />
        {/* Tongue */}
        <path
          d="M62 82 Q70 78 78 82 Q70 89 62 82"
          fill="#FF2A85"
        />
      </g>

      {/* Hand holding Vintage Showman Microphone */}
      <g>
        {/* Mic Body & Cord */}
        <path d="M108 92 L116 115" stroke="#444" strokeWidth="7" strokeLinecap="round" />
        <path d="M116 115 Q125 125 120 135" stroke="#111" strokeWidth="3" fill="none" />
        {/* Mic Capsule Grill */}
        <rect
          x="100"
          y="72"
          width="16"
          height="22"
          rx="8"
          fill="#CCCCCC"
          stroke="#000"
          strokeWidth="3"
        />
        <line x1="102" y1="78" x2="114" y2="78" stroke="#333" strokeWidth="1.5" />
        <line x1="102" y1="83" x2="114" y2="83" stroke="#333" strokeWidth="1.5" />
        <line x1="102" y1="88" x2="114" y2="88" stroke="#333" strokeWidth="1.5" />
        {/* Red On-Air Band on Mic */}
        <rect x="101" y="80" width="14" height="4" fill="#FF0033" />
        {/* Cartoon Hand Fingers gripping mic */}
        <ellipse cx="106" cy="94" rx="4" ry="5" fill="#FFF" stroke="#000" strokeWidth="2" />
        <ellipse cx="109" cy="99" rx="4" ry="5" fill="#FFF" stroke="#000" strokeWidth="2" />
        <ellipse cx="112" cy="104" rx="4" ry="5" fill="#FFF" stroke="#000" strokeWidth="2" />
      </g>

      {/* Sparkling Stars around Host */}
      <path
        d="M20 28 L23 20 L26 28 L34 31 L26 34 L23 42 L20 34 L12 31 Z"
        fill="#FFD600"
        stroke="#000"
        strokeWidth="1.5"
      />
      <circle cx="122" cy="24" r="3" fill="#00E5FF" stroke="#000" strokeWidth="1.5" />
      <circle cx="18" cy="80" r="2.5" fill="#FFD600" />
    </svg>
  );
}

// ============================================================================
// 2. GLI 8 AVATAR PARODIA ILLUSTRATI (SVG MEZZO BUSTO POP-ART)
// ============================================================================

// --- 1. L'Uomo Ragnatela (Parodia Eroe Marvel) ---
export function RagnatelaSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shoulders */}
      <path d="M12 95 C12 75 30 70 50 70 C70 70 88 75 88 95 Z" fill="#0077B6" stroke="#000" strokeWidth="3" />
      <path d="M35 70 C42 80 58 80 65 70 Z" fill="#E63946" stroke="#000" strokeWidth="2.5" />
      {/* Neck */}
      <rect x="42" y="62" width="16" height="12" fill="#E63946" stroke="#000" strokeWidth="2.5" />
      {/* Head Mask */}
      <ellipse cx="50" cy="44" rx="26" ry="30" fill="#E63946" stroke="#000" strokeWidth="3.5" />
      {/* Spider Web Pattern Lines */}
      {/* Radial lines from center nose */}
      <line x1="50" y1="46" x2="50" y2="14" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="46" x2="74" y2="28" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="46" x2="76" y2="48" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="46" x2="70" y2="68" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="46" x2="50" y2="74" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="46" x2="30" y2="68" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="46" x2="24" y2="48" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="46" x2="26" y2="28" stroke="#000" strokeWidth="2" />
      {/* Web arches */}
      <path d="M38 24 Q50 30 62 24" stroke="#000" strokeWidth="1.8" fill="none" />
      <path d="M32 34 Q50 42 68 34" stroke="#000" strokeWidth="1.8" fill="none" />
      <path d="M34 56 Q50 62 66 56" stroke="#000" strokeWidth="1.8" fill="none" />
      {/* Big White Teardrop Eyes with Bold Black Outline */}
      {/* Left Eye */}
      <path
        d="M30 42 C30 32 44 34 46 46 C46 54 34 56 30 42 Z"
        fill="#FFFFFF"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Right Eye */}
      <path
        d="M70 42 C70 32 56 34 54 46 C54 54 66 56 70 42 Z"
        fill="#FFFFFF"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Eye highlights */}
      <ellipse cx="37" cy="42" rx="3" ry="5" fill="#E0FBFC" />
      <ellipse cx="63" cy="42" rx="3" ry="5" fill="#E0FBFC" />
    </svg>
  );
}

// --- 2. Il Cavaliere Pipistrello (Parodia Eroe DC) ---
export function PipistrelloSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dark Cape / Shoulders */}
      <path d="M10 95 C10 72 32 68 50 68 C68 68 90 72 90 95 Z" fill="#181822" stroke="#000" strokeWidth="3" />
      {/* Bat Insignia Hint on Chest */}
      <polygon points="50,78 42,73 44,79 38,81 46,85 50,82 54,85 62,81 56,79 58,73" fill="#FFD600" stroke="#000" strokeWidth="1.5" />
      {/* Cowl with Pointed Bat Ears */}
      <path
        d="M28 42 L24 12 L38 28 C42 26 46 25 50 25 C54 25 58 26 62 28 L76 12 L72 42 C76 48 76 60 72 68 C68 76 58 78 50 78 C42 78 32 76 28 68 C24 60 24 48 28 42 Z"
        fill="#262635"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Serious Square Jaw / Flesh Mouth Area */}
      <polygon points="36,58 64,58 60,75 40,75" fill="#FFC9A2" stroke="#000" strokeWidth="2.5" />
      {/* Stern mouth slit & gritty chin dimple */}
      <line x1="42" y1="67" x2="58" y2="67" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="72" x2="52" y2="72" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Mask Nose ridge */}
      <polygon points="46,50 54,50 50,58" fill="#181822" stroke="#000" strokeWidth="2" />
      {/* Slanted Narrow White Glowing Eyes */}
      <polygon points="32,46 44,48 42,53 34,51" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
      <polygon points="68,46 56,48 58,53 66,51" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
      {/* High-tech eye glow */}
      <line x1="33" y1="48" x2="43" y2="50" stroke="#00E5FF" strokeWidth="1.5" />
      <line x1="67" y1="48" x2="57" y2="50" stroke="#00E5FF" strokeWidth="1.5" />
    </svg>
  );
}

// --- 3. Il Piccolo Imperatore (Parodia Storica Napoleone) ---
export function ImperatoreSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Navy Military Coat Shoulders with Gold Epaulettes */}
      <path d="M12 95 C12 76 30 72 50 72 C70 72 88 76 88 95 Z" fill="#0F172A" stroke="#000" strokeWidth="3" />
      {/* Gold Bullion Shoulder Epaulettes */}
      <rect x="12" y="74" width="14" height="8" rx="3" fill="#FFD600" stroke="#000" strokeWidth="2" />
      <rect x="74" y="74" width="14" height="8" rx="3" fill="#FFD600" stroke="#000" strokeWidth="2" />
      {/* White & Red Waistcoat */}
      <polygon points="44,72 56,72 58,95 42,95" fill="#F8FAFC" stroke="#000" strokeWidth="2" />
      <rect x="48" y="75" width="4" height="20" fill="#E63946" />
      {/* Hand Tucked Inside Coat (Classic Napoleon pose) */}
      <ellipse cx="48" cy="85" rx="5" ry="6" fill="#FDE047" stroke="#000" strokeWidth="2" />
      {/* Face & Proud Chin */}
      <ellipse cx="50" cy="54" rx="18" ry="19" fill="#FFD2B2" stroke="#000" strokeWidth="3" />
      {/* Sideburns */}
      <polygon points="32,48 35,58 37,50" fill="#4B382A" />
      <polygon points="68,48 65,58 63,50" fill="#4B382A" />
      {/* Resolute Eyes */}
      <circle cx="43" cy="53" r="2.5" fill="#000" />
      <circle cx="57" cy="53" r="2.5" fill="#000" />
      <path d="M39 49 Q44 47 47 49" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <path d="M61 49 Q56 47 53 49" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Nose & Smug Smirk */}
      <path d="M50 53 L49 59 L52 59" stroke="#000" strokeWidth="2" fill="none" />
      <path d="M45 64 Q50 67 55 63" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Huge Historic Bicorne Hat (Nero con bordo dorato) */}
      <path
        d="M6 38 Q50 8 94 38 Q50 32 6 38 Z"
        fill="#111827"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Gold Trim along hat rim */}
      <path d="M12 36 Q50 14 88 36" stroke="#FFD600" strokeWidth="2.5" fill="none" />
      {/* Tricolor Rosette / Cockade */}
      <circle cx="50" cy="28" r="6" fill="#1D4ED8" stroke="#000" strokeWidth="1.5" />
      <circle cx="50" cy="28" r="4" fill="#FFFFFF" />
      <circle cx="50" cy="28" r="2" fill="#EF4444" />
    </svg>
  );
}

// --- 4. Idraulico Baffuto (Parodia Gaming) ---
export function IdraulicoSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Red Shirt Shoulders */}
      <path d="M10 95 C10 74 28 70 50 70 C72 70 90 74 90 95 Z" fill="#DC2626" stroke="#000" strokeWidth="3" />
      {/* Denim Overalls Front & Straps */}
      <polygon points="34,70 66,70 68,95 32,95" fill="#2563EB" stroke="#000" strokeWidth="2.5" />
      <rect x="22" y="72" width="12" height="23" rx="3" fill="#2563EB" stroke="#000" strokeWidth="2.5" />
      <rect x="66" y="72" width="12" height="23" rx="3" fill="#2563EB" stroke="#000" strokeWidth="2.5" />
      {/* Yellow Overalls Buttons */}
      <circle cx="28" cy="78" r="3.5" fill="#FFD600" stroke="#000" strokeWidth="2" />
      <circle cx="72" cy="78" r="3.5" fill="#FFD600" stroke="#000" strokeWidth="2" />

      {/* Red Cap Dome Back */}
      <path
        d="M20 42 C16 16 84 16 80 42 Z"
        fill="#DC2626"
        stroke="#000"
        strokeWidth="3.5"
      />
      {/* White Crest Circle with the 'N' Letter */}
      <circle cx="50" cy="27" r="9" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
      <text
        x="50"
        y="32"
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fontFamily="'Bangers', Impact, sans-serif"
        fill="#DC2626"
      >
        N
      </text>

      {/* Head - Warm Skin-toned Face Oval (#FFCC99) */}
      <ellipse cx="50" cy="54" rx="22" ry="19" fill="#FFCC99" stroke="#000" strokeWidth="3.5" />
      {/* Cartoon Ears */}
      <circle cx="27" cy="54" r="5.5" fill="#FFCC99" stroke="#000" strokeWidth="2.5" />
      <circle cx="73" cy="54" r="5.5" fill="#FFCC99" stroke="#000" strokeWidth="2.5" />
      <path d="M26 52 C27 54 27 56 26 57" stroke="#D48A55" strokeWidth="1.5" fill="none" />
      <path d="M74 52 C73 54 73 56 74 57" stroke="#D48A55" strokeWidth="1.5" fill="none" />

      {/* Dark Curly Hair Sideburns */}
      <path d="M27 46 C32 46 32 54 28 58 Z" fill="#2B1B17" stroke="#000" strokeWidth="1.5" />
      <path d="M73 46 C68 46 68 54 72 58 Z" fill="#2B1B17" stroke="#000" strokeWidth="1.5" />

      {/* Red Cap Visor Brim across forehead */}
      <path
        d="M14 42 C24 38 76 38 86 42 C82 48 18 48 14 42 Z"
        fill="#B91C1C"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Cheerful Animated Eyes */}
      <ellipse cx="40" cy="48" rx="4" ry="6" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
      <ellipse cx="41" cy="48" rx="2.5" ry="4" fill="#0284C7" />
      <circle cx="42" cy="46" r="1.5" fill="#000" />
      <circle cx="42.5" cy="45" r="0.8" fill="#FFF" />
      <ellipse cx="60" cy="48" rx="4" ry="6" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
      <ellipse cx="59" cy="48" rx="2.5" ry="4" fill="#0284C7" />
      <circle cx="58" cy="46" r="1.5" fill="#000" />
      <circle cx="57.5" cy="45" r="0.8" fill="#FFF" />

      {/* Cheerful Eyebrows */}
      <path d="M35 40 Q40 37 45 40" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M65 40 Q60 37 55 40" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Round Cheerful Big Cartoon Nose */}
      <ellipse cx="50" cy="54" rx="10" ry="8" fill="#FFA588" stroke="#000" strokeWidth="3" />
      <ellipse cx="48" cy="52" rx="3" ry="2" fill="#FFC9BA" />

      {/* Big Bushy Curly Black Mustache in the Foreground */}
      <path
        d="M20 62
           C28 54 42 63 50 60
           C58 63 72 54 80 62
           C72 73 58 67 50 69
           C42 67 28 73 20 62 Z"
        fill="#181818"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// --- 5. Guerriero Saiyan (Parodia Anime) ---
export function SaiyanSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Orange Gi Shoulders with Navy V-neck */}
      <path d="M12 95 C12 76 30 72 50 72 C70 72 88 76 88 95 Z" fill="#EA580C" stroke="#000" strokeWidth="3" />
      <polygon points="40,72 60,72 50,92" fill="#1E3A8A" stroke="#000" strokeWidth="2.5" />
      <polygon points="45,72 55,72 50,82" fill="#FED7AA" />
      {/* Face */}
      <polygon points="34,44 66,44 58,68 42,68" fill="#FED7AA" stroke="#000" strokeWidth="3" />
      {/* Fierce Angled Golden Eyebrows */}
      <polygon points="32,46 47,50 46,47 34,44" fill="#EAB308" stroke="#000" strokeWidth="1.5" />
      <polygon points="68,46 53,50 54,47 66,44" fill="#EAB308" stroke="#000" strokeWidth="1.5" />
      {/* Intense Anime Eyes with Teal Iris */}
      <polygon points="35,49 46,52 44,56 36,54" fill="#FFF" stroke="#000" strokeWidth="1.8" />
      <rect x="40" y="51" width="3" height="4" fill="#06B6D4" />
      <polygon points="65,49 54,52 56,56 64,54" fill="#FFF" stroke="#000" strokeWidth="1.8" />
      <rect x="57" y="51" width="3" height="4" fill="#06B6D4" />
      {/* Nose and Determined Gritted Teeth */}
      <polygon points="50,55 48,60 52,60" fill="#000" />
      <rect x="44" y="63" width="12" height="3" fill="#FFF" stroke="#000" strokeWidth="1.5" />
      {/* Giant Golden Super Hair with Spikes & Aura */}
      <path
        d="M20 44
           L8 30
           L24 24
           L18 8
           L40 14
           L50 2
           L62 14
           L82 8
           L76 24
           L92 30
           L80 44
           L72 38
           L66 44
           L50 34
           L34 44
           L28 38 Z"
        fill="#FACC15"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Inner hair highlight spikes */}
      <polygon points="50,6 44,18 52,18" fill="#FEF08A" />
      <polygon points="34,16 26,24 36,24" fill="#FEF08A" />
      <polygon points="66,16 74,24 64,24" fill="#FEF08A" />
      {/* Spark crackles */}
      <path d="M12 50 L16 46 L14 42" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      <path d="M88 50 L84 46 L86 42" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// --- 6. Genio Ribelle (Parodia Scienziato) ---
export function GenioSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lab Coat and Sweater */}
      <path d="M12 95 C12 76 28 74 50 74 C72 74 88 76 88 95 Z" fill="#F8FAFC" stroke="#000" strokeWidth="3" />
      <polygon points="40,74 60,74 55,95 45,95" fill="#7C3AED" stroke="#000" strokeWidth="2" />
      {/* Pen in pocket */}
      <rect x="24" y="82" width="2" height="6" fill="#00E5FF" />
      <rect x="28" y="80" width="2" height="8" fill="#FF2A85" />
      {/* Head */}
      <ellipse cx="50" cy="55" rx="18" ry="17" fill="#FFDFBA" stroke="#000" strokeWidth="3" />
      {/* Round Glasses */}
      <circle cx="41" cy="50" r="7" fill="rgba(0,229,255,0.2)" stroke="#000" strokeWidth="2.5" />
      <circle cx="59" cy="50" r="7" fill="rgba(0,229,255,0.2)" stroke="#000" strokeWidth="2.5" />
      <line x1="48" y1="50" x2="52" y2="50" stroke="#000" strokeWidth="3" />
      {/* Winking/Sparkling Eyes */}
      <circle cx="41" cy="50" r="3" fill="#000" />
      <circle cx="42" cy="49" r="1" fill="#FFF" />
      <path d="M56 50 Q59 47 62 50" stroke="#000" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Wild Bushy White Mustache */}
      <path
        d="M28 59 C38 56 46 63 50 61 C54 63 62 56 72 59 C64 68 54 63 50 65 C46 63 36 68 28 59 Z"
        fill="#FFFFFF"
        stroke="#000"
        strokeWidth="2.5"
      />
      {/* Tongue Sticking Out Cheekily */}
      <path d="M46 65 Q50 76 54 65 Z" fill="#FF2A85" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="66" x2="50" y2="72" stroke="#B8004F" strokeWidth="1.5" />
      {/* Wild Electrified Hair Flying Upward */}
      <path
        d="M32 46
           C22 42 12 36 10 24
           C18 26 24 20 20 10
           C28 16 34 8 40 4
           C46 14 52 4 60 4
           C64 12 70 8 78 12
           C74 20 84 22 90 24
           C86 36 78 42 68 46"
        fill="#F8FAFC"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Electric Spark / Idea Bolt */}
      <polygon points="50,1 46,7 51,7 48,13 54,6 49,6" fill="#FFD600" stroke="#000" strokeWidth="1" />
    </svg>
  );
}

// --- 7. Regina del Nilo (Parodia Storica Cleopatra) ---
export function CleopatraSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Golden Royal Collar (Usekh) & White Gown */}
      <path d="M14 95 C14 76 30 72 50 72 C70 72 86 76 86 95 Z" fill="#F8FAFC" stroke="#000" strokeWidth="3" />
      {/* Usekh Beaded Collar Bands */}
      <path d="M26 75 C32 88 68 88 74 75" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
      <path d="M32 80 C38 90 62 90 68 80" stroke="#06B6D4" strokeWidth="3" fill="none" />
      {/* Sleek Geometric Jet-Black Egyptian Bob Haircut */}
      <path
        d="M22 36
           C22 18 78 18 78 36
           L84 68
           L72 68
           L70 46
           L30 46
           L28 68
           L16 68 Z"
        fill="#111827"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Face & Slender Neck */}
      <polygon points="44,66 56,66 54,76 46,76" fill="#F59E0B" opacity="0.6" />
      <ellipse cx="50" cy="52" rx="18" ry="17" fill="#FCD34D" stroke="#000" strokeWidth="3" />
      {/* Blunt Bangs with Gold Hair Beads */}
      <rect x="30" y="36" width="40" height="8" fill="#111827" stroke="#000" strokeWidth="2" />
      <circle cx="22" cy="65" r="2.5" fill="#F59E0B" stroke="#000" strokeWidth="1" />
      <circle cx="78" cy="65" r="2.5" fill="#F59E0B" stroke="#000" strokeWidth="1" />
      {/* Golden Diadem / Tiara with Cobra (Uraeus) */}
      <rect x="28" y="32" width="44" height="5" fill="#FFD600" stroke="#000" strokeWidth="2" />
      {/* Cobra Head at center */}
      <path d="M48 34 C48 26 52 26 52 34 Z" fill="#10B981" stroke="#000" strokeWidth="1.5" />
      <circle cx="50" cy="27" r="1.5" fill="#EF4444" />
      {/* Eye of Horus Winged Dramatic Makeup */}
      {/* Left Eye */}
      <polygon points="34,48 45,50 43,53 36,52" fill="#FFF" stroke="#000" strokeWidth="1.5" />
      <circle cx="40" cy="51" r="2.5" fill="#0284C7" />
      <path d="M32 48 L46 50 M32 54 L38 52" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Right Eye */}
      <polygon points="66,48 55,50 57,53 64,52" fill="#FFF" stroke="#000" strokeWidth="1.5" />
      <circle cx="60" cy="51" r="2.5" fill="#0284C7" />
      <path d="M68 48 L54 50 M68 54 L62 52" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Seductive Red Lips */}
      <path d="M45 61 Q50 59 55 61 Q50 67 45 61 Z" fill="#DC2626" stroke="#000" strokeWidth="1.5" />
    </svg>
  );
}

// --- 8. Ninja della Foglia (Parodia Anime) ---
export function NinjaSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Orange Tracksuit Shoulders with High Navy Collar */}
      <path d="M12 95 C12 76 28 72 50 72 C72 72 88 76 88 95 Z" fill="#EA580C" stroke="#000" strokeWidth="3" />
      {/* High popped collar */}
      <path d="M30 76 L26 66 L42 70 L50 75 L58 70 L74 66 L70 76 Z" fill="#1E3A8A" stroke="#000" strokeWidth="2.5" />
      <rect x="48" y="74" width="4" height="20" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
      {/* Face */}
      <ellipse cx="50" cy="54" rx="18" ry="17" fill="#FED7AA" stroke="#000" strokeWidth="3" />
      {/* 3 Whisker Marks on each Cheek */}
      <line x1="33" y1="54" x2="40" y2="54" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1="33" y1="58" x2="40" y2="58" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="62" x2="40" y2="61" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1="67" y1="54" x2="60" y2="54" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1="67" y1="58" x2="60" y2="58" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="62" x2="60" y2="61" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      {/* Big Confident Grin */}
      <path d="M42 63 Q50 71 58 63 Z" fill="#FFF" stroke="#000" strokeWidth="2" />
      <line x1="44" y1="65" x2="56" y2="65" stroke="#E5E7EB" strokeWidth="1" />
      {/* Spirited Bright Blue Anime Eyes */}
      <ellipse cx="41" cy="50" rx="3.5" ry="4.5" fill="#0284C7" stroke="#000" strokeWidth="1.5" />
      <circle cx="42" cy="49" r="1.5" fill="#FFF" />
      <ellipse cx="59" cy="50" rx="3.5" ry="4.5" fill="#0284C7" stroke="#000" strokeWidth="1.5" />
      <circle cx="60" cy="49" r="1.5" fill="#FFF" />
      {/* Forehead Protector Band (Blue Cloth with Silver Metal Plate) */}
      <rect x="28" y="32" width="44" height="12" rx="2" fill="#1E3A8A" stroke="#000" strokeWidth="2.5" />
      <rect x="36" y="34" width="28" height="8" rx="2" fill="#E2E8F0" stroke="#000" strokeWidth="2" />
      {/* Leaf / Spiral Symbol engraved */}
      <circle cx="50" cy="38" r="2" fill="none" stroke="#000" strokeWidth="1.5" />
      <path d="M50 36 C52 36 53 37 53 38 C53 40 48 40 49 41" fill="none" stroke="#000" strokeWidth="1.5" />
      {/* Metal Plate Rivets */}
      <circle cx="38" cy="38" r="0.8" fill="#000" />
      <circle cx="62" cy="38" r="0.8" fill="#000" />
      {/* Spiky Blond Anime Hair Bursting Out */}
      <path
        d="M26 36
           L14 26
           L24 22
           L18 8
           L36 16
           L50 4
           L64 16
           L82 8
           L76 22
           L86 26
           L74 36 Z"
        fill="#FACC15"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// --- 9. La Mela Sburritos (Meme Cult) ---
export function MelaSburritosSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Legs with Brown Dress Shoes */}
      <rect x="40" y="82" width="6" height="10" fill="#1A1A1A" stroke="#000" strokeWidth="2" />
      <rect x="54" y="82" width="6" height="10" fill="#1A1A1A" stroke="#000" strokeWidth="2" />
      {/* Brown Shoes */}
      <ellipse cx="38" cy="93" rx="8" ry="4" fill="#6F4E37" stroke="#000" strokeWidth="2" />
      <ellipse cx="62" cy="93" rx="8" ry="4" fill="#6F4E37" stroke="#000" strokeWidth="2" />

      {/* Apple Body Shape */}
      <path
        d="M50 24
           C32 16 14 30 16 56
           C18 78 36 86 50 84
           C64 86 82 78 84 56
           C86 30 68 16 50 24 Z"
        fill="#D90429"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Apple Gloss Highlight */}
      <path
        d="M26 32 C20 42 20 60 26 70"
        stroke="#FF6B6B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Stem (Picciolo) at Top */}
      <path
        d="M50 24 C51 16 55 10 60 6"
        stroke="#5A3E26"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Green Leaf */}
      <path
        d="M53 18 C64 14 68 8 68 8 C68 8 66 18 56 22 Z"
        fill="#00FF66"
        stroke="#000"
        strokeWidth="2"
      />

      {/* Super Serious Human-like Squinting Eyes */}
      {/* Left Eyebrow & Eye */}
      <path d="M30 42 Q39 40 44 43" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 47 Q38 43 43 46 Q38 50 32 47 Z" fill="#FFF" stroke="#000" strokeWidth="2" />
      <circle cx="38" cy="46" r="2.2" fill="#000" />
      <circle cx="39" cy="45.5" r="0.8" fill="#FFF" />
      <line x1="31" y1="52" x2="43" y2="52" stroke="#88001B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Right Eyebrow & Eye (Judging Arch) */}
      <path d="M70 41 Q61 39 56 43" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M68 47 Q62 43 57 46 Q62 50 68 47 Z" fill="#FFF" stroke="#000" strokeWidth="2" />
      <circle cx="62" cy="46" r="2.2" fill="#000" />
      <circle cx="63" cy="45.5" r="0.8" fill="#FFF" />
      <line x1="69" y1="52" x2="57" y2="52" stroke="#88001B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Straight Impassive Boss Mouth */}
      <line x1="38" y1="60" x2="62" y2="60" stroke="#000" strokeWidth="3" strokeLinecap="round" />

      {/* Boss Pose: Thin arms with large crossed white cartoon gloves */}
      <path d="M18 58 Q24 70 38 72" stroke="#000" strokeWidth="4" fill="none" />
      <path d="M82 58 Q76 70 62 72" stroke="#000" strokeWidth="4" fill="none" />
      {/* Interlaced White Gloves */}
      <ellipse cx="44" cy="72" rx="9" ry="7" fill="#FFFFFF" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="56" cy="72" rx="9" ry="7" fill="#FFFFFF" stroke="#000" strokeWidth="2.5" />
      <path d="M42 69 C46 69 48 74 48 76" stroke="#000" strokeWidth="2" fill="none" />
      <path d="M58 69 C54 69 52 74 52 76" stroke="#000" strokeWidth="2" fill="none" />
    </svg>
  );
}

// --- 10. La Vedova Letale (Parodia Vedova Nera Marvel) ---
export function VedovaLetaleSvg({ className = "w-full h-full", size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fiery Red Hair Back / Shoulder Waves */}
      <path
        d="M20 35
           C12 45 10 65 14 80
           C18 75 22 70 24 60
           L76 60
           C78 70 82 75 86 80
           C90 65 88 45 80 35
           C72 16 28 16 20 35 Z"
        fill="#D90429"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Hair Strands Shading */}
      <path d="M18 50 Q14 62 20 72" stroke="#7A0012" strokeWidth="2.5" fill="none" />
      <path d="M82 50 Q86 62 80 72" stroke="#7A0012" strokeWidth="2.5" fill="none" />

      {/* Tactical Super-Spy Bodysuit Shoulders */}
      <path d="M16 95 C16 75 32 72 50 72 C68 72 84 75 84 95 Z" fill="#181822" stroke="#000" strokeWidth="3" />
      {/* Collar & Cleavage V */}
      <polygon points="42,72 58,72 50,86" fill="#FFDFD3" stroke="#000" strokeWidth="2" />
      {/* Tactical Suit Zipper Line */}
      <line x1="50" y1="84" x2="50" y2="95" stroke="#E2E8F0" strokeWidth="2" />
      {/* Tactical Belt with Red Hourglass Emblem */}
      <rect x="36" y="90" width="28" height="6" fill="#2B2D42" stroke="#000" strokeWidth="2" />
      <polygon points="46,91 54,91 50,94" fill="#FF2A85" />
      <polygon points="50,93 54,96 46,96" fill="#FF2A85" />

      {/* Slender Head & Face */}
      <polygon points="44,66 56,66 54,75 46,75" fill="#FFDFD3" stroke="#000" strokeWidth="2" />
      <path
        d="M32 44 C32 30 68 30 68 44 C68 58 56 68 50 68 C44 68 32 58 32 44 Z"
        fill="#FFDFD3"
        stroke="#000"
        strokeWidth="3"
      />

      {/* Wavy Red Bangs Framing the Face */}
      <path
        d="M32 36
           C38 32 46 36 50 32
           C56 36 64 30 68 36
           C72 46 66 52 64 56
           C60 52 62 42 58 40
           C52 44 44 42 42 40
           C38 42 40 52 36 56
           C34 52 28 46 32 36 Z"
        fill="#EF233C"
        stroke="#000"
        strokeWidth="2.5"
      />

      {/* Piercing Cat Eyes with Green Iris & Eyeliner Wing */}
      <polygon points="36,48 46,49 44,53 37,52" fill="#FFF" stroke="#000" strokeWidth="1.5" />
      <circle cx="41" cy="50.5" r="2.2" fill="#10B981" />
      <circle cx="41" cy="50.5" r="1.1" fill="#000" />
      <path d="M34 47 L46 49" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M35 44 Q41 43 45 45" stroke="#7A0012" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      <polygon points="64,48 54,49 56,53 63,52" fill="#FFF" stroke="#000" strokeWidth="1.5" />
      <circle cx="59" cy="50.5" r="2.2" fill="#10B981" />
      <circle cx="59" cy="50.5" r="1.1" fill="#000" />
      <path d="M66 47 L54 49" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right Brow: Skeptical Raised Arch */}
      <path d="M55 42 Q60 38 65 41" stroke="#7A0012" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Small Cute Nose */}
      <path d="M50 51 L49 56 L52 56" stroke="#D48A55" strokeWidth="1.5" fill="none" />

      {/* Confident Seductive Dark Red Smirk */}
      <path d="M45 61 Q50 63 56 60" stroke="#7A0012" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M46 61 Q50 65 55 61 Q50 62 46 61 Z" fill="#D90429" />

      {/* Metallic Gold Wrist Gauntlets */}
      <rect x="18" y="86" width="10" height="7" rx="2" fill="#FFD600" stroke="#000" strokeWidth="1.8" />
      <line x1="23" y1="86" x2="23" y2="93" stroke="#000" strokeWidth="1.5" />
      <rect x="72" y="86" width="10" height="7" rx="2" fill="#FFD600" stroke="#000" strokeWidth="1.8" />
      <line x1="77" y1="86" x2="77" y2="93" stroke="#000" strokeWidth="1.5" />
    </svg>
  );
}

// ============================================================================
// 3. REGISTRY E LISTA DEI 10 AVATAR PARODIA
// ============================================================================

export const AVATARS_LIST = [
  {
    id: 'ragnatela',
    name: "L'Uomo Ragnatela",
    category: "Parodia Eroe Marvel",
    quote: "Occhio a non appiccicare le ragnatele sui bottoni!",
    themeColor: "#FF2A85",
    bgGradient: "from-red-600 via-rose-500 to-amber-500",
    glowColor: "rgba(255, 42, 133, 0.4)",
    badgeColor: "bg-red-500",
    Svg: RagnatelaSvg,
  },
  {
    id: 'pipistrello',
    name: "Il Cavaliere Pipistrello",
    category: "Parodia Eroe DC",
    quote: "Io sono la notte... ma stasera spero tu sappia le risposte!",
    themeColor: "#8A2BE2",
    bgGradient: "from-slate-900 via-indigo-950 to-purple-900",
    glowColor: "rgba(138, 43, 226, 0.4)",
    badgeColor: "bg-indigo-700",
    Svg: PipistrelloSvg,
  },
  {
    id: 'imperatore',
    name: "Il Piccolo Imperatore",
    category: "Parodia Storica",
    quote: "Pronto a conquistare la vetta o finisci in esilio?",
    themeColor: "#FFD600",
    bgGradient: "from-blue-900 via-indigo-800 to-amber-600",
    glowColor: "rgba(255, 214, 0, 0.4)",
    badgeColor: "bg-blue-600",
    Svg: ImperatoreSvg,
  },
  {
    id: 'idraulico',
    name: "Idraulico Baffuto",
    category: "Parodia Gaming",
    quote: "Mamma mia! Qui non bastano i funghetti per vincere!",
    themeColor: "#00E5FF",
    bgGradient: "from-red-600 via-red-500 to-blue-600",
    glowColor: "rgba(0, 229, 255, 0.4)",
    badgeColor: "bg-red-600",
    Svg: IdraulicoSvg,
  },
  {
    id: 'saiyan',
    name: "Guerriero Saiyan",
    category: "Parodia Anime",
    quote: "Il tuo livello di neuroni è sopra i 9000?!",
    themeColor: "#FF8800",
    bgGradient: "from-amber-500 via-orange-500 to-yellow-400",
    glowColor: "rgba(255, 136, 0, 0.5)",
    badgeColor: "bg-orange-500",
    Svg: SaiyanSvg,
  },
  {
    id: 'genio',
    name: "Genio Ribelle",
    category: "Parodia Scienziato",
    quote: "Tutto è relativo, tranne le torte in faccia che prenderai!",
    themeColor: "#00FF87",
    bgGradient: "from-purple-700 via-fuchsia-600 to-emerald-500",
    glowColor: "rgba(0, 255, 135, 0.4)",
    badgeColor: "bg-purple-600",
    Svg: GenioSvg,
  },
  {
    id: 'cleopatra',
    name: "Regina del Nilo",
    category: "Parodia Storica",
    quote: "Inchinarsi alla Regina... o bombardarla di Colpi Bassi?",
    themeColor: "#FFD600",
    bgGradient: "from-amber-600 via-yellow-500 to-teal-600",
    glowColor: "rgba(255, 214, 0, 0.4)",
    badgeColor: "bg-amber-500",
    Svg: CleopatraSvg,
  },
  {
    id: 'ninja',
    name: "Ninja della Foglia",
    category: "Parodia Anime",
    quote: "Credici! Diventerai il campione del quiz!",
    themeColor: "#FF8800",
    bgGradient: "from-orange-600 via-amber-500 to-sky-500",
    glowColor: "rgba(255, 136, 0, 0.4)",
    badgeColor: "bg-orange-600",
    Svg: NinjaSvg,
  },
  {
    id: 'mela',
    name: "La Mela Sburritos",
    category: "Meme Cult",
    quote: "Con quello sguardo serio e le mani incrociate... questa mela non perdona nessuno!",
    themeColor: "#D90429",
    bgGradient: "from-red-600 via-rose-600 to-amber-700",
    glowColor: "rgba(217, 4, 41, 0.45)",
    badgeColor: "bg-red-700",
    Svg: MelaSburritosSvg,
  },
  {
    id: 'vedova',
    name: "La Vedova Letale",
    category: "Parodia Eroe Marvel",
    quote: "Attenzione! La spia più letale del fumetto è pronta a sabotarvi tutti!",
    themeColor: "#FF2A85",
    bgGradient: "from-slate-950 via-red-950 to-rose-900",
    glowColor: "rgba(255, 42, 133, 0.45)",
    badgeColor: "bg-rose-700",
    Svg: VedovaLetaleSvg,
  },
];

// Map for quick O(1) lookup
export const AVATARS_BY_ID = Object.fromEntries(
  AVATARS_LIST.map(av => [av.id, av])
);

export function getAvatarById(id) {
  if (!id) return AVATARS_LIST[0];
  if (typeof id === 'object' && id.id) {
    return AVATARS_BY_ID[id.id] || id;
  }
  return AVATARS_BY_ID[id] || AVATARS_LIST[0];
}

// Universal Component to render any Avatar (SVG Parodia with fallback for legacy emojis)
export function AvatarDisplay({ avatar, className = "w-8 h-8", size, style = {} }) {
  if (!avatar) return null;

  // If passed an avatar ID string that exists in our list
  if (typeof avatar === 'string' && AVATARS_BY_ID[avatar]) {
    const Component = AVATARS_BY_ID[avatar].Svg;
    return <Component className={className} size={size} style={style} />;
  }

  // If passed an avatar object directly
  if (typeof avatar === 'object') {
    if (avatar.Svg) {
      const Component = avatar.Svg;
      return <Component className={className} size={size} style={style} />;
    }
    if (avatar.id && AVATARS_BY_ID[avatar.id]) {
      const Component = AVATARS_BY_ID[avatar.id].Svg;
      return <Component className={className} size={size} style={style} />;
    }
  }

  // Fallback if legacy emoji string was passed (e.g. '🤖')
  const inlineStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(size ? { width: size, height: size, fontSize: size * 0.75 } : {}),
    ...style,
  };

  return (
    <span className={className} style={inlineStyle}>
      {typeof avatar === 'string' ? avatar : '👤'}
    </span>
  );
}

export default AVATARS_LIST;
