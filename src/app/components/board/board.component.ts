import { Component, inject } from '@angular/core';
import { GameStore } from '../../store/game-store';
import { CellComponent } from './cell/cell.component';

@Component({
  selector: 'app-board',
  imports: [CellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  gameStore = inject(GameStore);
}
