<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const loginUrl = authStore.getLoginUrl()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
    <h1 class="text-4xl font-bold text-white">Welcome to Spotify Discovery</h1>
    <p class="text-gray-400 text-center max-w-md">
      Discover new music based on your preferences and create the perfect playlist for any moment.
    </p>
    <a
      :href="loginUrl"
      class="btn btn-primary flex items-center space-x-2"
    >
      <span>Login with Spotify</span>
    </a>
  </div>
</template>