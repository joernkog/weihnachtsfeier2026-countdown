export interface Track {
  /** Spotify Track-ID (22 alphanumerische Zeichen). */
  readonly id: string;
  readonly title: string;
  readonly artist: string;
  readonly addedBy: string;
  readonly addedAt: number;
}

const TRACK_ID = /^[A-Za-z0-9]{22}$/;

/**
 * Akzeptiert Spotify-Link, URI oder rohe ID und gibt die validierte Track-ID
 * zurück. Die Validierung verhindert, dass fremde URLs in den Embed-Player
 * gelangen.
 */
export function parseTrackId(input: string): string | null {
  const value = input.trim();
  if (TRACK_ID.test(value)) {
    return value;
  }

  const uri = /^spotify:track:([A-Za-z0-9]{22})$/.exec(value);
  if (uri) {
    return uri[1];
  }

  try {
    const url = new URL(value);
    if (url.hostname !== 'open.spotify.com') {
      return null;
    }
    const match = /^\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]{22})$/.exec(url.pathname);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
