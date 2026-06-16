"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateMaze, solveAStar, Position } from '../lib/maze';
import { Play, RotateCcw, Cpu, Sparkles, HelpCircle, Trophy } from 'lucide-react';

export default function MazeGame() {
  const [dimensions, setDimensions] = useState({ width: 21, height: 21 });
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>([1, 1]);
  const [aiPos, setAiPos] = useState<Position>([1, 1]);
  const [targetPos, setTargetPos] = useState<Position>([19, 19]);
  const [gameState, setGameState] = useState<'setup' | 'racing' | 'visualizing' | 'won' | 'lost' | 'finished-vis'>('setup');
  
  // Dynamic Simulation Visual states
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set());
  const [pathSet, setPathSet] = useState<Set<string>>(new Set());
  const [algorithmStats, setAlgorithmStats] = useState({ visitedCount: 0, pathLength: 0, computeTime: 0 });
  const [speed, setSpeed] = useState<number>(20); // ms render window delay

  const aiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const visTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const handleGenerate = useCallback(() => {
    // Clear concurrent event ticks and asynchronous queues
    visTimeoutRef.current.forEach(t => clearTimeout(t));
    visTimeoutRef.current = [];
    if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);

    const newGrid = generateMaze(dimensions.width, dimensions.height);
    const h = newGrid.length;
    const w = newGrid[0].length;
    
    setGrid(newGrid);
    setPlayerPos([1, 1]);
    setAiPos([1, 1]);
    setTargetPos([w - 2, h - 2]);
    setGameState('setup');
    setVisitedSet(new Set());
    setPathSet(new Set());
    setAlgorithmStats({ visitedCount: 0, pathLength: 0, computeTime: 0 });
  }, [dimensions]);

  useEffect(() => {
    handleGenerate();
    return () => {
      visTimeoutRef.current.forEach(t => clearTimeout(t));
      if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
    };
  }, [handleGenerate]);

  // Launch Live Adversarial AI Sequence
  const startAiRace = () => {
    if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
    setGameState('racing');
    
    const startTime = performance.now();
    const { path } = solveAStar(grid, aiPos, targetPos);
    const endTime = performance.now();

    setAlgorithmStats(prev => ({
      ...prev,
      computeTime: parseFloat((endTime - startTime).toFixed(2)),
      pathLength: path.length
    }));

    let step = 0;
    aiIntervalRef.current = setInterval(() => {
      if (step < path.length) {
        const nextPos = path[step];
        setAiPos(nextPos);
        if (nextPos[0] === targetPos[0] && nextPos[1] === targetPos[1]) {
          clearInterval(aiIntervalRef.current!);
          setGameState(curr => curr === 'won' ? 'won' : 'lost');
        }
        step++;
      } else {
        clearInterval(aiIntervalRef.current!);
      }
    }, speed * 2.5);
  };

  // Capture Real-Time Async User Movements
  useEffect(() => {
    if (gameState !== 'racing' && gameState !== 'setup') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      let [x, y] = playerPos;
      const key = e.key.toLowerCase();

      if (e.key === 'ArrowUp' || key === 'w') y--;
      else if (e.key === 'ArrowDown' || key === 's') y++;
      else if (e.key === 'ArrowLeft' || key === 'a') x--;
      else if (e.key === 'ArrowRight' || key === 'd') x++;
      else return;

      e.preventDefault();

      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length && !grid[y][x]) {
        setPlayerPos([x, y]);
        
        // Context Trigger: Automate Race initialization on first dynamic movement offset
        if (gameState === 'setup') {
          setGameState('racing');
          startAiRace();
        }

        if (x === targetPos[0] && y === targetPos[1]) {
          setGameState('won');
          if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, grid, gameState, targetPos]);

  // Multi-Stage Visual Scheduler mapping out Open and Closed Heuristic evaluations
  const visualizeAStar = () => {
    visTimeoutRef.current.forEach(t => clearTimeout(t));
    if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
    
    setPlayerPos([1, 1]);
    setAiPos([1, 1]);
    setVisitedSet(new Set());
    setPathSet(new Set());
    setGameState('visualizing');

    const startTime = performance.now();
    const { path, visitedOrder } = solveAStar(grid, [1, 1], targetPos);
    const endTime = performance.now();

    setAlgorithmStats({
      visitedCount: visitedOrder.length,
      pathLength: path.length,
      computeTime: parseFloat((endTime - startTime).toFixed(2))
    });

    // Step-by-Step State Space exploration visualization frame generation
    visitedOrder.forEach((pos, index) => {
      const timeout = setTimeout(() => {
        setVisitedSet(prev => {
          const next = new Set(prev);
          next.add(`${pos[0]},${pos[1]}`);
          return next;
        });

        // Transition from evaluation matrices into optimal solution rendering
        if (index === visitedOrder.length - 1) {
          path.forEach((pPos, pIndex) => {
            const pTimeout = setTimeout(() => {
              setPathSet(prev => {
                const next = new Set(prev);
                next.add(`${pPos[0]},${pPos[1]}`);
                return next;
              });
              if (pIndex === path.length - 1) {
                setGameState('finished-vis');
              }
            }, pIndex * speed);
            visTimeoutRef.current.push(pTimeout);
          });
        }
      }, index * (speed / 2));
      visTimeoutRef.current.push(timeout);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-2">
      {/* Control Configuration Matrix Panel */}
      <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              AlgoMaze Sandbox
            </h1>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            An immersive interface evaluating heuristic computation pipelines via <strong>A* Search Vector Graphs</strong> operating over structural <strong>DFS Backtracking</strong> lattices.
          </p>

          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Simulation Engine State</span>
            {gameState === 'setup' && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold">Ready (Press Key / Outrun)</span>}
            {gameState === 'racing' && <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">Race Pipeline Active</span>}
            {gameState === 'visualizing' && <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold">Evaluating Graph States...</span>}
            {gameState === 'won' && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">Biological Win</span>}
            {gameState === 'lost' && <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-semibold">Silicon Victory</span>}
            {gameState === 'finished-vis' && <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold">Path Solved</span>}
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Grid Boundary Dimensions</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                value={dimensions.width}
                onChange={(e) => setDimensions({ width: parseInt(e.target.value), height: parseInt(e.target.value) })}
                disabled={gameState === 'visualizing' || gameState === 'racing'}
              >
                <option value={15}>15 x 15 (Standard Space)</option>
                <option value={21}>21 x 21 (Intermediate Node Density)</option>
                <option value={31}>31 x 31 (Complex Matrix Array)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                <span>Ticks Interval Step Delay</span>
                <span className="text-indigo-400 font-mono">{speed}ms</span>
              </div>
              <input 
                type="range" 
                min={5} 
                max={80} 
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-4 rounded-xl font-medium text-xs transition-all border border-slate-700 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-seed Procedural Grid
            </button>
            <button 
              onClick={visualizeAStar}
              disabled={gameState === 'visualizing'}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2 px-4 rounded-xl font-medium text-xs transition-all shadow-md shadow-indigo-950/50 disabled:opacity-40"
            >
              <Cpu className="w-3.5 h-3.5" /> Run A* Vector Mapping
            </button>
            {gameState === 'setup' && (
              <button 
                onClick={() => { setGameState('racing'); startAiRace(); }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-xl font-medium text-xs transition-all shadow-md shadow-emerald-950/50"
              >
                <Play className="w-3.5 h-3.5" /> Launch AI Race Mode
              </button>
            )}
          </div>
        </div>

        {/* Runtime Mathematical Outputs */}
        <div className="mt-6 pt-5 border-t border-slate-800/60">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Runtime Complexities
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/40">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-0.5">CPU Compute</span>
              <span className="font-mono text-cyan-400 font-bold">{algorithmStats.computeTime} ms</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/40">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-0.5">Optimal Cost</span>
              <span className="font-mono text-amber-400 font-bold">{algorithmStats.pathLength} units</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/40 col-span-2">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-0.5">Evaluated State Space (Nodes Explored)</span>
              <span className="font-mono text-purple-400 font-bold">{algorithmStats.visitedCount || visitedSet.size || 0} vertices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Computational Display Grid */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-8 flex items-center justify-center shadow-2xl relative min-h-[450px] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none"></div>
        
        {grid.length > 0 && (
          <div 
            className="grid border border-slate-800/80 bg-slate-900 shadow-2xl rounded-xl overflow-hidden p-1 gap-[1px]"
            style={{
              gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
              width: 'min(100%, 480px)',
              aspectRatio: '1/1'
            }}
          >
            {grid.map((row, y) => 
              row.map((isWall, x) => {
                const isPlayer = playerPos[0] === x && playerPos[1] === y;
                const isAi = aiPos[0] === x && aiPos[1] === y;
                const isTarget = targetPos[0] === x && targetPos[1] === y;
                const isVisited = visitedSet.has(`${x},${y}`);
                const isPath = pathSet.has(`${x},${y}`);

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`transition-all duration-100 relative rounded-[1px] ${
                      isWall 
                        ? 'bg-slate-950 shadow-inner' 
                        : isTarget 
                        ? 'bg-emerald-500 animate-pulse'
                        : isPlayer 
                        ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10 scale-90 border border-white/20'
                        : isAi 
                        ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e] z-10 scale-90 border border-white/20'
                        : isPath 
                        ? 'bg-gradient-to-br from-amber-300 to-yellow-500 shadow-[0_0_6px_#f59e0b]'
                        : isVisited 
                        ? 'bg-purple-950/60 border border-purple-800/20'
                        : 'bg-slate-900'
                    }`}
                  >
                    {isTarget && (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-950">
                        <Trophy className="w-2.5 h-2.5 font-black" />
                      </div>
                    )}
                  </div>
                );
              })
                    )}
          </div>
        )}

        {/* State Conditional Overlays */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in text-center p-6">
            <div className={`p-3 rounded-full mb-3 ${gameState === 'won' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-100 mb-1">
              {gameState === 'won' ? 'Human Intelligence Wins!' : 'Optimized Model Triumphs'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
              {gameState === 'won' 
                ? 'Incredible execution speeds! You outmaneuvered the true algorithmic priority queue calculations.'
                : 'The heuristic expansion pipeline successfully evaluated all directional grid steps on the global optimal vector.'}
            </p>
            <button 
              onClick={handleGenerate}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-950"
            >
              Initialize Next Grid Plane
            </button>
          </div>
        )}
      </div>
    </div>
  );
}