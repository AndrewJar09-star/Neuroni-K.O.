import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { playSplat, playPop, vibrateShort } from '../utils/soundEffects';


export default function PieSplatterCanvas({ onCleanAnswer, onAllCleaned, isRevealed }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [cleanedPercent, setCleanedPercent] = useState(0);
  const [isFullyClean, setIsFullyClean] = useState(false);
  const isMouseDownRef = useRef(false);
  const soundThrottleRef = useRef(0);

  // Initialize canvas and draw cartoon paint / cream blobs
  const drawInitialSplats = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Cream / paint colors: Strawberry pink, custard yellow, mint cyan, whipped cream white
    const splats = [
      { x: width * 0.28, y: height * 0.3, r: 85, color: '#FF2A85' },
      { x: width * 0.72, y: height * 0.28, r: 90, color: '#FFD600' },
      { x: width * 0.32, y: height * 0.72, r: 95, color: '#00E5FF' },
      { x: width * 0.68, y: height * 0.7, r: 90, color: '#FFFFFF' },
      // Secondary overlapping splatter blobs
      { x: width * 0.5, y: height * 0.5, r: 75, color: '#FF2A85' },
      { x: width * 0.15, y: height * 0.5, r: 50, color: '#FFE600' },
      { x: width * 0.85, y: height * 0.5, r: 55, color: '#00E5FF' },
      { x: width * 0.5, y: height * 0.18, r: 55, color: '#FFFFFF' },
      { x: width * 0.5, y: height * 0.82, r: 60, color: '#FF2A85' },
    ];

    // Draw main blobs
    splats.forEach(s => {
      ctx.save();
      ctx.fillStyle = s.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;

      // Draw irregular organic blob
      ctx.beginPath();
      const numPoints = 12;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        // Perturb radius slightly for cartoon splash shape
        const radiusPerturb = s.r + Math.sin(i * 3) * 12 + Math.cos(i * 2) * 8;
        const px = s.x + Math.cos(angle) * radiusPerturb;
        const py = s.y + Math.sin(angle) * radiusPerturb;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cartoon highlight shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(s.x - s.r * 0.35, s.y - s.r * 0.35, s.r * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Small droplets / flying splatters
    for (let i = 0; i < 24; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rr = 6 + Math.random() * 12;
      const colors = ['#FF2A85', '#FFD600', '#00E5FF', '#FFFFFF'];
      const c = colors[Math.floor(Math.random() * colors.length)];

      ctx.save();
      ctx.fillStyle = c;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(rx, ry, rr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }, []);

  // Sync canvas size on mount / resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width || 360;
    canvas.height = rect.height || 260;

    drawInitialSplats();

    const handleResize = () => {
      if (!container || !canvas) return;
      const r = container.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        canvas.width = r.width;
        canvas.height = r.height;
        drawInitialSplats();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawInitialSplats]);

  // Wipe logic: destination-out
  const eraseAt = (x, y, radius = 45) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Throttled sound effect & haptic
    const now = Date.now();
    if (now - soundThrottleRef.current > 160) {
      playSplat();
      vibrateShort();
      soundThrottleRef.current = now;
    }
  };


  // Sample cleanliness
  const checkCleanliness = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Sample a 12x12 grid of pixels
    let totalSamples = 0;
    let transparentSamples = 0;
    const stepX = Math.floor(w / 12);
    const stepY = Math.floor(h / 12);

    try {
      for (let x = stepX / 2; x < w; x += stepX) {
        for (let y = stepY / 2; y < h; y += stepY) {
          totalSamples++;
          const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
          if (p[3] < 60) {
            transparentSamples++;
          }
        }
      }
      const percent = Math.round((transparentSamples / totalSamples) * 100);
      setCleanedPercent(percent);

      if (percent >= 55 && !isFullyClean) {
        setIsFullyClean(true);
        onAllCleaned?.();
      }
    } catch {
      // Ignore cross-origin context issues if any
    }
  }, [isFullyClean, onAllCleaned]);

  // Pointer & Touch handlers
  const handlePointerDown = (e) => {
    isMouseDownRef.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked pixel was already transparent (cleaned!)
    const ctx = canvasRef.current.getContext('2d');
    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    const isCleaned = pixel[3] < 50;

    if (isCleaned || isFullyClean) {
      // User tapped on clean spot: let click pass through to answer!
      onCleanAnswer?.(e.clientX, e.clientY);
    } else {
      // Erase spot
      eraseAt(x, y, 48);
      checkCleanliness();
    }
  };

  const handlePointerMove = (e) => {
    if (!isMouseDownRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    eraseAt(x, y, 42);

    if (Math.random() < 0.25) {
      checkCleanliness();
    }
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
    checkCleanliness();
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const ctx = canvasRef.current.getContext('2d');
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      if (pixel[3] < 50 || isFullyClean) {
        onCleanAnswer?.(touch.clientX, touch.clientY);
      } else {
        eraseAt(x, y, 48);
        checkCleanliness();
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      eraseAt(x, y, 44);

      if (Math.random() < 0.25) {
        checkCleanliness();
      }
    }
  };

  if (isRevealed) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-20 overflow-hidden rounded-xl transition-opacity duration-300 ${
        isFullyClean ? 'pointer-events-none opacity-40' : 'pointer-events-auto'
      }`}
    >
      {/* HTML5 Canvas overlay for wiping */}
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      />

      {/* Floating instruction banner */}
      <AnimatePresence>
        {!isFullyClean && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div
              className="neo-card px-3 py-1 flex items-center gap-1.5"
              style={{ backgroundColor: '#FFD600', color: '#000', borderWidth: 2 }}
            >
              <span className="text-base">🥧</span>
              <span className="font-bangers text-xs tracking-wider">
                PASSA IL DITO PER PULIRE LA PANNA! ({cleanedPercent}%)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Cleaned!" badge when cleared */}
      <AnimatePresence>
        {isFullyClean && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div
              className="neo-card px-3 py-1 flex items-center gap-1"
              style={{ backgroundColor: '#00FF87', color: '#000', borderWidth: 2 }}
            >
              <Sparkles size={14} strokeWidth={3} />
              <span className="font-bangers text-xs tracking-wider">
                PULITO! PUOI SCEGLIERE LA RISPOSTA! ✨
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
