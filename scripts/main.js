/**
 * Main initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    Animation.init();
    AudioController.init();
    CMS.init();
    
    // Add any additional initialization here
    setupTerminal();
});

/**
 * Terminal setup
 */
function setupTerminal() {
    // Add line numbers
    generateLineNumbers();
    
    // Add cursor blink
    setInterval(blinkCursor, 500);
}

/**
 * Generate line numbers in the sidebar
 */
function generateLineNumbers() {
    const linesContainer = document.querySelector('.terminal-content');
    const lineNumbersContainer = document.querySelector('.line-numbers');
    
    if (!linesContainer || !lineNumbersContainer) return;
    
    const lineCount = linesContainer.querySelectorAll('.line').length;
    
    for (let i = 1; i <= lineCount; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = `#${i}`;
        lineNumber.classList.add('line-number');
        lineNumbersContainer.appendChild(lineNumber);
    }
}

/**
 * Cursor blinking effect
 */
function blinkCursor() {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }
}
