document.addEventListener('DOMContentLoaded', function() {
    // Simulated data fetching
    const data = {
        networkHealth: { status: "healthy", lastScan: "2025-07-18 16:00", detectedThreats: 0 },
        alerts: [
            { level: "warning", message: "Unusual DNS query behavior detected.", time: "2025-07-18 15:59" }
        ],
        llmSummary: "Network activity is normal. No data exfiltration or known attack vectors detected. Recent increase in DNS traffic observed, but within expected range."
    };

    // Update Network Health
    document.getElementById('health-status').textContent = data.networkHealth.status;
    document.getElementById('last-scan').textContent = data.networkHealth.lastScan;
    document.getElementById('detected-threats').textContent = data.networkHealth.detectedThreats;

    // Update Alerts
    const alertsList = document.getElementById('alerts-list');
    if (data.alerts.length === 0) {
        alertsList.innerHTML = '<p>No alerts.</p>';
    } else {
        data.alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert';
            alertDiv.textContent = `[${alert.time}] ${alert.message}`;
            alertsList.appendChild(alertDiv);
        });
        // Show snackbar if alerts exist
        const snackbar = document.getElementById('snackbar');
        snackbar.className = 'snackbar show';
        setTimeout(() => { snackbar.className = snackbar.className.replace('show', ''); }, 6000);
    }

    // Update AI Summary
    document.getElementById('llm-summary').textContent = data.llmSummary;

    // Existing click event listeners (from previous)
    document.getElementById('threats-stat').addEventListener('click', function() {
        window.location.href = 'threats.html';
    });
    document.getElementById('devices-stat').addEventListener('click', function() {
        window.location.href = 'devices.html';
    });
    document.getElementById('connections-stat').addEventListener('click', function() {
        window.location.href = 'connections.html';
    });
    document.getElementById('threats-box').addEventListener('click', function() {
        window.location.href = 'threats-details.html';
    });
    document.getElementById('devices-box').addEventListener('click', function() {
        window.location.href = 'devices-details.html';
    });

    console.log('Script loaded successfully!');
});
