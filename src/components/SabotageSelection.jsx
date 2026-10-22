import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Target, CheckCircle2, Skull } from 'lucide-react';
import { SABOTAGES } from '../data/gameData';
import { playSound } from '../utils/sound';
import { AvatarDisplay } from '../data/avatars';

const SABOTAGE_TIME = 8;

export default function SabotageSelection({ players, roundNum, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(SABOTAGE_TIME);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [botStatus, setBotStatus] = useState({});

  const human = useMemo(() => players.find(p => !p.isBot) || players[0], [players]);
  const bots = useMemo(() => players.filter(p => p.isBot), [players]);

  // Pick 2 random sabotages for the human player
  const offeredSabotages = useMemo(() => {
    const shuffled = [...SABOTAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, []);

  const [selectedSabotage, setSelectedSabotage] = useState(offeredSabotages[0]?.id || 'cake');
  const [selectedTarget, setSelectedTarget] = useState(bots[0]?.id || '');

  // Pre-roll bot actions (each picks 1 sabotage and 1 target)
  const botDecisionsRef = useRef(null);
  if (!botDecisionsRef.current) {
    botDecisionsRef.current = bots.map(bot => {
      const randomSabotage = SABOTAGES[Math.floor(Math.random() * SABOTAGES.length)];
      // Can target human or another bot (exclude self)
      const possibleTargets = players.filter(p => p.id !== bot.id);
      const chosenTarget = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
      return {
        attackerId: bot.id,
        attackerName: bot.name,
        attackerAvatar: bot.avatar,
        sabotageId: randomSabotage.id,
        targetId: chosenTarget.id,
      };
    });
  }

  // Simulate bots making their decision with slight delay
  useEffect(() => {
    const timeouts = bots.map((bot, i) => {
      const delay = 1000 + i * 1400 + Math.random() * 1000;
      return setTimeout(() => {
        setBotStatus(prev => ({ ...prev, [bot.id]: true }));
      }, delay);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [bots]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalize();
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev <= 4) {
          playSound('tick');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleFinalize = () => {
    const humanAttack = {
      attackerId: human.id,
      attackerName: human.name,
      attackerAvatar: human.avatar,
      sabotageId: selectedSabotage,
      targetId: selectedTarget,
    };

    const allBotAttacks = botDecisionsRef.current || [];
    const allAttacks = [humanAttack, ...allBotAttacks];

    // Filter attacks that targeted the human player
    const attacksOnHuman = allBotAttacks
      .filter(atk => atk.targetId === human.id)
      .slice(0, 2); // Apply up to 2 simultaneous sabotages as specified

    onComplete({
      attacksOnHuman,
      humanAttack,
      allAttacks,
    });
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    playSound('pop');
  };

  const timerPct = (timeLeft / SABOTAGE_TIME) * 100;
  const timerColor = timeLeft <= 3 ? '#FF2A85' : timeLeft <= 5 ? '#FFD600' : '#00E5FF';

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3.5 py-3 select-none relative text-white">
      {/* Top Header */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="neo-card px-2.5 py-0.5 font-bangers text-xs sm:text-sm tracking-wider shadow-[3px_3px_0px_#000] border-3 border-black"
              style={{ backgroundColor: '#FF2A85', color: '#fff' }}
            >
              🥊 ROUND {roundNum}
            </span>
            <span className="font-bangers text-2xl text-[#FFD600] tracking-wider" style={{ textShadow: '2.5px 2.5px 0 #000' }}>
              COLPI BASSI!
            </span>
          </div>

          {/* 8-second timer badge */}
          <motion.div
            animate={{ scale: timeLeft <= 3 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timeLeft <= 3 ? Infinity : 0 }}
            className="neo-card flex items-center gap-1.5 px-3 py-1 shadow-[4px_4px_0px_#000] border-3 border-black"
            style={{
              backgroundColor: timeLeft <= 3 ? '#FF2A85' : '#FFFFFF',
              color: timeLeft <= 3 ? '#FFFFFF' : '#000000',
            }}
          >
            <Clock size={16} color={timeLeft <= 3 ? '#fff' : '#000'} strokeWidth={3} />
            <span className="font-bangers text-2xl leading-none" style={{ color: timeLeft <= 3 ? '#fff' : '#000' }}>
              {timeLeft}s
            </span>
          </motion.div>
        </div>

        {/* Fuse progress bar */}
        <div
          className="w-full h-4 rounded-full mb-2 overflow-hidden border-3 border-black relative bg-white shadow-[3px_3px_0px_#000]"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#FFD600] via-[#FF8800] to-[#FF2A85]"
            style={{ transformOrigin: 'left' }}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>

        {/* Subtitle / Instructions */}
        <div className="text-center mb-3">
          <p
            className="font-bangers text-lg tracking-wide"
            style={{ color: '#00E5FF', textShadow: '2px 2px 0 #000' }}
          >
            SCEGLI UN SABOTAGGIO E COLPISCI UN BOT! 🎯
          </p>
        </div>

        {/* Step 1: Offered Sabotages */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bangers text-xs px-2 py-0.5 rounded bg-yellow-400 text-black border border-black font-bold">
              FASE 1
            </span>
            <span className="font-bangers text-base tracking-wider text-gray-200">
              SCEGLI LA TUA ARMA (2 ESTRATTE):
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {offeredSabotages.map((sab, i) => {
              const isSelected = selectedSabotage === sab.id;
              return (
                <motion.div
                  key={sab.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedSabotage(sab.id);
                    playSound('pop');
                  }}
                  className={`neo-card p-3 cursor-pointer relative flex flex-col justify-between transition-all ${
                    isSelected ? 'ring-4 ring-yellow-400' : 'opacity-85'
                  }`}
                  style={{
                    backgroundColor: isSelected ? sab.bgColor : '#1c1c1c',
                    color: isSelected ? '#000' : '#fff',
                    borderColor: isSelected ? '#000' : '#444',
                    minHeight: 135,
                    transform: isSelected ? 'translate(2px, 2px)' : 'none',
                    boxShadow: isSelected ? '2px 2px 0 #000' : '5px 5px 0 #000',
                  }}
                >
                  {/* Selection badge */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-2 bg-yellow-400 text-black font-bangers text-xs px-2 py-0.5 rounded-full border-2 border-black shadow flex items-center gap-1">
                      <CheckCircle2 size={12} strokeWidth={3} /> SCELTA!
                    </div>
                  )}

                  <div>
                    <div className="text-3xl mb-1">{sab.emoji}</div>
                    <div className="font-bangers text-xl leading-tight" style={{ color: isSelected ? '#000' : '#FFD600' }}>
                      {sab.name}
                    </div>
                    <div
                      className="font-bangers text-xs tracking-wide"
                      style={{ color: isSelected ? sab.borderColor : '#aaa' }}
                    >
                      {sab.subtitle}
                    </div>
                  </div>

                  <p
                    className="text-[11px] leading-tight mt-1 font-semibold"
                    style={{
                      fontFamily: 'Fredoka',
                      color: isSelected ? '#222' : '#888',
                    }}
                  >
                    {sab.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Selection */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bangers text-xs px-2 py-0.5 rounded bg-pink-500 text-white border border-black font-bold">
              FASE 2
            </span>
            <span
              className="font-bangers text-base tracking-wider text-black"
              style={{ textShadow: '1px 1px 0 #FFF' }}
            >
              SCEGLI QUALE BOT BERSAGLIARE:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {bots.map(bot => {
              const isSelected = selectedTarget === bot.id;
              const isBotReady = botStatus[bot.id];

              return (
                <motion.div
                  key={bot.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setSelectedTarget(bot.id);
                    playSound('pop');
                  }}
                  className={`neo-card p-2 text-center cursor-pointer relative transition-all ${
                    isSelected ? 'ring-4 ring-yellow-400' : ''
                  }`}
                  style={{
                    backgroundColor: isSelected ? '#FF2A85' : '#FFFDF5',
                    color: isSelected ? '#fff' : '#000',
                    borderColor: '#000',
                    borderWidth: 3,
                    transform: isSelected ? 'translate(2px, 2px)' : 'none',
                    boxShadow: isSelected ? '2px 2px 0 #000' : '4px 4px 0 #000',
                  }}
                >
                  {/* Crosshair target icon */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-1 bg-yellow-400 text-black rounded-full p-1 border-2 border-black shadow">
                      <Target size={14} strokeWidth={3} />
                    </div>
                  )}

                  <div className="w-12 h-12 my-1 mx-auto flex items-center justify-center filter drop-shadow">
                    <AvatarDisplay avatar={bot.avatar} className="w-full h-full" />
                  </div>
                  <div
                    className="font-bangers text-base truncate font-bold"
                    style={{ color: isSelected ? '#fff' : '#000' }}
                  >
                    {bot.name}
                  </div>

                  <div
                    className="text-[10px] font-extrabold mt-0.5"
                    style={{ color: isSelected ? '#FFD600' : isBotReady ? '#059669' : '#888' }}
                  >
                    {isSelected ? '🎯 BERSAGLIO' : isBotReady ? '⚡ PRONTO' : '🤔 PENSA...'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Area: Confirmation & Bot Activity Status */}
      <div>
        {/* Bot status summary bar */}
        <div
          className="neo-card p-2 mb-2 flex items-center justify-between text-xs"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#000', borderWidth: 3, boxShadow: '3px 3px 0 #000' }}
        >
          <span className="font-bangers text-black tracking-wider text-xs font-bold">
            ATTIVITÀ AVVERSARI:
          </span>
          <div className="flex gap-1.5">
            {bots.map(bot => (
              <span
                key={bot.id}
                className={`font-bangers px-2 py-0.5 rounded-full border-2 border-black flex items-center gap-1 shadow-[1px_1px_0px_#000] ${
                  botStatus[bot.id] ? 'bg-[#00FF66] text-black font-extrabold' : 'bg-yellow-200 text-black'
                }`}
              >
                <AvatarDisplay avatar={bot.avatar} className="w-3.5 h-3.5 inline-block" />
                <span className="text-[11px]">{botStatus[bot.id] ? 'PRONTO' : '...'}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Launch Attack Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinalize}
          className="neo-btn w-full py-4 font-bangers text-2xl tracking-widest flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#FFD600',
            color: '#000',
            borderColor: '#000',
          }}
        >
          <Zap size={24} strokeWidth={3} fill="#000" />
          LANCIA COLPO BASSO! 🚀
        </motion.button>
      </div>
    </div>
  );
}
