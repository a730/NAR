document.addEventListener('DOMContentLoaded', function() {
    // Enhanced data simulation with real-time updates
    const data = {
        networkHealth: { status: "healthy", lastScan: "2025-07-18 16:00", detectedThreats: 0 },
        alerts: [
            { level: "warning", message: "Unusual DNS query behavior detected.", time: "2025-07-18 15:59" },
            { level: "error", message: "Potential data exfiltration detected.", time: "2025-07-18 16:02" }
        ],
        llmSummary: "Network activity is normal. No data exfiltration or known attack vectors detected. Recent increase in DNS traffic observed, but within expected range.",
        stats: { threats: 2, devices: 5, connections: 22 }
    };

    // Fancy loading animation for stats
    function animateCounter(element, target, duration = 2000) {
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

    // Typewriter effect for AI summary
    function typeWriter(element, text, speed = 50) {
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

    // Pulse animation for threat icons
    function pulseThreats() {
        const threatIcons = document.querySelectorAll('.threat-icon');
        threatIcons.forEach(icon => {
            icon.style.animation = 'pulse 2s infinite';
        });
    }

    // Rotate pie chart animation
    function animatePieChart() {
        const pieChart = document.querySelector('.pie-chart');
        if (pieChart) {
            pieChart.style.animation = 'rotate 10s linear infinite';
        }
    }

    // Loading states
    function showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading-spinner"></div>';
        }
    }

    function hideLoading(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            setTimeout(() => {
                element.innerHTML = content;
            }, 1000);
        }
    }

    // Enhanced snackbar with different types
    function showSnackbar(message, type = 'info', duration = 4000) {
        const snackbar = document.getElementById('snackbar') || createSnackbar();
        snackbar.textContent = message;
        snackbar.className = `snackbar show ${type}`;
        
        setTimeout(() => {
            snackbar.className = snackbar.className.replace('show', '');
        }, duration);
    }

    function createSnackbar() {
        const snackbar = document.createElement('div');
        snackbar.id = 'snackbar';
        snackbar.className = 'snackbar';
        document.body.appendChild(snackbar);
        return snackbar;
    }

    // Initialize loading states
    showLoading('health-status');
    showLoading('last-scan');
    showLoading('detected-threats');
    showLoading('alerts-list');
    showLoading('llm-summary');

    // Simulate data loading with delays
    setTimeout(() => {
        // Update Network Health with animation
        hideLoading('health-status', data.networkHealth.status);
        hideLoading('last-scan', data.networkHealth.lastScan);
        hideLoading('detected-threats', data.networkHealth.detectedThreats);

        // Animate stat counters
        const statsElements = document.querySelectorAll('.stat .value');
        statsElements.forEach((el, index) => {
            const values = [data.stats.threats, data.stats.devices, data.stats.connections];
            if (values[index]) {
                animateCounter(el, values[index]);
            }
        });

        // Update Alerts with fancy animation
        const alertsList = document.getElementById('alerts-list');
        if (data.alerts.length === 0) {
            hideLoading('alerts-list', '<p>No alerts.</p>');
        } else {
            let alertsHTML = '';
            data.alerts.forEach((alert, index) => {
                alertsHTML += `<div class="alert alert-${alert.level}" style="animation-delay: ${index * 0.2}s">[${alert.time}] ${alert.message}</div>`;
            });
            hideLoading('alerts-list', alertsHTML);
            
            // Show notification
            setTimeout(() => {
                showSnackbar(`${data.alerts.length} network alerts detected!`, 'warning');
            }, 1500);
        }

        // Typewriter effect for AI summary
        setTimeout(() => {
            const summaryElement = document.getElementById('llm-summary');
            if (summaryElement) {
                typeWriter(summaryElement, data.llmSummary, 30);
            }
        }, 2000);

        // Start fancy animations
        setTimeout(() => {
            pulseThreats();
            animatePieChart();
        }, 3000);

    }, 500);

    // Enhanced click handlers with visual feedback
    function addClickHandler(elementId, url, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('click', function(e) {
                // Visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-3px)';
                }, 150);

                // Show loading message
                showSnackbar(`Loading ${message}...`, 'info', 2000);
                
                // Navigate after delay
                setTimeout(() => {
                    window.location.href = url;
                }, 1000);
            });

            // Hover effects
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
                this.style.boxShadow = '0 8px 25px rgba(0,123,255,0.15)';
            });

            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-3px) scale(1)';
                this.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.08)';
            });
        }
    }

    // Add enhanced click handlers
    addClickHandler('threats-stat', 'threats.html', 'Threats Dashboard');
    addClickHandler('devices-stat', 'devices.html', 'Devices Dashboard');
    addClickHandler('connections-stat', 'connections.html', 'Connections Dashboard');
    addClickHandler('threats-box', 'threats-details.html', 'Threat Details');
    addClickHandler('devices-box', 'devices-details.html', 'Device Details');

    // Auto-refresh functionality
    function autoRefresh() {
        // Simulate new data
        const newThreatCount = Math.floor(Math.random() * 5) + 1;
        const newDeviceCount = Math.floor(Math.random() * 10) + 3;
        const newConnectionCount = Math.floor(Math.random() * 50) + 10;

        // Update counters with animation
        setTimeout(() => {
            const statsElements = document.querySelectorAll('.stat .value');
            if (statsElements[0]) animateCounter(statsElements[0], newThreatCount, 1000);
            if (statsElements[1]) animateCounter(statsElements[1], newDeviceCount, 1000);
            if (statsElements[2]) animateCounter(statsElements[2], newConnectionCount, 1000);
        }, 1000);

        // Random new alert
        if (Math.random() > 0.7) {
            setTimeout(() => {
                showSnackbar('New security event detected!', 'warning');
            }, 2000);
        }
    }

    // Start auto-refresh every 30 seconds
    setInterval(autoRefresh, 30000);

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'r':
                    e.preventDefault();
                    showSnackbar('Refreshing dashboard...', 'info');
                    setTimeout(() => location.reload(), 1000);
                    break;
                case '1':
                    e.preventDefault();
                    document.getElementById('threats-stat')?.click();
                    break;
                case '2':
                    e.preventDefault();
                    document.getElementById('devices-stat')?.click();
                    break;
                case '3':
                    e.preventDefault();
                    document.getElementById('connections-stat')?.click();
                    break;
            }
        }
    });

    // Add floating particles effect
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                particle.style.animationDelay = Math.random() * 2 + 's';
                particlesContainer.appendChild(particle);

                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 5000);
            }, i * 100);
        }
    }

    // Easter egg - double click logo for particles
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('dblclick', function() {
            createParticles();
            showSnackbar('✨ Easter egg activated! ✨', 'success');
        });
    }

    console.log('🚀 Enhanced NAR Dashboard loaded with fancy animations!');
    showSnackbar('Dashboard loaded successfully!', 'success', 3000);
});
