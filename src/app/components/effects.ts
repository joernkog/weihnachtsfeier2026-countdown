import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type EffectId = 'confetti' | 'snow';

interface Effect {
  readonly id: EffectId;
  readonly label: string;
}

interface ConfettiPiece {
  readonly x: string;
  readonly delay: string;
  readonly duration: string;
  readonly color: string;
  readonly rotation: string;
}

interface Snowflake {
  readonly x: string;
  readonly delay: string;
  readonly duration: string;
  readonly size: string;
  readonly drift: string;
  readonly opacity: string;
  readonly blur: string;
}

@Component({
  selector: 'app-effects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="effects panel">
      <div class="effects-heading">
        <h2>Spezialeffekte</h2>
      </div>

      <div class="effect-buttons" role="group" aria-label="Spezialeffekte">
        @for (effect of effects; track effect.id) {
          <button
            type="button"
            class="effect-button"
            [class.active]="active(effect.id)"
            [attr.aria-pressed]="active(effect.id)"
            (click)="toggle(effect.id)"
          >
            <span>{{ effect.label }}</span>
            <span class="status" aria-hidden="true"></span>
          </button>
        }
      </div>
    </section>

    @if (active('confetti')) {
      <div class="confetti-effect" aria-hidden="true">
        @for (piece of confetti; track $index) {
          <span
            class="confetti-piece"
            [style.--x]="piece.x"
            [style.--delay]="piece.delay"
            [style.--duration]="piece.duration"
            [style.--color]="piece.color"
            [style.--rotation]="piece.rotation"
          ></span>
        }
      </div>
    }

    @if (active('snow')) {
      <div class="snow-effect" aria-hidden="true">
        @for (flake of snowflakes; track $index) {
          <span
            class="snowflake"
            [style.--x]="flake.x"
            [style.--delay]="flake.delay"
            [style.--duration]="flake.duration"
            [style.--size]="flake.size"
            [style.--drift]="flake.drift"
          ></span>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }

    .effects {
      position: relative;
      z-index: 3;
      display: grid;
      gap: 1rem;
      margin: 0;
      max-width: 1500px;
      width: 100%;
      box-sizing: border-box;
    }

    .effects-heading {
      display: grid;
      gap: 0.7rem;
    }

    .effect-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.65rem;
    }

    .effect-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      min-height: 3rem;
      padding: 0.65rem 0.8rem;
      color: var(--ivory);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 248, 235, 0.18);
      border-radius: 0.25rem;
      font: inherit;
      font-weight: 600;
      line-height: 1.2;
      cursor: pointer;
      transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
    }

    .effect-button:hover,
    .effect-button:focus-visible {
      border-color: var(--neon);
      outline: none;
    }

    .effect-button.active {
      color: #07150d;
      background: var(--neon);
      border-color: var(--neon);
      box-shadow: 0 0 22px rgba(var(--neon-rgb), 0.28);
    }

    .status {
      width: 0.45rem;
      height: 0.45rem;
      margin-left: auto;
      border-radius: 50%;
    }

    .active .status {
      background: #07150d;
    }

    .confetti-effect {
      position: fixed;
      inset: 0;
      pointer-events: none;
    }

    .confetti-effect {
      z-index: 4;
      overflow: hidden;
    }

    .snow-effect {
      position: fixed;
      inset: 0;
      z-index: 4;
      overflow: hidden;
      pointer-events: none;
    }

    .snowflake {
      position: absolute;
      top: -2rem;
      left: var(--x);
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #fff 0 18%, rgba(239, 247, 242, 0.82) 48%, rgba(201, 220, 211, 0.26) 100%);
      opacity: var(--opacity);
      text-shadow: 0 0 8px rgba(255, 248, 220, 0.65);
      filter: blur(var(--blur));
      animation: snow-fall var(--duration) linear var(--delay) infinite;
    }

    .confetti-piece {
      position: absolute;
      top: -5vh;
      left: var(--x);
      width: 0.55rem;
      height: 1.1rem;
      background: var(--color);
      box-shadow: 0 0 4px rgba(255,255,255,.35);
      animation: confetti-fall var(--duration) linear var(--delay) infinite;
    }

    @keyframes confetti-fall {
      to { transform: translate3d(10vw, 110vh, 0) rotate(var(--rotation)); }
    }

    @keyframes snow-fall {
      0% { transform: translate3d(0, -2rem, 0) rotate(0); }
      35% { transform: translate3d(calc(var(--drift) * 0.35), 35vh, 0) rotate(100deg); }
      68% { transform: translate3d(calc(var(--drift) * -0.2), 68vh, 0) rotate(220deg); }
      100% { transform: translate3d(var(--drift), 110vh, 0) rotate(360deg); }
    }

    @media (max-width: 680px) {
      .effect-buttons {
        grid-template-columns: repeat(2, 1fr);
      }

      .effect-button {
        min-width: 0;
        padding-inline: 0.45rem;
        font-size: 0.88rem;
      }

    }

    @media (prefers-reduced-motion: reduce) {
      .confetti-piece {
        animation: none;
      }

      .snowflake {
        animation: none;
      }
    }
  `,
})
export class Effects {
  protected readonly effects: readonly Effect[] = [
    { id: 'confetti', label: 'Konfetti' },
    { id: 'snow', label: 'Schnee' },
  ];

  protected readonly confetti: readonly ConfettiPiece[] = Array.from({ length: 34 }, (_, index) => ({
    x: `${(index * 31) % 103 - 2}%`,
    delay: `${-((index * 0.37) % 7)}s`,
    duration: `${5.5 + ((index * 0.23) % 3)}s`,
    color: ['#ff4168', 'var(--neon)', '#ffd98a', '#fff8eb'][index % 4],
    rotation: `${90 + ((index * 47) % 270)}deg`,
  }));

  protected readonly snowflakes: readonly Snowflake[] = Array.from({ length: 42 }, (_, index) => ({
    x: `${(index * 37) % 101}%`,
    delay: `${-((index * 0.43) % 9)}s`,
    duration: `${8 + ((index * 0.31) % 7)}s`,
    size: `${0.45 + ((index * 0.07) % 0.65)}rem`,
    drift: `${-10 + ((index * 19) % 28)}vw`,
    opacity: `${0.35 + ((index * 0.11) % 0.55)}`,
    blur: `${(index % 5) * 0.35}px`,
  }));

  private readonly state = signal<Record<EffectId, boolean>>({
    confetti: false,
    snow: false,
  });

  protected active(id: EffectId): boolean {
    return this.state()[id];
  }

  protected toggle(id: EffectId): void {
    this.state.update((state) => ({ ...state, [id]: !state[id] }));
  }
}
