<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    const success = await authStore.handleCallback(code)
    if (success) {
      router.push('/preferences')
    } else {
      router.push('/')
    }
  } else {
    router.push('/')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-[80vh]">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify mx-auto"></div>
      <p class="mt-4 text-gray-400">Logging you in...</p>
    </div>
  </div>
</template>