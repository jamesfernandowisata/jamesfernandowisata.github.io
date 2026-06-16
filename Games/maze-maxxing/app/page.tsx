import MazeGame from '../components/MazeGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 py-8 px-4 flex flex-col items-center justify-center text-slate-100">
      <div className="w-full max-w-6xl mb-6 text-center lg:text-left lg:px-2">
        <h2 className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-1">Next.js Computer Science Laboratory</h2>
        <h1 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
          Procedural Space Exploration Sandbox
        </h1>
        <p className="mt-1.5 text-xs text-slate-400 max-w-2xl leading-relaxed">
          Race against or visually analyze an adversarial <strong>Heuristic A* Pathfinding Engine</strong> resolving complex topologies constructed via <strong>Recursive DFS Maze Generation</strong>.
        </p>
      </div>
      
      <MazeGame />
      
      {/* Informative Computer Science Algorithm Breakdowns */}
      <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
            1. Topology Construction: Randomized DFS Backtracker
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-400">
            The playground grid layout structures itself using a stack-based structural algorithm. By evaluating adjacent non-visited indices two steps away, it selectively removes barriers to establish a <em>"perfect lattice topology"</em>. This ensures exactly one valid, loops-free route links any two distinct vector paths.
          </p>
        </div>
        
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1.5">
            2. Real-Time Solution: Heuristic-Guided A* Search
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-400">
            The adversarial calculation pipeline solves index queries using the cost equation: <span className="font-mono text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded text-[10px]">f(n) = g(n) + h(n)</span>. By coupling absolute historical weight increments (<span className="italic font-serif">g</span>) with distance expectations evaluated using Manhattan Heuristics (<span className="italic font-serif">h</span>), it prunes graph-state branches instantly.
          </p>
        </div>
      </div>
    </main>
  );
}