<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="bg-gray-800 shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-white font-bold text-xl">
            Bolt - MusicMate
          </router-link>
          
          <div class="hidden md:flex space-x-4">
            <router-link
              to="/discover"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Discover
            </router-link>
            <router-link
              to="/preferences"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Preferences
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-gray-300 text-sm">
            {{ authStore.user?.display_name }}
          </span>
          <button
            @click="handleLogout"
            class="text-gray-300 hover:text-white text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>