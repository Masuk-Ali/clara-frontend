let deferredPrompt = null;

/**
 * Save the browser's install prompt.
 */
export function setDeferredPrompt(promptEvent) {
  deferredPrompt = promptEvent;
}

/**
 * Get the saved install prompt.
 */
export function getDeferredPrompt() {
  return deferredPrompt;
}

/**
 * Clear the saved install prompt.
 */
export function clearDeferredPrompt() {
  deferredPrompt = null;
}