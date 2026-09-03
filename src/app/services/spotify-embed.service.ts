import { Injectable } from '@angular/core';

export interface SpotifyController {
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  addListener(event: 'playback_update' | 'ready', cb: (e: SpotifyPlaybackEvent) => void): void;
  destroy(): void;
}

export interface SpotifyPlaybackEvent {
  data: {
    isPaused: boolean;
    isBuffering: boolean;
    position: number;
    duration: number;
    track?: { imageUri?: string; album?: { imageUri?: string } };
  };
}

interface SpotifyIFrameApi {
  createController(
    element: HTMLElement,
    options: { uri: string; width: string | number; height: string | number },
    callback: (controller: SpotifyController) => void,
  ): void;
}

const API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';

/** Lädt die Spotify Embed IFrame API genau einmal pro Session. */
@Injectable({ providedIn: 'root' })
export class SpotifyEmbedService {
  private api?: Promise<SpotifyIFrameApi>;

  createController(
    element: HTMLElement,
    uri: string,
    onPlaybackUpdate: (event: SpotifyPlaybackEvent) => void,
  ): Promise<SpotifyController> {
    return this.load().then(
      (api) =>
        new Promise<SpotifyController>((resolve) => {
          api.createController(element, { uri, width: '100%', height: '80' }, (controller) => {
            controller.addListener('playback_update', onPlaybackUpdate);
            resolve(controller);
          });
        }),
    );
  }

  async getTrackArtwork(trackId: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${trackId}`)}`,
      );
      if (!response.ok) {
        return null;
      }
      const data = (await response.json()) as { thumbnail_url?: unknown };
      return typeof data.thumbnail_url === 'string' ? data.thumbnail_url : null;
    } catch {
      return null;
    }
  }

  private load(): Promise<SpotifyIFrameApi> {
    this.api ??= new Promise<SpotifyIFrameApi>((resolve, reject) => {
      (window as unknown as { onSpotifyIframeApiReady: (api: SpotifyIFrameApi) => void })
        .onSpotifyIframeApiReady = resolve;

      const script = document.createElement('script');
      script.src = API_SRC;
      script.async = true;
      script.onerror = () => reject(new Error('Spotify Embed API konnte nicht geladen werden.'));
      document.body.appendChild(script);
    });
    return this.api;
  }
}
