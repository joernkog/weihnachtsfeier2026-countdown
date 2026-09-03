import { Injectable, computed, effect, signal } from '@angular/core';
import { Track, parseTrackId } from '../models/track';

const STORAGE_KEY = 'wf2026.playlist';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private readonly _tracks = signal<Track[]>(load());
  private readonly _selectedId = signal<string | null>(null);

  readonly tracks = this._tracks.asReadonly();
  readonly selected = computed<Track | null>(
    () => this._tracks().find((t) => t.id === this._selectedId()) ?? this._tracks().at(0) ?? null,
  );

  constructor() {
    effect(() => {
      const tracks = this._tracks();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
      } catch {
        // Privater Modus o.ä. – Playlist bleibt dann nur im Speicher.
      }
    });
  }

  /** @returns Fehlermeldung oder `null`, wenn der Track übernommen wurde. */
  add(link: string, title: string, artist: string, addedBy: string): string | null {
    const id = parseTrackId(link);
    if (!id) {
      return 'Das ist kein gültiger Spotify-Track-Link.';
    }
    if (this._tracks().some((t) => t.id === id)) {
      return 'Der Track liegt schon auf dem Teller.';
    }

    const track: Track = {
      id,
      title: title.trim() || 'Unbekannter Track',
      artist: artist.trim() || 'Unbekannt',
      addedBy: addedBy.trim() || 'Anonym',
      addedAt: Date.now(),
    };
    this._tracks.update((tracks) => [...tracks, track]);
    this._selectedId.set(id);
    return null;
  }

  remove(id: string): void {
    this._tracks.update((tracks) => tracks.filter((t) => t.id !== id));
    if (this._selectedId() === id) {
      this._selectedId.set(null);
    }
  }

  select(id: string): void {
    this._selectedId.set(id);
  }
}

function load(): Track[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (t): t is Track => !!t && typeof t.id === 'string' && parseTrackId(t.id) !== null,
    );
  } catch {
    return [];
  }
}
