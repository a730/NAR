// NAR Zero Configuration
window.NAR_CONFIG = {
    // App information
    app: {
        name: "NAR Zero",
        version: "1.0.0",
        description: "Home Network Security Dashboard"
    },

    // Dashboard settings
    dashboard: {
        refreshInterval: 30000, // 30 seconds
        animationSpeed: 300,
        enableNotifications: true,
        enableAnimations: true,
        autoScan: true
    },

    // Mock data for demonstration
    mockData: {
        networkStatus: {
            isOnline: true,
            lastCheck: new Date().toLocaleTimeString(),
            threatLevel: "low"
        },
        
        devices: [
            {
                id: "laptop-001",
                name: "Your Laptop",
                type: "laptop",
                icon: "💻",
                status: "safe",
                ip: "192.168.1.101",
                lastSeen: "Just now",
                dataUsage: "2.4 MB/s"
            },
            {
                id: "tv-001",
                name: "Smart TV",
                type: "smart-tv",
                icon: "📺",
                status: "warning",
                ip: "192.168.1.150",
                lastSeen: "2 minutes ago",
                dataUsage: "24.8 MB/s"
            },
            {
                id: "phone-001",
                name: "iPhone",
                type: "mobile",
                icon: "📱",
                status: "safe",
                ip: "192.168.1.125",
                lastSeen: "Active now",
                dataUsage: "1.2 MB/s"
            }
        ],

        threats: [
            {
                id: "threat-001",
                title: "Smart TV sending unusual data",
                description: "Your Samsung TV is sending more data than usual. This might be normal or could indicate a problem.",
                device: "Smart TV",
                deviceIcon: "📺",
                priority: "high",
                time: "2 minutes ago",
                ip: "192.168.1.150",
                status: "active"
            }
        ],

        stats: {
            totalDevices: 5,
            secureDevices: 4,
            attentionNeeded: 1,
            threatsDetected: 1,
            networkSpeed: "2.4 MB/s"
        }
    },

    // AI responses for different queries
    aiResponses: {
        "What should I do about my TV?": "Your Smart TV is uploading 10x more data than usual. I recommend temporarily blocking it and checking if there's a software update. If the high usage continues, consider factory resetting the device.",
        
        "Is my network safe?": "Overall, your network is secure. I've detected one device (Smart TV) with unusual behavior, but your other devices are operating normally. I'm monitoring the situation.",
        
        "Show me all my devices": "You have 5 connected devices: Laptop (safe), Smart TV (needs attention), iPhone (safe), Router (safe), and Smart Speaker (safe). Would you like details about any specific device?",
        
        "default": "I'm here to help with your network security. You can ask me about specific devices, threats, or general network health. What would you like to know?"
    },

    // Theme settings
    theme: {
        default: "light",
        enableDarkMode: true,
        respectSystemPreference: true
    },

    // Notification settings
    notifications: {
        enabled: true,
        duration: 5000,
        position: "top-right",
        types: {
            success: "✅",
            warning: "⚠️",
            error: "❌",
            info: "ℹ️"
        }
    },

    // Security levels
    securityLevels: {
        safe: {
            color: "#28a745",
            label: "Safe",
            icon: "✅"
        },
        warning: {
            color: "#ffc107",
            label: "Attention Needed",
            icon: "⚠️"
        },
        danger: {
            color: "#dc3545",
            label: "High Risk",
            icon: "❌"
        }
    }
};
