import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SPOTIFY_PLAYLIST_URL } from '../config';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-playlist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="panel">
      <header>
        <h2>Die schnellste Playlist der Stadt</h2>
      </header>

      <a class="qr-card" [href]="playlistUrl" target="_blank" rel="noopener noreferrer">
        <img [src]="qrCodeUrl" alt="QR-Code zum Hinzufügen von Songs zur Spotify-Playlist" />
        <span>
          <p>Song hinzufügen</p>
          <small>Spotify-Playlist mit dem Handy öffnen</small>
        </span>
      </a>
      <p class="sync-note">Neue Songs aus der Playlist erscheinen mit etwas Verzögerung im Player.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    section.panel {
      padding-bottom: 1rem;
    }

    header {
      display: grid;
      gap: 0.7rem;
      margin-bottom: 1rem;
    }

    .qr-card {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      min-height: 7.5rem;
      padding: 0.8rem;
      color: var(--ivory);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 248, 235, 0.18);
      border-radius: 0.5rem;
      font-weight: 500;
      line-height: 1.2;
      transition:
        border-color 160ms ease,
        background 160ms ease,
        color 160ms ease;
    }

    .qr-card:hover,
    .qr-card:focus-visible {
      background: rgba(var(--neon-rgb), 0.08);
      border-color: var(--neon);
      outline: none;
      text-decoration: none;
    }

    .qr-card img {
      width: clamp(6rem, 14vw, 7rem);
      height: auto;
      aspect-ratio: 1;
      padding: 0.3rem;
      background: var(--ivory);
      border-radius: 0.15rem;
      flex: 0 0 auto;
    }

    .qr-card span {
      display: grid;
      gap: 0.25rem;
    }

    .qr-card p {
      color: inherit;
      font-size: 1rem;
      line-height: 1.25;
    }

    .qr-card small {
      display: none;
    }

    .sync-note {
      margin: 0;
      color: rgba(255, 248, 235, 0.62);
      font-size: 1rem;
      padding: 0.5rem 0rem;
      line-height: 1.4;
    }

    .tracks {
      list-style: none;
      margin: 0 0 1rem;
      padding: 0;
      display: grid;
      gap: 0.4rem;
      max-height: 17rem;
      overflow-y: auto;
    }

    .tracks li {
      display: flex;
      align-items: stretch;
      gap: 0.3rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.5rem;
      background: rgba(0, 0, 0, 0.35);
    }

    .tracks li.active {
      border-color: var(--neon);
      box-shadow: 0 0 18px rgba(var(--neon-rgb), 0.25);
    }

    .pick {
      flex: 1;
      display: grid;
      gap: 0.15rem;
      padding: 0.55rem 0.7rem;
      text-align: left;
      color: inherit;
      background: none;
      border: none;
      cursor: pointer;
      font: inherit;
    }

    .title {
      font-weight: 700;
    }

    .meta {
      font-size: 0.72rem;
      line-height: 1.2;
    }

    .drop {
      padding: 0 0.7rem;
      background: none;
      border: none;
      cursor: pointer;
    }

    .drop:hover {
      color: var(--neon);
    }

    .empty {
      padding: 0.8rem;
      font-size: 0.85rem;
      line-height: var(--text-body-line);
    }

  `,
})
export class Playlist {
  protected readonly playlist = inject(PlaylistService);
  protected readonly playlistUrl = SPOTIFY_PLAYLIST_URL;
  protected readonly qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(SPOTIFY_PLAYLIST_URL)}`;
  protected readonly tracks = this.playlist.tracks;
  protected readonly selected = this.playlist.selected;
}
