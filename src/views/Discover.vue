<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usePreferencesStore } from '../stores/preferences'
import { usePlayerStore } from '../stores/player'

const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()
const playerStore = usePlayerStore()

interface Artist {
  name: string;
}

interface Album {
  images: { url: string }[];
  name: string;
}

interface Track {
  id: string;
  name: string;
  uri: string;
  album: Album;
  artists: Artist[];
  external_urls: { spotify: string };
}

const recommendations = ref<Track[]>([])
const isLoading = ref(false)
const error = ref('')

const fetchRecommendations = async () => {
  if (preferencesStore.selectedGenres.length === 0) {
    error.value = 'Please select some genres in your preferences first'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch('https://api.spotify.com/v1/recommendations?' + new URLSearchParams({
      seed_genres: preferencesStore.selectedGenres.slice(0, 5).join(','),
      target_energy: preferencesStore.mood.energy.toString(),
      target_danceability: preferencesStore.mood.danceability.toString(),
      target_valence: preferencesStore.mood.valence.toString(),
      limit: '20'
    }), {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })

    const data = await response.json()
    recommendations.value = data.tracks
  } catch (e) {
    error.value = 'Failed to fetch recommendations'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await playerStore.initializePlayer()
  await fetchRecommendations()
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-arvo">Discover New Music</h1>
      <button @click="fetchRecommendations" class="btn btn-primary" :disabled="isLoading">
        Refresh
      </button>
    </div>

    <div v-if="error" class="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
      {{ error }}
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="track in recommendations" :key="track.id" class="card-music transition-colors">
        <img :src="track.album.images[0]?.url" :alt="track.album.name"
          class="w-full aspect-square object-cover rounded-lg mb-4" />
        <h3 class="font-semibold text-lg">{{ track.name }}</h3>
        <p class="text-gray-400">{{ track.artists.map((a: Artist) => a.name).join(', ') }}</p>
        <div class="flex justify-between items-center mt-4">
          <button @click="playerStore.playTrack(track.uri)" class="btn btn-secondary flex items-center justify-center">
            <span class="flex items-center gap-2" v-if="playerStore.currentTrack?.id === track.id && playerStore.isPlaying">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6" />
              </svg>
              Pause
            </span>
            <span v-else class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-5.197-3.018A1 1 0 008 8.882v6.236a1 1 0 001.555.832l5.197-3.018a1 1 0 000-1.664z" />
              </svg>
              Play
            </span>
          </button>
          <a :href="track.external_urls.spotify" target="_blank" class="text-spotify hover:text-spotify/80">
            Open in Spotify
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.text-arvo {
  font-family: "Arvo", serif;
  font-weight: 700;
  font-style: normal;
  font-size: 2rem;
}
</style>