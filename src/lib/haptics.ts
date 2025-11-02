import { Haptics, ImpactStyle } from '@capacitor/haptics';

export type HapticIntensity = 'light' | 'medium' | 'heavy';

/**
 * Triggers haptic feedback on mobile devices
 * Falls back gracefully on web/unsupported devices
 */
export async function triggerHaptic(intensity: HapticIntensity = 'medium') {
  try {
    // Check if running on mobile with Capacitor
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      const style =
        intensity === 'light'
          ? ImpactStyle.Light
          : intensity === 'heavy'
          ? ImpactStyle.Heavy
          : ImpactStyle.Medium;

      await Haptics.impact({ style });
    } else if ('vibrate' in navigator) {
      // Fallback to Vibration API on web
      const duration = intensity === 'light' ? 10 : intensity === 'heavy' ? 50 : 25;
      navigator.vibrate(duration);
    }
  } catch (error) {
    // Silently fail if haptics aren't supported
    console.debug('Haptics not supported:', error);
  }
}

/**
 * Triggers a selection haptic (used for UI element selection)
 */
export async function triggerSelectionHaptic() {
  try {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      await Haptics.selectionStart();
      setTimeout(() => Haptics.selectionEnd(), 100);
    }
  } catch (error) {
    console.debug('Selection haptics not supported:', error);
  }
}

/**
 * Triggers a notification haptic (success, warning, error)
 */
export async function triggerNotificationHaptic(type: 'success' | 'warning' | 'error' = 'success') {
  try {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      await Haptics.notification({ type: type.toUpperCase() as any });
    } else if ('vibrate' in navigator) {
      // Different patterns for different notification types
      const patterns = {
        success: [50, 50, 50],
        warning: [100, 50, 100],
        error: [200, 100, 200],
      };
      navigator.vibrate(patterns[type]);
    }
  } catch (error) {
    console.debug('Notification haptics not supported:', error);
  }
}
