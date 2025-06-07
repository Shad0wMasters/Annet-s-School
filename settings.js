document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Get all settings elements
    const settingsForm = {
        // Account Settings
        emailNotifications: document.getElementById('emailNotifications'),
        smsNotifications: document.getElementById('smsNotifications'),
        twoFactorAuth: document.getElementById('twoFactorAuth'),
        
        // Privacy Settings
        profileVisibility: document.getElementById('profileVisibility'),
        onlineStatus: document.getElementById('onlineStatus'),
        shareProgress: document.getElementById('shareProgress'),
        
        // Appearance Settings
        themeSelect: document.getElementById('themeSelect'),
        fontSize: document.getElementById('fontSize'),
        animations: document.getElementById('animations'),
        
        // Language Settings
        language: document.getElementById('language'),
        timezone: document.getElementById('timezone')
    };

    // Load saved settings
    loadSettings();

    // Add event listeners for all settings changes
    Object.keys(settingsForm).forEach(key => {
        const element = settingsForm[key];
        if (element) {
            if (element.type === 'checkbox') {
                element.addEventListener('change', () => {
                    saveSettings();
                    showSuccessMessage();
                });
            } else if (element.tagName === 'SELECT') {
                element.addEventListener('change', () => {
                    saveSettings();
                    showSuccessMessage();
                    applySettings();
                });
            }
        }
    });

    // Save button click handler
    const saveButton = document.querySelector('.save-settings-btn');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            saveSettings();
            showSuccessMessage();
        });
    }

    // Function to load settings from localStorage
    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem(`settings_${currentUser.email}`)) || getDefaultSettings();
        
        Object.keys(settingsForm).forEach(key => {
            const element = settingsForm[key];
            if (element && savedSettings[key] !== undefined) {
                if (element.type === 'checkbox') {
                    element.checked = savedSettings[key];
                } else if (element.tagName === 'SELECT') {
                    element.value = savedSettings[key];
                }
            }
        });

        // Apply settings on load
        applySettings();
    }

    // Function to save settings to localStorage
    function saveSettings() {
        const settings = {};
        
        Object.keys(settingsForm).forEach(key => {
            const element = settingsForm[key];
            if (element) {
                if (element.type === 'checkbox') {
                    settings[key] = element.checked;
                } else if (element.tagName === 'SELECT') {
                    settings[key] = element.value;
                }
            }
        });

        localStorage.setItem(`settings_${currentUser.email}`, JSON.stringify(settings));
    }

    // Function to get default settings
    function getDefaultSettings() {
        return {
            emailNotifications: true,
            smsNotifications: false,
            twoFactorAuth: false,
            profileVisibility: 'public',
            onlineStatus: true,
            shareProgress: true,
            themeSelect: 'light',
            fontSize: 'medium',
            animations: true,
            language: 'en',
            timezone: 'UTC+2'
        };
    }

    // Function to show success message
    function showSuccessMessage() {
        // Remove existing success message
        const existingMessage = document.querySelector('.settings-success');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new success message
        const message = document.createElement('div');
        message.className = 'settings-success';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Settings saved successfully!
        `;

        document.body.appendChild(message);

        // Show message with animation
        setTimeout(() => {
            message.classList.add('show');
        }, 100);

        // Remove message after 3 seconds
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    }

    // Function to apply settings
    function applySettings() {
        // Apply theme
        const theme = settingsForm.themeSelect.value;
        document.body.className = theme;

        // Apply font size
        const fontSize = settingsForm.fontSize.value;
        document.documentElement.style.fontSize = {
            'small': '14px',
            'medium': '16px',
            'large': '18px'
        }[fontSize] || '16px';

        // Apply animations
        if (!settingsForm.animations.checked) {
            document.body.style.setProperty('--transition', 'none');
        } else {
            document.body.style.setProperty('--transition', 'all 0.3s ease');
        }

        // Apply language
        const language = settingsForm.language.value;
        // Here you would typically implement language switching logic
        // For now, we'll just save the preference
    }
}); 