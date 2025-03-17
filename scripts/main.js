/**
 * Main initialization script
 */

// Global state
const APP = {
    initialized: false,
    audioConsented: false,
    loginComplete: false
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Start everything immediately
    initAudioConsent();
    startLoginSequence();
    setupEventListeners();
    
    // Start cursor blink
    setInterval(blinkCursor, 500);
    
    // Initialize CMS immediately too
    CMS.init();
    
    // Start ticker
    initTicker();
});

/**
 * Start audio consent countdown
 */
function initAudioConsent() {
    const consentEl = document.getElementById('audioConsent');
    const countdownEl = document.getElementById('countdown');
    let timeLeft = 10;
    
    // Start countdown
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
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
    
    // Allow click on consent box too
    consentEl.addEventListener('click', () => {
        if (!APP.audioConsented) {
            clearInterval(countdownInterval);
            handleAudioConsent();
        }
    });
}

/**
 * Handle audio consent
 */
function handleAudioConsent() {
    APP.audioConsented = true;
    
    // Hide consent overlay
    document.getElementById('audioConsent').style.display = 'none';
    
    // Initialize audio
    AudioController.init();
}

/**
 * Start login sequence animation
 */
function startLoginSequence() {
    const loginText = document.getElementById('loginText');
    const promptText = document.getElementById('promptText');
    
    // Terminal boot text
    const loginLines = [
        'SYSTEM INITIALIZING...',
        'ACCESSING MEDIA ARCHIVE...',
        'BYPASSING SECURITY...',
        'AUTHORIZATION OVERRIDE',
        'ACCESS GRANTED'
    ];
    
    // Start typing animation
    Animation.typeSequence(loginText, loginLines, 80, 300, () => {
        // After login text, show command prompt
        setTimeout(() => {
            Animation.typeText(promptText, 'DISPLAYING CONTENT', 100, () => {
                // After typing completes, show content
                setTimeout(() => {
                    completeLogin();
                }, 500);
            });
        }, 300);
    });
}

/**
 * Complete login, show main content
 */
function completeLogin() {
    APP.loginComplete = true;
    
    // Hide login screen
    document.getElementById('loginScreen').classList.add('hidden');
    
    // Show main terminal
    document.getElementById('terminalContent').classList.remove('hidden');
}

/**
 * Initialize ticker
 */
function initTicker() {
    const ticker = document.getElementById('ticker');
    ticker.innerHTML = 'WELCOME TO THE ARCHIVE // UNRELEASED CONTENT AVAILABLE // USE HEADPHONES FOR BEST EXPERIENCE // PRESS SPACE FOR AUDIO // SYSTEM ONLINE SINCE 2006 //';
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Command input (for easter egg)
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
        
        // Auto-focus command input when clicking terminal
        document.getElementById('terminalContent').addEventListener('click', () => {
            commandInput.focus();
        });
    }
    
    // Audio controls
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
 * Show easter egg riddle
 */
function showEasterEgg() {
    const dialogBox = document.getElementById('dialogBox');
    const dialogContent = document.getElementById('dialogContent');
    
    // Display riddle
    dialogContent.textContent = 'WHAT GETS BIGGER THE MORE YOU TAKE AWAY?';
    dialogBox.classList.remove('hidden');
    
    // Focus input
    const dialogInput = document.getElementById('dialogInput');
    setTimeout(() => dialogInput.focus(), 100);
    
    // Handle answer
    dialogInput.addEventListener('keydown', function onEnter(e) {
        if (e.key === 'Enter') {
            const answer = dialogInput.value.trim().toLowerCase();
            dialogBox.classList.add('hidden');
            
            if (answer === 'hole') {
                // Success message
                const contentEl = document.getElementById('content');
                const successLine = document.createElement('div');
                successLine.classList.add('line');
                successLine.textContent = 'ACCESS GRANTED: UNLOCKING HIDDEN CONTENT';
                successLine.style.color = 'var(--highlight)';
                contentEl.appendChild(successLine);
                
                // Reveal hidden content
                CMS.revealHiddenContent();
            }
            
            dialogInput.removeEventListener('keydown', onEnter);
        }
    });
}

/**
 * Cursor blink effect
 */
function blinkCursor() {
    document.querySelectorAll('.cursor').forEach(cursor => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    });
}
