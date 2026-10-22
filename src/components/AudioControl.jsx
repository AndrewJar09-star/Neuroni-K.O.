import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { getIsMuted, toggleMute, subscribeMuteChange } from '../utils/soundEffects';

export default function AudioControl() {
  const [muted, setMuted] = useState(getIsMuted);

  useEffect(() => {
    return subscribeMuteChange((newMuted) => {
      setMuted(newMuted);
    });
  }, []);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => toggleMute()}
      className="neo-btn fixed top-3 right-3 z-50 px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer"
      style={{
        backgroundColor: muted ? '#262626' : '#FFD600',
        color: muted ? '#999' : '#000',
        borderColor: '#000',
        borderWidth: 3,
        boxShadow: '3px 3px 0 #000',
      }}
      title={muted ? 'Riattiva Audio' : 'Disattiva Audio'}
    >
      {muted ? (
        <>
          <VolumeX size={18} strokeWidth={3} className="text-red-400" />
          <span className="font-bangers text-xs tracking-wider text-red-400">
            MUTED
          </span>
        </>
      ) : (
        <>
          <Volume2 size={18} strokeWidth={3} className="text-black" />
          <span className="font-bangers text-xs tracking-wider text-black">
            AUDIO
          </span>
        </>
      )}
    </motion.button>
  );
}
