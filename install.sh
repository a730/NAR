#!/bin/bash
# install.sh

# Exit on error
set -e

# Default variables with user overrides
NETWORK_MODE=${1:-"firewall"}         # firewall or no-firewall

VPN_ENABLED=${4:-"false"}             # true or false
VLAN_ID=${5:-"10"}                    # VLAN ID
TRAFFIC_SHAPING=${6:-"false"}         # true or false
TRAFFIC_LIMIT=${7:-"1000kbit"}        # Bandwidth limit

# Update and install dependencies
echo "Installing dependencies..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y zeek suricata snort ossec-hids elasticsearch logstash kibana cyberchef ufw iptables tc ssmtp nodejs npm nginx openssh-server curl python3 python3-pip build-essential cmake libpython3-dev python3-venv twilio

# Configure SSH
echo "Configuring SSH..."
sudo sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
if [ ! -f /home/nar/.ssh/id_rsa ]; then
  sudo mkdir -p /home/nar/.ssh
  sudo ssh-keygen -t rsa -N "" -f /home/nar/.ssh/id_rsa
  sudo chown nar:nar /home/nar/.ssh -R
fi
sudo systemctl enable ssh
sudo systemctl restart ssh

# Install Ollama and WhiteRabbitNeo-7B
echo "Installing Ollama and WhiteRabbitNeo-7B..."
curl https://ollama.ai/install.sh | sh
ollama pull whiterabbitneo-7b

# Configure security tools
echo "Configuring security tools..."
sudo systemctl enable suricata zeek snort ossec elasticsearch logstash kibana
sudo systemctl start suricata zeek snort ossec elasticsearch logstash kibana
sudo suricata-update
sudo zeekctl install && sudo zeekctl deploy
sudo ossec-control enable
sudo /usr/share/cyberchef/CyberChef_v9.1.1/index.html &  # Start CyberChef

# Configure ufw and iptables
echo "Configuring ufw and iptables..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 192.168.1.0/24 to any port 22
sudo ufw enable

# Configure ssmtp and Twilio for notifications
if [ -n "$EMAIL" ] || [ -n "$PHONE" ]; then
  echo "Configuring notifications..."
  sudo bash src/scripts/setup_ssmtp_twilio.sh "$EMAIL" "$PHONE"
fi

# Install GUI and backend
echo "Installing GUI and backend..."
cd src/gui
npm install
npm run build
sudo mkdir -p /var/www/html/nar
sudo cp -r build/* /var/www/html/nar
cd ../backend
npm install
npm install -g pm2
pm2 start server.js --name nar-backend
pm2 save
pm2 startup

# Configure Nginx
echo "Configuring Nginx..."
sudo bash -c 'cat > /etc/nginx/sites-available/nar <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/html/nar;
    index index.html;
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF'
sudo ln -sf /etc/nginx/sites-available/nar /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Configure network
echo "Configuring network..."
bash src/scripts/configure_network.sh "$NETWORK_MODE" "$VLAN_ID"

# Configure VPN if enabled
if [ "$VPN_ENABLED" = "true" ]; then
  echo "Configuring VPN..."
  bash src/scripts/setup_vpn.sh
fi

# Configure traffic shaping if enabled
if [ "$TRAFFIC_SHAPING" = "true" ]; then
  echo "Applying traffic shaping..."
  sudo bash src/scripts/apply_traffic_shaping.sh "$TRAFFIC_LIMIT"
fi

# Start services
echo "Starting services..."
sudo bash src/scripts/start_services.sh
sudo systemctl enable nginx

echo "NAR OS installed successfully! Access GUI at http://<rdk-x5-ip>"
