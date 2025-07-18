#!/bin/bash

# Exit script on any error
set -e

echo "Starting installation of NAR components: Zeek, Ollama (WhiteRabbitNeo), and React Web UI..."

# Update and upgrade system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install dependencies for building and running components
echo "Installing general dependencies..."
sudo apt install -y build-essential curl git python3 python3-pip python3-venv nodejs npm wget gnupg ca-certificates

######################################
# Step 1: Install Zeek
######################################
echo "Installing Zeek..."
# Add Zeek's official APT repository
curl -fsSL https://download.opensuse.org/repositories/security:zeek/Debian_$(lsb_release -rs)/Release.key | sudo gpg --dearmor -o /usr/share/keyrings/zeek-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/zeek-archive-keyring.gpg] https://download.opensuse.org/repositories/security:/zeek/Debian_$(lsb_release -rs)/ /" | sudo tee /etc/apt/sources.list.d/zeek.list

# Install Zeek
sudo apt update
sudo apt install -y zeek

# Verify Zeek installation
echo "Verifying Zeek installation..."
zeek --version || { echo "Zeek installation failed!"; exit 1; }

######################################
# Step 2: Install Ollama for WhiteRabbitNeo
######################################
echo "Installing Ollama..."
# Download the Ollama installer
OLLAMA_INSTALLER_URL="https://ollama.com/download"
wget -qO ollama-installer.deb "$OLLAMA_INSTALLER_URL"

# Install Ollama
sudo dpkg -i ollama-installer.deb || sudo apt-get install -f -y
rm -f ollama-installer.deb

# Verify Ollama installation
echo "Verifying Ollama installation..."
ollama version || { echo "Ollama installation failed!"; exit 1; }

# Download the WhiteRabbitNeo model
echo "Downloading WhiteRabbitNeo model..."
ollama pull whiterabbitneo || { echo "Failed to download the WhiteRabbitNeo model!"; exit 1; }

######################################
# Step 3: Install React Web UI
######################################
echo "Setting up React Web UI..."
# Clone the GitHub repository containing the React Web UI
REPO_URL="https://github.com/your-organization/your-web-ui-repo.git"
WEB_UI_DIR="web-ui"
git clone "$REPO_URL" "$WEB_UI_DIR"

# Navigate to the React project directory
cd "$WEB_UI_DIR"

# Install Node.js dependencies
echo "Installing React dependencies..."
npm install

# Build the React application
echo "Building React application..."
npm run build

# Move back to the original directory
cd ..

######################################
# Step 4: Python Backend Dependencies
######################################
echo "Setting up Python backend dependencies..."
# Create a Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Flask, Flask-CORS, and llama-cpp-python for the backend
pip install flask flask-cors llama-cpp-python

######################################
# Finalization
######################################
echo "Installation complete!"
echo "To run the system:"
echo "1. Start the Python backend by running: source venv/bin/activate && python3 network_alarm_resp.py"
echo "2. Serve the React Web UI from the 'web-ui/build' directory using Flask or another web server."
echo "3. Use Zeek for network monitoring and log generation."
echo "4. Use Ollama for WhiteRabbitNeo-based threat analysis."