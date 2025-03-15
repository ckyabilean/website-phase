/**
 * Main initialization script
 * Loads and coordinates all components
 */

// Global state
const APP = {
    initialized: false,
    audioConsented: false,
    loginComplete: false
};

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components in sequence
    initAudioConsent();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start cursor blink
    setInterval(blinkCursor, 500);
});

/**
 * Initial audio consent setup
 */
function initAudioConsent() {
    const consentEl = document.getElementById('audioConsent');
    const countdownEl = document.getElementById('countdown');
    let timeLeft = 10;
    
    // Start countdown immediately
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            // Force audio consent after countdown
            handleAudioConsent();
        }
    }, 1000);
    
    // Listen for space key
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !APP.audioConsented) {
            e.preventDefault();
            clearInterval(countdownInterval);
            handleAudioConsent();
        }
    });
    
    // Also allow click on text
    consentEl.addEventListener('click', () => {
        if (!APP.audioConsented) {
            clearInterval(countdownInterval);
            handleAudioConsent();
        }
    });
}

/**
 * Handle audio consent confirmation
 */
function handleAudioConsent() {
    APP.audioConsented = true;
    
    // Hide consent screen
    const consentEl = document.getElementById('audioConsent');
    consentEl.style.opacity = '0';
    
    // After fade out, remove and show terminal
    setTimeout(() => {
        consentEl.style.display = 'none';
        
        // Show and activate terminal
        const terminal = document.getElementById('terminal');
        terminal.classList.add('active');
        
        // Start login sequence
        startLoginSequence();
        
        // Initialize audio
        AudioController.init();
    }, 500);
}

/**
 * Start the initial login sequence animation
 */
function startLoginSequence() {
    const loginText = document.getElementById('loginText');
    const promptText = document.getElementById('promptText');
    
    // Initial login text (typing effect handled by Animation module)
    const loginLines = [
        'SYSTEM INITIALIZING...',
        'ACCESSING MEDIA ARCHIVE...',
        'SECURITY PROTOCOLS BYPASSED',
        'UNAUTHORIZED ACCESS GRANTED',
        'DISPLAYING CONTENT'
    ];
    
    // Start typing animation
    Animation.typeSequence(loginText, loginLines, 80, 500, () => {
        // After login text, show prompt typing
        setTimeout(() => {
            Animation.typeText(promptText, 'WELCOME', 100, () => {
                // After typing completes, wait and then switch to main terminal
                setTimeout(() => {
                    completeLogin();
                }, 1000);
            });
        }, 800);
    });
}

/**
 * Complete login and show main terminal
 */
function completeLogin() {
    APP.loginComplete = true;
    
    // Hide login screen
    document.getElementById('loginScreen').classList.add('hidden');
    
    // Show main terminal
    document.getElementById('terminalContent').classList.remove('hidden');
    
    // Initialize content display directly
    CMS.init();
    
    // Start ticker
    initTicker();
}

/**
 * Initialize the stock ticker at the bottom
 */
function initTicker() {
    const ticker = document.getElementById('ticker');
    // Default ticker content (will be replaced by CMS)
    ticker.innerHTML = 'WELCOME TO THE ARCHIVE // UNRELEASED CONTENT AVAILABLE // USE HEADPHONES FOR BEST EXPERIENCE // PRESS SPACE TO MUTE/UNMUTE // SYSTEM ONLINE SINCE 2006 //';
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Command input handling - only for easter egg
    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = commandInput.value.trim();
                if (command === '2006') {
                    showEasterEgg();
                }
                commandInput.value = '';
            }
        });
    }
    
    // Audio control events
    document.getElementById('muteToggle').addEventListener('click', () => {
        AudioController.toggleMute();
    });
    
    document.getElementById('volumeUp').addEventListener('click', () => {
        AudioController.changeVolume(0.1);
    });
    
    document.getElementById('volumeDown').addEventListener('click', () => {
        AudioController.changeVolume(-0.1);
    });
}

/**
 * Show easter egg content
 */
function showEasterEgg() {
    const dialogBox = document.getElementById('dialogBox');
    const dialogContent = document.getElementById('dialogContent');
    
    dialogContent.textContent = 'WHAT GETS BIGGER THE MORE YOU TAKE AWAY?';
    dialogBox.classList.remove('hidden');
    
    const dialogInput = document.getElementById('dialogInput');
    dialogInput.addEventListener('keydown', function onEnter(e) {
        if (e.key === 'Enter') {
            const answer = dialogInput.value.trim().toLowerCase();
            dialogBox.classList.add('hidden');
            
            // Check answer
            if (answer === 'hole') {
                // Show success in content
                const contentEl = document.getElementById('content');
                const successLine = document.createElement('div');
                successLine.classList.add('line');
                successLine.textContent = 'ACCESS GRANTED: UNLOCKING HIDDEN CONTENT';
                successLine.style.color = 'var(--highlight)';
                contentEl.appendChild(successLine);
                
                // Reveal hidden content
                CMS.revealHiddenContent();
            }
            
            // Remove event listener
            dialogInput.removeEventListener('keydown', onEnter);
        }
    });
}

/**
 * Cursor blinking effect
 */
function blinkCursor() {
    document.querySelectorAll('.cursor').forEach(cursor => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    });
}
