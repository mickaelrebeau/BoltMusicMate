<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

if (authStore.isAuthenticated) {
  router.push('/discover')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
    <h1 class="text-4xl font-bold text-white">Spotify Discovery</h1>
    <p class="text-gray-400 text-center max-w-md">
      Discover new music tailored to your taste. Connect with Spotify to get started.
    </p>
    <router-link
      to="/login"
      class="btn btn-primary"
    >
      Get Started
    </router-link>
  </div>
</template>