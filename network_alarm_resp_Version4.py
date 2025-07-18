import os
import subprocess
from datetime import datetime
import json
from flask import Flask, jsonify, request, send_from_directory, render_template
from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__, static_folder="web-ui/build", template_folder="web-ui/build")
CORS(app)  # Enable Cross-Origin Resource Sharing for React integration

# Paths
MODEL_PATH = "models/white_rabbit_neo.bin"
ZEEK_LOG_DIR = "/opt/zeek/logs/current"
ZEEK_SCRIPT_PATH = "/opt/zeek/scripts/capture.zeek"

# Load the White Rabbit NEO LLM model
llm = Llama(model_path=MODEL_PATH)

@app.route('/analyze_logs', methods=['POST'])
def analyze_logs():
    """
    Analyze Zeek logs using the AI model.
    """
    try:
        log_files = request.json.get("log_files", [])
        if not log_files:
            return jsonify({"error": "No log files provided"}), 400

        results = []
        for log_file in log_files:
            log_path = os.path.join(ZEEK_LOG_DIR, log_file)
            if not os.path.exists(log_path):
                return jsonify({"error": f"Log file {log_file} not found"}), 404

            with open(log_path, "r") as file:
                log_data = file.read()
                # AI model inference for threat analysis
                analysis = llm(prompt=f"Analyze this network log: {log_data}")
                results.append({"log_file": log_file, "analysis": analysis})

        return jsonify({"results": results}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/run_zeek', methods=['POST'])
def run_zeek():
    """
    Execute Zeek for real-time packet capture and analysis.
    """
    try:
        interface = request.json.get("interface", "eth0")
        zeek_command = f"zeek -i {interface} {ZEEK_SCRIPT_PATH}"
        subprocess.run(zeek_command, shell=True, check=True)
        return jsonify({"message": "Zeek is running for real-time packet analysis"}), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Failed to start Zeek: {e}"}), 500


@app.route('/system_health', methods=['GET'])
def system_health():
    """
    Monitor the system health, including CPU and memory usage.
    """
    import psutil  # Imported here to avoid unnecessary overhead
    health_data = {
        "cpu_usage": psutil.cpu_percent(),
        "memory_usage": psutil.virtual_memory().percent,
        "timestamp": datetime.now().isoformat()
    }
    return jsonify(health_data), 200


@app.route('/dashboard', methods=['GET'])
def dashboard():
    """
    Serve the React web UI for visualization.
    """
    return render_template("index.html")


@app.route('/static/<path:path>', methods=['GET'])
def serve_static_files(path):
    """
    Serve static files for React web UI.
    """
    return send_from_directory(app.static_folder, path)


if __name__ == "__main__":
    # Ensure required directories and files are in place
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"AI model not found at {MODEL_PATH}")
    if not os.path.exists(ZEEK_SCRIPT_PATH):
        raise FileNotFoundError(f"Zeek script not found at {ZEEK_SCRIPT_PATH}")

    # Start the Flask app for real-time interaction and visualization
    app.run(host="0.0.0.0", port=5000, debug=True)