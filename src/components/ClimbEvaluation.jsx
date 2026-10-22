import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Zap, CheckCircle2, XCircle, ArrowUp } from 'lucide-react';
import { playSound } from '../utils/sound';
import { AvatarDisplay } from '../data/avatars';

export default function ClimbEvaluation({
  question,
  fullResults,
  floorAwards,
  oldFloors,
  newFloors,
  players,
  onProceed,
}) {
  const [showClimbedFloors, setShowClimbedFloors] = useState(false);

  // Check if anyone reached Floor 15
  const hasWinner = Object.values(newFloors).some(fl => fl >= 15);

  useEffect(() => {
    playSound('climb');
    const timer = setTimeout(() => {
      setShowClimbedFloors(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sort players by speed/awards: players with award > 0 first, then by timeTaken
  const sortedPlayers = [...players].sort((a, b) => {
    const awardA = floorAwards[a.id] || 0;
    const awardB = floorAwards[b.id] || 0;
    if (awardB !== awardA) return awardB - awardA;
    return (fullResults[a.id]?.timeTaken || 12) - (fullResults[b.id]?.timeTaken || 12);
  });

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3.5 py-3 select-none relative text-white bg-transparent">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span
            className="neo-card px-2.5 py-0.5 font-bangers text-xs tracking-wider"
            style={{ backgroundColor: '#FF2A85', color: '#fff', borderColor: '#000', borderWidth: 2, boxShadow: '2px 2px 0 #000' }}
          >
            ⚡ RISULTATI VELOCITÀ
          </span>
          <span
            className="font-bangers text-xl text-yellow-300"
            style={{ WebkitTextStroke: '1px #000', textShadow: '2px 2px 0 #000' }}
          >
            CHI HA SCALATO? 🏢
          </span>
        </div>

        {/* Correct Answer Badge */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="neo-card p-2.5 mb-2"
          style={{ backgroundColor: '#00FF66', borderColor: '#000', borderWidth: 3, boxShadow: '4px 4px 0 #000' }}
        >
          <span className="text-[10px] font-black text-black block tracking-wider" style={{ fontFamily: 'Fredoka' }}>
            ✅ RISPOSTA ESATTA:
          </span>
          <span
            className="font-bangers text-xl text-black block leading-tight mt-0.5"
            style={{ WebkitTextStroke: '0.5px #000' }}
          >
            {question.answers[question.correct]}
          </span>
        </motion.div>

        {/* Speed Rankings & Floor Awards */}
        <div className="flex flex-col gap-1.5 my-1">
          {sortedPlayers.map((p, idx) => {
            const res = fullResults[p.id];
            const award = floorAwards[p.id] || 0;
            const isHuman = !p.isBot;
            const isCorrect = res?.isCorrect;
            const timeTaken = res?.timeTaken ? res.timeTaken.toFixed(1) : '12.0';

            const rankColors = ['#FFD600', '#00E5FF', '#FF2A85', '#FFF'];

            return (
              <motion.div
                key={p.id}
                initial={{ x: idx % 2 === 0 ? -40 : 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.12 + idx * 0.08, type: 'spring' }}
                className={`neo-card p-2 flex items-center justify-between ${
                  isHuman ? 'ring-3 ring-yellow-400' : ''
                }`}
                style={{
                  backgroundColor: isHuman ? '#FFD600' : isCorrect ? '#FFFDF5' : '#FFE5EE',
                  borderColor: '#000',
                  borderWidth: 3,
                  boxShadow: '3px 3px 0 #000',
                }}
              >
                {/* Left: Avatar & speed info */}
                <div className="flex items-center gap-2">
                  <AvatarDisplay avatar={p.avatar} className="w-7 h-7 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bangers text-base leading-none text-black">
                        {p.name}
                      </span>
                      {isHuman && (
                        <span className="bg-red-500 text-white font-bangers text-[9px] px-1 rounded border border-black font-bold">
                          TU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-700 font-bold block" style={{ fontFamily: 'Fredoka' }}>
                      {isCorrect ? `Corretto in ${timeTaken}s` : 'Sbagliato / Fuori tempo'}
                    </span>
                  </div>
                </div>

                {/* Right: +Piani and floor change */}
                <div className="text-right flex items-center gap-2">
                  {award > 0 ? (
                    <div
                      className="neo-card px-2 py-0.5 font-bangers text-xs"
                      style={{
                        backgroundColor: rankColors[idx] || '#FFD600',
                        color: '#000',
                        borderWidth: 2,
                        borderColor: '#000',
                        boxShadow: '2px 2px 0 #000',
                      }}
                    >
                      +{award} PIANI! 🚀
                    </div>
                  ) : (
                    <span className="font-bangers text-xs text-gray-500">
                      FERMO (0)
                    </span>
                  )}

                  {/* Floor Transition */}
                  <div className="font-bangers text-sm leading-none min-w-[55px] text-right text-black font-bold">
                    <span className="text-gray-500 text-xs">P{oldFloors[p.id]}</span>
                    <span className="text-red-500 mx-0.5">→</span>
                    <motion.span
                      animate={{ scale: showClimbedFloors && award > 0 ? [1, 1.3, 1] : 1 }}
                      className="text-black text-base font-black"
                    >
                      P{newFloors[p.id]}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onProceed}
        className="neo-btn w-full py-3.5 font-bangers text-xl tracking-wider flex items-center justify-center gap-2 mt-2 border-4 border-black shadow-[4px_4px_0px_#000]"
        style={{
          backgroundColor: hasWinner ? '#00FF66' : '#FFD600',
          color: '#000',
          borderColor: '#000',
        }}
      >
        {hasWinner ? (
          <>
            <Trophy size={22} strokeWidth={3} />
            <span>CAMPIONE AL PIANO 15! AL PODIO! 🏆</span>
          </>
        ) : (
          <>
            <span>CONTINUA LA SCALATA!</span>
            <ArrowRight size={20} strokeWidth={3} />
          </>
        )}
      </motion.button>
    </div>
  );
}
