import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy } from 'lucide-react';
import { AvatarDisplay } from '../data/avatars';

const RANK_COLORS = ['#FFD600', '#C0C0C0', '#CD7F32', '#888'];
const RANK_EMOJIS = ['🥇', '🥈', '🥉', '4️⃣'];

export default function FinalScreen({ players, scores, onRestart }) {
  const ranked = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  const winner = ranked[0];
  const human = players.find(p => !p.isBot);
  const humanRank = ranked.findIndex(p => p.id === human.id) + 1;

  const messages = {
    1: ['NEURONI IMBATTIBILI! 🧠', '#FFD600'],
    2: ['QUASI QUASI! Allenati ancora! 💪', '#00E5FF'],
    3: ['Terzo posto... ma ci hai messo il cuore! ❤️', '#FF2A85'],
    4: ['K.O. TOTALE! 😵 Riprova!', '#8A2BE2'],
  };

  const [msg, color] = messages[humanRank] || messages[4];

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col items-center justify-between px-3.5 py-3 select-none relative text-white bg-transparent">
      {/* Title */}
      <div className="text-center shrink-0">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 250 }}
          className="font-bangers text-5xl tracking-widest text-yellow-300"
          style={{ textShadow: '4px 4px 0 #000', WebkitTextStroke: '2px #000' }}
        >
          FINE PARTITA!
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-bangers text-xl mt-0.5 text-white"
          style={{ textShadow: '2px 2px 0 #000' }}
        >
          {msg}
        </motion.p>
      </div>

      {/* Winner showcase */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
        className="neo-card px-4 py-2.5 text-center w-full my-1"
        style={{
          backgroundColor: '#FFD600',
          borderColor: '#000',
          borderWidth: 4,
          boxShadow: '5px 5px 0 #000',
        }}
      >
        <Trophy size={28} color="#000" strokeWidth={2.5} className="mx-auto" />
        <div className="w-14 h-14 my-1 mx-auto flex items-center justify-center filter drop-shadow">
          <AvatarDisplay avatar={winner.avatar} className="w-full h-full" />
        </div>
        <p className="font-bangers text-2xl text-black leading-none" style={{ textShadow: '1px 1px 0 #fff' }}>
          {winner.name}
        </p>
        <p className="font-bangers text-3xl mt-0.5 text-black leading-none">
          {scores[winner.id] || 0} PTS
        </p>
      </motion.div>

      {/* Full leaderboard */}
      <div className="w-full flex flex-col gap-1.5 my-1">
        <h3 className="font-bangers text-xs tracking-wider text-black ml-1 font-bold">
          📋 CLASSIFICA FINALE DEI PUNTEGGI
        </h3>
        {ranked.map((p, i) => {
          const isHuman = !p.isBot;
          return (
            <motion.div
              key={p.id}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.08, type: 'spring' }}
              className="neo-card flex items-center justify-between px-3 py-1.5"
              style={{
                backgroundColor: i === 0 ? '#FFD600' : '#FFFDF5',
                borderColor: '#000',
                borderWidth: 2,
                boxShadow: '2px 2px 0 #000',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{RANK_EMOJIS[i]}</span>
                <AvatarDisplay avatar={p.avatar} className="w-6 h-6 flex-shrink-0" />
                <div>
                  <span className="font-bangers text-sm text-black font-bold">
                    {p.name}
                  </span>
                  {isHuman && (
                    <span className="font-bangers text-[10px] ml-1 text-red-600 font-bold">★ TU!</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="font-bangers text-xl block text-black font-bold leading-none">
                  {scores[p.id] || 0}
                </span>
                <span className="text-[10px] text-gray-700 font-bold block" style={{ fontFamily: 'Fredoka' }}>pt</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Restart button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="neo-btn w-full py-3.5 font-bangers text-2xl tracking-widest mt-1 border-4 border-black shadow-[4px_4px_0px_#000]"
        style={{ backgroundColor: '#FF2A85', color: '#fff', borderColor: '#000' }}
      >
        <RotateCcw className="inline mr-2" size={24} strokeWidth={3} />
        RIVINCITA!
      </motion.button>
    </div>
  );
}
