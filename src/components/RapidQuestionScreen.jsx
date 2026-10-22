import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Hammer } from 'lucide-react';
import { SABOTAGES } from '../data/gameData';
import {
  playSound,
  playPop,
  playTick,
  playCrash,
  playCorrect,
  playWrong,
  vibrateShort,
  vibrateHeavy,
  triggerScreenShake,
} from '../utils/soundEffects';
import PieSplatterCanvas from './PieSplatterCanvas';
import { AvatarDisplay } from '../data/avatars';


const RAPID_ANSWER_TIME = 12; // 12 seconds as requested
const ANSWER_COLORS = ['answer-a', 'answer-b', 'answer-c', 'answer-d'];
const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

const INITIAL_POPUPS = [
  {
    id: 'p1',
    emoji: '🐔',
    title: 'HAI VINTO UN POLLO DI GOMMA!',
    desc: 'Starnazza se lo premi! Chiudi subito con la X rossa per rifiutare l\'offerta!',
    bg: '#FFD600',
    textColor: '#000',
  },
  {
    id: 'p2',
    emoji: '🔥',
    title: 'NEURONE SURRISCALDATO!',
    desc: 'Temperatura cervello: 120°C! Raffreddamento a ghiaccio cartoon in corso... Clicca X!',
    bg: '#FF2A85',
    textColor: '#fff',
  },
  {
    id: 'p3',
    emoji: '📢',
    title: 'PUBBLICITÀ INUTILE!',
    desc: 'Compra subito la nuova forchetta per il brodo con buchi extralarge! Clicca X!',
    bg: '#00E5FF',
    textColor: '#000',
  },
];

