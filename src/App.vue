<script setup lang="ts">
import { RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();
</script>

<template>
	<div class="min-h-screen background">
		<div class="min-h-screen">
			<Navigation v-if="authStore.isAuthenticated" />
			<main class="container mx-auto px-4 py-8">
				<RouterView v-slot="{ Component }">
					<Transition name="fade" mode="out-in">
						<component :is="Component" />
					</Transition>
				</RouterView>
			</main>
		</div>
	</div>
</template>

<style scoped>
.background {
	background-image: url("./assets/background.svg");
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}
</style>