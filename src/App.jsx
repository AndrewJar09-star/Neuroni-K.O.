import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import HomeScreen from './components/HomeScreen';
import CategoryVote from './components/CategoryVote';
import SabotageSelection from './components/SabotageSelection';
import SabotageImpact from './components/SabotageImpact';
import QuestionScreen from './components/QuestionScreen';
import RoundResult from './components/RoundResult';
import ClimbIntro from './components/ClimbIntro';
import SkyscraperTower from './components/SkyscraperTower';
import RapidQuestionScreen from './components/RapidQuestionScreen';
import ClimbEvaluation from './components/ClimbEvaluation';
import ClimbVictory from './components/ClimbVictory';
import FinalScreen from './components/FinalScreen';
import AudioControl from './components/AudioControl';
import {
  pickUniqueQuestionsByCategory,
  pickUniqueQuestion,
} from './data/questions/index.js';
import { BOT_PLAYERS } from './data/gameData';
import { AVATARS_LIST } from './data/avatars';


// Game states (state machine)
const STATES = {
  HOME: 'home',
  VOTE: 'vote',
  SABOTAGE: 'sabotage',
  IMPACT: 'impact',
  QUESTION: 'question',
  RESULT: 'result',
  // Final Round: La Scalata del Grattacielo K.O.
  CLIMB_INTRO: 'climb_intro',
  CLIMB_TOWER: 'climb_tower',
  CLIMB_IMPACT: 'climb_impact',
  CLIMB_QUESTION: 'climb_question',
  CLIMB_EVAL: 'climb_eval',
  CLIMB_VICTORY: 'climb_victory',
  FINAL: 'final',
};

