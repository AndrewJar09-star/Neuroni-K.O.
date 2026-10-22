import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Zap, Sparkles, Award, Flame, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playVictory, playPop, vibrateShort } from '../utils/soundEffects';
import { AvatarDisplay } from '../data/avatars';

export default function ClimbVictory({
  players,
  finalFloors,
  onRestart,
}) {
  // Sort players by final floor descending
  const ranked = useMemo(() => {
    return [...players].sort((a, b) => (finalFloors[b.id] || 0) - (finalFloors[a.id] || 0));
  }, [players, finalFloors]);

  const winner = ranked[0];
  const human = players.find(p => !p.isBot);
  const isHumanWinner = winner.id === human.id;

  // Shoot confetti bursts on mount
  useEffect(() => {
    playVictory();


    const shootConfetti = () => {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD600', '#FF2A85', '#00E5FF', '#00FF87', '#FFFFFF'],
      });
    };

    shootConfetti();
    const t1 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD600', '#FF2A85', '#00E5FF'],
      });
    }, 400);

    const t2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00FF87', '#FFD600', '#FFFFFF'],
      });
    }, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const rankBadges = ['🥇 1° POSTO', '🥈 2° POSTO', '🥉 3° POSTO', '4° POSTO'];
  const rankColors = ['#FFD600', '#C0C0C0', '#CD7F32', '#777'];

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3.5 py-3 select-none relative text-white bg-transparent">
      {/* Top Victory Wordmark */}
      <div className="text-center relative z-10 shrink-0">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
        >
          <span
            className="onomatopoeia font-bangers text-5xl tracking-widest block text-yellow-300"
            style={{
              WebkitTextStroke: '2px #000',
              textShadow: '4px 4px 0 #000',
              lineHeight: 1,
            }}
          >
            VITTORIA K.O.!
          </span>
        </motion.div>

        <p className="font-bangers text-sm text-white tracking-wider mt-0.5" style={{ textShadow: '1px 1px 0 #000' }}>
          {isHumanWinner ? '🏆 SEI IL CAMPIONE DEI NEURONI! 🏆' : `👑 ${winner.name.toUpperCase()} HA CONQUISTATO IL TETTO!`}
        </p>
      </div>

      {/* Winner Showcase & Championship Belt */}
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 280 }}
        className="neo-card p-2.5 my-1 text-center relative z-10 flex flex-col items-center"
        style={{
          backgroundColor: '#FFD600',
          borderColor: '#000',
          borderWidth: 4,
          boxShadow: '6px 6px 0 #000',
        }}
      >
        {/* Crown Icon */}
        <motion.div
          animate={{ y: [-3, 3, -3], rotate: [-4, 4, -4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-yellow-600"
        >
          <Crown size={28} fill="#FFD600" stroke="#000" strokeWidth={2.5} />
        </motion.div>

        {/* Winner Avatar */}
        <div className="w-16 h-16 my-1 mx-auto flex items-center justify-center filter drop-shadow">
          <AvatarDisplay avatar={winner.avatar} className="w-full h-full" />
        </div>

        {/* Winner Name */}
        <h2
          className="font-bangers text-3xl text-black leading-none"
          style={{ textShadow: '1.5px 1.5px 0 #fff' }}
        >
          {winner.name}
        </h2>

        {/* Final Floor Reached Badge */}
        <div className="bg-black text-yellow-400 font-bangers text-xs px-2.5 py-0.5 rounded-full border-2 border-black mt-1 shadow flex items-center gap-1">
          <Zap size={12} fill="#FFD600" />
          <span>RAGGIUNTO IL PIANO {finalFloors[winner.id]}!</span>
        </div>

        {/* CINTURA DI CAMPIONE 'NEURONI K.O.!' */}
        <div className="w-full mt-2 pt-1.5 border-t-2 border-black flex flex-col items-center">
          <div
            className="neo-card px-3 py-1 w-full max-w-[260px] flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#111',
              borderColor: '#000',
              borderWidth: 2,
              boxShadow: '2px 2px 0 #000',
            }}
          >
            <Trophy size={16} color="#FFD600" fill="#FFD600" />
            <span
              className="font-bangers text-base tracking-wider text-yellow-400"
              style={{ textShadow: '1px 1px 0 #000' }}
            >
              CINTURA 'NEURONI K.O.!' 🥊
            </span>
          </div>
        </div>
      </motion.div>

      {/* Full Leaderboard / Final Floors */}
      <div className="relative z-10 flex flex-col gap-1 my-1">
        <span className="font-bangers text-xs tracking-wider text-black ml-1 font-bold">
          CLASSIFICA FINALE DEL GRATTACIELO:
        </span>
        {ranked.map((p, idx) => {
          const isHuman = !p.isBot;
          const floor = finalFloors[p.id] || 1;

          return (
            <motion.div
              key={p.id}
              initial={{ x: idx % 2 === 0 ? -40 : 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 + idx * 0.08 }}
              className={`neo-card px-2.5 py-1 flex items-center justify-between ${
                isHuman ? 'ring-3 ring-yellow-400' : ''
              }`}
              style={{
                backgroundColor: idx === 0 ? '#FFD600' : '#FFFDF5',
                borderColor: '#000',
                borderWidth: 2,
                boxShadow: '2px 2px 0 #000',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-bangers text-xs text-black font-bold">
                  {rankBadges[idx]}
                </span>
                <AvatarDisplay avatar={p.avatar} className="w-5 h-5 flex-shrink-0" />
                <span className="font-bangers text-sm text-black font-bold">
                  {p.name}
                  {isHuman && <span className="text-red-600 text-xs ml-1">(TU)</span>}
                </span>
              </div>

              <div className="font-bangers text-sm text-black font-bold">
                PIANO {floor}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Play Again (Rigioca) Button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playPop();
          vibrateShort();
          onRestart();
        }}
        className="neo-btn w-full py-3 font-bangers text-2xl tracking-widest flex items-center justify-center gap-2 z-10 border-4 border-black shadow-[4px_4px_0px_#000]"
        style={{
          backgroundColor: '#FF2A85',
          color: '#fff',
          borderColor: '#000',
        }}
      >
        <RotateCcw size={22} strokeWidth={3} />
        <span>RIGIOCA! 🔄</span>
      </motion.button>
    </div>
  );
}
