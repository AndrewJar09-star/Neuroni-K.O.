import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowUpRight, Zap, Target, Flame } from 'lucide-react';
import { playSound } from '../utils/sound';
import { AvatarDisplay } from '../data/avatars';

export default function ClimbIntro({ players, scores, onStart }) {
  const [showFloors, setShowFloors] = useState(false);

  // Unique scores sorted descending for ex-aequo tiers
  const uniqueScores = [...new Set(players.map(p => scores[p.id] || 0))].sort((a, b) => b - a);

  // Determine starting floors based on score tiers:
  // uniqueScores[0] (1° punteggio più alto) -> Piano 4
  // uniqueScores[1] (2° punteggio) -> Piano 3 (se a pari merito partono ENTRAMBI dal Piano 3!)
  // uniqueScores[2] (3° punteggio) -> Piano 2
  // uniqueScores[3] (4° punteggio) -> Piano 1
  const startingFloors = {};
  players.forEach(p => {
    const pScore = scores[p.id] || 0;
    const tierIndex = uniqueScores.indexOf(pScore);
    startingFloors[p.id] = Math.max(1, 4 - tierIndex);
  });

  // Sort players by score descending for leaderboard display
  const ranked = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));

  useEffect(() => {
    playSound('fanfare');
    const timer = setTimeout(() => {
      setShowFloors(true);
      playSound('climb');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleProceed = () => {
    playSound('pop');
    onStart(startingFloors);
  };

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3.5 py-3 select-none relative text-white bg-transparent">
      {/* Top Banner */}
      <div className="relative z-10 text-center shrink-0">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="mb-0.5"
        >
          <span
            className="font-bangers text-2xl tracking-widest inline-block px-3 py-0.5 neo-card"
            style={{
              backgroundColor: '#FF2A85',
              color: '#FFF',
              borderWidth: 2,
              borderColor: '#000',
              boxShadow: '3px 3px 0 #000',
            }}
          >
            🔥 ROUND FINALE K.O.!
          </span>
        </motion.div>

        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring' }}
          className="font-bangers text-3xl leading-tight text-yellow-300 tracking-wider mt-1"
          style={{
            WebkitTextStroke: '1.5px #000',
            textShadow: '3px 3px 0 #000',
          }}
        >
          LA SCALATA DEL GRATTACIELO 🏢
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-white font-bangers text-sm tracking-wide"
          style={{ textShadow: '1px 1px 0 #000' }}
        >
          I tuoi punti decidono da quale piano inizi a scalare!
        </motion.p>
      </div>

      {/* Conversione Punti in Piani */}
      <div className="relative z-10 flex flex-col gap-1.5 my-1.5">
        {ranked.map((p, idx) => {
          const isHuman = !p.isBot;
          const assignedFloor = startingFloors[p.id];
          const rankColors = ['#FFD600', '#00E5FF', '#FF2A85', '#00FF66'];

          return (
            <motion.div
              key={p.id}
              initial={{ x: idx % 2 === 0 ? -80 : 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + idx * 0.08, type: 'spring', stiffness: 260 }}
              className={`neo-card p-2 flex items-center justify-between relative ${
                isHuman ? 'ring-4 ring-yellow-400' : ''
              }`}
              style={{
                backgroundColor: isHuman ? '#FFD600' : '#FFFDF5',
                borderColor: '#000',
                borderWidth: 3,
                boxShadow: '3px 3px 0 #000',
              }}
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-center gap-2">
                <AvatarDisplay avatar={p.avatar} className="w-8 h-8 flex-shrink-0 filter drop-shadow" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bangers text-base leading-none text-black">
                      {p.name}
                    </span>
                    {isHuman && (
                      <span className="bg-red-500 text-white font-bangers text-[9px] px-1 py-0.2 rounded border border-black font-bold">
                        TU
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-700 font-bold block" style={{ fontFamily: 'Fredoka' }}>
                    {scores[p.id] || 0} punti accumulati
                  </span>
                </div>
              </div>

              {/* Right: Assigned Floor Conversion */}
              <div>
                {!showFloors ? (
                  <span className="font-bangers text-sm text-gray-600 animate-pulse">
                    CALCOLO...
                  </span>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: 15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                    className="neo-card px-2.5 py-0.5 text-center"
                    style={{
                      backgroundColor: rankColors[idx],
                      color: '#000',
                      borderColor: '#000',
                      borderWidth: 2,
                      boxShadow: '2px 2px 0 #000',
                    }}
                  >
                    <span className="font-bangers text-[9px] tracking-wider block leading-none">
                      INIZIA AL
                    </span>
                    <span className="font-bangers text-lg leading-none">
                      PIANO {assignedFloor}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rules Mini-Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="neo-card p-2 relative z-10 bg-[#FFFDF5] text-black border-3 border-black shadow-[3px_3px_0px_#000]"
      >
        <div className="font-bangers text-xs text-black tracking-wider mb-0.5 flex items-center gap-1">
          <Zap size={14} className="text-yellow-500" /> REGOLE DELLA SCALATA:
        </div>
        <ul className="text-[10px] text-gray-800 space-y-0.5 font-bold" style={{ fontFamily: 'Fredoka' }}>
          <li>• <span className="text-emerald-700 font-bold">Quiz a raffica (12s)</span>: 1° veloce <span className="bg-yellow-300 px-1 rounded border border-black">+3 piani</span>, 2° <span className="bg-cyan-300 px-1 rounded border border-black">+2</span>, 3° <span className="bg-pink-300 px-1 rounded border border-black">+1</span>.</li>
          <li>• <span className="text-rose-600 font-bold">Riscossa degli Ultimi</span>: sabotaggi automatici contro chi è in testa!</li>
          <li>• Il primo che conquista il <span className="text-yellow-600 font-black">Piano 15</span> vince la partita! 🏆</li>
        </ul>
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleProceed}
        className="neo-btn w-full py-3 font-bangers text-2xl tracking-widest flex items-center justify-center gap-2 z-10 border-4 border-black shadow-[4px_4px_0px_#000]"
        style={{
          backgroundColor: '#FFD600',
          color: '#000',
          borderColor: '#000',
        }}
      >
        <span>🏢 SCALA IL GRATTACIELO!</span>
        <ArrowUpRight size={24} strokeWidth={3} />
      </motion.button>
    </div>
  );
}
