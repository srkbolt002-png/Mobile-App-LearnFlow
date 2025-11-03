// This script runs BEFORE React renders to prevent theme flash
// Always follows device/system theme

export function initializeTheme() {
  const applySystemTheme = () => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  };

  // Clear any old theme preference
  localStorage.removeItem("theme");
  
  // Apply system theme
  applySystemTheme();
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", applySystemTheme);
}
