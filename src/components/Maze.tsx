import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Cell = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
};

type Position = {
  x: number;
  y: number;
};

const isLargeScreen = window.innerWidth > 767;
const MAZE_SIZE = isLargeScreen ? 20 : 10;

const Maze: React.FC = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [gameWon, setGameWon] = useState(false);
  console.log("🧑‍💻Dev: https://t.me/jasurbek_muminjonov");

  const generateMaze = () => {
    const newMaze: Cell[][] = Array(MAZE_SIZE).fill(null).map(() =>
      Array(MAZE_SIZE).fill(null).map(() => ({
        top: true,
        right: true,
        bottom: true,
        left: true,
        visited: false,
      }))
    );

    const stack: Position[] = [];
    const startPos: Position = { x: 0, y: 0 };

    useEffect(() => {
      const preventScroll = (e: KeyboardEvent) => {
        if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
          e.preventDefault();
        }
      };

      window.addEventListener("keydown", preventScroll, { passive: false });

      return () => {
        window.removeEventListener("keydown", preventScroll);
      };
    }, []);


    const visit = (pos: Position) => {
      newMaze[pos.y][pos.x].visited = true;
      stack.push(pos);

      while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors: Position[] = [];

        const directions = [
          { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
          { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
          { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
          { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
        ];

        for (const dir of directions) {
          const newX = current.x + dir.dx;
          const newY = current.y + dir.dy;

          if (
            newX >= 0 && newX < MAZE_SIZE &&
            newY >= 0 && newY < MAZE_SIZE &&
            !newMaze[newY][newX].visited
          ) {
            neighbors.push({ x: newX, y: newY });
          }
        }

        if (neighbors.length > 0) {
          const next = neighbors[Math.floor(Math.random() * neighbors.length)];
          const dx = next.x - current.x;
          const dy = next.y - current.y;

          if (dx === 1) {
            newMaze[current.y][current.x].right = false;
            newMaze[next.y][next.x].left = false;
          } else if (dx === -1) {
            newMaze[current.y][current.x].left = false;
            newMaze[next.y][next.x].right = false;
          } else if (dy === 1) {
            newMaze[current.y][current.x].bottom = false;
            newMaze[next.y][next.x].top = false;
          } else if (dy === -1) {
            newMaze[current.y][current.x].top = false;
            newMaze[next.y][next.x].bottom = false;
          }

          newMaze[next.y][next.x].visited = true;
          stack.push(next);
        } else {
          stack.pop();
        }
      }
    };

    visit(startPos);
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setGameWon(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameWon) return;
    e.preventDefault();
    const currentCell = maze[playerPos.y][playerPos.x];
    let newPos = { ...playerPos };

    switch (e.key) {
      case 'ArrowUp':
        if (!currentCell.top) newPos.y--;
        break;
      case 'ArrowRight':
        if (!currentCell.right) newPos.x++;
        break;
      case 'ArrowDown':
        if (!currentCell.bottom) newPos.y++;
        break;
      case 'ArrowLeft':
        if (!currentCell.left) newPos.x--;
        break;
      case 'w':
        if (!currentCell.top) newPos.y--;
        break;
      case 'd':
        if (!currentCell.right) newPos.x++;
        break;
      case 's':
        if (!currentCell.bottom) newPos.y++;
        break;
      case 'a':
        if (!currentCell.left) newPos.x--;
        break;
    }

    setPlayerPos(newPos);

    // Check if player reached the end
    if (newPos.x === MAZE_SIZE - 1 && newPos.y === MAZE_SIZE - 1) {
      setGameWon(true);
    }
  };

  useEffect(() => {
    generateMaze();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maze, playerPos, gameWon]);

  return (
    <div className="flex flex-col items-center gap-6 text-center px-1.5">
      <div
        className={`text-2xl font-bold ${gameWon ? 'text-green-500' : 'text-gray-800'}`}
      >
        {gameWon ? 'Tabriklaymiz! Siz g\'alaba qozondingiz🎉' : 'Yashil doirachaga yo\'lni toping'}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={generateMaze}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Yangi O'yin
        </button>
      </div>



      <div className="relative bg-white p-1 rounded-lg shadow-lg">
        {maze.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="relative w-8 h-8"
                style={{
                  borderTop: cell.top ? '2px solid #000' : 'none',
                  borderRight: cell.right ? '2px solid #000' : 'none',
                  borderBottom: cell.bottom ? '2px solid #000' : 'none',
                  borderLeft: cell.left ? '2px solid #000' : 'none',
                }}
              >
                {playerPos.x === x && playerPos.y === y && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  </div>
                )}
                {x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button
            onClick={() => handleKeyDown({ key: 'ArrowUp' } as KeyboardEvent)}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <ArrowUp />
          </button>
          <div />
          <button
            onClick={() => handleKeyDown({ key: 'ArrowLeft' } as KeyboardEvent)}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <ArrowLeft />
          </button>
          <div />
          <button
            onClick={() => handleKeyDown({ key: 'ArrowRight' } as KeyboardEvent)}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <ArrowRight />
          </button>
          <div />
          <button
            onClick={() => handleKeyDown({ key: 'ArrowDown' } as KeyboardEvent)}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <ArrowDown />
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};

export default Maze;