<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { onMounted } from "vue";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const router = useRouter()
const authStore = useAuthStore()
const loginUrl = authStore.getLoginUrl()

if (authStore.isAuthenticated) {
  router.push('/discover')
}

onMounted(() => {
  gsap.fromTo(
    ".title",
    { y: -100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "elastic.out(1, 1.5)",
    }
  );

  gsap.fromTo(
    ".subtitle",
    { opacity: 0, x: -50 },
    {
      x: 0,
      opacity: 1,
      duration: 1.5,
      delay: 1,
      ease: "power4.out",
    }
  );

  gsap.fromTo(
    ".button",
    { opacity: 0, y: 50 },
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      delay: 1.5,
      ease: "power4.out",
    }
  );

  gsap.fromTo(
    ".button-text",
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay: 1.7,
      ease: "back.out(1.7)",
    }
  );

  gsap.fromTo(
    ".button-icon",
    { opacity: 0, x: -10, scale: 0.8 },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 1,
      delay: 1.9,
      ease: "back.out(1.7)",
    }
  );
});
</script>

<template>
  <div class="flex flex-col items-start justify-center gap-6 min-h-[80vh] space-y-8">
    <h1
      class="title font-bold text-white md:font-arvo-bold arvo-bold-md"
    >
      Welcome to Music Mate
    </h1>
    <p class="subtitle text-3xl text-gray-200 max-w-3xl">
      Uncover new sounds crafted to your tastes and create playlists that match every moment of your life
    </p>
    <a
      :href="loginUrl"
      class="button btn btn-primary flex items-center w-auto space-x-4 py-4 px-6 text-lg md:text-xl hover:btn-shadow"
    >
      <span class="button-text">Login with Spotify</span>
      <svg 
        class="button-icon" 
        xmlns="http://www.w3.org/2000/svg"
        width="48" 
        height="48"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/>
      </svg>
    </a>
  </div>
</template>