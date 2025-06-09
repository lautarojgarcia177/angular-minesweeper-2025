import { Cellstate } from "../enums/enums";

export interface Cell {
    state: Cellstate;
    containsMine: boolean;
    id: number;
    adjacentMines: number;
}

export interface Board {
    rows: number;
    cols: number;
    cells: Cell[][];
}