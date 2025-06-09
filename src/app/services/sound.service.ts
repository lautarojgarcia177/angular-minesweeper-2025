import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { Sound } from '../enums/enums';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private revealCellSound = new Howl({
    src: ['/audio/530776__rickplayer__select.mp3'],
  });

  private flagCellSound = new Howl({
    src: ['/audio/flagged.mp3'],
  });

  private winSound = new Howl({
    src: ['/audio/270319__littlerobotsoundfactory__jingle-win-01.wav'],
  });

  private lostSound = new Howl({
    src: ['/audio/157218__adamweeden__video-game-die-or-lose-life.flac'],
  });

  playSound(sound: Sound) {
    switch (sound) {
      case Sound.revealCell:
        this.revealCellSound.play();
        break;
      case Sound.flagCell:
        this.flagCellSound.play();
        break;
      case Sound.win:
        this.winSound.play();
        break;
      case Sound.lost:
        this.lostSound.play();
        break;
    }
  }
}
