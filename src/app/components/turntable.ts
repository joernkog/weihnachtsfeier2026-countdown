import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { SPOTIFY_PLAYLIST_ID } from '../config';
import { SpotifyController, SpotifyEmbedService } from '../services/spotify-embed.service';

@Component({
  selector: 'app-turntable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="deck">
      <div class="embed"><div #holder></div></div>

      <div class="controls">
        <button type="button" class="play" (click)="toggle()">
          @if (playing()) {
            <span class="play-icon" aria-hidden="true">❚❚</span>
            <span>Pause</span>
          } @else {
            <span class="play-icon" aria-hidden="true">▶</span>
            <span>Play</span>
          }
        </button>
      </div>

      <div class="platter" [class.spinning]="playing()">
        <div class="vinyl" [style.background-image]="recordStyle()">
          <div class="grooves"></div>
          <div class="label" aria-hidden="true"></div>
          <div class="spindle"></div>
        </div>
        <div class="arm" [class.on-record]="playing()">
          <div class="head"></div>
        </div>
      </div>

      @if (error(); as message) {
        <p class="error">{{ message }}</p>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .deck {
      display: grid;
      justify-items: center;
      gap: 1rem;
      width: 100%;
    }

    .platter {
      position: relative;
      width: min(74vw, 420px);
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(circle at 50% 50%, #26282d 0 46%, #17181c 46% 100%);
      box-shadow:
        0 0 0 10px #0e0f12,
        0 0 60px rgba(var(--neon-rgb), 0.2),
        0 30px 60px rgba(0, 0, 0, 0.7);
    }

    .vinyl {
      position: absolute;
      inset: 6%;
      border-radius: 50%;
      background: radial-gradient(
        circle at 34% 26%,
        #727a73 0 2%,
        #343b36 9%,
        #171c19 30%,
        #070908 67%,
        #4d564f 100%
      );
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border: 1px solid rgba(205, 214, 202, 0.4);
      box-shadow:
        inset 0 0 0 5px rgba(0, 0, 0, 0.42),
        inset 16px 10px 24px rgba(255, 255, 255, 0.08),
        0 0 0 2px rgba(0, 0, 0, 0.65);
      animation: spin 1.8s linear infinite;
      animation-play-state: paused;
      overflow: hidden;
    }

    .platter.spinning .vinyl {
      animation-play-state: running;
    }

    .grooves {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background:
        linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)),
        repeating-radial-gradient(
          circle at 50% 50%,
          rgba(215, 225, 214, 0.15) 0 1px,
          transparent 1px 5px
        );
      mask: radial-gradient(circle at 50% 50%, transparent 0 29%, #000 29% 100%);
    }

    .label {
      position: absolute;
      inset: 32%;
      border-radius: 50%;
      display: grid;
      align-content: center;
      justify-items: center;
      gap: 0.2rem;
      padding: 0.5rem;
      text-align: center;
      background: radial-gradient(
        circle,
        rgba(15, 15, 15, 0.78) 0 42%,
        rgba(15, 15, 15, 0.52) 43% 100%
      );
      color: #fff;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.55);
    }

    .label::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: rgba(0, 0, 0, 0.3);
    }

    .label strong {
      position: relative;
      z-index: 1;
      font-size: 0.8rem;
      line-height: 1.1;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .label span {
      position: relative;
      z-index: 1;
      font-size: 0.65rem;
      opacity: 0.8;
    }

    .spindle {
      position: absolute;
      inset: calc(50% - 5px);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #d7d7d7;
    }

    .arm {
      position: absolute;
      top: 6%;
      right: 4%;
      width: 12px;
      height: 46%;
      border-radius: 6px;
      background: linear-gradient(180deg, #e6e6e6, #8d8d8d);
      transform-origin: top center;
      transform: rotate(-38deg);
      transition: transform 0.8s ease;
    }

    .arm.on-record {
      transform: rotate(38deg);
    }

    .arm .head {
      position: absolute;
      bottom: -14px;
      left: -6px;
      width: 24px;
      height: 22px;
      border-radius: 4px;
      background: #1c1c1c;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    }

    .controls {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .play {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      font-family: var(--font-display);
      font-size: 1.2rem;
      padding: 0.5rem 1.5rem;
      color: #04120b;
      font-weight: 500;
      background: var(--neon);
      border: none;
      border-radius: 999px;
      cursor: pointer;
      box-shadow: 0 0 22px rgba(var(--neon-rgb), 0.5);
      will-change: box-shadow;
      transition: box-shadow 160ms ease;
    }

    .play-icon {
      display: inline-block;
      line-height: 1;
    }

    .play:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      box-shadow: none;
    }

    .play:hover:not(:disabled),
    .play:focus-visible {
      outline: none;
      box-shadow: 0 0 30px rgba(var(--neon-rgb), 0.72);
    }

    .error {
      margin: 0;
      color: var(--hot);
      font-size: 0.8rem;
    }

    .embed {
      width: min(100%, 460px);
      min-width: 0;
      height: 80px;
      overflow: hidden;
    }

    .embed > div,
    .embed iframe {
      display: block;
      width: 100%;
      height: 80px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .vinyl {
        animation: none;
      }
    }

    @media (max-width: 480px) {
      .platter {
        width: min(88vw, 360px);
      }

      .controls {
        flex-wrap: wrap;
        justify-content: center;
      }

      .play {
        font-size: 1rem;
        padding-inline: 1.25rem;
      }
    }
  `,
})
export class Turntable implements OnDestroy {
  private readonly embed = inject(SpotifyEmbedService);
  private readonly holder = viewChild.required<ElementRef<HTMLElement>>('holder');
  private controller?: SpotifyController;

  protected readonly playing = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly cover = signal<string | null>(null);
  protected readonly recordStyle = computed(() => {
    const artwork = this.cover();
    return artwork ? `url("${artwork}")` : '';
  });
  private pendingPlay = false;
  private refreshTimer?: ReturnType<typeof setInterval>;

  constructor() {
    afterNextRender(() => {
      this.embed
        .createController(
          this.holder().nativeElement,
          playlistUri(),
          (event) => {
            this.playing.set(!event.data.isPaused && !event.data.isBuffering);
            const artwork = event.data.track?.imageUri ?? event.data.track?.album?.imageUri;
            if (artwork) {
              this.cover.set(artwork);
            }
          },
        )
        .then((controller) => {
          this.controller = controller;
            if (this.pendingPlay) {
            this.pendingPlay = false;
            controller.play();
          }
          this.refreshTimer = setInterval(() => {
            if (!this.playing()) {
              controller.loadUri(playlistUri());
            }
          }, 30_000);
        })
        .catch(() => this.error.set('Spotify-Player konnte nicht geladen werden.'));
    });

  }

  protected toggle(): void {
    if (!this.controller) {
      this.pendingPlay = true;
      return;
    }
    this.controller.togglePlay();
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }
}

function playlistUri(): string {
  return `spotify:playlist:${SPOTIFY_PLAYLIST_ID}`;
}
