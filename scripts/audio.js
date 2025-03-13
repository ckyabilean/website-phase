/**
 * Handles YouTube audio integration and playback
 */
const AudioController = {
    player: null,
    isPlaying: false,
    videoId: 'YOUR_YOUTUBE_LIVESTREAM_ID', // Replace with actual ID
    
    init: function() {
        // Load YouTube API
        this.loadYouTubeAPI();
        
        // Set up controls
        this.setupControls();
    },
    
    loadYouTubeAPI: function() {
        // Create script tag
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        
        // Insert before first script tag
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        // YouTube API will call onYouTubeIframeAPIReady when loaded
        window.onYouTubeIframeAPIReady = this.createPlayer.bind(this);
    },
    
    createPlayer: function() {
        this.player = new YT.Player('player', {
            height: '0',
            width: '0',
            videoId: this.videoId,
            playerVars: {
                autoplay: 0,
                controls: 0
            },
            events: {
                'onReady': this.onPlayerReady.bind(this),
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
    },
    
    onPlayerReady: function(event) {
        console.log('YouTube player ready');
    },
    
    onPlayerStateChange: function(event) {
        // Update UI based on player state
        if (event.data === YT.PlayerState.PLAYING) {
            this.updatePlaybackStatus(true);
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            this.updatePlaybackStatus(false);
        }
    },
    
    setupControls: function() {
        // Space key control
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlayback();
            }
        });
        
        // Button control
        const playButton = document.getElementById('playButton');
        if (playButton) {
            playButton.addEventListener('click', () => {
                this.togglePlayback();
            });
        }
    },
    
    togglePlayback: function() {
        if (!this.player) return;
        
        if (this.isPlaying) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
        
        this.isPlaying = !this.isPlaying;
        this.updatePlaybackStatus(this.isPlaying);
    },
    
    updatePlaybackStatus: function(isPlaying) {
        const statusEl = document.getElementById('audioStatus');
        const buttonEl = document.getElementById('playButton');
        
        if (statusEl) {
            statusEl.textContent = isPlaying ? 'AUDIO ON' : 'AUDIO OFF';
        }
        
        if (buttonEl) {
            buttonEl.textContent = isPlaying ? 'PRESS SPACE TO PAUSE' : 'PRESS SPACE TO PLAY';
        }
    }
};
