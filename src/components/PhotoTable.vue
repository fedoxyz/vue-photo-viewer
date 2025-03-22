<template>
  <div class="relative dark:bg-slate-900 dark:text-white">
    <div v-if="photoStore.isLoading && photoStore.displayedPhotos.length === 0" class="border rounded-md w-full max-w-600 h-600 mx-auto overflow-auto">
      <div class="sticky top-0 bg-gray-200 dark:bg-slate-800">
        <div class="grid grid-cols-5 border-b dark:border-slate-700">
          <div v-for="header in tableHeaders" :key="header.value" class="p-3 text-sm font-medium">
            <div class="h-6 bg-gray-300 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div>
        <div v-for="i in 20" :key="i" class="grid grid-cols-5 border-b dark:border-slate-700">
          <div v-for="j in 5" :key="j" class="p-3">
            <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <div 
      v-else
      ref="tableContainer" 
      class="border rounded-md w-full max-w-600 h-600 mx-auto overflow-auto dark:bg-slate-900 dark:text-white"
      :class="photoStore.isLoading ? 'opacity-50' : ''"
      @scroll="handleScroll"
    >
      <div v-if="photoStore.displayedPhotos.length === 0 && !photoStore.isLoading" class="p-4 text-center">
        No photos found. Try different album IDs or check console for errors.
      </div>
      
      <table v-else class="w-full table-fixed">
        <thead class="sticky z-5 top-0 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white">
          <tr>
            <th 
              v-for="header in tableHeaders" 
              :key="header.value"
              @click="photoStore.sortPhotos(header.value)"
              class="p-3 text-left text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 w-1/5"
            >
              {{ header.label }}
              <span v-if="photoStore.sortColumn === header.value" class="ml-1">
                {{ photoStore.sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="photo in photoStore.displayedPhotos" 
            :key="photo.id"
            class="border-b dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            <td 
              v-for="header in tableHeaders" 
              :key="`${photo.id}-${header.value}`"
              class="p-3 text-sm overflow-hidden text-ellipsis whitespace-nowrap"
              :title="photo[header.value]"
            >
              {{ photo[header.value] }}
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="photoStore.isLoading && photoStore.displayedPhotos.length > 0" class="p-4 text-center">
        <div class="inline-block animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span class="ml-2">Loading more...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { usePhotoStore } from '../stores/photoStores.js';

const photoStore = usePhotoStore();
const tableContainer = ref(null);

const tableHeaders = reactive([
  { label: 'ID', value: 'id' },
  { label: 'Album', value: 'albumId' },
  { label: 'Title', value: 'title' },
  { label: 'URL', value: 'url' },
  { label: 'Thumbnail URL', value: 'thumbnailUrl' }
]);

function handleScroll(event) {
  const { scrollHeight, scrollTop, clientHeight } = event.target;
  
  if (scrollHeight - scrollTop - clientHeight < 50 && !photoStore.isLoading) {
    photoStore.loadMorePhotos();
  }
}
</script>

<style scoped>
table {
  width: 100%;
  table-layout: fixed;
}

table {
  scrollbar-width: thin;
  scrollbar-color: #4a4a4a #2c2c2c; /* Dark gray thumb and track */
}

td, th {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

td:hover, th:hover {
  cursor: pointer;
}
</style>
