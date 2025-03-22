// src/stores/photoStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePhotoStore = defineStore('photo', () => {
  // State
  const photos = ref([]);
  const displayedPhotos = ref([]);
  const isLoading = ref(false);
  const albumIdInput = ref('');
  const sortColumn = ref('');
  const sortDirection = ref('asc');
  const itemsPerPage = ref(30);
  const loadMoreCount = ref(20);

  // Computed
  const albumIds = computed(() => {
    if (!albumIdInput.value.trim()) return [];
    return albumIdInput.value
      .trim()
      .split(' ')
      .filter(id => id.trim() !== '')
      .map(id => parseInt(id));
  });

  // Actions
  function saveAlbumIds() {
    localStorage.setItem('albumIds', albumIdInput.value);
  }

  function loadSavedAlbumIds() {
    const saved = localStorage.getItem('albumIds');
    if (saved) {
      albumIdInput.value = saved;
    }
  }

  async function fetchPhotos() {
    isLoading.value = true;
    displayedPhotos.value = []; // Clear displayed photos when fetching new ones
    
    try {
      let url = 'https://jsonplaceholder.typicode.com/photos';
      
      // Build query string for album IDs if present
      if (albumIds.value.length > 0) {
        const queryParams = albumIds.value.map(id => `albumId=${id}`).join('&');
        url = `${url}?${queryParams}`;
      }
      
      console.log('Fetching photos from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      const data = await response.json();
      console.log(`Fetched ${data.length} photos`);
      photos.value = data;
      
      // Save search parameters
      saveAlbumIds();
      
      // Apply sorting if active
      if (sortColumn.value) {
        sortPhotos(sortColumn.value, sortDirection.value);
      } else {
        // Initialize display with first page
        loadInitialPhotos();
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      isLoading.value = false;
    }
  }

  function loadInitialPhotos() {
    console.log('Loading initial photos');
    displayedPhotos.value = photos.value.slice(0, itemsPerPage.value);
    console.log(`Displayed photos: ${displayedPhotos.value.length}`);
  }

  function loadMorePhotos() {
    const start = displayedPhotos.value.length;
    const end = start + loadMoreCount.value;
    
    if (start < photos.value.length) {
      console.log(`Loading more photos: ${start} to ${end}`);
      const morePhotos = photos.value.slice(start, end);
      displayedPhotos.value = [...displayedPhotos.value, ...morePhotos];
    }
  }

  function sortPhotos(column, direction = null) {
    // If clicking the same column, toggle direction
    if (column === sortColumn.value && direction === null) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else if (direction !== null) {
      sortDirection.value = direction;
    } else {
      // New column, default to ascending
      sortDirection.value = 'asc';
    }
    
    sortColumn.value = column;
    
    // Sort full data set
    photos.value.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      
      // Handle numbers vs strings
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        // Convert to strings for comparison
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        
        if (sortDirection.value === 'asc') {
          return aString.localeCompare(bString);
        } else {
          return bString.localeCompare(aString);
        }
      }
    });
    
    // Reset to first page after sorting
    loadInitialPhotos();
  }

  return {
    photos,
    displayedPhotos,
    isLoading,
    albumIdInput,
    albumIds,
    sortColumn,
    sortDirection,
    fetchPhotos,
    loadMorePhotos,
    sortPhotos,
    saveAlbumIds,
    loadSavedAlbumIds
  };
});
