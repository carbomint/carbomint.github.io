class DiscordStatus {
    constructor(config) {
        this.config = config;
        this.statusCard = document.getElementById('discordCard');
        this.loading = document.getElementById('discordLoading');
        this.content = document.getElementById('discordContent');
        this.error = document.getElementById('discordError');
        this.init();
    }

    async init() {
        if (!this.config?.userId) {
            this.showError();
            return;
        }
        this.fetchStatus();
        // Update every 30 seconds
        setInterval(() => this.fetchStatus(), 30000);
    }

    async fetchStatus() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) throw new Error('Failed to fetch');
            
            const data = await response.json();
            if (data.success) {
                this.displayStatus(data.data);
            }
        } catch (err) {
            console.error('Discord status fetch error:', err);
            this.showError();
        }
    }

    displayStatus(userData) {
        // Hide loading, show content
        this.loading.style.display = 'none';
        this.error.style.display = 'none';
        this.content.style.display = 'block';

        // Avatar
        const avatar = document.getElementById('discordAvatar');
        const userId = this.config.userId;
        const discriminator = userData.discriminator || '0';
        avatar.src = `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.png?size=128`;
        avatar.alt = userData.username;

        // Username
        document.getElementById('discordName').textContent = userData.username || 'Unknown';

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
            const activity = userData.activities[0];
            activityText.textContent = activity.name || 'Unknown activity';
            activityElement.style.display = 'block';
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
        new DiscordStatus(DISCORD_CONFIG);
    });
} else {
    new DiscordStatus(DISCORD_CONFIG);
}