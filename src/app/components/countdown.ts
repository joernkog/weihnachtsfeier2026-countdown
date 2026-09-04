import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';
import { PARTY_DATE } from '../config';

@Component({
  selector: 'app-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="countdown panel">
      <header>
        <h2>Countdown</h2>
      </header>
      <p class="date">{{ date }}</p>
        <div class="digits">
          @for (part of parts(); track part.label) {
            <div class="digit">
              <span class="value">{{ part.value }}</span>
              <span class="label">{{ part.label }}</span>
            </div>
          }
        </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .countdown {
      padding-bottom: 1rem;
    }

    header {
      display: grid;
      gap: 0.7rem;
    }

    .digits {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.6rem;
      margin: 1.4rem 0 1rem;
    }

    .digit {
      display: grid;
      justify-items: center;
      gap: 0.25rem;
      padding: 0.7rem 0.3rem;
      background: linear-gradient(180deg, #14161a, #0a0b0d);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.6rem;
      box-shadow: inset 0 0 22px rgba(0, 0, 0, 0.8);
    }

    .value {
      font-family: var(--font-display);
      font-size: clamp(1.7rem, 5vw, 2.8rem);
      font-weight: 600;
      line-height: 1;
      color: var(--neon);
      text-shadow: 0 0 14px rgba(var(--neon-rgb), 0.65);
      font-variant-numeric: tabular-nums;
    }

    .label {
      font-size: 0.8rem;
      font-weight: 500;
    }

    .over {
      margin: 1.4rem 0;
      font-family: var(--font-display);
      font-size: 1.6rem;
      color: var(--hot);
    }

    .date {
      margin: 0;
      line-height: var(--text-body-line);
    }
  `,
})
export class Countdown implements OnDestroy {
  protected readonly date = PARTY_DATE.toLocaleString('de-DE', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  private readonly remaining = signal(this.msLeft());
  private readonly timer = setInterval(() => this.remaining.set(this.msLeft()), 1000);

  protected readonly over = computed(() => this.remaining() <= 0);
  protected readonly parts = computed(() => {
    const total = Math.max(0, Math.floor(this.remaining() / 1000));
    return [
      { label: 'Tage', value: pad(Math.floor(total / 86400)) },
      { label: 'Stunden', value: pad(Math.floor(total / 3600) % 24) },
      { label: 'Minuten', value: pad(Math.floor(total / 60) % 60) },
      { label: 'Sekunden', value: pad(total % 60) },
    ];
  });

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private msLeft(): number {
    return PARTY_DATE.getTime() - Date.now();
  }
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}
