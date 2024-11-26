<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePreferencesStore } from '../stores/preferences'

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

const preferencesStore = usePreferencesStore()

const artistSearch = ref<string>('')
const searchResults = ref<Artist[]>([])
const isSearching = ref<boolean>(false)

onMounted(() => {
  preferencesStore.loadPreferences()
  preferencesStore.fetchAvailableGenres()
})

const searchArtists = async (): Promise<void> => {
  if (!artistSearch.value) return

  isSearching.value = true
  searchResults.value = await preferencesStore.searchArtists(artistSearch.value)
  isSearching.value = false
}
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-arvo">Your Music Preferences</h1>
    <div class="card space-y-6">
      <h2 class="text-arvo">Genres</h2>
      <div class="py-4 flex flex-wrap gap-2 max-h-[500px] overflow-y-auto">
        <button v-for="genre in preferencesStore.availableGenres" :key="genre"
          @click="preferencesStore.toggleGenre(genre)" :class="[ 
            'btn',
            preferencesStore.selectedGenres.includes(genre)
              ? 'btn-primary'
              : 'btn-secondary'
          ]">
          {{ genre }}
        </button>
      </div>
    </div>
    <div class="card space-y-6">
      <h2 class="text-arvo">Mood Settings</h2>
      <div class="space-y-4">
        <div v-for="(value, key) in preferencesStore.mood" :key="key">
          <label :for="key" class="block text-sm font-medium text-white mb-2">
            {{ key.charAt(0).toUpperCase() + key.slice(1) }}
          </label>
          <input :id="key" type="range" min="0" max="1" step="0.1" :value="value"
            @input="e => preferencesStore.updateMood(key, parseFloat((e.target as HTMLInputElement).value))"
            class="w-full" />
        </div>
      </div>
    </div>
    <div class="card space-y-6">
      <h2 class="text-arvo">Favorite Artists</h2>
      <div class="space-y-4">
        <div class="flex gap-2">
          <input v-model="artistSearch" type="text" placeholder="Search artists..."
            class="flex-1 bg-white rounded-lg px-4 py-2" @keyup.enter="searchArtists" />
          <button @click="searchArtists" class="btn btn-primary" :disabled="isSearching">
            Search
          </button>
        </div>
        <div v-if="searchResults.length > 0" class="space-y-2">
          <div v-for="artist in searchResults" :key="artist.id"
            class="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg">
            <div class="flex items-center gap-4">
              <img :src="artist.images[2]?.url" :alt="artist.name" class="w-12 h-12 rounded-full" />
              <span>{{ artist.name }}</span>
            </div>
            <button @click="preferencesStore.addArtist(artist)" class="btn btn-secondary"
              :disabled="preferencesStore.favoriteArtists.some(a => a.id === artist.id)">
              Add
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <div v-for="artist in preferencesStore.favoriteArtists" :key="artist.id"
            class="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
            <div class="flex items-center gap-4">
              <img :src="artist.images[2]?.url" :alt="artist.name" class="w-12 h-12 rounded-full" />
              <span>{{ artist.name }}</span>
            </div>
            <button @click="preferencesStore.removeArtist(artist.id)" class="text-red-500 hover:text-red-400">
              Remove
            </button>
          </div>
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