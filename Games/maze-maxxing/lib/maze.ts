export type Position = [number, number];

export interface AStarNode {
  x: number;
  y: number;
  g: number; // Cost from start to current node
  h: number; // Estimated cost from current node to end (Heuristic)
  f: number; // Total cost (g + h)
  parent: AStarNode | null;
}

/**
 * Generates a perfect maze grid using an Iterative Depth-First Search Backtracking algorithm.
 * 0 = empty path, 1 = solid wall.
 */
export function generateMaze(width: number, height: number): boolean[][] {
  // Ensure odd dimensions for proper wall/path interleaving
  const w = width % 2 === 0 ? width + 1 : width;
  const h = height % 2 === 0 ? height + 1 : height;

  // Initialize entire matrix as walls (true = wall)
  const grid: boolean[][] = Array(h).fill(null).map(() => Array(w).fill(true));

  const stack: [number, number][] = [];
  // Start point
  grid[1][1] = false; 
  stack.push([1, 1]);

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    const neighbors: [number, number, number, number][] = []; // [next_x, next_y, wall_x, wall_y]

    // Check steps of 2 cells away to preserve separating walls
    const dirs = [
      [0, -2, 0, -1], // Up
      [0, 2, 0, 1],   // Down
      [-2, 0, -1, 0], // Left
      [2, 0, 1, 0],   // Right
    ];

    for (const [dx, dy, wx, wy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1) {
        if (grid[ny][nx]) {
          neighbors.push([nx, ny, cx + wx, cy + wy]);
        }
      }
    }

    if (neighbors.length > 0) {
      // Pick a random unvisited neighbor
      const [nx, ny, wx, wy] = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Carve paths through structural barrier and destination target
      grid[wy][wx] = false;
      grid[ny][nx] = false;
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }

  // Double check entry and exit points are explicitly cleared paths
  grid[1][1] = false;
  grid[h - 2][w - 2] = false;

  return grid;
}

/**
 * Solves the maze grid using the Heuristic-Guided A* Search Algorithm.
 * Computes optimal step matrices using Manhattan Distance.
 */
export function solveAStar(
  grid: boolean[][],
  start: Position,
  end: Position
): { path: Position[]; visitedOrder: Position[] } {
  const height = grid.length;
  const width = grid[0].length;
  
  const openSet: AStarNode[] = [];
  const closedSet = new Set<string>();
  const visitedOrder: Position[] = [];

  const startNode: AStarNode = {
    x: start[0],
    y: start[1],
    g: 0,
    h: Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]),
    f: 0,
    parent: null,
  };
  startNode.f = startNode.g + startNode.h;
  openSet.push(startNode);

  while (openSet.length > 0) {
    // Sort array to pop the node with the lowest total estimated functional cost (f)
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    
    const posKey = `${current.x},${current.y}`;
    if (closedSet.has(posKey)) continue;
    
    closedSet.add(posKey);
    visitedOrder.push([current.x, current.y]);

    // Destination target evaluation match check
    if (current.x === end[0] && current.y === end[1]) {
      const path: Position[] = [];
      let curr: AStarNode | null = current;
      while (curr !== null) {
        path.push([curr.x, curr.y]);
        curr = curr.parent;
      }
      return { path: path.reverse(), visitedOrder };
    }

    // Traditional Cardinal Graph Directions (Up, Down, Left, Right)
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];

    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      // Verify grid boundary conditions and check for empty paths (false = free path)
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !grid[ny][nx]) {
        if (closedSet.has(`${nx},${ny}`)) continue;

        const gScore = current.g + 1;
        const hScore = Math.abs(nx - end[0]) + Math.abs(ny - end[1]);
        const fScore = gScore + hScore;

        const existingOpen = openSet.find(n => n.x === nx && n.y === ny);
        
        if (existingOpen) {
          if (existingOpen.g > gScore) {
            existingOpen.g = gScore;
            existingOpen.f = fScore;
            existingOpen.parent = current;
          }
        } else {
          openSet.push({
            x: nx,
            y: ny,
            g: gScore,
            h: hScore,
            f: fScore,
            parent: current
          });
        }
      }
    }
  }

  return { path: [], visitedOrder }; // Fallback for structurally blocked matrices
}