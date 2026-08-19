/**
 * FoodRescue PH - Main JavaScript (main.js)
 * Handles global interactions like text-to-speech (read aloud) and mobile menu toggles.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize global listeners if needed
    console.log('FoodRescue PH loaded successfully.');
});

/**
 * Toggles the mobile navigation drawer visibility
 */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

/**
 * Reads text aloud using the browser's SpeechSynthesis API for accessibility
 * @param {string} text - The text to be spoken aloud
 */
function readAloud(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for better clarity
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
    } else {
        alert(text);
    }
}
