import { Box, Grid, Card, CardContent, Typography, Alert, Snackbar, Button } from '@mui/material';
import { useEffect, useState } from 'react';

export default function NARDashboard() {
  // Simulated API calls – replace with real integrations later!
  const fetchNetworkHealth = async () => ({
    status: "healthy",
    lastScan: "2025-07-18 16:00",
    detectedThreats: 0
  });
  const fetchAlerts = async () => [
    { id: 1, level: "warning", message: "Unusual DNS query behavior detected.", time: "2025-07-18 15:59" }
  ];
  const fetchLLMSummary = async () => 
    "Network activity is normal. No data exfiltration or known attack vectors detected. Recent increase in DNS traffic observed, but within expected range.";

  const [networkHealth, setNetworkHealth] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [llmSummary, setLlmSummary] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    fetchNetworkHealth().then(setNetworkHealth);
    fetchAlerts().then(setAlerts);
    fetchLLMSummary().then(setLlmSummary);

    if (alerts.length > 0) setAlertOpen(true);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Network Alarm Respons (NAR) Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Conceptual Smoke Alarm for Your Network – powered by AI (White Rabbit NEO)
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Network Health</Typography>
              <Typography>Status: {networkHealth.status}</Typography>
              <Typography>Last Scan: {networkHealth.lastScan}</Typography>
              <Typography>Detected Threats: {networkHealth.detectedThreats}</Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Run Manual Scan
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Latest Alerts</Typography>
              {alerts.length === 0 ? (
                <Typography>No alerts.</Typography>
              ) : (
                alerts.map(alert => (
                  <Alert key={alert.id} severity={alert.level} sx={{ mb: 1 }}>
                    [{alert.time}] {alert.message}
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">AI-Powered Network Summary</Typography>
              <Typography>{llmSummary}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Transparency & Privacy</Typography>
              <Typography>
                All analysis is performed locally. No packet contents are stored or sent to the cloud. Only network behavior is analyzed, prioritizing your privacy and resource efficiency.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert severity="warning" sx={{ width: '100%' }}>
          New network alert detected!
        </Alert>
      </Snackbar>
    </Box>
  );
}