export default function RapidQuestionScreen({
  question,
  players,
  activeSabotages = [],
  botSabotages = {},
  climbRound = 1,
  onQuestionEnd,
}) {
  const [timeLeft, setTimeLeft] = useState(RAPID_ANSWER_TIME);
  const [playerAnswer, setPlayerAnswer] = useState(null);
  const [playerTimeTaken, setPlayerTimeTaken] = useState(null);
  const [botAnswers, setBotAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Active sabotages for human
  const isCakeActive = activeSabotages.includes('cake');
  const isCageActive = activeSabotages.includes('cage');
  const isEarthquakeActive = activeSabotages.includes('earthquake');
  const isUpsideDownActive = activeSabotages.includes('upside_down');

  // Cage hits state per button
  const [cageHits, setCageHits] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [shakingIdx, setShakingIdx] = useState(null);
  const [lastHitAnim, setLastHitAnim] = useState({});

  // Crazy buttons ordering state
  const [buttonOrder, setButtonOrder] = useState([0, 1, 2, 3]);

  // Upside down pop-ups state
  const [openPopups, setOpenPopups] = useState(() => (isUpsideDownActive ? [...INITIAL_POPUPS] : []));

  const bots = useMemo(() => players.filter(p => p.isBot), [players]);
  const human = useMemo(() => players.find(p => !p.isBot) || players[0], [players]);

  // Bot answers with delay & accuracy affected by sabotages
  useEffect(() => {
    const timeouts = bots.map(bot => {
      const isSabotaged = botSabotages[bot.id] && botSabotages[bot.id].length > 0;
      // Rapid fire bot delays: normally 1.4s to 6.5s. If sabotaged: extra 3-4s!
      const baseDelay = 1400 + Math.random() * 5500;
      const delay = isSabotaged ? baseDelay + 3200 + Math.random() * 2000 : baseDelay;

      return setTimeout(() => {
        const accuracy = isSabotaged ? 0.35 : 0.70;
        const isCorrect = Math.random() < accuracy;
        const answerIdx = isCorrect
          ? question.correct
          : (question.correct + 1 + Math.floor(Math.random() * 3)) % 4;

        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        setBotAnswers(prev => ({
          ...prev,
          [bot.id]: { answer: answerIdx, timeTaken },
        }));
      }, delay);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [question, bots, botSabotages]);

  // Crazy Buttons: shuffle positions every 1.2s if earthquake is active
  useEffect(() => {
    if (!isEarthquakeActive || revealed) return;

    const interval = setInterval(() => {
      setButtonOrder(prev => {
        const next = [...prev];
        for (let i = next.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [next[i], next[j]] = [next[j], next[i]];
        }
        playSound('whoosh');
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isEarthquakeActive, revealed]);

  // Countdown timer (12s)
  useEffect(() => {
    if (revealed) return;
    if (timeLeft <= 0) {
      revealAnswers();
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev <= 5 && prev > 1) playTick();
        return prev - 1;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, revealed]);

  // Handle Answer selection
  const handleAnswerClick = (idx) => {
    if (playerAnswer !== null || revealed) return;

    if (openPopups.length > 0) {
      playPop();
      vibrateShort();
      return;
    }

    if (isCageActive) {
      const currentHits = cageHits[idx] || 0;
      if (currentHits < 3) {
        const nextHits = currentHits + 1;
        setCageHits(prev => ({ ...prev, [idx]: nextHits }));
        setShakingIdx(idx);
        setTimeout(() => setShakingIdx(null), 300);

        playCrash();
        vibrateShort();

        if (nextHits === 3) {
          setLastHitAnim(prev => ({ ...prev, [idx]: { text: 'SMASH! 💥', key: Date.now() } }));
        } else {
          setLastHitAnim(prev => ({ ...prev, [idx]: { text: 'CRACK! 🔨', key: Date.now() } }));
        }
        return;
      }
    }

    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    setPlayerAnswer(idx);
    setPlayerTimeTaken(timeTaken);
    playPop();
    vibrateShort();
  };

  const handleCanvasCleanClick = (clientX, clientY) => {
    if (playerAnswer !== null || revealed) return;
    const elements = document.elementsFromPoint(clientX, clientY);
    for (const el of elements) {
      const btn = el.closest('[data-answer-idx]');
      if (btn) {
        const idx = parseInt(btn.getAttribute('data-answer-idx'), 10);
        if (!isNaN(idx)) {
          handleAnswerClick(idx);
          break;
        }
      }
    }
  };

  const handleDismissPopup = (popupId) => {
    playPop();
    vibrateShort();
    setOpenPopups(prev => prev.filter(p => p.id !== popupId));
  };

  const revealAnswers = () => {
    if (revealed) return;
    setRevealed(true);

    // Audio & vibration feedback for human answer
    const isHumanCorrect = playerAnswer === question.correct;
    if (isHumanCorrect) {
      playCorrect();
      vibrateShort();
    } else {
      playWrong();
      triggerScreenShake();
      vibrateHeavy();
    }

    // Force bot answers for any missing
    setBotAnswers(prev => {
      const updated = { ...prev };
      bots.forEach(bot => {
        if (!updated[bot.id]) {
          updated[bot.id] = { answer: Math.floor(Math.random() * 4), timeTaken: 12 };
        }
      });
      return updated;
    });
  };


  // Evaluate speed ranking & floor rewards
  useEffect(() => {
    if (!revealed) return;

    const timer = setTimeout(() => {
      // Gather all answers and times
      const fullResults = {};

      // Human
      if (playerAnswer !== null) {
        fullResults[human.id] = {
          answer: playerAnswer,
          isCorrect: playerAnswer === question.correct,
          timeTaken: playerTimeTaken || 12,
        };
      } else {
        fullResults[human.id] = {
          answer: -1,
          isCorrect: false,
          timeTaken: 12,
        };
      }

      // Bots
      bots.forEach(b => {
        const bRes = botAnswers[b.id] || { answer: -1, timeTaken: 12 };
        fullResults[b.id] = {
          answer: bRes.answer,
          isCorrect: bRes.answer === question.correct,
          timeTaken: bRes.timeTaken || 12,
        };
      });

      // Filter correct players and sort by timeTaken ascending (fastest first)
      const correctPlayers = players
        .filter(p => fullResults[p.id]?.isCorrect)
        .sort((a, b) => fullResults[a.id].timeTaken - fullResults[b.id].timeTaken);

      // Floor awards: 1st -> +3, 2nd -> +2, 3rd -> +1, others -> 0
      const floorAwards = {};
      players.forEach(p => { floorAwards[p.id] = 0; });

      if (correctPlayers[0]) floorAwards[correctPlayers[0].id] = 3;
      if (correctPlayers[1]) floorAwards[correctPlayers[1].id] = 2;
      if (correctPlayers[2]) floorAwards[correctPlayers[2].id] = 1;

      onQuestionEnd({
        question,
        fullResults,
        correctPlayers,
        floorAwards,
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, [revealed]);

  const timerPct = (timeLeft / RAPID_ANSWER_TIME) * 100;
  const fuseColor = timeLeft <= 4 ? '#FF2A85' : timeLeft <= 8 ? '#FFD600' : '#00FF87';

  const getButtonStyle = (idx) => {
    if (!revealed) {
      return playerAnswer === idx
        ? { transform: 'translate(5px, 5px)', boxShadow: 'none' }
        : {};
    }
    if (idx === question.correct) return { backgroundColor: '#00FF87', color: '#000' };
    if (playerAnswer === idx && idx !== question.correct)
      return { backgroundColor: '#555', color: '#999' };
    return { opacity: 0.4 };
  };

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3.5 py-2.5 sm:py-3 select-none relative text-white">
      {/* Rapid Fire Header */}
      <div className="flex items-center justify-between gap-2 mb-1.5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span
            className="neo-card px-2.5 py-1 font-bangers text-xs tracking-wider flex items-center gap-1 shadow-[3px_3px_0px_#000] border-3 border-black"
            style={{ backgroundColor: '#FF2A85', color: '#fff' }}
          >
            <Zap size={14} fill="#fff" />
            <span>A FUOCO RAPIDO!</span>
          </span>
          <span className="neo-card px-2 py-1 font-bangers text-xs text-black bg-[#FFD600] border-3 border-black shadow-[3px_3px_0px_#000]">
            {question.emoji} {question.category}
          </span>
        </div>

        {/* Comic Bomb Timer badge */}
        <div
          className="neo-card flex items-center gap-1.5 px-3 py-1 shadow-[4px_4px_0px_#000] border-3 border-black"
          style={{
            backgroundColor: timeLeft <= 4 ? '#FF2A85' : '#FFFFFF',
            color: timeLeft <= 4 ? '#FFFFFF' : '#000000',
          }}
        >
          <span className="text-lg leading-none animate-bounce">💣</span>
          <span className="font-bangers text-2xl leading-none" style={{ color: timeLeft <= 4 ? '#FFF' : '#000' }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Comic Fuse Timer Bar */}
      <div
        className="w-full h-4 sm:h-5 rounded-full mb-1.5 overflow-hidden border-3 sm:border-4 border-black relative bg-white shadow-[4px_4px_0px_#000] flex-shrink-0"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#FFD600] via-[#FF8800] to-[#FF2A85]"
          style={{ transformOrigin: 'left' }}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
        {timeLeft > 0 && !revealed && (
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 text-sm leading-none pointer-events-none"
            style={{
              left: `calc(${timerPct}% - 10px)`,
            }}
            animate={{ scale: [1, 1.3, 1], rotate: [-10, 10, -10] }}
            transition={{ duration: 0.35, repeat: Infinity }}
          >
            🔥
          </motion.span>
        )}
      </div>

      {/* Speed Rewards Badge */}
      <div className="flex justify-between items-center mb-1 px-2 py-0.5 rounded-lg bg-black/75 border-2 border-black text-[10px] sm:text-xs font-bangers shadow-[2px_2px_0px_#000] flex-shrink-0">
        <span className="text-[#FFD600]">🥇 1°: +3 PIANI</span>
        <span className="text-[#00E5FF]">🥈 2°: +2 PIANI</span>
        <span className="text-[#FF2A85]">🥉 3°: +1 PIANO</span>
        <span className="text-gray-400">❌ 0</span>
      </div>

      {/* Active Sabotage / Malus Banner (Riscossa degli Ultimi) */}
      {activeSabotages.length > 0 && (
        <div className="flex justify-center items-center mb-1 px-2 py-0.5 rounded-lg bg-[#FF2A85] border-2 border-black text-[11px] font-bangers shadow-[2px_2px_0px_#000] text-white flex-shrink-0 animate-pulse">
          <span>⚠️ RISCOSSA: SEI COLPITO DA {activeSabotages.map(s => {
            const sab = SABOTAGES.find(x => x.id === s);
            return `${sab?.emoji || '💥'} ${sab?.name?.toUpperCase() || s.toUpperCase()}`;
          }).join(' + ')}!</span>
        </div>
      )}
      {bots.some(b => botSabotages[b.id] && botSabotages[b.id].length > 0) && (
        <div className="flex justify-center items-center mb-1 px-2 py-0.5 rounded-lg bg-[#FFD600] border-2 border-black text-[11px] font-bangers shadow-[2px_2px_0px_#000] text-black flex-shrink-0">
          <span>🎯 RISCOSSA: {bots.filter(b => botSabotages[b.id] && botSabotages[b.id].length > 0).map(b => {
            const sabs = (botSabotages[b.id] || []).map(s => SABOTAGES.find(x => x.id === s)?.emoji || '💥').join(' ');
            return `${b.name} ${sabs} (+4s RITARDO)`;
          }).join(', ')}</span>
        </div>
      )}

      {/* Box Domanda: Grande fumetto bianco/crema con bordo nero spesso 4px e ombra netta */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 20 }}
        className="speech-bubble px-4 py-3 mb-2 rounded-2xl border-4 border-black bg-[#FFFDF5] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center min-h-[75px] sm:min-h-[85px] flex-shrink-0"
      >
        <p
          className="font-bold text-base sm:text-lg text-center leading-snug text-black"
          style={{ fontFamily: 'Fredoka', fontWeight: 700 }}
        >
          {question.question}
        </p>
      </motion.div>

      {/* Answers Area with Sabotages */}
      <div className="relative flex-1 flex flex-col justify-start">
        {/* Sabotage 1: Canvas */}
        {isCakeActive && (
          <PieSplatterCanvas
            onCleanAnswer={handleCanvasCleanClick}
            isRevealed={revealed}
          />
        )}

        {/* Sabotage 4: Pop-ups */}
        <AnimatePresence>
          {openPopups.length > 0 && !revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 p-2 bg-black/60 backdrop-blur-xs rounded-xl"
            >
              <div className="font-bangers text-sm text-yellow-300 tracking-wider mb-1 text-center">
                ⚠️ CHIUDI TUTTI I POP-UP PER RISPONDERE! ({openPopups.length} rimasti)
              </div>

              {openPopups.map((popup, i) => (
                <motion.div
                  key={popup.id}
                  initial={{ scale: 0, rotate: i % 2 === 0 ? -4 : 4 }}
                  animate={{ scale: 1, rotate: i % 2 === 0 ? -1 : 1 }}
                  exit={{ scale: 0, rotate: 10, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="neo-card p-3 w-full max-w-[340px] flex items-center justify-between"
                  style={{
                    backgroundColor: popup.bg,
                    borderColor: '#000',
                    boxShadow: '5px 5px 0 #000',
                    color: popup.textColor,
                  }}
                >
                  <div className="flex items-center gap-2 pr-2">
                    <span className="text-3xl">{popup.emoji}</span>
                    <div>
                      <span className="font-bangers text-sm block leading-tight">
                        {popup.title}
                      </span>
                      <span className="text-[10px] font-bold block leading-tight opacity-90" style={{ fontFamily: 'Fredoka' }}>
                        {popup.desc}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleDismissPopup(popup.id)}
                    className="neo-btn flex items-center justify-center w-9 h-9 shrink-0 rounded-lg"
                    style={{
                      backgroundColor: '#FF2A85',
                      color: '#fff',
                      borderColor: '#000',
                      boxShadow: '3px 3px 0 #000',
                    }}
                  >
                    <X size={20} strokeWidth={4} />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 Answers Grid */}
        <div className="grid grid-cols-2 gap-3">
          {buttonOrder.map(idx => {
            const ans = question.answers[idx];
            const hits = cageHits[idx] || 0;
            const isBroken = hits >= 3;
            const isShaking = shakingIdx === idx;
            const hitAnim = lastHitAnim[idx];

            return (
              <motion.div
                key={idx}
                layout={isEarthquakeActive}
                transition={{
                  layout: { type: 'spring', stiffness: 320, damping: 22 },
                }}
                className="relative"
              >
                <motion.button
                  data-answer-idx={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: isShaking ? [-6, 6, -4, 4, 0] : 0,
                  }}
                  transition={{
                    scale: { delay: 0.1 + idx * 0.05, type: 'spring' },
                    x: { duration: 0.3 },
                  }}
                  onClick={() => handleAnswerClick(idx)}
                  className={`neo-btn w-full py-3.5 px-3 text-center relative overflow-hidden ${ANSWER_COLORS[idx]}`}
                  style={{
                    minHeight: 84,
                    ...getButtonStyle(idx),
                  }}
                >
                  <div
                    style={{
                      transform: isUpsideDownActive ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s ease',
                      display: 'inline-block',
                      width: '100%',
                    }}
                  >
                    <span className="font-bangers text-xl tracking-wide block">
                      {ANSWER_LABELS[idx]}
                    </span>
                    <span
                      className="text-sm font-bold leading-tight block mt-1"
                      style={{ fontFamily: 'Fredoka', fontWeight: 600 }}
                    >
                      {ans}
                    </span>
                  </div>

                  {/* Sabotage 2: Wooden Planks */}
                  {isCageActive && !isBroken && !revealed && (
                    <div
                      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none"
                      style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                    >
                      <div
                        className="comic-wood absolute w-[130%] h-7 rounded-sm flex items-center justify-around"
                        style={{ transform: 'rotate(24deg)' }}
                      />
                      <div
                        className="comic-wood absolute w-[130%] h-7 rounded-sm flex items-center justify-around"
                        style={{ transform: 'rotate(-24deg)' }}
                      />
                      <div
                        className="neo-card z-20 px-2 py-0.5 flex items-center gap-1 font-bangers text-[11px] tracking-wider"
                        style={{
                          backgroundColor: '#FFD600',
                          color: '#000',
                          borderWidth: 2,
                          boxShadow: '2px 2px 0 #000',
                        }}
                      >
                        <Hammer size={12} strokeWidth={3} />
                        <span>COLPISCI! ({3 - hits})</span>
                      </div>
                    </div>
                  )}

                  {/* Hit anim */}
                  <AnimatePresence>
                    {hitAnim && Date.now() - hitAnim.key < 500 && (
                      <motion.div
                        key={hitAnim.key}
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1.3, y: -15 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
                      >
                        <span
                          className="onomatopoeia font-bangers text-2xl text-yellow-300"
                          style={{ WebkitTextStroke: '2px #000' }}
                        >
                          {hitAnim.text}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Answer status row */}
      <div className="flex gap-2 flex-wrap justify-center mt-2">
        {players.map(p => {
          const hasAns = p.isBot ? botAnswers[p.id] !== undefined : playerAnswer !== null;
          const isSabotaged = p.isBot
            ? botSabotages[p.id] && botSabotages[p.id].length > 0
            : activeSabotages.length > 0;

          return (
            <div
              key={p.id}
              className={`flex items-center gap-1.5 border-2 border-black rounded-full px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black ${
                isSabotaged ? 'bg-pink-100 ring-2 ring-pink-500' : 'bg-white'
              }`}
            >
              <span className="relative flex items-center">
                <AvatarDisplay avatar={p.avatar} className="w-4 h-4 flex-shrink-0" />
                {isSabotaged && (
                  <span className="absolute -bottom-1 -right-1 text-[10px]">
                    💥
                  </span>
                )}
              </span>
              <span className="font-extrabold text-xs text-black">{p.name}</span>
              {isSabotaged && p.isBot && (
                <span className="font-bangers text-[9px] bg-red-500 text-white px-1 rounded-full border border-black">
                  +4s
                </span>
              )}
              <span className="font-bangers text-xs text-black">{hasAns ? '✅' : '⏳'}</span>
            </div>
          );
        })}
      </div>

      {/* Early Reveal button */}
      {playerAnswer !== null && !revealed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={revealAnswers}
          className="neo-btn mt-2 py-2 px-4 text-xs w-full font-bangers tracking-wider"
          style={{ backgroundColor: '#2a2a2a', color: '#FFD600', borderColor: '#FFD600' }}
        >
          RIVELA RISPOSTE ADESSO! ⚡
        </motion.button>
      )}
    </div>
  );
}
