import { useEffect } from 'react';
import { cmsService } from '../services/cmsService';
import { ThemeConfig } from '../types';

/**
 * Hook that applies the theme colors from CMS to CSS variables
 * This allows the theme to be dynamic and responsive
 */
export const useThemeApply = () => {
  useEffect(() => {
    const updateTheme = async () => {
      const data = await cmsService.getData();
      const theme = data.theme;

      // Apply CSS variables to the root element
      // These variables match the Tailwind theme configuration
      const root = document.documentElement;
      
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-accent', theme.accent);
      root.style.setProperty('--color-accent-red', theme.accentRed);
      root.style.setProperty('--color-background-dark', theme.background);
      root.style.setProperty('--color-surface-dark', theme.surface);
      root.style.setProperty('--color-text', theme.text);
      root.style.setProperty('--color-muted-text', theme.mutedText);
      
      // Also set for any potential uses with opacity
      root.style.setProperty('--color-primary-rgb', theme.primary);
      root.style.setProperty('--color-accent-rgb', theme.accent);
      root.style.setProperty('--color-accent-red-rgb', theme.accentRed);
    };

    // Apply theme on initial load
    updateTheme();

    // Listen for storage changes (when theme is updated in admin)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'asbi_cms_data') {
        updateTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event (for same-tab updates)
    const handleCustomEvent = async () => {
      await updateTheme();
    };

    window.addEventListener('cmsDataChanged', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cmsDataChanged', handleCustomEvent);
    };
  }, []);
};
