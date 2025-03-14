/**
 * Audio controller for YouTube integration
 */
const AudioController = {
    player: null,
    isPlaying: false,
    isMuted: false,
    volume: 0.8,
    videoId: 'YOUR_YOUTUBE_LIVESTREAM_ID', // Replace with actual ID
    
    /**
     * Initialize the audio controller
     */
    init: function() {
        this.loadYouTubeAPI();
        this.updateControls();
    },
    
    /**
     * Load the YouTube iframe API
     */
    loadYouTubeAPI: function() {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        // YouTube API will call this when loaded
        window.onYouTubeIframeAPIReady = this.createPlayer.bind(this);
    },
    
    /**
     * Create the YouTube player
     */
    createPlayer: function() {
        this.player = new YT.Player('player', {
            width: '1',
            height: '1',
            videoId: this.videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0
            },
            events: {
                'onReady': this.onPlayerReady.bind(this),
                'onStateChange': this.onPlayerStateChange.bind(this),
                'onError': this.onPlayerError.bind(this)
            }
        });
    },
    
    /**
     * Handle player ready event
     */
    onPlayerReady: function(event) {
        console.log('YouTube player ready');
        this.player.setVolume(this.volume * 100);
        this.player.playVideo();
        this.isPlaying = true;
        this.updateControls();
    },
    
    /**
     * Handle player state changes
     */
    onPlayerStateChange: function(event) {
        // YT.PlayerState.PLAYING = 1
        // YT.PlayerState.PAUSED = 2
        if (event.data === 1) {
            this.isPlaying = true;
        } else if (event.data === 2) {
            this.isPlaying = false;
        }
        
        this.updateControls();
    },
    
    /**
     * Handle player errors
     */
    onPlayerError: function(event) {
        console.error('YouTube player error:', event.data);
        
        // Create a fallback notification
        const line = Animation.addScrollingLine('ERROR: AUDIO STREAM NOT AVAILABLE');
        line.style.color = 'var(--warning-color)';
    },
    
    /**
     * Toggle audio mute state
     */
    toggleMute: function() {
        if (!this.player) return;
        
        if (this.isMuted) {
            this.player.unMute();
            this.isMuted = false;
        } else {
            this.player.mute();
            this.isMuted = true;
        }
        
        this.updateControls();
    },
    
    /**
     * Change volume
     * @param {number} delta - Volume change (-1 to 1)
     */
    changeVolume: function(delta) {
        if (!this.player) return;
        
        this.volume = Math.max(0, Math.min(1, this.volume + delta));
        this.player.setVolume(this.volume * 100);
        
        // If changing volume while muted, unmute
        if (this.isMuted && delta > 0) {
            this.player.unMute();
            this.isMuted = false;
        }
        
        this.updateControls();
    },
    
    /**
     * Update the audio control display
     */
    updateControls: function() {
        const muteEl = document.getElementById('muteToggle');
        
        if (muteEl) {
            muteEl.textContent = this.isMuted ? 'UNMUTE' : 'MUTE';
        }
        
        // Could add volume indicator if needed
    }
};
