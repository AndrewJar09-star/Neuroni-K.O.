import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SABOTAGES } from '../data/gameData';
import { playSound, triggerScreenShake, vibrateHeavy, playSplat, playCrash } from '../utils/soundEffects';
import { AvatarDisplay } from '../data/avatars';

export default function SabotageImpact({ attacks, onComplete }) {
  const primaryAttack = attacks[0];
  const primarySabotage = SABOTAGES.find(s => s.id === primaryAttack?.sabotageId) || SABOTAGES[0];

  useEffect(() => {
    playSound('impact');
    triggerScreenShake();
    vibrateHeavy();

    if (primarySabotage.id === 'cake') {
      setTimeout(() => playSplat(), 200);
    } else if (primarySabotage.id === 'cage') {
      setTimeout(() => playCrash(), 200);
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 2 seconds as specified

    return () => clearTimeout(timer);
  }, [onComplete, primarySabotage]);


  // Color schemes based on sabotage
  const impactBg = primarySabotage.impactColor || '#FF2A85';
  const isMultiAttack = attacks.length > 1;

  return (
    <div
      className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col items-center justify-center px-4 relative select-none bg-transparent"
    >
      {/* Dynamic Starburst Explosion Background */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: [0, 1.4, 1.2], rotate: [0, 45, 90] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute w-[450px] h-[450px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${impactBg} 30%, #FFD600 70%, transparent 80%)`,
          filter: 'blur(10px)',
          opacity: 0.85,
        }}
      />

      {/* Screen Shake wrapper */}
      <motion.div
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [-12, 12, -8, 8, -4, 4, 0],
          y: [-8, 8, -6, 6, -2, 2, 0],
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center text-center w-full"
      >
        {/* Onomatopoeia Word Burst */}
        <motion.div
          initial={{ scale: 0.1, rotate: -25 }}
          animate={{ scale: [0.1, 1.35, 1], rotate: [-25, 8, -3] }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="mb-2"
        >
          <span
            className="onomatopoeia font-bangers text-7xl md:text-8xl tracking-widest block"
            style={{
              color: '#FFD600',
              WebkitTextStroke: '4px #000',
              textShadow: '6px 6px 0 #000, -3px -3px 0 #000',
              lineHeight: 0.9,
            }}
          >
            {primarySabotage.impactTitle}
          </span>
        </motion.div>

        {/* Sub-banner impact message */}
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="neo-card px-4 py-2 mb-4"
          style={{ backgroundColor: '#000', borderColor: '#FFD600', borderWidth: 3 }}
        >
          <span className="font-bangers text-xl md:text-2xl text-white tracking-wider">
            {isMultiAttack ? '💥 DOPPIO ATTACCO A SORPRESA! 💥' : '⚠️ SEI STATO COLPITO! ⚠️'}
          </span>
        </motion.div>

        {/* Attacker(s) Card */}
        <div className="flex flex-col gap-3 w-full max-w-[340px]">
          {attacks.map((atk, idx) => {
            const sab = SABOTAGES.find(s => s.id === atk.sabotageId) || SABOTAGES[0];
            return (
              <motion.div
                key={idx}
                initial={{ x: idx % 2 === 0 ? -120 : 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 + idx * 0.15, type: 'spring', stiffness: 280 }}
                className="neo-card p-3 flex items-center justify-between"
                style={{
                  backgroundColor: sab.bgColor,
                  borderColor: '#000',
                  boxShadow: '6px 6px 0 #000',
                }}
              >
                {/* Attacker Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 flex-shrink-0 filter drop-shadow">
                    <AvatarDisplay avatar={atk.attackerAvatar} className="w-full h-full" />
                  </div>
                  <div className="text-left">
                    <span className="font-bangers text-lg text-black block leading-none">
                      {atk.attackerName}
                    </span>
                    <span className="text-xs font-bold text-gray-700" style={{ fontFamily: 'Fredoka' }}>
                      ti ha lanciato:
                    </span>
                  </div>
                </div>

                {/* Sabotage Badge */}
                <div
                  className="neo-card px-3 py-1 flex items-center gap-1.5"
                  style={{
                    backgroundColor: sab.borderColor,
                    color: '#fff',
                    borderColor: '#000',
                    borderWidth: 2,
                    boxShadow: '3px 3px 0 #000',
                  }}
                >
                  <span className="text-xl">{sab.emoji}</span>
                  <span className="font-bangers text-sm tracking-wide text-white">
                    {sab.name.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 2-second countdown pulse bar */}
        <div className="w-48 h-2.5 rounded-full mt-6 overflow-hidden border-2 border-black bg-black">
          <motion.div
            className="h-full bg-yellow-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.0, ease: 'linear' }}
          />
        </div>
        <p className="font-bangers text-xs text-yellow-400 tracking-widest mt-1">
          PREPARATI ALLA DOMANDA...!
        </p>
      </motion.div>
    </div>
  );
}
