import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    player: null as any,
    deviceId: null as string | null,
    currentTrack: null as any,
    isPlaying: false,
    volume: 0.5,
  }),

  actions: {
    async initializePlayer() {
      const authStore = useAuthStore();

      // @ts-ignore
      if (!window.Spotify) {
        await new Promise((resolve) => {
          // @ts-ignore
          window.onSpotifyWebPlaybackSDKReady = resolve;
          const script = document.createElement("script");
          script.src = "https://sdk.scdn.co/spotify-player.js";
          document.body.appendChild(script);
        });
      }

      // @ts-ignore
      this.player = new window.Spotify.Player({
        name: "Bolt - MusicMate",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(authStore.accessToken!);
        },
        volume: this.volume,
      });

      this.player.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Player is ready with device_id:", device_id);
          this.deviceId = device_id;
        }
      );

      this.player.addListener("player_state_changed", (state: any) => {
        if (state) {
          this.currentTrack = state.track_window.current_track;
          this.isPlaying = !state.paused;
        }
      });

      await this.player.connect();
    },

    async playTrack(uri: string) {
      if (!this.deviceId) {
        console.error(
          "Device ID is not available. Initialize the player first."
        );
        return;
      }

      const authStore = useAuthStore();

      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [uri],
          }),
        }
      );
    },

    async togglePlayback() {
      await this.player?.togglePlay();
    },

    async setVolume(value: number) {
      this.volume = value;
      await this.player?.setVolume(value);
    },
  },
});
