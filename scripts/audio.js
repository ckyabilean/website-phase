/**
 * Audio controller for YouTube integration
 */
const AudioController = {
    player: null,
    isPlaying: false,
    isMuted: false,
    volume: 0.8,
    // Restore your original YouTube ID here
    videoId: 'jfKfPfyJRdk',
    
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
        try {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // YouTube API will call this when loaded
            window.onYouTubeIframeAPIReady = this.createPlayer.bind(this);
        } catch (error) {
            console.error('Error loading YouTube API:', error);
            // Continue with site functionality even if YouTube fails
        }
    },
    
    /**
     * Create the YouTube player
     */
    createPlayer: function() {
        try {
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
        } catch (error) {
            console.error('Error creating YouTube player:', error);
            // Continue with site functionality
        }
    },
    
    /**
     * Handle player ready event
     */
    onPlayerReady: function(event) {
        try {
            console.log('YouTube player ready');
            this.player.setVolume(this.volume * 100);
            this.player.playVideo();
            this.isPlaying = true;
            this.updateControls();
        } catch (error) {
            console.error('Error in player ready:', error);
        }
    },
    
    /**
     * Handle player state changes
     */
    onPlayerStateChange: function(event) {
        try {
            // YT.PlayerState.PLAYING = 1
            // YT.PlayerState.PAUSED = 2
            if (event.data === YT.PlayerState.PLAYING) {
                this.isPlaying = true;
            } else if (event.data === YT.PlayerState.PAUSED) {
                this.isPlaying = false;
            }
            
            this.updateControls();
        } catch (error) {
            console.error('Error in state change:', error);
        }
    },
    
    /**
     * Handle player errors
     */
    onPlayerError: function(event) {
        console.error('YouTube player error:', event.data);
        // Silently fail - don't show visible errors
    },
    
    /**
     * Toggle audio mute state
     */
    toggleMute: function() {
        if (!this.player) return;
        
        try {
            if (this.isMuted) {
                this.player.unMute();
                this.isMuted = false;
            } else {
                this.player.mute();
                this.isMuted = true;
            }
            
            this.updateControls();
        } catch (error) {
            console.error('Error toggling mute:', error);
        }
    },
    
    /**
     * Change volume
     * @param {number} delta - Volume change (-1 to 1)
     */
    changeVolume: function(delta) {
        if (!this.player) return;
        
        try {
            this.volume = Math.max(0, Math.min(1, this.volume + delta));
            this.player.setVolume(this.volume * 100);
            
            // If changing volume while muted, unmute
            if (this.isMuted && delta > 0) {
                this.player.unMute();
                this.isMuted = false;
            }
            
            this.updateControls();
        } catch (error) {
            console.error('Error changing volume:', error);
        }
    },
    
    /**
     * Update the audio control display
     */
    updateControls: function() {
        const muteEl = document.getElementById('muteToggle');
        
        if (muteEl) {
            muteEl.textContent = this.isMuted ? 'UNMUTE' : 'MUTE';
        }
    }
};
