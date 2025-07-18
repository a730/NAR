import { Box, Card, CardContent, Typography } from '@mui/material';

export default function NARAbout() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        About NAR
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            NAR is a conceptual smoke alarm for your network, powered by local AI/LLM models. It monitors network traffic in real-time and provides actionable insights for improved home network security.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Why NAR?</strong> Prevent data theft, automate protection, gain peace of mind, and avoid resource-heavy cloud solutions.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Design Philosophy:</strong> Real-time analysis, minimal hardware, user-friendly output, and ethical privacy.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Technical Requirements:</strong> Runs on SBCs with NPUs, uses lightweight LLMs (White Rabbit NEO), integrates with Grafana and Security Onion.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}