import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

const LOCAL_STORAGE_KEY = "userPreferences";

export const usePreferencesStore = defineStore("preferences", {
	state: () => ({
		selectedGenres: [] as string[],
		favoriteArtists: [] as any[],
		mood: {
			energy: 0.5,
			danceability: 0.5,
			valence: 0.5,
		},
		availableGenres: [] as string[],
	}),
	actions: {
		async fetchAvailableGenres() {
			const authStore = useAuthStore();
			try {
				const response = await axios.get(
					"https://api.spotify.com/v1/recommendations/available-genre-seeds",
					{
						headers: { Authorization: `Bearer ${authStore.accessToken}` },
					}
				);
				this.availableGenres = response.data.genres;
			} catch (error) {
				console.error("Error fetching genres:", error);
			}
		},
		async searchArtists(query: string) {
			const authStore = useAuthStore();
			try {
				const response = await axios.get(`https://api.spotify.com/v1/search`, {
					headers: { Authorization: `Bearer ${authStore.accessToken}` },
					params: {
						q: query,
						type: "artist",
						limit: 5,
					},
				});
				return response.data.artists.items;
			} catch (error) {
				console.error("Error searching artists:", error);
				return [];
			}
		},
		addArtist(artist: any) {
			if (!this.favoriteArtists.find((a) => a.id === artist.id)) {
				this.favoriteArtists.push(artist);
				this.savePreferences();
			}
		},
		removeArtist(artistId: string) {
			this.favoriteArtists = this.favoriteArtists.filter(
				(a) => a.id !== artistId
			);
			this.savePreferences();
		},
		toggleGenre(genre: string) {
			const index = this.selectedGenres.indexOf(genre);
			if (index === -1) {
				this.selectedGenres.push(genre);
			} else {
				this.selectedGenres.splice(index, 1);
			}
			this.savePreferences();
		},
		updateMood(key: keyof typeof this.mood, value: number) {
			this.mood[key] = value;
			this.savePreferences();
		},
		savePreferences() {
			const preferences = {
				selectedGenres: this.selectedGenres,
				favoriteArtists: this.favoriteArtists,
				mood: this.mood,
			};
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
		},
		loadPreferences() {
			const savedPreferences = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (savedPreferences) {
				const parsedPreferences = JSON.parse(savedPreferences);
				this.selectedGenres = parsedPreferences.selectedGenres || [];
				this.favoriteArtists = parsedPreferences.favoriteArtists || [];
				this.mood = parsedPreferences.mood || {
					energy: 0.5,
					danceability: 0.5,
					valence: 0.5,
				};
			}
		},
	},
});
