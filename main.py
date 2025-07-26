import json
import kuzu  # Import KuzuDB
from model import ZeroDayDetector
from monitoring import NetworkMonitor
from response import AutomatedResponse

def main():
    # Load configuration
    with open('config.json', 'r') as f:
        config = json.load(f)
    
    # Initialize KuzuDB
    db = kuzu.Database('threats.kuzu')  # Embeddable DB file
    conn = kuzu.Connection(db)
    init_kuzu_schema(conn)  # Set up schema if needed
    
    # Initialize components (pass DB connection)
    detector = ZeroDayDetector(config['model'], conn)
    monitor = NetworkMonitor(config['monitoring'])
    responder = AutomatedResponse(config['response'], conn)
    
    # Start real-time monitoring
    print("Starting NAR Zero-Day Detection System with KuzuDB...")
    while True:
        packet_data = monitor.capture_packets()  # Simulate or integrate with Zeek
        anomalies = detector.analyze_behavior(packet_data)
        if anomalies:
            responder.neutralize_threat(anomalies)
            print("Threat detected and neutralized:", anomalies)

def init_kuzu_schema(conn):
    # Create simple graph schema for threats (nodes: IPs, edges: connections)
    conn.execute("""
        CREATE NODE TABLE IP(address STRING, PRIMARY KEY(address));
        CREATE NODE TABLE Threat(type STRING, timestamp STRING, PRIMARY KEY(type, timestamp));
        CREATE REL TABLE Connection(FROM IP TO Threat, details STRING);
    """)

if __name__ == "__main__":
    main()
