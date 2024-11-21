import { defineStore } from 'pinia'
import axios from 'axios'

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_URL = 'https://api.spotify.com/v1'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  user: any | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken && state.expiresAt ? state.expiresAt > Date.now() : false,
  },

  actions: {
    getLoginUrl() {
      const scope = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'playlist-modify-public',
        'streaming',
        'user-read-playback-state',
      ].join(' ')

      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: import.meta.env.VITE_URL_CALLBACK,
        scope,
      });

      return `${SPOTIFY_AUTH_URL}?${params.toString()}`
    },

    async handleCallback(code: string) {
      try {
        const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

        const credentials = btoa(`${client_id}:${client_secret}`);

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append("redirect_uri", import.meta.env.VITE_URL_CALLBACK);

        const response = await axios.post(SPOTIFY_TOKEN_URL, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`,
          },
        });

        this.setTokens(response.data);
        await this.fetchUser();
        return true;
      } catch (error) {
        console.error('Auth error:', error);
        return false;
      }
    },

    setTokens(data: any) {
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      this.expiresAt = Date.now() + data.expires_in * 1000
    },

    async fetchUser() {
      try {
        const response = await axios.get(`${SPOTIFY_API_URL}/me`, {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        })
        this.user = response.data
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.expiresAt = null
      this.user = null
    },
  },
})