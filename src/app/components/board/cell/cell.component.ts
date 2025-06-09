import { Component, inject, input, signal } from '@angular/core';
import { Cellstate, Sound } from '../../../enums/enums';
import { Cell } from '../../../interfaces/interfaces';
import { GameStore } from '../../../store/game-store';
import { SoundService } from '../../../services/sound.service';

@Component({
  selector: 'app-cell',
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent {
  readonly store = inject(GameStore);
  soundService = inject(SoundService);

  Cellstate = Cellstate; // Expose the Cellstate enum to the template

  cell = input.required<Cell>();
  isHovered = signal(false);

  onMouseEnter() {
    this.isHovered.set(true);
  }
  onMouseLeave() {
    this.isHovered.set(false);
  }

  onAuxClick(event: any) {
    event.preventDefault(); // Prevent the default context menu from appearing
    this.store.toggleFlag(this.cell().id);
    this.soundService.playSound(Sound.flagCell);
  }

  revealCell() {
    if (
      (this.cell()!.state === Cellstate.untouched ||
        this.cell()!.state === Cellstate.flagged) &&
      !(this.store.isGameLost() || this.store.isGameWon())
    ) {
      this.soundService.playSound(Sound.revealCell);
      this.store.revealCell(this.cell().id);
      if (this.cell().containsMine) {
        this.store.loseGame();
      }
    }
  }
}
