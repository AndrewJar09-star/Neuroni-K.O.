import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronLeft, ChevronRight, Sparkles, Users, KeyRound, ShieldAlert } from 'lucide-react';
import { playPop, vibrateShort } from '../utils/soundEffects';
import { AVATARS_LIST, HostSvg } from '../data/avatars';

export default function HomeScreen({ onStart }) {
  const [name, setName] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [onlineToast, setOnlineToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Modalità Online in arrivo! 🎮');
  const [nameWarning, setNameWarning] = useState(false);

  const currentAvatar = AVATARS_LIST[avatarIndex];

  const handlePrev = () => {
    playPop();
    vibrateShort();
    setDirection(-1);
    setAvatarIndex(prev => (prev === 0 ? AVATARS_LIST.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playPop();
    vibrateShort();
    setDirection(1);
    setAvatarIndex(prev => (prev === AVATARS_LIST.length - 1 ? 0 : prev + 1));
  };

  const handleStart = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      playPop();
      vibrateShort();
      setNameWarning(true);
      setTimeout(() => setNameWarning(false), 2000);
      return;
    }
    playPop();
    vibrateShort();
    onStart({ name: trimmed, avatar: currentAvatar.id });
  };

  const showOnlineToast = (msg) => {
    playPop();
    vibrateShort();
    setToastMessage(msg || 'Modalità Online in arrivo! 🎮');
    setOnlineToast(true);
    setTimeout(() => {
      setOnlineToast(false);
    }, 2400);
  };

  const CurrentSvg = currentAvatar.Svg;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between items-center bg-transparent select-none text-white">

      {/* Online Toast Notification */}
      <AnimatePresence>
        {onlineToast && (
          <motion.div
            initial={{ y: -80, scale: 0.8, opacity: 0 }}
            animate={{ y: 20, scale: 1, opacity: 1 }}
            exit={{ y: -80, scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="fixed top-2 z-50 px-5 py-2.5 rounded-xl border-3 border-black bg-[#FFD600] text-black font-bangers text-lg shadow-[5px_5px_0px_#000] tracking-wide flex items-center gap-2"
          >
            <Sparkles size={22} className="text-[#FF2A85] animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          CONTENITORE PRINCIPALE SCHERMO MOBILE 9:16 (FLEX-COL JUSTIFY-BETWEEN)
          ============================================================ */}
      <div className="relative z-10 w-full max-w-[430px] h-full flex flex-col justify-between px-3.5 py-3 sm:py-4">

        {/* ============================================================
            2. FASCIA ALTA: LOGO + IL PRESENTATORE SHOWMAN
            ============================================================ */}
        <div className="flex flex-col items-center w-full flex-shrink-0">
          {/* Logo 'Neuroni K.O.!' */}
          <div className="flex items-center justify-center gap-1.5 -rotate-2 transform hover:rotate-0 transition-transform duration-200">
            {/* 'NEURONI' Wordmark */}
            <span
              className="font-bangers text-4xl sm:text-5xl tracking-widest text-white leading-none"
              style={{
                WebkitTextStroke: '3.5px #000',
                textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
              }}
            >
              NEURONI
            </span>

            {/* 'K.O.!' Explosive Starburst Badge */}
            <div className="relative flex items-center justify-center rotate-6 scale-90 sm:scale-100">
              {/* Spikes / Starburst Background */}
              <div className="relative flex items-center justify-center w-14 h-14">
                {[0, 30, 60, 90, 120, 150].map(deg => (
                  <div
                    key={deg}
                    className="absolute w-12 h-12 bg-[#FF2A85] border-2 border-black"
                    style={{
                      transform: `rotate(${deg}deg)`,
                      boxShadow: '2px 2px 0 #000',
                    }}
                  />
                ))}
                {/* Center Badge Core */}
                <div className="absolute inset-1 rounded-full bg-[#FFD600] border-2 border-black flex items-center justify-center shadow-inner">
                  <span
                    className="font-bangers text-xl tracking-tight text-[#FF2A85] leading-none"
                    style={{
                      WebkitTextStroke: '1.2px #000',
                      textShadow: '1.5px 1.5px 0 #000',
                    }}
                  >
                    K.O.!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Il Presentatore con Nuvoletta Showman */}
          <div className="flex items-center justify-center w-full mt-1.5 sm:mt-2 gap-2 max-w-[400px]">
            {/* Host SVG Cartoon Bust */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex-shrink-0 filter drop-shadow-[3px_4px_0px_#000]"
            >
              <HostSvg className="w-16 h-16 sm:w-20 sm:h-20" />
            </motion.div>

            {/* Nuvoletta di Dialogo a Fumetti */}
            <div className="relative flex-1 comic-speech-bubble px-3 py-2 rounded-2xl min-h-[58px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAvatar.id}
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="w-full text-left"
                >
                  <p className="font-bold text-xs sm:text-sm text-black leading-tight">
                    &ldquo;{currentAvatar.quote}&rdquo;
                  </p>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF2A85] block mt-0.5">
                    — Il Presentatore
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ============================================================
            3. FASCIA CENTRALE: 'IL CAMERINO VIP' E GLI AVATAR PARODIA
            ============================================================ */}
        <div className="w-full flex flex-col items-center my-auto py-1">
          {/* Camerino TV Mirror Frame */}
          <div className="relative w-full rounded-2xl border-4 border-black bg-[#12121A] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center pt-2 pb-3 px-3 overflow-visible">

            {/* Fila di Lampadine da Camerino sul Bordo Superiore */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2.5 sm:gap-3 px-4 py-0.5 bg-black rounded-full border-2 border-black z-20 shadow-[2px_2px_0px_#000]">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#FFD600] border-2 border-black camerino-bulb"
                />
              ))}
            </div>

            {/* Header del Camerino */}
            <div className="w-full flex items-center justify-between mt-2 mb-1.5 px-1">
              <span className="font-bangers text-xs sm:text-sm tracking-wider text-[#FFD600] flex items-center gap-1">
                ★ CAMERINO VIP ★
              </span>
              <span className="font-bangers text-[11px] sm:text-xs tracking-wider text-[#00E5FF] px-2 py-0.5 rounded-md bg-black/60 border border-[#00E5FF]/40">
                {avatarIndex + 1} / {AVATARS_LIST.length}
              </span>
            </div>

            {/* Specchio & Carosello Avatar */}
            <div className="relative w-full flex items-center justify-between gap-1 sm:gap-2">
              {/* Bottone Freccia Sinistra (◀) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, x: -2 }}
                onClick={handlePrev}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFD600] border-3 border-black text-black font-bangers text-2xl flex items-center justify-center shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 flex-shrink-0 z-10 transition-colors hover:bg-yellow-300"
                aria-label="Avatar precedente"
              >
                <ChevronLeft size={26} strokeWidth={3.5} />
              </motion.button>

              {/* Box Specchio Centrale con Avatar Grande */}
              <div className="relative flex-1 h-36 sm:h-44 rounded-xl border-3 border-black bg-gradient-to-b from-[#1C1F2E] to-[#0E1017] flex flex-col items-center justify-center overflow-hidden shadow-inner p-2">
                {/* Sfondo colorato a tema con bagliore */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentAvatar.bgGradient} opacity-35 transition-all duration-300`}
                />

                {/* Halftone circolare dietro l'avatar */}
                <div
                  className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-dashed border-white/30"
                  style={{
                    boxShadow: `0 0 25px ${currentAvatar.glowColor}`,
                  }}
                />

                {/* Illustrazione Avatar con Animazione Elastica Framer Motion */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentAvatar.id}
                    custom={direction}
                    initial={{
                      scale: 0.4,
                      rotate: direction > 0 ? 25 : -25,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      opacity: 1,
                    }}
                    exit={{
                      scale: 0.4,
                      rotate: direction > 0 ? -25 : 25,
                      opacity: 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 18,
                    }}
                    className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.7)]"
                  >
                    <CurrentSvg className="w-full h-full" />
                  </motion.div>
                </AnimatePresence>

                {/* Badge Nome Costume */}
                <div className="absolute bottom-1 z-20 px-2.5 py-0.5 rounded-full bg-black/85 border border-white/30 shadow-[2px_2px_0px_#000] flex items-center gap-1.5 max-w-[95%]">
                  <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse flex-shrink-0" />
                  <span className="font-bangers text-[11px] sm:text-xs text-[#FFD600] tracking-wide truncate">
                    Costume: {currentAvatar.name}
                  </span>
                </div>
              </div>

              {/* Bottone Freccia Destra (▶) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, x: 2 }}
                onClick={handleNext}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFD600] border-3 border-black text-black font-bangers text-2xl flex items-center justify-center shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 flex-shrink-0 z-10 transition-colors hover:bg-yellow-300"
                aria-label="Avatar successivo"
              >
                <ChevronRight size={26} strokeWidth={3.5} />
              </motion.button>
            </div>

            {/* Pass VIP (Input Nome) integrato in basso come targhetta VIP */}
            <div className="w-full mt-2.5">
              <div
                className={`relative w-full rounded-xl border-3 border-black bg-[#FFD600] p-1.5 shadow-[4px_4px_0px_#000] transition-all ${
                  nameWarning ? 'ring-4 ring-[#FF2A85] animate-bounce' : ''
                }`}
              >
                <div className="flex items-center justify-between px-2 py-0.5 border-b-2 border-black/30 mb-1">
                  <span className="font-bangers text-[11px] sm:text-xs text-black tracking-wider flex items-center gap-1 font-bold">
                    🎟️ PASS VIP // IL TUO NICKNAME
                  </span>
                  <span className="text-[10px] font-extrabold text-black/70">
                    {name.length}/16
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#1A1A24] rounded-lg border-2 border-black px-2.5 py-1.5">
                  <span className="text-sm">⭐</span>
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (nameWarning) setNameWarning(false);
                    }}
                    placeholder="Scrivi il tuo Nickname..."
                    maxLength={16}
                    className="w-full bg-transparent font-bold text-sm sm:text-base text-white placeholder-gray-400 outline-none"
                  />
                  {name.trim().length >= 2 && (
                    <span className="text-[#00FF87] font-bold text-xs flex-shrink-0">✓ OK</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================
            4. FASCIA BASSA: BOTTONI D'AZIONE STILE 'RISSA'
            ============================================================ */}
        <div className="w-full flex flex-col gap-2 flex-shrink-0 mb-1">
          {/* Bottone Principale: SALI SUL PALCO! (GIOCA) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96, x: 4, y: 4 }}
            onClick={handleStart}
            className={`w-full py-3.5 sm:py-4 rounded-2xl border-4 border-black font-bangers text-2xl sm:text-3xl tracking-widest text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1.5 active:translate-y-1.5 flex items-center justify-center gap-2 -rotate-1 transition-transform ${
              name.trim().length >= 2
                ? 'bg-[#FF2A85] hover:bg-[#ff1a7d]'
                : 'bg-[#FF2A85] hover:brightness-105'
            }`}
          >
            <Zap size={28} strokeWidth={3} className="text-[#FFD600] animate-pulse" />
            <span
              style={{
                textShadow: '2.5px 2.5px 0 #000',
              }}
            >
              SALI SUL PALCO! (GIOCA)
            </span>
            <Zap size={28} strokeWidth={3} className="text-[#FFD600] animate-pulse" />
          </motion.button>

          {/* Subito sotto: due bottoni affiancati più compatti (Giallo e Viola) */}
          <div className="w-full grid grid-cols-2 gap-2.5">
            {/* CREA STANZA (Giallo) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => showOnlineToast('Modalità Online: Crea Stanza in arrivo! 🎮')}
              className="py-2.5 rounded-xl border-3 border-black bg-[#FFD600] text-black font-bangers text-base sm:text-lg tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-1.5 hover:bg-yellow-300 transition-colors"
            >
              <Users size={18} strokeWidth={2.5} />
              <span>CREA STANZA</span>
            </motion.button>

            {/* CODICE STANZA (Viola) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => showOnlineToast('Modalità Online: Codice Stanza in arrivo! 🔑')}
              className="py-2.5 rounded-xl border-3 border-black bg-[#8A2BE2] text-white font-bangers text-base sm:text-lg tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-1.5 hover:bg-purple-600 transition-colors"
            >
              <KeyRound size={18} strokeWidth={2.5} />
              <span>CODICE STANZA</span>
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
}
