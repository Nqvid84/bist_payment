'use client';

import { useEffect, useCallback, memo } from 'react';

/**
 * This component is used to initialize and manage the theme on the client side.
 * It handles theme persistence and system preference detection efficiently.
 * @returns null
 */
const ThemeInitializer = memo(() => {
  const applyTheme = useCallback((theme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, []);

  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    // Apply initial theme
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!savedTheme) {
        // Only change if no theme is saved
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [applyTheme]);

  return null;
});

ThemeInitializer.displayName = 'ThemeInitializer';

export default ThemeInitializer;
