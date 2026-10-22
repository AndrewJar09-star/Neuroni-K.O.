import cultItalia from './cult_italia.json';
import cinemaSerie from './cinema_serie.json';
import gamingNerd from './gaming_nerd.json';
import assurdoVero from './assurdo_vero.json';
import ciboScienza from './cibo_scienza.json';

// Normalize question item ensuring full compatibility
function normalizeQuestion(q) {
  const answers = q.answers || q.options || [];
  const correct = q.correct !== undefined ? q.correct : q.correctAnswer;
  return {
    ...q,
    answers,
    options: answers,
    correct,
    correctAnswer: correct,
    emoji: q.emoji || q.icon || '❓',
    icon: q.icon || q.emoji || '❓',
  };
}

export const CULT_ITALIA_QUESTIONS = cultItalia.map(normalizeQuestion);
export const CINEMA_SERIE_QUESTIONS = cinemaSerie.map(normalizeQuestion);
export const GAMING_NERD_QUESTIONS = gamingNerd.map(normalizeQuestion);
export const ASSURDO_VERO_QUESTIONS = assurdoVero.map(normalizeQuestion);
export const CIBO_SCIENZA_QUESTIONS = ciboScienza.map(normalizeQuestion);

// All 250 questions combined
export const ALL_QUESTIONS = [
  ...CULT_ITALIA_QUESTIONS,
  ...CINEMA_SERIE_QUESTIONS,
  ...GAMING_NERD_QUESTIONS,
  ...ASSURDO_VERO_QUESTIONS,
  ...CIBO_SCIENZA_QUESTIONS,
];

// Helper: pick N questions for a category ensuring no duplicates from usedIds
export function pickUniqueQuestionsByCategory(category, count, usedIds = new Set()) {
  const pool = ALL_QUESTIONS.filter(q => q.category === category && !usedIds.has(q.id));
  const fallbackPool = ALL_QUESTIONS.filter(q => q.category === category);
  const sourcePool = pool.length >= count ? pool : fallbackPool;
  const shuffled = [...sourcePool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Helper: pick random question from any category ensuring no duplicates
export function pickUniqueQuestion(usedIds = new Set()) {
  const available = ALL_QUESTIONS.filter(q => !usedIds.has(q.id));
  const sourcePool = available.length > 0 ? available : ALL_QUESTIONS;
  return sourcePool[Math.floor(Math.random() * sourcePool.length)];
}

export default ALL_QUESTIONS;
