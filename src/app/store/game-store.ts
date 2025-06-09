import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Cell } from '../interfaces/interfaces';
import { Cellstate } from '../enums/enums';

type GameState = {
  score: number;
  board: Cell[][];
  timeElapsed: number;
  isGameLost: boolean;
  isGameWon: boolean;
};

const initialState: GameState = {
  score: 0,
  board: generateBoard(9, 9),
  timeElapsed: 0,
  isGameLost: false,
  isGameWon: false,
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    startNewGame: (rows: number, cols: number) => {
      patchState(store, (state) => ({
        score: 0,
        board: generateBoard(rows, cols),
        timeElapsed: 0,
        isGameLost: false,
        isGameWon: false,
      }));
    },
    loseGame: () => {
      patchState(store, (state) => ({
        isGameLost: true,
        isGameWon: false,
        board: state.board.map((row) =>
          row.map((cell) => ({
            ...cell,
            state: Cellstate.revealed, // Reveal all cells on game over
          }))
        ),
      }));
    },
    revealCell: (cellId: number) => {
      patchState(store, (state) => {
        const newBoard = recalculateBoardAfterRevealCell(state, cellId);
        return {
          ...state,
          board: newBoard,
          isGameWon: checkIfWon(newBoard) ? true : false,
        };
      });
    },
    toggleFlag: (cellId: number) => {
      patchState(store, (state) => {
        const newBoard = recalculateBoardAfterFlagCell(state, cellId);
        return {
          ...state,
          board: newBoard,
        };
      });
    },
  }))
);

function recalculateBoardAfterRevealCell(state: GameState, cellId: number) {
  const rows = state.board.length;
  const cols = state.board[0].length;
  const flatCells = state.board.flat();
  const cellIndex = flatCells.findIndex((cell) => cell.id === cellId);
  const r = Math.floor(cellIndex / cols);
  const c = cellIndex % cols;

  // Deep copy the board to avoid mutating state directly
  const newBoard = state.board.map((row) => row.map((cell) => ({ ...cell })));

  function reveal(r: number, c: number) {
    if (
      r < 0 ||
      r >= rows ||
      c < 0 ||
      c >= cols ||
      newBoard[r][c].state === Cellstate.revealed
    ) {
      return;
    }
    newBoard[r][c].state = Cellstate.revealed;
    if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].containsMine) {
      // Reveal all adjacent cells
      for (const [dr, dc] of [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ]) {
        reveal(r + dr, c + dc);
      }
    }
  }

  reveal(r, c);

  return newBoard;
}

function recalculateBoardAfterFlagCell(state: GameState, cellId: number) {
  const rows = state.board.length;
  const cols = state.board[0].length;
  const flatCells = state.board.flat();
  const cellIndex = flatCells.findIndex((cell) => cell.id === cellId);
  const r = Math.floor(cellIndex / cols);
  const c = cellIndex % cols;

  // Deep copy the board to avoid mutating state directly
  const newBoard = state.board.map((row) => row.map((cell) => ({ ...cell })));

  const cell = newBoard[r][c];
  if (cell.state === Cellstate.untouched) {
    cell.state = Cellstate.flagged;
  } else if (cell.state === Cellstate.flagged) {
    cell.state = Cellstate.untouched; // Toggle flag off if already flagged
  }
  // If revealed, do nothing

  return newBoard;
}

function generateBoard(rows: number, cols: number, mineCount = 10): Cell[][] {
  // Create a flat array with mineCount mines and the rest empty
  const totalCells = rows * cols;
  const cells: Cell[] = Array.from({ length: totalCells }, (_, i) => ({
    state: Cellstate.untouched,
    containsMine: i < mineCount,
    id: i,
    adjacentMines: 0, // Initialize with 0
  }));

  // Shuffle the cells to randomize mine placement
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  // Convert flat array to 2D array
  const board: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    board.push(cells.slice(r * cols, (r + 1) * cols));
  }

  // Calculate adjacent mines for each cell
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].containsMine) {
        board[r][c].adjacentMines = -1; // Optional: -1 for mines
        continue;
      }
      let count = 0;
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          board[nr][nc].containsMine
        ) {
          count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }

  return board;
}

function checkIfWon(board: Cell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (
        !cell.containsMine &&
        (cell.state === Cellstate.untouched || cell.state === Cellstate.flagged)
      ) {
        return false;
      }
    }
  }
  return true;
}
