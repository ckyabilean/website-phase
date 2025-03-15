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
        // Load mock data immediately
        this.loadMockData();
        
        // In production, use this instead:
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
            items: [],
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
            
            // Special handling for content items
            if (item.type === 'item') {
                result.items.push({
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
        
        // Display content items
        this.displayContent();
        
        // Update ticker
        this.updateTicker();
    },
    
    /**
     * Display content items from CMS
     */
    displayContent: function() {
        if (!this.data || !this.data.items) return;
        
        const contentEl = document.getElementById('content');
        contentEl.innerHTML = '';
        
        // Add header
        const headerLine = document.createElement('div');
        headerLine.classList.add('line');
        headerLine.textContent = '# MEDIA ARCHIVE';
        headerLine.style.color = 'var(--highlight)';
        headerLine.style.marginBottom = '1rem';
        contentEl.appendChild(headerLine);
        
        // Add each content item
        this.data.items.forEach((item) => {
            const line = document.createElement('div');
            line.classList.add('line');
            
            // For visible items, show title with link
            if (item.visible) {
                // Create link if URL exists
                if (item.url && item.url !== '#') {
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.textContent = item.title;
                    link.target = '_blank';
                    line.appendChild(link);
                } else {
                    // Just text if no URL
                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = item.title;
                    line.appendChild(titleSpan);
                }
            } 
            // For hidden items, show placeholders
            else {
                // Create placeholder (underscores matching length of title)
                const placeholder = document.createElement('span');
                placeholder.classList.add('placeholder');
                placeholder.textContent = '_'.repeat(Math.max(5, item.title.length));
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
                question: 'WHAT GETS BIGGER THE MORE YOU TAKE AWAY?', 
                answer: 'hole', 
                reward: 'ACCESS GRANTED' 
            };
        }
        
        return this.data.riddle;
    },
    
    /**
     * Reveal hidden content (for easter egg)
     */
    revealHiddenContent: function() {
        if (!this.data || !this.data.items) return;
        
        // Find a random hidden item
        const hiddenItems = this.data.items.filter(item => !item.visible);
        if (hiddenItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * hiddenItems.length);
            const randomItem = hiddenItems[randomIndex];
            
            // Find this item in the original array
            const itemIndex = this.data.items.findIndex(item => 
                item.title === randomItem.title && !item.visible);
            
            if (itemIndex !== -1) {
                // Mark as visible
                this.data.items[itemIndex].visible = true;
                
                // Re-display content
                this.displayContent();
            }
        }
    },
    
    /**
     * Load mock data for development
     */
    loadMockData: function() {
        this.data = {
            items: [
                { title: 'INTERVIEW: ROLLING STONE 2023', url: '#', visible: true },
                { title: 'ALBUM COVER OUTTAKES', url: 'https://example.com', visible: true },
                { title: 'STUDIO SESSION: LONDON', url: 'https://example.com', visible: true },
                { title: 'UNRELEASED MUSIC VIDEO', url: 'https://example.com', visible: true },
                { title: 'SYNTH COLLECTION', url: '#', visible: true },
                { title: 'SAMPLE PACK RELEASE', url: 'https://example.com', visible: true },
                { title: 'BERLIN LIVE SET', url: 'https://example.com', visible: true },
                { title: 'UNDERGROUND RADIO MIX', url: '#', visible: true },
                { title: 'MODULAR SETUP GUIDE', url: 'https://example.com', visible: true },
                { title: 'BACKSTAGE PHOTOS', url: 'https://example.com', visible: true },
                { title: 'STUDIO WALKTHROUGH', url: '#', visible: true },
                { title: 'COLLAB WITH APHEX TWIN', url: 'https://example.com', visible: false },
                { title: 'UNRELEASED REMIXES', url: 'https://example.com', visible: false },
                { title: 'HARDWARE SCHEMATICS', url: 'https://example.com', visible: true },
                { title: 'SECRET SHOW FOOTAGE', url: 'https://example.com', visible: false },
                { title: 'DOCUMENTARY PREVIEW', url: '#', visible: true },
                { title: 'HANDWRITTEN LYRICS', url: 'https://example.com', visible: true },
                { title: 'FESTIVAL AFTERMOVIE', url: 'https://example.com', visible: true },
                { title: 'PRODUCTION MASTERCLASS', url: 'https://example.com', visible: true },
                { title: 'RARE INTERVIEW FOOTAGE', url: '#', visible: false }
            ],
            ticker: 'WELCOME TO THE ARCHIVE // UNRELEASED CONTENT AVAILABLE // USE HEADPHONES FOR BEST EXPERIENCE // PRESS SPACE TO MUTE/UNMUTE // SYSTEM ONLINE SINCE 2006 // SECRET CONTENT HIDDEN SOMEWHERE // KEEP EXPLORING //',
            riddle: {
                question: 'WHAT GETS BIGGER THE MORE YOU TAKE AWAY?',
                answer: 'hole',
                reward: 'UNLOCKING HIDDEN TRACK: EVENT HORIZON'
            }
        };
        
        this.loadingComplete = true;
        
        // Update content immediately
        this.updateTerminalContent();
    }
};

// Make callback available globally for Google Sheets API
window.CMS = CMS;
