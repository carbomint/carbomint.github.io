class DiscordStatus {
    constructor(config) {
        this.config = config;
        this.loading = document.getElementById('discordLoading');
        this.content = document.getElementById('discordContent');
        this.error = document.getElementById('discordError');
        this.init();
    }

    async init() {
        if (!this.config?.userId) {
            console.error('No Discord user ID configured');
            this.showError();
            return;
        }
        this.fetchStatus();
        // Update every 30 seconds
        setInterval(() => this.fetchStatus(), 30000);
    }

    async fetchStatus() {
        try {
            console.log('Fetching Discord status from:', this.config.apiEndpoint);
            const response = await fetch(this.config.apiEndpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success && data.data) {
                this.displayStatus(data.data);
            } else {
                console.error('API returned success: false or no data');
                this.showError();
            }
        } catch (err) {
            console.error('Discord status fetch error:', err);
            this.showError();
        }
    }

    displayStatus(userData) {
        console.log('Displaying status for:', userData.username);
        
        // Hide loading, show content
        this.loading.style.display = 'none';
        this.error.style.display = 'none';
        this.content.style.display = 'block';

        // Avatar
        const avatar = document.getElementById('discordAvatar');
        if (userData.avatar) {
            avatar.src = `https://cdn.discordapp.com/avatars/${this.config.userId}/${userData.avatar}.png?size=128`;
        }
        avatar.alt = userData.username || 'Discord User';

        // Username
        document.getElementById('discordName').textContent = userData.username || userData.display_name || 'Unknown';

        // Status
        const status = userData.discord_status || 'offline';
        const statusDot = document.getElementById('discordDot');
        const statusText = document.getElementById('discordStatusText');
        
        const statusColors = {
            'online': '#43b581',
            'idle': '#faa61a',
            'dnd': '#f04747',
            'offline': '#747f8d'
        };
        
        statusDot.style.backgroundColor = statusColors[status] || '#747f8d';
        statusText.textContent = status;

        // Activity
        const activityElement = document.getElementById('discordActivity');
        const activityText = document.getElementById('discordActivityText');
        
        if (userData.activities && userData.activities.length > 0) {
            // Filter out custom status (type 4)
            const activity = userData.activities.find(a => a.type !== 4);
            if (activity) {
                activityText.textContent = activity.name || 'Unknown activity';
                activityElement.style.display = 'block';
            } else {
                activityElement.style.display = 'none';
            }
        } else {
            activityElement.style.display = 'none';
        }

        // Custom Status
        const customStatusElement = document.getElementById('discordCustomStatus');
        const customStatusText = document.getElementById('discordCustomText');
        
        const customStatus = userData.activities?.find(a => a.type === 4);
        if (customStatus?.state) {
            customStatusText.textContent = customStatus.state;
            customStatusElement.style.display = 'block';
        } else {
            customStatusElement.style.display = 'none';
        }
    }

    showError() {
        this.loading.style.display = 'none';
        this.content.style.display = 'none';
        this.error.style.display = 'block';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof DISCORD_CONFIG !== 'undefined') {
            new DiscordStatus(DISCORD_CONFIG);
        } else {
            console.error('DISCORD_CONFIG not defined');
        }
    });
} else {
    if (typeof DISCORD_CONFIG !== 'undefined') {
        new DiscordStatus(DISCORD_CONFIG);
    } else {
        console.error('DISCORD_CONFIG not defined');
    }
}
