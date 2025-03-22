<template>
  <div class="min-h-screen" :class="themeStore.isDark ? 'dark bg-slate-900 text-white' : 'bg-white text-slate-900'">
    <div class="container mx-auto px-4 py-8">
      <header class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Photo Viewer</h1>
          <button 
            @click="themeStore.toggleTheme" 
            class="p-2 rounded-full"
            :class="themeStore.isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'"
          >
            <span v-if="themeStore.isDark">🌞</span>
            <span v-else>🌙</span>
          </button>
        </div>
        
        <div class="flex gap-2">
          <input
            v-model="photoStore.albumIdInput"
            type="text"
            placeholder="Filter by Album IDs (e.g. 1 2 3)"
            class="flex-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
          />
          <button
            @click="photoStore.fetchPhotos"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="photoStore.isLoading"
          >
            <span v-if="photoStore.isLoading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
            <span v-else>Search</span>
          </button>
        </div>
      </header>

      <PhotoTable />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePhotoStore } from './stores/photoStores.js';
import { useThemeStore } from './stores/themeStore.js';
import PhotoTable from './components/PhotoTable.vue';

const photoStore = usePhotoStore();
const themeStore = useThemeStore();

onMounted(() => {
  // Load theme preference
  themeStore.initTheme();
  
  // Load saved album IDs from localStorage
  photoStore.loadSavedAlbumIds();
  
  // Initial data fetch
  photoStore.fetchPhotos();
});
</script>
