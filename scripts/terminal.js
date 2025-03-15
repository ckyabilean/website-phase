/**
 * Terminal functionality and easter eggs
 */
const Terminal = {
    lineCount: 0,
    maxLines: 50,
    easterEggActivated: false,
    
    /**
     * Initialize the terminal
     */
    init: function() {
        // Set up command input focus
        this.setupCommandInput();
        
        // Add initial welcome message
        this.addInitialContent();
    },
    
    /**
     * Set up command input behavior
     */
    setupCommandInput: function() {
        const inputEl = document.getElementById('commandInput');
        if (!inputEl) return;
        
        // Focus input when terminal is clicked
        document.getElementById('terminalContent').addEventListener('click', () => {
            inputEl.focus();
        });
        
        // Auto-focus on init
        setTimeout(() => {
            inputEl.focus();
        }, 500);
    },
    
    /**
     * Add initial terminal content
     */
    addInitialContent: function() {
        const lines = [
            'TERMINAL v2.3.1 (c) 1993-2025',
            'SYSTEM READY',
            'TYPE "HELP" FOR AVAILABLE COMMANDS',
            '-----------------------------------',
            ''
        ];
        
        // Display with slight delay for effect
        setTimeout(() => {
            Animation.simulateScrolling(lines, () => {
                // After initial content, add CMS content if ready
                if (CMS.loadingComplete) {
                    CMS.updateTerminalContent();
                } else {
                    // Show loading message
                    Animation.addScrollingLine('LOADING DATA...');
                }
            });
        }, 500);
    },
    
    /**
     * Process terminal commands
     * @param {string} command - Command string
     */
    processCommand: function(command) {
        if (!command) return;
        
        // Add command to terminal output
        const commandLine = Animation.addScrollingLine(`> ${command}`);
        commandLine.style.color = 'var(--highlight)';
        
        // Process different commands
        const cmd = command.toLowerCase().trim();
        
        // Easter egg command
        if (cmd === '2006') {
            this.showRiddle();
            return;
        }
        
        // Handle other commands
        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
                
            case 'clear':
                this.clearTerminal();
                break;
                
            case 'list':
            case 'ls':
                this.listContent();
                break;
                
            case 'about':
                this.showAbout();
                break;
                
            case 'date':
            case 'time':
                this.showDateTime();
                break;
                
            default:
                Animation.addScrollingLine(`COMMAND NOT RECOGNIZED: ${command}`);
                Animation.addScrollingLine('TYPE "HELP" FOR AVAILABLE COMMANDS');
        }
    },
    
    /**
     * Show help message
     */
    showHelp: function() {
        const helpLines = [
            'AVAILABLE COMMANDS:',
            '-------------------',
            'HELP - Display this help message',
            'CLEAR - Clear the terminal',
            'LIST - Show available content',
            'ABOUT - Display information about the artist',
            'DATE - Show current date and time',
            '',
            'MORE COMMANDS MAY BE AVAILABLE...'
        ];
        
        Animation.simulateScrolling(helpLines);
    },
    
    /**
     * Clear the terminal
     */
    clearTerminal: function() {
        document.getElementById('content').innerHTML = '';
        Animation.addScrollingLine('TERMINAL CLEARED');
        Animation.addScrollingLine('');
    },
    
    /**
     * List available content
     */
    listContent: function() {
        // If CMS data isn't loaded, show loading message
        if (!CMS.loadingComplete) {
            Animation.addScrollingLine('LOADING DATA...');
            return;
        }
        
        // Re-display the tracks from CMS
        Animation.addScrollingLine('# MEDIA', 'h2');
        CMS.displayTracks();
    },
    
    /**
     * Show about information
     */
    showAbout: function() {
        const aboutLines = [
            'ARTIST INFORMATION',
            '-----------------',
            'NAME: [ARTIST NAME]',
            'GENRE: ELECTRONIC / EXPERIMENTAL',
            'ESTABLISHED: 2006',
            '',
            'FIND MORE INFORMATION AT:',
            'INSTAGRAM: @[HANDLE]',
            'TWITTER: @[HANDLE]',
            '',
            'STREAMING 24/7 - NEW RELEASES MONTHLY'
        ];
        
        Animation.simulateScrolling(aboutLines);
    },
    
    /**
     * Show current date and time
     */
    showDateTime: function() {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        Animation.addScrollingLine(`CURRENT DATE: ${dateString}`);
        Animation.addScrollingLine(`CURRENT TIME: ${timeString}`);
    },
    
    /**
     * Show riddle (easter egg)
     */
    showRiddle: function() {
        // Prevent activating multiple times
        if (this.easterEggActivated) {
            Animation.addScrollingLine('EASTER EGG ALREADY ACTIVATED');
            return;
        }
        
        this.easterEggActivated = true;
        
        // Get riddle from CMS
        const riddle = CMS.getRiddle();
        
        // Show dialog box
        const dialogBox = document.getElementById('dialogBox');
        const dialogContent = document.getElementById('dialogContent');
        const dialogInput = document.getElementById('dialogInput');
        
        dialogContent.textContent = riddle.question;
        dialogBox.classList.remove('hidden');
        
        // Focus dialog input
        setTimeout(() => {
            dialogInput.focus();
        }, 100);
    },
    
    /**
     * Process riddle answer
     * @param {string} answer - User's answer to the riddle
     */
    processDialogAnswer: function(answer) {
        // Get riddle from CMS
        const riddle = CMS.getRiddle();
        
        // Check if answer matches (case insensitive)
        const isCorrect = answer.toLowerCase().trim() === riddle.answer.toLowerCase().trim();
        
        // Hide dialog box
        document.getElementById('dialogBox').classList.add('hidden');
        
        // Display result in terminal
        if (isCorrect) {
            Animation.addScrollingLine('ACCESS GRANTED');
            Animation.addScrollingLine(riddle.reward);
            
            // Add some glitch effect for dramatic effect
            for (let i = 0; i < 3; i++) {
                const line = Animation.addScrollingLine(
                    Animation.corruptText('SYSTEM OVERRIDE SUCCESSFUL', 0.3)
                );
                line.style.color = 'var(--highlight)';
            }
            
            // Unlock hidden content
            this.unlockHiddenContent();
        } else {
            Animation.addScrollingLine('ACCESS DENIED');
            Animation.addScrollingLine('INCORRECT ANSWER');
            
            // Reset easter egg flag so they can try again
            this.easterEggActivated = false;
        }
    },
    
    /**
     * Unlock hidden content after easter egg
     */
    unlockHiddenContent: function() {
        // If we had CMS data, we would update the hidden tracks
        setTimeout(() => {
            // Simulate revealing a hidden track
            Animation.addScrollingLine('REVEALING HIDDEN CONTENT...');
            
            setTimeout(() => {
                // Re-display tracks with a new one revealed
                if (CMS.data && CMS.data.tracks) {
                    // Modify a random hidden track to be visible
                    const hiddenTracks = CMS.data.tracks.filter(track => !track.visible);
                    if (hiddenTracks.length > 0) {
                        const randomIndex = Math.floor(Math.random() * hiddenTracks.length);
                        const trackToReveal = hiddenTracks[randomIndex];
                        
                        // Find the actual index in the full array
                        const actualIndex = CMS.data.tracks.findIndex(track => 
                            track.title === trackToReveal.title);
                        
                        if (actualIndex !== -1) {
                            CMS.data.tracks[actualIndex].visible = true;
                            
                            // Re-display the tracks
                            CMS.displayTracks();
                        }
                    }
                }
            }, 1500);
        }, 1000);
    }
};
