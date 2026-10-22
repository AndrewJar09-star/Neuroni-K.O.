import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, AlertOctagon } from 'lucide-react';
import { SABOTAGES } from '../data/gameData';
import { playSound } from '../utils/sound';
import { AvatarDisplay } from '../data/avatars';

const TOTAL_FLOORS = 15;

export default function SkyscraperTower({
  players,
  playerFloors,
  climbRound = 1,
  lastClimbAwards = null, // { [playerId]: +3, +2, +1, 0 }
  onReadyForQuestion,
}) {
  const towerContainerRef = useRef(null);

  const human = useMemo(() => players.find(p => !p.isBot) || players[0], [players]);

  // Determine highest floor and leaders
  const maxFloor = useMemo(() => Math.max(...players.map(p => playerFloors[p.id] || 1), 1), [players, playerFloors]);
  const topLeaders = useMemo(() => players.filter(p => (playerFloors[p.id] || 1) === maxFloor), [players, playerFloors, maxFloor]);
  const isHumanLeader = topLeaders.some(l => l.id === human.id);

  // Sorted players by floor descending
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => (playerFloors[b.id] || 0) - (playerFloors[a.id] || 0));
  }, [players, playerFloors]);

  const leader = topLeaders.find(p => !p.isBot) || topLeaders[0] || sortedPlayers[0] || human;

  // Underdogs: bottom players
  const sortedAsc = useMemo(() => {
    return [...players].sort((a, b) => (playerFloors[a.id] || 1) - (playerFloors[b.id] || 1));
  }, [players, playerFloors]);
  const underdogs = useMemo(() => [sortedAsc[0], sortedAsc[1]].filter(Boolean), [sortedAsc]);
  const isHumanUnderdog = underdogs.some(u => u.id === human.id);

  // Stable underdog attacks generation per climbRound
  const [underdogAttacks, setUnderdogAttacks] = useState([]);

  useEffect(() => {
    const attacks = underdogs.map((attacker, idx) => {
      const randomSab = SABOTAGES[Math.floor(Math.random() * SABOTAGES.length)];
      // If human is among top leaders, underdogs target human!
      // Otherwise underdogs target the top bot leader
      let target;
      if (topLeaders.some(l => l.id === human.id)) {
        target = human;
      } else {
        target = topLeaders[idx % (topLeaders.length || 1)] || human;
      }
      return {
        attacker,
        sabotage: randomSab,
        target,
      };
    });
    setUnderdogAttacks(attacks);
  }, [climbRound, maxFloor, human.id, underdogs, topLeaders, human]);

  // Auto-scroll to highest player on mount
  useEffect(() => {
    if (towerContainerRef.current) {
      const highestFloor = Math.max(...Object.values(playerFloors), 1);
      const ratio = 1 - highestFloor / TOTAL_FLOORS;
      const targetScroll = towerContainerRef.current.scrollHeight * ratio - 80;
      towerContainerRef.current.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [playerFloors]);

  const handleStartQuestion = () => {
    playSound('pop');
    onReadyForQuestion({
      leaderId: leader.id,
      underdogAttacks,
    });
  };

  return (
    <div className="w-full max-w-[430px] h-[100dvh] mx-auto overflow-hidden flex flex-col justify-between px-3 py-2.5 select-none relative text-white bg-transparent">
      {/* Top Header */}
      <div className="mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="neo-card px-2.5 py-0.5 font-bangers text-xs tracking-wider"
              style={{ backgroundColor: '#FFD600', color: '#000', borderColor: '#000', borderWidth: 2 }}
            >
              🏢 ROUND SCALATA #{climbRound}
            </span>
            <span
              className="font-bangers text-xl text-yellow-300 tracking-wider"
              style={{ WebkitTextStroke: '1px #000', textShadow: '2px 2px 0 #000' }}
            >
              GRATTACIELO K.O.
            </span>
          </div>

          <div
            className="neo-card px-2 py-0.5 font-bangers text-xs flex items-center gap-1 text-white"
            style={{ backgroundColor: '#FF2A85', borderColor: '#000', borderWidth: 2, boxShadow: '2px 2px 0 #000' }}
          >
            <Trophy size={14} />
            <span>OBIETTIVO: P15</span>
          </div>
        </div>

        {/* Riscossa degli Ultimi Banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="neo-card p-2 mt-1.5"
          style={{
            backgroundColor: isHumanLeader ? '#FF2A85' : isHumanUnderdog ? '#FFD600' : '#FFFDF5',
            color: '#000',
            borderColor: '#000',
            borderWidth: 3,
            boxShadow: '4px 4px 0 #000',
          }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <AlertOctagon size={16} className={isHumanLeader ? 'text-yellow-300' : 'text-black'} />
            <span
              className="font-bangers text-sm tracking-wider"
              style={{ color: isHumanLeader ? '#FFD600' : '#000' }}
            >
              RISCOSSA DEGLI ULTIMI! 🚀
            </span>
          </div>

          <div
            className="text-[11px] leading-tight font-bold"
            style={{ fontFamily: 'Fredoka', color: isHumanLeader ? '#fff' : '#000' }}
          >
            {isHumanLeader ? (
              <span>
                ⚠️ SEI IN TESTA AL PIANO {playerFloors[human.id]}! Gli ultimi ti hanno bersagliato di colpi bassi prima del quiz a raffica!
              </span>
            ) : isHumanUnderdog ? (
              <span>
                🎯 SEI IN CODA! I colpi bassi rallenteranno il capolista 👑 {leader.name} (+4s di penalità tempo per i bot)!
              </span>
            ) : (
              <span>
                Gli ultimi 2 lanciano sabotaggi a raffica contro il capolista 👑 {leader.name}!
              </span>
            )}
          </div>

          {/* Underdog Sabotage Badges */}
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {underdogAttacks.map((atk, idx) => (
              <span
                key={idx}
                className="neo-card px-1.5 py-0.5 text-[10px] font-bangers flex items-center gap-1"
                style={{
                  backgroundColor: atk.sabotage.borderColor,
                  color: '#fff',
                  borderWidth: 2,
                  borderColor: '#000',
                  boxShadow: '2px 2px 0 #000',
                }}
              >
                <span className="flex items-center gap-1">
                  <AvatarDisplay avatar={atk.attacker.avatar} className="w-4 h-4 inline-block" />
                  <span>{atk.attacker.name}</span>
                </span>
                <span>→</span>
                <span>{atk.sabotage.emoji} {atk.sabotage.name}</span>
                <span className="bg-black/60 text-yellow-300 px-1 rounded text-[9px]">
                  vs {atk.target.id === human.id ? 'TU' : atk.target.name}
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skyscraper Tower Scrollable Container */}
      <div
        ref={towerContainerRef}
        className="neo-card flex-1 my-1 overflow-y-auto relative rounded-xl border-4 border-black"
        style={{
          maxHeight: 'calc(100dvh - 210px)',
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(3px)',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 5px 5px 0 #000',
        }}
      >
        <div className="flex flex-col w-full py-1.5 px-2 gap-1.5 min-h-[560px]">
          {/* Render 15 Floors in Descending Order */}
          {Array.from({ length: TOTAL_FLOORS }, (_, i) => TOTAL_FLOORS - i).map(floorNum => {
            const isRoof = floorNum === TOTAL_FLOORS;
            // Find players currently on this floor
            const playersHere = players.filter(p => (playerFloors[p.id] || 1) === floorNum);

            // Styling colors by floor height
            const isHighFloor = floorNum >= 12;
            const isMidFloor = floorNum >= 7 && floorNum < 12;

            return (
              <div
                key={floorNum}
                className={`neo-card flex items-center justify-between px-2 py-1 transition-all relative ${
                  isRoof ? 'ring-4 ring-yellow-400' : ''
                }`}
                style={{
                  backgroundColor: isRoof
                    ? '#FFD600'
                    : isHighFloor
                    ? '#FF2A85'
                    : isMidFloor
                    ? '#00E5FF'
                    : '#FFFDF5',
                  color: isHighFloor ? '#FFF' : '#000',
                  borderColor: '#000',
                  borderWidth: isRoof ? 3 : 2,
                  boxShadow: isRoof ? '0 0 15px rgba(255,214,0,0.7), 3px 3px 0 #000' : '2px 2px 0 #000',
                  minHeight: 36,
                }}
              >
                {/* Floor Label Badge */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className="font-bangers text-xs px-1.5 py-0.5 rounded border border-black flex items-center gap-0.5"
                    style={{
                      backgroundColor: isRoof ? '#000' : '#000',
                      color: isRoof ? '#FFD600' : '#fff',
                    }}
                  >
                    {isRoof ? <Trophy size={11} className="text-yellow-400" /> : null}
                    <span>P{floorNum}</span>
                  </div>

                  {isRoof && (
                    <span className="font-bangers text-xs tracking-wider text-black font-bold">
                      TETTO K.O.! RING DEI CAMPIONI 🏆
                    </span>
                  )}
                </div>

                {/* Players on this floor */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <AnimatePresence>
                    {playersHere.map(p => {
                      const isHuman = !p.isBot;
                      const isTopRank = (playerFloors[p.id] || 1) === maxFloor;
                      const award = lastClimbAwards ? lastClimbAwards[p.id] : null;

                      return (
                        <motion.div
                          key={p.id}
                          layout
                          initial={{ scale: 0, y: 15 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                          className={`neo-card px-1.5 py-0.5 flex items-center gap-1 relative ${
                            isHuman ? 'ring-2 ring-yellow-400' : ''
                          }`}
                          style={{
                            backgroundColor: isHuman ? '#FFD600' : '#FFF',
                            borderColor: '#000',
                            borderWidth: 2,
                            boxShadow: '2px 2px 0 #000',
                          }}
                        >
                          {/* Crown on leader */}
                          {isTopRank && (
                            <span className="absolute -top-3 -left-1 text-xs">
                              👑
                            </span>
                          )}

                          <AvatarDisplay avatar={p.avatar} className="w-5 h-5 flex-shrink-0" />
                          <span
                            className="font-bangers text-xs text-black tracking-wide font-bold"
                            style={{ maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {p.name}
                          </span>

                          {/* +Piani gained indicator */}
                          {award && award > 0 && (
                            <span className="bg-red-500 text-white font-bangers text-[10px] px-1 rounded border border-black font-bold">
                              +{award}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Launch Rapid Fire Question Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartQuestion}
        className="neo-btn w-full py-3.5 font-bangers text-xl tracking-wider flex items-center justify-center gap-2 mt-1.5 shadow-[4px_4px_0px_#000]"
        style={{
          backgroundColor: '#FFD600',
          color: '#000',
          borderColor: '#000',
          borderWidth: 4,
        }}
      >
        <Zap size={22} strokeWidth={3} fill="#000" />
        VAI ALLA DOMANDA A RAFFICA! (12s) ⚡
      </motion.button>
    </div>
  );
}
