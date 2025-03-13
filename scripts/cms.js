/**
 * Handles Google Sheets integration for CMS functionality
 */
const CMS = {
    sheetId: 'YOUR_GOOGLE_SHEET_ID', // Replace with actual ID
    apiKey: 'YOUR_API_KEY', // Replace with actual key
    data: null,
    
    init: function() {
        this.loadScript();
    },
    
    loadScript: function() {
        const script = document.createElement('script');
        script.src = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Sheet1?key=${this.apiKey}&callback=CMS.handleData`;
        document.body.appendChild(script);
    },
    
    handleData: function(response) {
        if (response.error) {
            console.error('Error fetching sheet data:', response.error);
            return;
        }
        
        // Store data
        this.data = this.parseSheetData(response.values);
        
        // Update content
        this.updateContent();
    },
    
    parseSheetData: function(values) {
        if (!values || values.length === 0) {
            return [];
        }
        
        const headers = values[0];
        const items = [];
        
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            const item = {};
            
            for (let j = 0; j < headers.length; j++) {
                item[headers[j]] = row[j] || '';
            }
            
            items.push(item);
        }
        
        return items;
    },
    
    updateContent: function() {
        if (!this.data || this.data.length === 0) return;
        
        // Access elements
        const headerLines = document.querySelectorAll('.header .line');
        const counter = document.getElementById('counter');
        
        // Update header lines with content from sheet
        this.data.forEach((item, index) => {
            if (index < headerLines.length && item.header) {
                headerLines[index].textContent = item.header;
            }
        });
        
        // Update counter/timestamps
        if (counter && this.data[0].timestamps) {
            const timestamps = this.data[0].timestamps.split(',');
            let counterHTML = '';
            
            timestamps.forEach((timestamp, index) => {
                const className = index === 0 ? 'time-entry current' : 'time-entry';
                counterHTML += `<div class="${className}">${timestamp.trim()}</div>`;
            });
            
            counter.innerHTML = counterHTML;
        }
    },
    
    // Get specific content by key
    getContent: function(key) {
        if (!this.data) return null;
        
        for (const item of this.data) {
            if (item.key === key) {
                return item.value;
            }
        }
        
        return null;
    }
};

// For callback from Google Sheets API
window.CMS = CMS;
