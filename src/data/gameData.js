// Bot players data
export const BOT_PLAYERS = [
  { id: 'bot1', name: 'Brainiac99', avatar: 'pipistrello', isBot: true },
  { id: 'bot2', name: 'Quizzo',    avatar: 'imperatore',  isBot: true },
  { id: 'bot3', name: 'Cervellone', avatar: 'idraulico',   isBot: true },
];

// Game categories
export const CATEGORIES = [
  'Trash, TV & Nostalgia',
  'Cinema & Serie TV',
  'Gaming & Nerd',
  'Assurdo ma Vero!',
  'Cervelloni & Forchette',
];

// Category metadata
export const CATEGORY_META = {
  'Trash, TV & Nostalgia': { emoji: '📺', color: '#FFD600', bg: 'bg-yellow-400' },
  'Cinema & Serie TV':      { emoji: '🎬', color: '#FF2A85', bg: 'bg-pink-500' },
  'Gaming & Nerd':          { emoji: '🎮', color: '#00E5FF', bg: 'bg-cyan-400' },
  'Assurdo ma Vero!':       { emoji: '🤯', color: '#8A2BE2', bg: 'bg-purple-600' },
  'Cervelloni & Forchette': { emoji: '🍕', color: '#00FF87', bg: 'bg-emerald-400' },
};


// Avatars to choose from
export const AVATARS = ['🦄', '🐸', '🤡', '🦊', '🐳', '🦁', '👾', '🎃', '🍕', '🚀'];

// Punteggio fisso basato sulla velocita (5, 4, 3, 2)
export const SPEED_POINTS = [5, 4, 3, 2];

// Score calculation based on speed (legacy fallback)
export const calcScore = (timeLeft, maxTime = 15) => {
  const ratio = timeLeft / maxTime;
  return Math.round(200 + 800 * ratio); // 200 to 1000
};

// 4 Colpi Bassi (Sabotages)
export const SABOTAGES = [
  {
    id: 'cake',
    name: 'Torta in Faccia',
    subtitle: 'Vernice & Panna',
    emoji: '🥧',
    iconColor: '#FF2A85',
    bgColor: '#FFE5F0',
    borderColor: '#FF2A85',
    badgeText: 'SPLAT!',
    description: 'Copre i bottoni con panna e vernice densa. La vittima deve pulirle a mano col dito o col mouse!',
    impactTitle: 'SPLAT!',
    impactSubtitle: 'UNA TORTA IN FACCIA TI HA INZUPPATO!',
    impactColor: '#FF2A85',
  },
  {
    id: 'cage',
    name: 'Gabbia Cartoon',
    subtitle: 'Assi di Legno & Catene',
    emoji: '🪵',
    iconColor: '#FF8800',
    bgColor: '#FFF5E6',
    borderColor: '#FF8800',
    badgeText: 'CRACK!',
    description: 'Inchioda i bottoni con assi di legno. Servono 3 colpi decisi per spaccare ogni ostacolo!',
    impactTitle: 'CRACK!',
    impactSubtitle: 'LE TUE RISPOSTE SONO INCHIODATE!',
    impactColor: '#FF8800',
  },
  {
    id: 'earthquake',
    name: 'Bottoni Impazziti',
    subtitle: 'Terremoto Incontenibile',
    emoji: '🌀',
    iconColor: '#00E5FF',
    bgColor: '#E6FCFF',
    borderColor: '#00E5FF',
    badgeText: 'KABOOM!',
    description: 'I bottoni non stanno fermi e si scambiano di posto continuamente ogni 1.2 secondi!',
    impactTitle: 'KABOOM!',
    impactSubtitle: 'TERREMOTO! I BOTTONI SCAPPANO VIA!',
    impactColor: '#00E5FF',
  },
  {
    id: 'upside_down',
    name: 'Sottosopra & Pop-up',
    subtitle: 'Testo Girato + Spam Demenziale',
    emoji: '🙃',
    iconColor: '#8A2BE2',
    bgColor: '#F3E8FF',
    borderColor: '#8A2BE2',
    badgeText: 'TILT!',
    description: 'Capovolge il testo di 180° e scatena pop-up demenziali da chiudere prima di rispondere!',
    impactTitle: 'TILT!',
    impactSubtitle: 'CERVELLO IN TILT! ATTACCO POP-UP!',
    impactColor: '#8A2BE2',
  },
];

