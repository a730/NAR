import { Box, Card, CardContent, Typography, Switch, FormControlLabel, Button } from '@mui/material';

export default function NARSettings() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        NAR Settings
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Operation Mode</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Standalone beside router" />
          <FormControlLabel control={<Switch />} label="Integrated with OpenWRT" />
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">AI Model</Typography>
          <Button variant="outlined">Select/Update White Rabbit NEO Model</Button>
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">Privacy Settings</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Analyze only network behavior (no packet content)" />
        </CardContent>
      </Card>
    </Box>
  );
}