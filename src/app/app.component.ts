import { Component, inject } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { GameStore } from './store/game-store';
import { effect } from '@angular/core';
import Swal from 'sweetalert2';
import { SoundService } from './services/sound.service';
import { Sound } from './enums/enums';
import { NgOptimizedImage } from '@angular/common';

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
    const handlePlayAgain = async (title: string, sound: Sound) => {
      this.soundService.playSound(sound);
      const playAgain = await Swal.fire({
        title,
        confirmButtonText: 'Play again',
        position: 'top',
      });
      if (playAgain.isConfirmed) {
        this.store.startNewGame(9, 9);
      }
    };

    effect(async () => {
      if (this.store.isGameLost()) {
        await handlePlayAgain('💀 Game over 💀', Sound.lost);
      } else if (this.store.isGameWon()) {
        await handlePlayAgain('😁 You win 😁', Sound.win);
      }
    });
  }
}
