import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star } from 'lucide-react';
import { CATEGORY_META } from '../data/gameData';
import { playPop, playTick, playCorrect, vibrateShort } from '../utils/soundEffects';
import { AvatarDisplay } from '../data/avatars';

const VOTE_TIME = 10;

export default function CategoryVote({ players, onVoteEnd, roundNum = 1, maxRounds = 5 }) {
  // Seleziona esattamente 3 categorie casuali all'inizio di ogni turno
  const [categories] = useState(() => {
    const all = Object.keys(CATEGORY_META);
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const [timeLeft, setTimeLeft] = useState(VOTE_TIME);
  const [playerVote, setPlayerVote] = useState(null);
  const [botVotes, setBotVotes] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState(null);

  // Bot voting (scelgono solo tra le 3 categorie selezionate)
  useEffect(() => {
    const bots = players.filter(p => p.isBot);
    const timeouts = bots.map(bot =>
      setTimeout(() => {
        const pick = categories[Math.floor(Math.random() * categories.length)];
        setBotVotes(prev => ({ ...prev, [bot.id]: pick }));
      }, 800 + Math.random() * 4500)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [categories, players]);

  // Timer countdown with tick in last 5 seconds
  useEffect(() => {
    if (showResult) return;
    if (timeLeft <= 0) {
      finalizeVote();
      return;
    }
    const t = setTimeout(() => {
      if (timeLeft <= 5 && timeLeft > 1) {
        playTick();
      }
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showResult]);

  // Se tutti i giocatori (umano + bot) hanno votato, finalizza dopo breve suspense
  useEffect(() => {
    if (showResult) return;
    const bots = players.filter(p => p.isBot);
    const allBotsVoted = bots.every(b => botVotes[b.id]);
    const humanVoted = playerVote !== null;

    if (humanVoted && allBotsVoted) {
      const timer = setTimeout(() => {
        finalizeVote();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [playerVote, botVotes, showResult, players]);

  const handleVote = (cat) => {
    if (playerVote || showResult) return;
    playPop();
    vibrateShort();
    setPlayerVote(cat);
  };

  const finalizeVote = () => {
    if (showResult) return;
    const allVotes = { ...botVotes };
    const humanPlayer = players.find(p => !p.isBot);
    if (playerVote && humanPlayer) allVotes[humanPlayer.id] = playerVote;
    
    // Tally votes
    const tally = {};
    categories.forEach(c => { tally[c] = 0; });
    Object.values(allVotes).forEach(v => {
      if (tally[v] !== undefined) {
        tally[v] = (tally[v] || 0) + 1;
      }
    });
    
    // Find winner
    const maxVotes = Math.max(...Object.values(tally));
    const tied = categories.filter(c => (tally[c] || 0) === maxVotes);
    const chosenCat = tied[Math.floor(Math.random() * tied.length)];
    
    setWinner({ category: chosenCat, tally, wasTied: tied.length > 1 });
    setShowResult(true);
    playCorrect();
    vibrateShort();
  };

  // Auto-advance after showing result
  useEffect(() => {
    if (!showResult || !winner) return;
    const t = setTimeout(() => onVoteEnd(winner.category), 2600);
    return () => clearTimeout(t);
  }, [showResult, winner, onVoteEnd]);

  const timerPct = (timeLeft / VOTE_TIME) * 100;

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3.5 py-3 select-none relative text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div>
          <span
            className="neo-card px-2.5 py-0.5 font-bangers text-xs tracking-wider inline-block mb-1 shadow-[3px_3px_0px_#000] border-2 border-black"
            style={{ backgroundColor: '#FFD600', color: '#000' }}
          >
            ROUND {roundNum} DI {maxRounds}
          </span>
          <h2 className="font-bangers text-2xl sm:text-3xl tracking-wider text-white" style={{ textShadow: '3px 3px 0 #000' }}>
            VOTA LA CATEGORIA!
          </h2>
        </div>
        {!showResult && (
          <div
            className="flex items-center gap-1.5 neo-card px-3 py-1 shadow-[4px_4px_0px_#000] border-3 border-black"
            style={{ backgroundColor: timeLeft <= 3 ? '#FF2A85' : '#FFFFFF', color: timeLeft <= 3 ? '#fff' : '#000' }}
          >
            <Clock size={16} color={timeLeft <= 3 ? '#fff' : '#000'} strokeWidth={3} />
            <span className="font-bangers text-2xl leading-none" style={{ color: timeLeft <= 3 ? '#fff' : '#000' }}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Timer bar */}
      {!showResult && (
        <div className="w-full h-4 rounded-full mb-3 overflow-hidden border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex-shrink-0">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#FFD600] via-[#FF8800] to-[#FF2A85]"
            style={{ width: `${timerPct}%` }}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      )}

      {/* Category cards */}
      <div className="flex flex-col gap-3 sm:gap-4 flex-1">
        {categories.map((cat, i) => {
          const meta = CATEGORY_META[cat];
          const voted = playerVote === cat;
          const isWinner = showResult && winner?.category === cat;
          const voteCount = showResult
            ? Object.values({ ...botVotes, ...(playerVote ? { human: playerVote } : {}) }).filter(v => v === cat).length
            : null;

          return (
            <motion.button
              key={cat}
              initial={{ x: i % 2 === 0 ? -80 : 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
              onClick={() => handleVote(cat)}
              className={`neo-btn w-full py-3.5 sm:py-4 px-4 flex items-center justify-between ${voted ? 'ring-4 ring-white' : ''}`}
              style={{
                backgroundColor: isWinner ? '#00FF87' : meta.color,
                color: isWinner ? '#000' : (meta.color === '#FFD600' ? '#000' : '#000'),
                transform: voted ? 'translate(5px, 5px)' : 'translate(0,0)',
                boxShadow: voted ? 'none' : '6px 6px 0px 0px rgba(0,0,0,1)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{meta.emoji}</span>
                <span className="font-bangers text-xl sm:text-2xl tracking-wide text-left">{cat}</span>
              </div>
              {showResult && (
                <div className="flex items-center gap-1">
                  {[...Array(voteCount)].map((_, j) => (
                    <Star key={j} size={20} fill="black" color="black" />
                  ))}
                  {isWinner && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="font-bangers text-xl ml-2"
                    >
                      WIN!
                    </motion.span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Result overlay */}
      <AnimatePresence>
        {showResult && winner && (
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          >
            <div className="neo-card px-8 py-6 text-center" style={{ backgroundColor: '#FF2A85', maxWidth: 320 }}>
              {winner.wasTied && (
                <p className="font-bangers text-lg" style={{ color: '#FFD600' }}>PAREGGIO! ESTRAZIONE... 🎲</p>
              )}
              <p className="font-bangers text-3xl mt-2" style={{ color: '#fff', textShadow: '3px 3px 0 #000' }}>
                CATEGORIA SCELTA:
              </p>
              <p className="font-bangers text-4xl mt-1" style={{ color: '#FFD600', textShadow: '3px 3px 0 #000' }}>
                {CATEGORY_META[winner.category].emoji} {winner.category}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player votes shown during vote */}
      <div className="mt-2.5 flex gap-2 flex-wrap justify-center">
        {players.map(p => {
          const pVote = p.isBot ? botVotes[p.id] : playerVote;
          return (
            <div
              key={p.id}
              className="flex items-center gap-1.5 bg-white border-2 border-black rounded-full px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black"
            >
              <AvatarDisplay avatar={p.avatar} className="w-5 h-5 flex-shrink-0" />
              <span className="font-extrabold text-xs text-black">{p.name}</span>
              {pVote ? (
                <span className="font-bangers text-xs bg-yellow-300 px-1.5 py-0.5 rounded-full border border-black text-black">
                  {CATEGORY_META[pVote]?.emoji}
                </span>
              ) : (
                <span className="text-xs">🤔</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
