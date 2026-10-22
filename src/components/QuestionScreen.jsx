import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Hammer, AlertTriangle } from 'lucide-react';
import { SPEED_POINTS, SABOTAGES } from '../data/gameData';
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


const ANSWER_TIME = 15;
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

export default function QuestionScreen({
  question,
  players,
  onRoundEnd,
  activeSabotages = [],
  botSabotages = {},
}) {
  const [timeLeft, setTimeLeft] = useState(ANSWER_TIME);
  const [playerAnswer, setPlayerAnswer] = useState(null);
  const [playerTimeTaken, setPlayerTimeTaken] = useState(null);
  const [botAnswers, setBotAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const startTimeRef = useRef(Date.now());
  const playerTimeRef = useRef(null);
  const botAnswersRef = useRef({});
  const hasCompletedRef = useRef(false);

  // Active sabotages for human player (up to 2 simultaneous)
  const isCakeActive = activeSabotages.includes('cake');
  const isCageActive = activeSabotages.includes('cage');
  const isEarthquakeActive = activeSabotages.includes('earthquake');
  const isUpsideDownActive = activeSabotages.includes('upside_down');

  // Cage hits state per button: { 0: 0, 1: 0, 2: 0, 3: 0 }
  const [cageHits, setCageHits] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [shakingIdx, setShakingIdx] = useState(null);
  const [lastHitAnim, setLastHitAnim] = useState({}); // { [idx]: { text: 'CRACK!', key: Date.now() } }

  // Crazy buttons ordering state
  const [buttonOrder, setButtonOrder] = useState([0, 1, 2, 3]);

  // Upside down pop-ups state
  const [openPopups, setOpenPopups] = useState(() => (isUpsideDownActive ? [...INITIAL_POPUPS] : []));

  const bots = useMemo(() => players.filter(p => p.isBot), [players]);
  const human = useMemo(() => players.find(p => !p.isBot) || players[0], [players]);

  // Bot answers con tempo di risposta casuale (2-12s) e precisione influenzata dai sabotaggi
  useEffect(() => {
    startTimeRef.current = Date.now();
    playerTimeRef.current = null;
    botAnswersRef.current = {};
    hasCompletedRef.current = false;

    const timeouts = bots.map(bot => {
      const isSabotaged = botSabotages[bot.id] && botSabotages[bot.id].length > 0;
      // Genera per ogni bot un tempo casuale tra 2 e 12 secondi
      const baseDelay = 2000 + Math.random() * 9500;
      const delay = isSabotaged
        ? Math.min(14200, baseDelay + 2500 + Math.random() * 1500)
        : baseDelay;
      const timeTaken = Number((delay / 1000).toFixed(2));

      return setTimeout(() => {
        // I bot sabotati hanno accuratezza minore (35% vs 65%)
        const accuracy = isSabotaged ? 0.35 : 0.65;
        const isCorrect = Math.random() < accuracy;
        const answerIdx = isCorrect
          ? question.correct
          : (question.correct + 1 + Math.floor(Math.random() * 3)) % 4;

        const botData = { answer: answerIdx, timeTaken, isCorrect };
        botAnswersRef.current[bot.id] = botData;
        setBotAnswers(prev => ({ ...prev, [bot.id]: botData }));
      }, delay);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [question, bots, botSabotages]);

  // Crazy Buttons: shuffle positions every 1.2s if earthquake is active
  useEffect(() => {
    if (!isEarthquakeActive || revealed) return;

    const interval = setInterval(() => {
      setButtonOrder(prev => {
        // Deterministic shuffle ensuring items swap positions
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

  // Countdown timer with ticking in last 5 seconds
  useEffect(() => {
    if (revealed) return;
    if (timeLeft <= 0) {
      revealAnswers();
      return;
    }
    const t = setTimeout(() => {
      if (timeLeft > 0) {
        if (timeLeft - 1 <= 5 && timeLeft - 1 > 0) {
          playTick();
        }
        setTimeLeft(prev => prev - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, revealed]);

  // Handle Answer selection (including cage hits & popups check)
  const handleAnswerClick = (idx) => {
    if (playerAnswer !== null || revealed) return;

    // 1. Pop-ups check: cannot answer while pop-ups are open
    if (openPopups.length > 0) {
      playPop();
      vibrateShort();
      return;
    }

    // 2. Cage check: must hit 3 times to break obstacle
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
        } else if (nextHits === 2) {
          setLastHitAnim(prev => ({ ...prev, [idx]: { text: 'CRRRACK! 🔨', key: Date.now() } }));
        } else {
          setLastHitAnim(prev => ({ ...prev, [idx]: { text: 'CRACK! 🔨', key: Date.now() } }));
        }
        return; // Needs more hits, do not select answer yet
      }
    }

    // If no obstacles or obstacle broken, select answer & record reaction time!
    const elapsed = Number(((Date.now() - startTimeRef.current) / 1000).toFixed(2));
    playerTimeRef.current = elapsed;
    setPlayerTimeTaken(elapsed);
    setPlayerAnswer(idx);
    playPop();
    vibrateShort();
  };

  // Called from canvas when user clicks on a clean area
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

  // Dismiss a pop-up
  const handleDismissPopup = (popupId) => {
    playPop();
    vibrateShort();
    setOpenPopups(prev => prev.filter(p => p.id !== popupId));
  };

  // Se tutti i giocatori (umano + tutti i bot) hanno risposto, rivela dopo breve suspense
  useEffect(() => {
    if (revealed) return;
    const allBotsAnswered = bots.every(b => botAnswers[b.id] !== undefined);
    const humanAnswered = playerAnswer !== null;

    if (allBotsAnswered && humanAnswered) {
      const timer = setTimeout(() => {
        revealAnswers();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [revealed, botAnswers, playerAnswer, bots]);

  const revealAnswers = () => {
    if (revealed) return;
    setRevealed(true);

    // Audio and haptic feedback based on human answer
    const isHumanCorrect = playerAnswer === question.correct;
    if (isHumanCorrect) {
      playCorrect();
      vibrateShort();
    } else {
      playWrong();
      triggerScreenShake();
      vibrateHeavy();
    }

    // Completa i bot che non avevano ancora risposto
    setBotAnswers(prev => {
      const updated = { ...prev };
      bots.forEach(bot => {
        if (!updated[bot.id]) {
          const fallbackAns = Math.floor(Math.random() * 4);
          const fallbackTime = 15;
          const fallbackData = {
            answer: fallbackAns,
            timeTaken: fallbackTime,
            isCorrect: fallbackAns === question.correct,
          };
          updated[bot.id] = fallbackData;
          botAnswersRef.current[bot.id] = fallbackData;
        }
      });
      return updated;
    });
  };

  // Auto advance to results after reveal: calcolo punteggio fisso per velocità (5, 4, 3, 2, 0)
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;

      const results = {};
      const humanTime = playerTimeRef.current ?? (playerAnswer !== null ? 15 : 999);
      const isHumanCorrect = playerAnswer !== null && playerAnswer === question.correct;

      // Risultato giocatore umano
      results[human.id] = {
        answer: playerAnswer ?? -1,
        isCorrect: isHumanCorrect,
        timeTaken: humanTime,
        score: 0,
      };

      // Risultati Bot
      bots.forEach(bot => {
        const bData = botAnswersRef.current[bot.id] || { answer: -1, timeTaken: 999, isCorrect: false };
        const isBotCorrect = bData.answer === question.correct;
        results[bot.id] = {
          answer: bData.answer,
          isCorrect: isBotCorrect,
          timeTaken: bData.timeTaken ?? 999,
          score: 0,
        };
      });

      // Filtra e ordina solo coloro che hanno indovinato, dal più veloce al più lento
      const correctPlayers = players
        .filter(p => results[p.id]?.isCorrect)
        .sort((a, b) => results[a.id].timeTaken - results[b.id].timeTaken);

      // Assegna rispettivamente 5, 4, 3 e 2 punti
      correctPlayers.forEach((p, rankIdx) => {
        if (rankIdx < SPEED_POINTS.length) {
          results[p.id].score = SPEED_POINTS[rankIdx];
        }
      });

      onRoundEnd(results);
    }, 2800);
    return () => clearTimeout(t);
  }, [revealed, bots, human, playerAnswer, question.correct, players, onRoundEnd]);

  const timerPct = (timeLeft / ANSWER_TIME) * 100;
  const fuseColor = timeLeft <= 5 ? '#FF2A85' : timeLeft <= 10 ? '#FFD600' : '#00FF87';

  const getButtonStyle = (idx) => {
    if (!revealed) {
      return playerAnswer === idx
        ? { transform: 'translate(5px, 5px)', boxShadow: 'none' }
        : {};
    }
    if (idx === question.correct) return { backgroundColor: '#00FF87', color: '#000' };
    if (playerAnswer === idx && idx !== question.correct)
      return { backgroundColor: '#555', color: '#999' };
    const botAnswerIndices = Object.values(botAnswers).map(b => (b && typeof b === 'object' ? b.answer : b));
    if (botAnswerIndices.includes(idx) && idx !== question.correct)
      return { backgroundColor: '#444', color: '#777' };
    return { opacity: 0.4 };
  };

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3.5 py-2.5 sm:py-3 select-none relative text-white">
      {/* Top Header - Compact Category and Comic Bomb Timer */}
      <div className="flex items-center justify-between gap-2 mb-1.5 flex-shrink-0">
        <span
          className="neo-card px-3 py-1 font-bangers text-xs sm:text-sm tracking-wider flex items-center gap-1.5 shadow-[4px_4px_0px_#000] border-3 border-black text-black"
          style={{ backgroundColor: '#FFD600' }}
        >
          <span className="text-base">{question.emoji}</span>
          <span className="truncate max-w-[180px]">{question.category.toUpperCase()}</span>
        </span>

        {/* Comic Bomb Timer badge */}
        <div
          className="neo-card flex items-center gap-1.5 px-3 py-1 shadow-[4px_4px_0px_#000] border-3 border-black"
          style={{
            backgroundColor: timeLeft <= 5 ? '#FF2A85' : '#FFFFFF',
            color: timeLeft <= 5 ? '#FFFFFF' : '#000000',
            transition: 'background-color 0.25s',
          }}
        >
          <span className="text-lg leading-none animate-bounce">💣</span>
          <span className="font-bangers text-2xl leading-none" style={{ color: timeLeft <= 5 ? '#FFF' : '#000' }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Comic Fuse Timer Bar (Miccia della Bomba con bordo nero spesso) */}
      <div
        className="w-full h-4 sm:h-5 rounded-full mb-2 overflow-hidden border-3 sm:border-4 border-black relative bg-white shadow-[4px_4px_0px_#000] flex-shrink-0"
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

      {/* Active Sabotages Notice Bar (if any applied to human) */}
      {activeSabotages.length > 0 && (
        <div className="flex gap-1.5 mb-1.5 flex-wrap justify-center flex-shrink-0">
          {activeSabotages.map(sabId => {
            const sab = SABOTAGES.find(s => s.id === sabId);
            if (!sab) return null;
            return (
              <span
                key={sabId}
                className="neo-card px-2.5 py-0.5 font-bangers text-xs tracking-wider flex items-center gap-1"
                style={{
                  backgroundColor: sab.borderColor,
                  color: '#fff',
                  borderWidth: 2.5,
                  borderColor: '#000',
                  boxShadow: '3px 3px 0 #000',
                }}
              >
                <span>{sab.emoji}</span>
                <span>ATTACCO: {sab.name.toUpperCase()}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Earthquake Alert Banner */}
      {isEarthquakeActive && (
        <motion.div
          animate={{ x: [-2, 2, -2, 2, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="neo-card py-1 px-3 mb-1.5 flex items-center justify-center gap-1.5 flex-shrink-0"
          style={{
            backgroundColor: '#FFD600',
            color: '#000',
            borderColor: '#000',
            borderWidth: 3,
            boxShadow: '3px 3px 0 #000',
          }}
        >
          <AlertTriangle size={14} strokeWidth={3} className="text-[#FF2A85]" />
          <span className="font-bangers text-xs tracking-wider">
            TERREMOTO IN CORSO! I BOTTONI SCAMBIANO POSTO! 🌀
          </span>
        </motion.div>
      )}

      {/* Box Domanda: Grande fumetto bianco/crema con bordo nero spesso 4px e ombra netta */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="speech-bubble px-4 py-3 mb-2 rounded-2xl border-4 border-black bg-[#FFFDF5] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center min-h-[75px] sm:min-h-[90px] flex-shrink-0"
      >
        <p
          className="font-bold text-base sm:text-lg text-center leading-snug text-black"
          style={{ fontFamily: 'Fredoka', fontWeight: 700 }}
        >
          {question.question}
        </p>
      </motion.div>

      {/* Answer buttons container with Sabotage Overlays */}
      <div className="relative flex-1 flex flex-col justify-start">
        {/* Sabotage 1: Torta in Faccia Canvas Overlay */}
        {isCakeActive && (
          <PieSplatterCanvas
            onCleanAnswer={handleCanvasCleanClick}
            isRevealed={revealed}
          />
        )}

        {/* Sabotage 4: Upside-Down Pop-ups Overlay */}
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
                  className="neo-card p-3 w-full max-w-[340px] flex items-center justify-between relative"
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
                      <span
                        className="text-[10px] font-bold block leading-tight opacity-90"
                        style={{ fontFamily: 'Fredoka' }}
                      >
                        {popup.desc}
                      </span>
                    </div>
                  </div>

                  {/* Red [X] Close Button */}
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
                    title="Chiudi pop-up"
                  >
                    <X size={20} strokeWidth={4} />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid of 4 Answer Buttons (rendered in buttonOrder for Earthquake) */}
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
                    scale: { delay: 0.1 + idx * 0.05, type: 'spring', stiffness: 250 },
                    x: { duration: 0.3 },
                  }}
                  onClick={() => handleAnswerClick(idx)}
                  className={`neo-btn w-full py-3.5 px-3 text-center relative overflow-hidden ${ANSWER_COLORS[idx]}`}
                  style={{
                    minHeight: 84,
                    ...getButtonStyle(idx),
                  }}
                >
                  {/* Answer label & text (rotated 180° if Upside Down sabotage is active) */}
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

                  {/* Sabotage 2: Gabbia Cartoon (Crossed Wooden Planks) Overlay */}
                  {isCageActive && !isBroken && !revealed && (
                    <div
                      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none"
                      style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                    >
                      {/* Diagonal Plank 1 */}
                      <div
                        className="comic-wood absolute w-[130%] h-7 rounded-sm flex items-center justify-around"
                        style={{ transform: 'rotate(24deg)' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                      </div>

                      {/* Diagonal Plank 2 */}
                      <div
                        className="comic-wood absolute w-[130%] h-7 rounded-sm flex items-center justify-around"
                        style={{ transform: 'rotate(-24deg)' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                      </div>

                      {/* Cracks SVG overlay based on hits */}
                      {hits > 0 && (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none z-15"
                          viewBox="0 0 100 60"
                        >
                          {hits === 1 && (
                            <path
                              d="M50,10 L45,25 L55,35 L48,50"
                              stroke="#000"
                              strokeWidth="3.5"
                              fill="none"
                              strokeLinecap="round"
                            />
                          )}
                          {hits === 2 && (
                            <>
                              <path
                                d="M50,10 L45,25 L55,35 L48,50"
                                stroke="#000"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                d="M20,30 L45,25 L65,15"
                                stroke="#000"
                                strokeWidth="3"
                                fill="none"
                              />
                              <path
                                d="M48,50 L75,42"
                                stroke="#000"
                                strokeWidth="3"
                                fill="none"
                              />
                              <path
                                d="M50,10 L45,25 L55,35 L48,50"
                                stroke="#fff"
                                strokeWidth="1.5"
                                fill="none"
                              />
                            </>
                          )}
                        </svg>
                      )}

                      {/* Hits remaining badge */}
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

                  {/* Crack / Smash Floating Text animation */}
                  <AnimatePresence>
                    {hitAnim && Date.now() - hitAnim.key < 500 && (
                      <motion.div
                        key={hitAnim.key}
                        initial={{ scale: 0, y: 10, rotate: -10 }}
                        animate={{ scale: 1.3, y: -15, rotate: 5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
                      >
                        <span
                          className="onomatopoeia font-bangers text-2xl text-yellow-300"
                          style={{
                            WebkitTextStroke: '2px #000',
                            textShadow: '3px 3px 0 #000',
                          }}
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

      {/* Players Answer Status Row */}
      <div className="flex gap-2 flex-wrap justify-center mt-2">
        {players.map(p => {
          const hasAns = p.isBot ? botAnswers[p.id] !== undefined : playerAnswer !== null;
          const ansTime = p.isBot ? botAnswers[p.id]?.timeTaken : playerTimeTaken;
          const isSabotaged = p.isBot
            ? botSabotages[p.id] && botSabotages[p.id].length > 0
            : activeSabotages.length > 0;

          return (
            <div
              key={p.id}
              className="flex items-center gap-1.5 bg-white border-2 border-black rounded-full px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black"
            >
              <span className="relative flex items-center">
                <AvatarDisplay avatar={p.avatar} className="w-5 h-5 inline-block" />
                {isSabotaged && (
                  <span className="absolute -bottom-1 -right-1 text-[10px]">
                    💥
                  </span>
                )}
              </span>
              <span className="font-extrabold text-xs text-black">{p.name}</span>
              <span className="font-bangers text-xs text-black">
                {hasAns ? (ansTime ? `⚡ ${ansTime.toFixed(1)}s` : '✅') : '⏳'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Reveal early button (if human has answered) */}
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