const ROUNDS_PER_GAME = 5;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Game Error caught by ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-center items-center px-4 text-center select-none relative z-50">
          <div
            className="neo-card p-6 bg-[#FFD600] border-4 border-black text-black"
            style={{ boxShadow: '6px 6px 0 #000' }}
          >
            <h2 className="font-bangers text-3xl mb-2 text-red-600 tracking-wider">💥 OPS! K.O. IMPREVISTO!</h2>
            <p className="font-bold text-sm mb-3" style={{ fontFamily: 'Fredoka' }}>
              Si è verificato un errore durante il passaggio di schermata.
            </p>
            <p className="text-xs text-gray-800 mb-4 bg-white/80 p-2 rounded border-2 border-black overflow-auto max-h-24 font-mono">
              {this.state.error?.message || 'Errore imprevisto'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
                else window.location.reload();
              }}
              className="neo-btn px-6 py-3 bg-red-500 text-white font-bangers text-xl border-3 border-black shadow-[3px_3px_0_#000]"
            >
              🔄 RICOMINCIA PARTITA
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [gameState, setGameState] = useState(STATES.HOME);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [roundNum, setRoundNum] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lastRoundResults, setLastRoundResults] = useState(null);
  const roundCompletedRef = useRef({});

  // Standard rounds sabotage states
  const [activeSabotagesForHuman, setActiveSabotagesForHuman] = useState([]);
  const [attacksOnHuman, setAttacksOnHuman] = useState([]);
  const [botSabotages, setBotSabotages] = useState({});

  // Skyscraper Climb states
  const [playerFloors, setPlayerFloors] = useState({});
  const [previousFloors, setPreviousFloors] = useState({});
  const [climbRound, setClimbRound] = useState(1);
  const [climbAwards, setClimbAwards] = useState(null);
  const [climbCurrentQuestion, setClimbCurrentQuestion] = useState(null);
  const [lastRapidResults, setLastRapidResults] = useState(null);
  const [lastFloorAwards, setLastFloorAwards] = useState({});
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());

  // Screen shake state
  const [isScreenShaking, setIsScreenShaking] = useState(false);

  useEffect(() => {
    const handleScreenShake = () => {
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 450);
    };
    window.addEventListener('neuroni-screen-shake', handleScreenShake);
    return () => window.removeEventListener('neuroni-screen-shake', handleScreenShake);
  }, []);

  // ── HOME → setup players + start game (Inizia sempre da Domanda 1 con CATEGORY_VOTE) ──
  const handleStart = useCallback(({ name, avatar }) => {
    const humanPlayer = { id: 'human', name, avatar, isBot: false };

    // Assegna ai 3 Bot tre avatar diversi estratti dalla lista parodia, escludendo quello scelto dal giocatore
    const availableAvatars = AVATARS_LIST.filter(a => a.id !== avatar);
    const shuffledAvatars = [...availableAvatars].sort(() => Math.random() - 0.5);
    const botPlayersWithAvatars = BOT_PLAYERS.map((bot, index) => ({
      ...bot,
      avatar: shuffledAvatars[index % shuffledAvatars.length].id,
    }));

    const allPlayers = [humanPlayer, ...botPlayersWithAvatars];
    const initScores = {};
    allPlayers.forEach(p => { initScores[p.id] = 0; });
    setPlayers(allPlayers);
    setScores(initScores);
    setRoundNum(1);
    roundCompletedRef.current = {};
    setCurrentQuestion(null);
    setLastRoundResults(null);
    setActiveSabotagesForHuman([]);
    setAttacksOnHuman([]);
    setBotSabotages({});
    setPlayerFloors({});
    setPreviousFloors({});
    setClimbRound(1);
    setClimbAwards(null);
    setUsedQuestionIds(new Set());
    setGameState(STATES.VOTE);
  }, []);

  // ── VOTE → estrai 1 domanda unica per la categoria votata e passa a Sabotaggi ──
  const handleVoteEnd = useCallback((category) => {
    const picked = pickUniqueQuestionsByCategory(category, 1, usedQuestionIds);
    const chosen = picked[0] || pickUniqueQuestion(usedQuestionIds);
    setUsedQuestionIds(prev => new Set(prev).add(chosen.id));
    setCurrentQuestion(chosen);

    setActiveSabotagesForHuman([]);
    setAttacksOnHuman([]);
    setBotSabotages({});
    setGameState(STATES.SABOTAGE);
  }, [usedQuestionIds]);

  // ── SABOTAGE_SELECTION → handle choices & determine impact ──
  const handleSabotageComplete = useCallback(({ attacksOnHuman: incomingAttacks, allAttacks }) => {
    const botSabs = {};
    allAttacks.forEach(atk => {
      if (atk.targetId !== 'human') {
        botSabs[atk.targetId] = [...(botSabs[atk.targetId] || []), atk.sabotageId];
      }
    });
    setBotSabotages(botSabs);

    const appliedSabotages = incomingAttacks.map(a => a.sabotageId).slice(0, 2);
    setActiveSabotagesForHuman(appliedSabotages);
    setAttacksOnHuman(incomingAttacks);

    if (incomingAttacks.length > 0) {
      setGameState(STATES.IMPACT);
    } else {
      setGameState(STATES.QUESTION);
    }
  }, []);

  // ── IMPACT → 2s animation ended → Question screen ──
  const handleImpactComplete = useCallback(() => {
    setGameState(STATES.QUESTION);
  }, []);

  // ── QUESTION → aggiorna il punteggio totale ESATTAMENTE UNA VOLTA per round ──
  const handleRoundEnd = useCallback((results) => {
    // Evita doppie esecuzioni dovute a StrictMode o re-render
    if (roundCompletedRef.current[roundNum]) return;
    roundCompletedRef.current[roundNum] = true;

    setScores(prev => {
      const updated = { ...prev };
      Object.entries(results).forEach(([id, res]) => {
        updated[id] = (updated[id] || 0) + (res.score || 0);
      });
      return updated;
    });
    setLastRoundResults(results);

    setActiveSabotagesForHuman([]);
    setAttacksOnHuman([]);
    setBotSabotages({});

    setGameState(STATES.RESULT);
  }, [roundNum]);

  // ── RESULT → ogni round normale passa SEMPRE da CATEGORY_VOTE (dalla 1 alla 5) ──
  const handleNext = useCallback(() => {
    if (roundNum >= ROUNDS_PER_GAME) {
      // Dopo il Round 5: passa al Round Finale del Grattacielo
      setGameState(STATES.CLIMB_INTRO);
    } else {
      // Round 2, 3, 4, 5: passa SEMPRE per la scelta della categoria!
      setRoundNum(prev => prev + 1);
      setCurrentQuestion(null);
      setLastRoundResults(null);
      setActiveSabotagesForHuman([]);
      setAttacksOnHuman([]);
      setBotSabotages({});
      setGameState(STATES.VOTE);
    }
  }, [roundNum]);

  // ── CLIMB INTRO → Points converted to floors → Show Tower ──
  const handleClimbStart = useCallback((startingFloors) => {
    setPlayerFloors(startingFloors);
    setPreviousFloors(startingFloors);
    setClimbRound(1);
    setClimbAwards(null);
    setGameState(STATES.CLIMB_TOWER);
  }, []);

  // ── CLIMB TOWER → Riscossa degli Ultimi & Question setup ──
  const handleClimbReadyForQuestion = useCallback(({ underdogAttacks = [] }) => {
    // Pick an unused question from all questions pool, ensuring no duplicate appears
    const chosen = pickUniqueQuestion(usedQuestionIds);

    setUsedQuestionIds(prev => new Set(prev).add(chosen.id));
    setClimbCurrentQuestion(chosen);

    // Extract attacks targeting human vs bots
    const humanAttacks = underdogAttacks.filter(a => a.target?.id === 'human');
    const botAttacks = underdogAttacks.filter(a => a.target?.id !== 'human');

    if (humanAttacks.length > 0) {
      const sabsForHuman = humanAttacks.map(a => a.sabotage.id).slice(0, 2);
      const attacksForImpact = humanAttacks.map(a => ({
        attackerName: a.attacker.name,
        attackerAvatar: a.attacker.avatar,
        sabotageId: a.sabotage.id,
      }));

      setActiveSabotagesForHuman(sabsForHuman);
      setAttacksOnHuman(attacksForImpact);
    } else {
      setActiveSabotagesForHuman([]);
      setAttacksOnHuman([]);
    }

    // Bot sabotages
    const botSabs = {};
    botAttacks.forEach(a => {
      if (a.target?.id) {
        botSabs[a.target.id] = [...(botSabs[a.target.id] || []), a.sabotage.id];
      }
    });
    setBotSabotages(botSabs);

    if (humanAttacks.length > 0) {
      // Show 2-second comic impact animation against human before rapid question
      setGameState(STATES.CLIMB_IMPACT);
    } else {
      // Directly start rapid question (bots will have delay penalties active)
      setGameState(STATES.CLIMB_QUESTION);
    }
  }, [usedQuestionIds]);

  // ── CLIMB IMPACT → 2s animation ended → Rapid Question ──
  const handleClimbImpactComplete = useCallback(() => {
    setGameState(STATES.CLIMB_QUESTION);
  }, []);

  // ── CLIMB QUESTION END → Speed evaluation & floor rewards ──
  const handleClimbQuestionEnd = useCallback(({ fullResults, floorAwards }) => {
    setLastRapidResults(fullResults);
    setLastFloorAwards(floorAwards);

    // Compute updated floors
    setPreviousFloors(playerFloors);
    const updatedFloors = { ...playerFloors };
    players.forEach(p => {
      const award = floorAwards[p.id] || 0;
      updatedFloors[p.id] = (updatedFloors[p.id] || 1) + award;
    });
    setPlayerFloors(updatedFloors);
    setClimbAwards(floorAwards);

    setGameState(STATES.CLIMB_EVAL);
  }, [playerFloors, players]);

  // ── CLIMB EVAL PROCEED → Check for Winner or next Climb round ──
  const handleClimbEvalProceed = useCallback(() => {
    const hasWinner = Object.values(playerFloors).some(fl => fl >= 15);
    if (hasWinner) {
      setGameState(STATES.CLIMB_VICTORY);
    } else {
      setClimbRound(prev => prev + 1);
      setGameState(STATES.CLIMB_TOWER);
    }
  }, [playerFloors]);

  // ── RESTART → full reset ──
  const handleRestart = useCallback(() => {
    setGameState(STATES.HOME);
    setPlayers([]);
    setScores({});
    setRoundNum(1);
    roundCompletedRef.current = {};
    setCurrentQuestion(null);
    setLastRoundResults(null);
    setActiveSabotagesForHuman([]);
    setAttacksOnHuman([]);
    setBotSabotages({});
    setPlayerFloors({});
    setPreviousFloors({});
    setClimbRound(1);
    setClimbAwards(null);
    setUsedQuestionIds(new Set());
  }, []);

  const slideVariants = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit:    { x: '-100%', opacity: 0 },
  };

  return (
    <div
      className={`relative w-full h-[100dvh] overflow-hidden select-none ${isScreenShaking ? 'screen-shake' : ''}`}
      style={{ width: '100%', height: '100dvh', backgroundColor: '#00B8D4' }}
    >
      {/* ============================================================
          SFONDO DINAMICO GLOBALE 'SUNBURST POP-ART + RIFLETTORI'
          Sempre visibile dietro a TUTTE le schermate di gioco!
          ============================================================ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="popart-sunburst" />
        <div className="popart-halftone-overlay" />
        <div className="popart-vignette-overlay" />
        <div className="tv-spotlight-left" />
        <div className="tv-spotlight-right" />
      </div>

      {/* Always-visible Neo-Brutalist Mute/Unmute audio button */}
      <AudioControl />

      <div className="relative z-10 w-full h-full">
        <ErrorBoundary onReset={handleRestart}>
        <AnimatePresence mode="wait">
        {/* Normal Game Phases (Questions 1 - 5) */}
        {gameState === STATES.HOME && (

          <motion.div key="home" {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <HomeScreen onStart={handleStart} />
          </motion.div>
        )}

        {gameState === STATES.VOTE && (
          <motion.div key={`vote-${roundNum}`} {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <CategoryVote
              players={players}
              roundNum={roundNum}
              maxRounds={ROUNDS_PER_GAME}
              onVoteEnd={handleVoteEnd}
            />
          </motion.div>
        )}

        {gameState === STATES.SABOTAGE && (
          <motion.div key={`sab-${roundNum}`} {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <SabotageSelection
              players={players}
              roundNum={roundNum}
              onComplete={handleSabotageComplete}
            />
          </motion.div>
        )}

        {gameState === STATES.IMPACT && (
          <motion.div key={`impact-${roundNum}`} {...slideVariants} transition={{ type: 'tween', duration: 0.2 }}>
            <SabotageImpact
              attacks={attacksOnHuman}
              onComplete={handleImpactComplete}
            />
          </motion.div>
        )}

        {gameState === STATES.QUESTION && currentQuestion && (
          <motion.div key={`q-${roundNum}`} {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <QuestionScreen
              question={currentQuestion}
              players={players}
              onRoundEnd={handleRoundEnd}
              activeSabotages={activeSabotagesForHuman}
              botSabotages={botSabotages}
            />
          </motion.div>
        )}

        {gameState === STATES.RESULT && lastRoundResults && currentQuestion && (
          <motion.div key={`r-${roundNum}`} {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <RoundResult
              question={currentQuestion}
              roundResults={lastRoundResults}
              players={players}
              scores={scores}
              roundNum={roundNum}
              maxRounds={ROUNDS_PER_GAME}
              onNext={handleNext}
            />
          </motion.div>
        )}

        {/* ── FINALE: LA SCALATA DEL GRATTACIELO K.O. ── */}
        {gameState === STATES.CLIMB_INTRO && (
          <motion.div key="climb-intro" {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <ClimbIntro
              players={players}
              scores={scores}
              onStart={handleClimbStart}
            />
          </motion.div>
        )}

        {gameState === STATES.CLIMB_TOWER && (
          <motion.div key={`tower-${climbRound}`} {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <SkyscraperTower
              players={players}
              playerFloors={playerFloors}
              climbRound={climbRound}
              lastClimbAwards={climbAwards}
              onReadyForQuestion={handleClimbReadyForQuestion}
            />
          </motion.div>
        )}

        {gameState === STATES.CLIMB_IMPACT && (
          <motion.div key={`climb-impact-${climbRound}`} {...slideVariants} transition={{ type: 'tween', duration: 0.2 }}>
            <SabotageImpact
              attacks={attacksOnHuman}
              onComplete={handleClimbImpactComplete}
            />
          </motion.div>
        )}

        {gameState === STATES.CLIMB_QUESTION && climbCurrentQuestion && (
          <motion.div key={`climb-q-${climbRound}`} {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <RapidQuestionScreen
              question={climbCurrentQuestion}
              players={players}
              activeSabotages={activeSabotagesForHuman}
              botSabotages={botSabotages}
              climbRound={climbRound}
              onQuestionEnd={handleClimbQuestionEnd}
            />
          </motion.div>
        )}

        {gameState === STATES.CLIMB_EVAL && climbCurrentQuestion && lastRapidResults && (
          <motion.div key={`climb-eval-${climbRound}`} {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <ClimbEvaluation
              question={climbCurrentQuestion}
              fullResults={lastRapidResults}
              floorAwards={lastFloorAwards}
              oldFloors={previousFloors}
              newFloors={playerFloors}
              players={players}
              onProceed={handleClimbEvalProceed}
            />
          </motion.div>
        )}

        {gameState === STATES.CLIMB_VICTORY && (
          <motion.div key="climb-victory" {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <ClimbVictory
              players={players}
              finalFloors={playerFloors}
              onRestart={handleRestart}
            />
          </motion.div>
        )}

        {gameState === STATES.FINAL && (
          <motion.div key="final" {...slideVariants} transition={{ type: 'tween', duration: 0.3 }}>
            <FinalScreen
              players={players}
              scores={scores}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
        </AnimatePresence>
        </ErrorBoundary>
      </div>
    </div>
  );
}
