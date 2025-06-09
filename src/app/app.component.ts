import { Component, inject } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { GameStore } from './store/game-store';
import { effect } from '@angular/core';
import Swal from 'sweetalert2';
import { SoundService } from './services/sound.service';
import { Sound } from './enums/enums';
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-root',
  imports: [BoardComponent, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly store = inject(GameStore);
  soundService = inject(SoundService);

  constructor() {
    effect(async () => {
      let playAgain: any;
      if (this.store.isGameLost()) {
        this.soundService.playSound(Sound.lost);
        playAgain = await Swal.fire({
          title: '💀 Game over 💀',
          confirmButtonText: 'Play again',
          position: 'top',
        });
      } else if (this.store.isGameWon()) {
        this.soundService.playSound(Sound.win);
        playAgain = await Swal.fire({
          title: '😁 You win 😁',
          confirmButtonText: 'Play again',
          position: 'top',
        });
      }
      if (playAgain.isConfirmed) {
        this.store.startNewGame(9, 9);
      }
    });
  }
}
