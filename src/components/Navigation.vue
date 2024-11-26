<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};

const handleLogout = () => {
	authStore.logout();
	router.push("/");
};
</script>

<template>
	<nav class="bg-green-950 shadow-lg sticky top-0 z-10">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<img src="/musicmate-alt.svg" alt="" class="w-8 h-8 mr-2">
					<router-link to="/" class="text-arvo">
						MusicMate
					</router-link>
				</div>

				<!-- Burger menu button -->
				<div class="md:hidden">
					<button
						@click="toggleMenu"
						class="text-gray-300 hover:text-white focus:outline-none"
					>
						<svg
							class="w-6 h-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>

				<!-- Desktop links -->
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

				<div class="hidden md:flex items-center space-x-4">
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

			<!-- Mobile menu -->
			<div
				v-if="isMenuOpen"
				class="md:hidden flex flex-col space-y-2 py-4 border-t border-gray-700"
			>
				<div class="flex flex-col items-end justify-between gap-2 px-3 py-2">
					<span class="text-gray-300 text-sm">
						{{ authStore.user?.display_name }}
					</span>
					<button
						@click="handleLogout"
						class="text-white text-sm font-medium"
					>
						Logout
					</button>
				</div>
				<router-link
					to="/discover"
					class="hover:text-white px-3 py-2 rounded-md text-sm font-medium"
					@click="toggleMenu"
				>
					Discover
				</router-link>
				<router-link
					to="/preferences"
					class="hover:text-white px-3 py-2 rounded-md text-sm font-medium"
					@click="toggleMenu"
				>
					Preferences
				</router-link>
			</div>
		</div>
	</nav>
</template>

<style scoped>
.text-arvo {
  font-family: "Arvo", serif;
  font-weight: 700;
  font-style: normal;
  font-size: 2rem;
}
</style>