/**
 * Animation effects and text manipulations
 */
const Animation = {
    /**
     * Type text with a typewriter effect
     * @param {HTMLElement} element - Element to add text to
     * @param {string} text - Text to type
     * @param {number} speed - Typing speed in ms
     * @param {Function} callback - Optional callback when complete
     */
    typeText: function(element, text, speed = 50, callback = null) {
        let i = 0;
        element.textContent = '';
        
        const typing = setInterval(() => {
            // Random slight variation in timing for realism
            if (Math.random() > 0.9) {
                return; // Occasional pause
            }
            
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                if (callback) callback();
            }
        }, speed);
    },
    
    /**
     * Type a sequence of text lines
     * @param {HTMLElement} element - Element to add text to
     * @param {Array} lines - Array of text lines
     * @param {number} speed - Typing speed in ms
     * @param {number} lineDelay - Delay between lines in ms
     * @param {Function} callback - Optional callback when complete
     */
    typeSequence: function(element, lines, speed = 50, lineDelay = 500, callback = null) {
        let lineIndex = 0;
        element.innerHTML = '';
        
        const typeLine = () => {
            if (lineIndex >= lines.length) {
                if (callback) callback();
                return;
            }
            
            const lineElement = document.createElement('div');
            element.appendChild(lineElement);
            
            this.typeText(lineElement, lines[lineIndex], speed, () => {
                lineIndex++;
                setTimeout(typeLine, lineDelay);
            });
        };
        
        typeLine();
    },
    
    /**
     * Add scroll-in text from bottom 
     * @param {string} text - Text content
     * @param {string} htmlTag - Optional HTML tag
     * @returns {HTMLElement} The created element
     */
    addScrollingLine: function(text, htmlTag = 'div') {
        const contentEl = document.getElementById('content');
        const newLine = document.createElement(htmlTag);
        newLine.classList.add('line');
        newLine.textContent = text;
        
        contentEl.appendChild(newLine);
        
        // Trigger scroll to bottom
        setTimeout(() => {
            contentEl.scrollTop = contentEl.scrollHeight;
        }, 10);
        
        return newLine;
    },
    
    /**
     * Create line with occasional glitch effect
     * @param {string} text - Text content 
     * @param {string} htmlTag - Optional HTML tag
     * @returns {HTMLElement} The created element
     */
    addGlitchingLine: function(text, htmlTag = 'div') {
        const line = this.addScrollingLine('', htmlTag);
        
        // Split text into span elements for individual glitching
        for (let i = 0; i < text.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.textContent = text[i];
            
            // Random chance of glitching for each character
            if (Math.random() < 0.03) {
                charSpan.classList.add('glitch-letter');
            }
            
            line.appendChild(charSpan);
        }
        
        return line;
    },
    
    /**
     * Apply horizontal spacing animation as line "crashes out"
     * @param {HTMLElement} element - Element to animate 
     * @param {Function} callback - Optional callback when complete
     */
    crashLine: function(element, callback = null) {
        element.classList.add('spacing-out');
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            if (callback) callback();
        }, 500);
    },
    
    /**
     * Create underscores for placeholder text
     * @param {number} length - Number of characters
     * @returns {string} Underscore string
     */
    createPlaceholder: function(length) {
        return '_'.repeat(length);
    },
    
    /**
     * Add random corruption to text (glitching)
     * @param {string} text - Original text
     * @param {number} intensity - Corruption intensity (0-1)
     * @returns {string} Corrupted text
     */
    corruptText: function(text, intensity = 0.1) {
        const glitchChars = '@#$%&*!?<>/\\|[]{}~-_=+';
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < intensity) {
                // Replace with random glitch character
                const randIndex = Math.floor(Math.random() * glitchChars.length);
                result += glitchChars[randIndex];
            } else {
                result += text[i];
            }
        }
        
        return result;
    },
    
    /**
     * Simulate text scrolling with occasional corruption
     * @param {Array} lines - Array of text lines
     * @param {Function} callback - Optional callback when complete
     */
    simulateScrolling: function(lines, callback = null) {
        let index = 0;
        
        const scrollInterval = setInterval(() => {
            if (index >= lines.length) {
                clearInterval(scrollInterval);
                if (callback) callback();
                return;
            }
            
            // Add some random corruption to ~20% of lines
            const line = Math.random() < 0.2 ? 
                this.corruptText(lines[index], 0.1) : 
                lines[index];
            
            this.addGlitchingLine(line);
            index++;
        }, 100);
    }
};
