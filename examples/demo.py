from model import ZeroDayDetector

# Quick test of detection
config = {'contamination': 0.01, 'train_file': '../data/train.csv'}
detector = ZeroDayDetector(config)
sample_data = [{'size': 100, 'protocol': 6}]  # Example packet
anomalies = detector.analyze_behavior(sample_data)
print("Detected anomalies:", anomalies)
