// NAR Zero Dashboard Application
class NARApp {
    constructor() {
        this.config = window.NAR_CONFIG;
        this.currentPage = 'dashboard';
        this.theme = localStorage.getItem('nar-theme') || 'light';
        this.init();
    }

    init() {
        console.log('🛡️ NAR Zero Dashboard starting...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupTheme();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoRefresh();
        this.showWelcomeMessage();
        
        console.log('✅ NAR Zero Dashboard ready!');
    }

    setupTheme() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();

        // Set up theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('nar-theme', this.theme);
        this.updateThemeIcon();
        this.showNotification('Theme changed', 'info');
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'light' ? '🌙' : '☀️';
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                }
            });
        });
    }

    setupEventListeners() {
        // Status cards
        this.setupCardClicks();
        
        // AI input
        this.setupAIInput();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Online/offline detection
        this.setupConnectivityDetection();
    }

    setupCardClicks() {
        const cards = document.querySelectorAll('.status-card, .device-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleCardClick(card);
            });
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardClick(card);
                }
            });
        });
    }

    handleCardClick(card) {
        // Add visual feedback
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Determine action based on card type
        if (card.classList.contains('status-card')) {
            if (card.id === 'safetyCard') {
                this.showPage('threats');
            } else if (card.id === 'devicesCard') {
                this.showPage('devices');
            }
        } else if (card.classList.contains('device-card')) {
            const deviceId = card.getAttribute('data-device');
            if (deviceId) {
                this.showDeviceDetails(deviceId);
            }
        }
    }

    setupAIInput() {
        const aiInput = document.getElementById('aiInput');
        const aiSendBtn = document.getElementById('aiSendBtn');

        if (aiInput && aiSendBtn) {
            const sendMessage = () => {
                const message = aiInput.value.trim();
                if (message) {
                    this.sendAIMessage(message);
                    aiInput.value = '';
                }
            };

            aiSendBtn.addEventListener('click', sendMessage);
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.showPage('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showPage('threats');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showPage('devices');
                        break;
                    case '4':
                        e.preventDefault();
                        this.showPage('help');
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
        });
    }

    setupConnectivityDetection() {
        const updateConnectionStatus = () => {
            const statusDot = document.getElementById('connectionStatus');
            const offlineBanner = document.getElementById('offlineBanner');
            
            if (navigator.onLine) {
                if (statusDot) statusDot.className = 'status-dot online';
                if (offlineBanner) offlineBanner.classList.add('hidden');
            } else {
                if (statusDot) statusDot.className = 'status-dot';
                if (offlineBanner) offlineBanner.classList.remove('hidden');
            }
        };

        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        updateConnectionStatus();
    }

    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Show requested page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Announce page change for screen readers
        this.announcePageChange(pageId);
    }

    announcePageChange(pageId) {
        const pageNames = {
            dashboard: 'Dashboard',
            threats: 'Threats',
            devices: 'Devices',
            help: 'Help'
        };
        
        const announcement = document.createElement('div');
        announcement.textContent = `Navigated to ${pageNames[pageId]} page`;
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    loadInitialData() {
        // Update device count
        this.updateDeviceCount();
        
        // Update last check time
        this.updateLastCheckTime();
        
        // Update data flow
        this.updateDataFlow();
        
        // Load threat data
        this.loadThreats();
    }

    updateDeviceCount() {
        const deviceCountEl = document.getElementById('deviceCount');
        if (deviceCountEl) {
            this.animateCounter(deviceCountEl, this.config.mockData.stats.totalDevices);
        }
    }

    updateLastCheckTime() {
        const lastCheckEl = document.getElementById('lastCheck');
        if (lastCheckEl) {
            lastCheckEl.textContent = this.config.mockData.networkStatus.lastCheck;
        }
    }

    updateDataFlow() {
        const dataFlowEl = document.getElementById('dataFlow');
        if (dataFlowEl) {
            dataFlowEl.textContent = this.config.mockData.stats.networkSpeed;
        }
    }

    loadThreats() {
        const threatList = document.getElementById('threatList');
        if (!threatList) return;

        const threats = this.config.mockData.threats;
        if (threats.length === 0) {
            this.showNoThreats();
        } else {
            // Threats are already in HTML, just make sure they're visible
            const threatItems = threatList.querySelectorAll('.threat-item');
            threatItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    }

    showNoThreats() {
        const threatList = document.getElementById('threatList');
        const noThreats = document.getElementById('noThreats');
        
        if (threatList && noThreats) {
            const threatItems = threatList.querySelectorAll('.threat-item');
            threatItems.forEach(item => item.classList.add('hidden'));
            noThreats.classList.remove('hidden');
        }
    }

    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    handleThreat(action) {
        const messages = {
            block: '🛡️ Blocking Smart TV temporarily...',
            investigate: '🔍 Starting detailed investigation...'
        };

        this.showNotification(messages[action] || 'Processing...', 'info');
        
        setTimeout(() => {
            if (action === 'block') {
                this.showNotification('✅ Smart TV has been blocked successfully!', 'success');
                this.updateThreatStatus('blocked');
            } else if (action === 'investigate') {
                this.showNotification('📊 Investigation complete - likely software update', 'success');
            }
        }, 2000);
    }

    updateThreatStatus(status) {
        const threatItems = document.querySelectorAll('.threat-item');
        threatItems.forEach(item => {
            if (status === 'blocked') {
                item.style.opacity = '0.6';
                const indicator = item.querySelector('.threat-indicator');
                if (indicator) {
                    indicator.style.background = '#28a745';
                }
            }
        });
    }

    askAI(question) {
        this.sendAIMessage(question);
    }

    sendAIMessage(message = null) {
        const aiInput = document.getElementById('aiInput');
        const query = message || (aiInput ? aiInput.value.trim() : '');
        
        if (!query) return;

        this.showNotification('🤖 AI is thinking...', 'info');

        // Simulate AI processing time
        setTimeout(() => {
            const response = this.getAIResponse(query);
            this.displayAIResponse(query, response);
        }, 1500);
    }

    getAIResponse(query) {
        const responses = this.config.aiResponses;
        return responses[query] || responses.default;
    }

    displayAIResponse(query, response) {
        const aiMessage = document.getElementById('aiMessage');
        if (!aiMessage) return;

        const messageContent = aiMessage.querySelector('.message-bubble p');
        if (messageContent) {
            this.typeWriter(messageContent, `You asked: "${query}"\n\n${response}`, 30);
        }
    }

    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    showDeviceDetails(deviceId) {
        const device = this.config.mockData.devices.find(d => d.id === deviceId);
        if (!device) return;

        this.showNotification(`📱 Loading details for ${device.name}...`, 'info');
        
        // For now, just navigate to devices page
        setTimeout(() => {
            this.showPage('devices');
        }, 1000);
    }

    addNewDevice() {
        this.showNotification('➕ Device discovery started...', 'info');
        
        setTimeout(() => {
            this.showNotification('🔍 Scanning for new devices on your network', 'info');
        }, 1500);
    }

    blockDevice(deviceId) {
        this.showNotification('🛡️ Blocking device access...', 'warning');
        
        setTimeout(() => {
            this.showNotification('✅ Device blocked successfully!', 'success');
        }, 2000);
    }

    investigateDevice(deviceId) {
        this.showNotification('🔍 Starting device investigation...', 'info');
        
        setTimeout(() => {
            this.showNotification('📊 Investigation complete - no threats found', 'success');
        }, 3000);
    }

    ignoreAlert(deviceId) {
        this.showNotification('✓ Alert marked as normal', 'success');
        this.updateThreatStatus('ignored');
    }

    startAutoRefresh() {
        if (this.config.dashboard.refreshInterval > 0) {
            setInterval(() => {
                this.refreshData();
            }, this.config.dashboard.refreshInterval);
        }
    }

    refreshData() {
        // Update timestamps and dynamic data
        this.updateLastCheckTime();
        
        // Simulate random data changes occasionally
        if (Math.random() > 0.8) {
            const newSpeed = (Math.random() * 10 + 1).toFixed(1);
            const dataFlowEl = document.getElementById('dataFlow');
            if (dataFlowEl) {
                dataFlowEl.textContent = `${newSpeed} MB/s`;
            }
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        if (!this.config.notifications.enabled) return;

        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.config.notifications.types[type] || 'ℹ️';
        toast.innerHTML = `${icon} ${message}`;
        
        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('🛡️ NAR Zero is protecting your network!', 'success', 4000);
        }, 1000);
    }
}

// Initialize the app when the script loads
window.narApp = new NARApp();
