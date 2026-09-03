import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Countdown } from './components/countdown';
import { Effects } from './components/effects';
import { Playlist } from './components/playlist';
import { Street } from './components/street';
import { Turntable } from './components/turntable';
import { RACE_SIM_URL } from './config';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Countdown, Effects, Playlist, Street, Turntable],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly raceSimUrl = RACE_SIM_URL;
}
