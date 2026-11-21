export const playSound = (src: string, volume: number = 0.5): void => {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(src);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch((err) => {
      // Browsers often block autoplay without user interaction
      console.warn('Audio play prevented:', err);
    });
  } catch (error) {
    console.warn('Audio error:', error);
  }
};
