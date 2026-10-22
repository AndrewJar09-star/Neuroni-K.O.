import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Crown } from 'lucide-react';
import { playCorrect, playWrong, playPop, vibrateShort, vibrateHeavy, triggerScreenShake } from '../utils/soundEffects';
import { AvatarDisplay } from '../data/avatars';

const RANK_COLORS = ['#FFD600', '#C0C0C0', '#CD7F32', '#888'];
const RANK_EMOJIS = ['🥇', '🥈', '🥉', '4️⃣'];

export default function RoundResult({ question, roundResults, players, scores, roundNum, maxRounds, onNext }) {
  const [showOnomatopoeia, setShowOnomatopoeia] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const human = players.find(p => !p.isBot);
  const humanResult = roundResults[human.id];
  const isCorrect = humanResult?.isCorrect;

  useEffect(() => {
    if (isCorrect) {
      playCorrect();
      vibrateShort();
    } else {
      playWrong();
      triggerScreenShake();
      vibrateHeavy();
    }
    const t1 = setTimeout(() => setShowOnomatopoeia(false), 1800);
    const t2 = setTimeout(() => setShowLeaderboard(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);


  // Ordina per punteggio totale: 'scores' contiene già la somma matematica esatta aggiornata di tutti i turni
  const ranked = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3.5 py-3 select-none relative text-white">

      {/* Onomatopoeia overlay */}
      <AnimatePresence>
        {showOnomatopoeia && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1.1, rotate: 5 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute inset-0 z-30 flex items-center justify-center"
            style={{ backgroundColor: isCorrect ? 'rgba(0,255,135,0.92)' : 'rgba(255,42,133,0.92)' }}
          >
            <div className="text-center">
              <div
                className="onomatopoeia font-bangers"
                style={{
                  fontSize: '5rem',
                  color: '#fff',
                  lineHeight: 1,
                  WebkitTextStroke: '3px #000',
                }}
              >
                {isCorrect ? 'BOOM!' : 'K.O.!'}
              </div>
              <div
                className="onomatopoeia font-bangers mt-2"
                style={{
                  fontSize: '2.2rem',
                  color: '#FFD600',
                  WebkitTextStroke: '2px #000',
                }}
              >
                {isCorrect ? 'ESATTO! 🎉' : 'SBAGLIATO! 💀'}
              </div>
              {isCorrect && humanResult?.score !== undefined && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-bangers text-3xl mt-2"
                  style={{ color: '#000' }}
                >
                  +{humanResult.score} PUNTI ⚡
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <h2 className="font-bangers text-2xl tracking-wider text-[#FFD600]" style={{ textShadow: '2.5px 2.5px 0 #000' }}>
            <Trophy size={20} className="inline mr-1" />
            TURNO {roundNum}/{maxRounds}
          </h2>
          <span className="neo-card px-2.5 py-0.5 font-bangers text-xs bg-[#FFD600] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            {question.emoji} {question.category}
          </span>
        </div>

        {/* Correct answer reveal */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="neo-card px-3.5 py-2 mb-2 flex-shrink-0 shadow-[4px_4px_0px_#000]"
          style={{ backgroundColor: '#00FF87', borderColor: '#000' }}
        >
          <p className="text-xs font-bold text-black uppercase tracking-wider" style={{ fontFamily: 'Fredoka' }}>✅ RISPOSTA ESATTA:</p>
          <p className="font-bold text-base leading-snug text-black" style={{ fontFamily: 'Fredoka', fontWeight: 700 }}>
            {question.answers[question.correct]}
          </p>
        </motion.div>

        {/* Who answered what */}
        <div className="flex flex-col gap-1.5 mb-2 flex-shrink-0">
          {players.map((p) => {
            const res = roundResults[p.id];
            const ansText = res?.answer >= 0 ? question.answers[res.answer] : 'Tempo scaduto';
            const timeText = res?.timeTaken && res?.timeTaken < 15 ? `${res.timeTaken}s` : null;
            const pts = res?.score || 0;

            return (
              <motion.div
                key={p.id}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + players.indexOf(p) * 0.08 }}
                className="neo-card flex items-center justify-between px-2.5 py-1.5 shadow-[3px_3px_0px_#000]"
                style={{
                  backgroundColor: res?.isCorrect ? '#E6FFF0' : '#FFF0F5',
                  borderColor: '#000',
                  borderWidth: 3,
                }}
              >
                <div className="flex items-center gap-2">
                  <AvatarDisplay avatar={p.avatar} className="w-7 h-7 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm block text-black">{p.name}</span>
                      {timeText && (
                        <span className="font-bangers text-[10px] px-1 py-0.2 rounded bg-black text-[#00E5FF]">
                          ⚡ {timeText}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-black truncate max-w-[180px] block">{ansText}</span>
                  </div>
                </div>
                <div className="text-right">
                  {res?.isCorrect && pts > 0 ? (
                    <span
                      className="neo-card px-2 py-0.5 font-bangers text-base tracking-wider inline-block shadow-[2px_2px_0px_#000]"
                      style={{ backgroundColor: '#00FF66', color: '#000', borderColor: '#000', borderWidth: 2 }}
                    >
                      +{pts}
                    </span>
                  ) : (
                    <span
                      className="neo-card px-2 py-0.5 font-bangers text-base tracking-wider inline-block shadow-[2px_2px_0px_#000]"
                      style={{ backgroundColor: '#FF2A85', color: '#fff', borderColor: '#000', borderWidth: 2 }}
                    >
                      +0
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex-shrink-0 mb-1"
            >
              <h3 className="font-bangers text-base sm:text-lg tracking-wider mb-1 text-[#FFD600]" style={{ textShadow: '2px 2px 0 #000' }}>
                🏆 CLASSIFICA TOTALE
              </h3>
              <div className="flex flex-col gap-1.5">
                {ranked.map((p, i) => {
                  const isHuman = !p.isBot;
                  const rowBgs = ['#FFD600', '#FFFFFF', '#00E5FF', '#FF2A85'];
                  const rowText = ['#000', '#000', '#000', '#FFF'];
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="neo-card flex items-center justify-between px-2.5 py-1 rounded-xl shadow-[3px_3px_0px_#000]"
                      style={{
                        backgroundColor: rowBgs[i] || '#FFF',
                        borderColor: '#000',
                        borderWidth: 3,
                        color: rowText[i] || '#000',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{RANK_EMOJIS[i]}</span>
                        <AvatarDisplay avatar={p.avatar} className="w-7 h-7 flex-shrink-0" />
                        <span className="font-bold text-xs sm:text-sm">
                          {p.name}
                          {isHuman && <span className="font-bangers text-xs ml-1 bg-black text-[#FFD600] px-1 rounded">(TU)</span>}
                        </span>
                      </div>
                      <span className="font-bangers text-xl">
                        {scores[p.id] || 0} PTS
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next button */}
      {showLeaderboard && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            playPop();
            vibrateShort();
            onNext();
          }}
          className="neo-btn w-full py-4 mt-5 font-bangers text-2xl tracking-widest"
          style={{ backgroundColor: '#FFD600', color: '#000' }}
        >
          {roundNum >= maxRounds ? '🏢 VAI AL GRATTACIELO FINALE!' : 'PROSSIMA DOMANDA →'}
          <ArrowRight className="inline ml-2" size={24} strokeWidth={3} />
        </motion.button>
      )}

    </div>
  );
}
