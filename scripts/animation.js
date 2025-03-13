/**
 * Handles text animation effects for the terminal
 */
const Animation = {
    // Store elements and state
    elements: {
        lines: null,
        container: null
    },
    
    // Initialize animation system
    init: function() {
        this.elements.lines = document.querySelectorAll('.line');
        this.elements.container = document.querySelector('.terminal-content');
        
        // Set up scrolling animations
        this.setupScrollEvent();
    },
    
    // Handle scroll animations
    setupScrollEvent: function() {
        // Demo animation - replace with your scroll logic
        setTimeout(() => {
            this.crashTextAnimation();
        }, 3000);
    },
    
    // Text crash animation
    crashTextAnimation: function() {
        this.elements.lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('crash-out');
                
                // Remove after animation completes
                setTimeout(() => {
                    if (line.parentNode) {
                        line.parentNode.removeChild(line);
                    }
                }, 500);
                
            }, index * 150); // Stagger effect
        });
    },
    
    // Add new content that scrolls up
    addContent: function(text) {
        const newLine = document.createElement('div');
        newLine.classList.add('line');
        newLine.textContent = text;
        
        this.elements.container.appendChild(newLine);
        
        // Trigger entrance animation
        setTimeout(() => {
            newLine.style.transform = 'translateY(0)';
        }, 10);
    }
};
