/**
 * CMS integration with Google Sheets
 */
const CMS = {
    sheetId: 'YOUR_GOOGLE_SHEET_ID', // Replace with actual Sheet ID
    apiKey: 'YOUR_API_KEY', // Replace with actual API key
    data: null,
    loadingComplete: false,
    
    /**
     * Initialize the CMS
     */
    init: function() {
        // For development, use mock data first
        this.loadMockData();
        
        // In production, load from Google Sheets
        // this.loadSheetData();
    },
    
    /**
     * Load data from Google Sheets API
     */
    loadSheetData: function() {
        const script = document.createElement('script');
        script.src = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Sheet1?key=${this.apiKey}&callback=CMS.handleSheetData`;
        document.body.appendChild(script);
    },
    
    /**
     * Handle the data returned from Google Sheets API
     */
    handleSheetData: function(response) {
        if (response.error) {
            console.error('Error loading sheet data:', response.error);
            return;
        }
        
        // Parse the sheet data into a usable format
        this.data = this.parseSheetData(response.values);
        this.loadingComplete = true;
        
        // Update terminal content with the data
        this.updateTerminalContent();
    },
    
    /**
     * Parse sheet data into structured format
     * @param {Array} values - Raw values from Google Sheets
     * @returns {Object} Structured data
     */
    parseSheetData: function(values) {
        if (!values || values.length === 0) {
            return null;
        }
        
        const headers = values[0];
        const result = {
            tracks: [],
            ticker: '',
            riddle: { question: '', answer: '', reward: '' }
        };
        
        // Start from row 1 (after headers)
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            const item = {};
            
            for (let j = 0; j < Math.min(headers.length, row.length); j++) {
                item[headers[j]] = row[j];
            }
            
            // Special handling for track items
            if (item.type === 'track') {
                result.tracks.push({
                    title: item.title || '',
                    url: item.url || '#',
                    visible: item.visible === 'TRUE'
                });
            } 
            // Handle ticker content
            else if (item.type === 'ticker') {
                result.ticker = item.content || '';
            }
            // Handle riddle content
            else if (item.type === 'riddle') {
                result.riddle = {
                    question: item.question || '',
                    answer: item.answer || '',
                    reward: item.reward || ''
                };
            }
        }
        
        return result;
    },
    
    /**
     * Update terminal content with CMS data
     */
    updateTerminalContent: function() {
        if (!this.data) return;
        
        // Update tracks list
        this.displayTracks();
        
        // Update ticker
        this.updateTicker();
    },
    
    /**
     * Display track list from CMS
     */
    displayTracks: function() {
        if (!this.data || !this.data.tracks) return;
        
        const contentEl = document.getElementById('content');
        contentEl.innerHTML = '';
        
        // Add header
        Animation.addScrollingLine('# TRACKLIST', 'h2');
        
        // Add each track
        this.data.tracks.forEach((track, index) => {
            const line = document.createElement('div');
            line.classList.add('line');
            
            // For visible tracks, show title with link
            if (track.visible) {
                // Create track number
                const trackNum = document.createElement('span');
                trackNum.textContent = `${index + 1}. `;
                line.appendChild(trackNum);
                
                // Create link if URL exists
                if (track.url && track.url !== '#') {
                    const link = document.createElement('a');
                    link.href = track.url;
                    link.textContent = track.title;
                    link.target = '_blank';
                    line.appendChild(link);
                } else {
                    // Just text if no URL
                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = track.title;
                    line.appendChild(titleSpan);
                }
            } 
            // For hidden tracks, show placeholders
            else {
                const trackNum = document.createElement('span');
                trackNum.textContent = `${index + 1}. `;
                line.appendChild(trackNum);
                
                // Create placeholder (underscores matching length of title)
                const placeholder = document.createElement('span');
                placeholder.classList.add('placeholder');
                placeholder.textContent = '_'.repeat(Math.max(5, track.title.length));
                line.appendChild(placeholder);
            }
            
            contentEl.appendChild(line);
        });
    },
    
    /**
     * Update ticker with CMS content
     */
    updateTicker: function() {
        if (!this.data || !this.data.ticker) return;
        
        const tickerEl = document.getElementById('ticker');
        if (tickerEl) {
            tickerEl.textContent = this.data.ticker;
        }
    },
    
    /**
     * Get riddle content
     * @returns {Object} Riddle data
     */
    getRiddle: function() {
        if (!this.data || !this.data.riddle) {
            return { 
                question: 'WHAT IS YOUR FAVORITE COLOR?', 
                answer: 'blue', 
                reward: 'ACCESS GRANTED' 
            };
        }
        
        return this.data.riddle;
    },
    
    /**
     * Load mock data for development
     */
    loadMockData: function() {
        this.data = {
            tracks: [
                { title: 'STATIC NOISE', url: '#', visible: true },
                { title: 'MIDNIGHT DRIVE', url: 'https://example.com', visible: true },
                { title: 'DARK MATTER', url: 'https://example.com', visible: false },
                { title: 'ECHO CHAMBER', url: 'https://example.com', visible: true },
                { title: 'DIGITAL DREAMS', url: 'https://example.com', visible: true },
                { title: 'VOID WALKER', url: '#', visible: false },
                { title: 'SYSTEM FAILURE', url: 'https://example.com', visible: true },
                { title: 'LOST SIGNAL', url: 'https://example.com', visible: false }
            ],
            ticker: 'WELCOME TO THE TERMINAL // MUSIC STREAMING LIVE 24/7 // USE HEADPHONES FOR BEST EXPERIENCE // NEXT DROP: 03.21.25 // EXPLORE THE SYSTEM // FIND THE HIDDEN TRACKS // STAY TUNED // SYSTEM ONLINE SINCE 2006 //',
            riddle: {
                question: 'WHAT GETS BIGGER THE MORE YOU TAKE AWAY?',
                answer: 'hole',
                reward: 'UNLOCKING HIDDEN TRACK: EVENT HORIZON'
            }
        };
        
        this.loadingComplete = true;
        
        // Small delay to simulate loading
        setTimeout(() => {
            this.updateTerminalContent();
        }, 1500);
    }
};

// Make callback available globally for Google Sheets API
window.CMS = CMS;
