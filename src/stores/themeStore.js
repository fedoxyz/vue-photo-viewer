// stores/themeStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false);

  // Actions
  function initTheme() {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme !== null) {
      isDark.value = savedTheme === 'true';
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark.value = prefersDark;
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem('darkMode', isDark.value.toString());
  }

  return {
    isDark,
    initTheme,
    toggleTheme
  };
});
