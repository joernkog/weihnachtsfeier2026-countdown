import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Car {
  readonly color: string;
  readonly highlight: string;
  readonly duration: string;
  readonly delay: string;
  readonly scale: string;
  readonly lane: string;
}

@Component({
  selector: 'app-street',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="street" aria-hidden="true">
      <div class="traffic">
        @for (car of cars; track $index) {
          <div
            class="car"
            [style.--color]="car.color"
            [style.--duration]="car.duration"
            [style.--delay]="car.delay"
            [style.--scale]="car.scale"
            [style.bottom]="car.lane"
          >
            <div class="trail"></div>
            <svg viewBox="0 0 180 55" width="180" height="55">
              <path d="M7 39h166l-7-11-30-4-18-14H66L43 25 15 29Z" fill="var(--color)" stroke="#050605" stroke-width="2.5" />
              <path d="M61 13h43l20 11H50Z" fill="#151918" stroke="rgba(255,255,255,.36)" stroke-width="1.2" />
              <path d="M67 15h17v8H57ZM88 15h14l17 9H88Z" fill="#39403e" opacity=".9" />
              <path d="M18 30h143" stroke="var(--highlight)" stroke-width="1.3" opacity=".75" />
              <path d="M12 35h25M141 35h25" stroke="#080908" stroke-width="3" />
              <path d="M8 39h19M153 39h20" stroke="#080908" stroke-width="2" />
              <path d="M7 39l-5 3h22M173 39l5 3h-22" fill="none" stroke="#070807" stroke-width="2" />
              <path d="M43 34q0 12 12 12t12-12M119 34q0 12 12 12t12-12" fill="#080908" />
              <circle cx="54" cy="39" r="8" fill="#0a0b0a" stroke="#8b938e" stroke-width="1.5" />
              <circle cx="54" cy="39" r="3" fill="#d9e8df" />
              <circle cx="131" cy="39" r="8" fill="#0a0b0a" stroke="#8b938e" stroke-width="1.5" />
              <circle cx="131" cy="39" r="3" fill="#d9e8df" />
              <path d="M162 29h8" stroke="#fff1bf" stroke-width="2.5" stroke-linecap="round" />
              <path d="M10 29h9" stroke="#d9e8df" stroke-width="2" stroke-linecap="round" />
              <path d="M25 28l16-2M144 26l18 2" stroke="rgba(255,255,255,.5)" stroke-width="1" />
            </svg>
          </div>
        }
      </div>
      <div class="asphalt">
        <div class="markings"></div>
      </div>
    </div>
  `,
  styles: `
    .street {
      position: fixed;
      inset: auto 0 0 0;
      height: 130px;
      width: 100%;
      overflow: hidden;
      contain: layout paint;
      pointer-events: none;
      z-index: 5;
    }

    .traffic {
      position: absolute;
      inset: 0;
      z-index: 2;
      overflow: hidden;
      contain: layout paint;
    }

    .asphalt {
      position: absolute;
      inset: auto 0 0 0;
      z-index: 1;
      height: 74px;
      background: linear-gradient(180deg, #191a1e, #0b0c0e);
      border-top: 2px solid rgba(255, 255, 255, 0.12);
      overflow: hidden;
    }

    .markings {
      position: absolute;
      top: 34px;
      left: 0;
      width: 200%;
      height: 5px;
      background: repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.55) 0 60px,
        transparent 60px 130px
      );
      animation: dash 0.9s linear infinite;
      will-change: translate;
    }

    .car {
      position: absolute;
      left: 0;
      transform: scale(var(--scale));
      transform-origin: bottom left;
      animation: race var(--duration) linear var(--delay) infinite;
      filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.72));
      will-change: translate;
    }

    .trail {
      position: absolute;
      top: 40%;
      right: 100%;
      width: 160px;
      height: 8px;
      border-radius: 999px;
      background: linear-gradient(90deg, transparent, rgba(235, 222, 187, 0.58));
      opacity: 0.28;
      filter: blur(2px);
      will-change: translate;
    }

    @keyframes race {
      from {
        translate: -260px 0;
      }
      to {
        translate: calc(100vw + 200px) 0;
      }
    }

    @keyframes dash {
      to {
        translate: -130px 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .car,
      .markings {
        animation: none;
      }
    }
  `,
})
export class Street {
  protected readonly cars: Car[] = [
    { color: '#c7c4bb', highlight: '#d9e8df', duration: '2.35s', delay: '-0.05s', scale: '1', lane: '8px' },
    { color: '#4b504c', highlight: '#d9d1b8', duration: '3.1s', delay: '-0.9s', scale: '0.8', lane: '46px' },
    { color: '#6d716c', highlight: '#d9e8df', duration: '2.65s', delay: '-1.7s', scale: '1.1', lane: '6px' },
    { color: '#6d716c', highlight: '#e6ddc5', duration: '3.55s', delay: '-2.25s', scale: '0.7', lane: '50px' },
    { color: '#e1ded4', highlight: '#fff7db', duration: '2.15s', delay: '-1.25s', scale: '0.9', lane: '26px' },
    { color: '#353a36', highlight: '#d4c29a', duration: '2.9s', delay: '-2.65s', scale: '1', lane: '14px' },
  ];
}
