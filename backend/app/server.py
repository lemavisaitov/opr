from flask import Flask, request, jsonify
import torch
import joblib
from features import extract_features
import tempfile
import os
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
      r"/api/v1/predict": {
        "origins": ["http://localhost:3000","http://localhost:5173"],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

model_path = "model/malware_model.pt"
scaler_path = "model/scaler.pkl"

device = torch.device("cpu")

class MalwareClassifier(torch.nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.model = torch.nn.Sequential(
            torch.nn.Linear(input_dim, 128),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.3),
            torch.nn.Linear(128, 64),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.3),
            torch.nn.Linear(64, 2)
        )

    def forward(self, x):
        return self.model(x)

# Загрузка scaler и модели
scaler = joblib.load(scaler_path)
input_dim = len(scaler.mean_)
model = MalwareClassifier(input_dim)
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

def generate_explanation(label, influential_features):
    lines = [f"The file was classified as **{label.upper()}**."]
    lines.append("Key influencing features:")
    for feat in influential_features:
        name = feat["name"]
        value = feat["value"]
        z = feat["z_score"]

        if abs(z) > 10:
            impact = "very high impact"
        elif abs(z) > 3:
            impact = "moderate impact"
        elif abs(z) > 1:
            impact = "minor impact"
        else:
            impact = "low impact"

        lines.append(f"- {name}: value = {value:.3g}, z-score = {z:.2f} ({impact})")

    return "\n".join(lines)

@app.route("/api/v1/predict", methods=["POST"])
def predict():
    print("HELLO!")
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    try:
        feats = extract_features(tmp_path)
        feature_values = np.array(list(feats.values()))
        feature_names = list(feats.keys())

        feature_scaled = scaler.transform([feature_values])
        input_tensor = torch.tensor(feature_scaled, dtype=torch.float32)

        with torch.no_grad():
            output = model(input_tensor)
            probs = torch.nn.functional.softmax(output, dim=1).cpu().numpy()[0]
            pred = int(torch.argmax(output, dim=1).item())
            label = "malicious" if pred == 1 else "benign"

        # Анализ отклонений
        mean = scaler.mean_
        std = scaler.scale_
        z_scores = np.abs((feature_values - mean) / std)
        top_indices = z_scores.argsort()[-5:][::-1]

        influential_features = [
            {"name": feature_names[i], "value": float(feature_values[i]), "z_score": float(z_scores[i])}
            for i in top_indices
        ]

        explanation = generate_explanation(label, influential_features)

    except Exception as e:
        os.unlink(tmp_path)
        return jsonify({"error": str(e)}), 500

    os.unlink(tmp_path)
    return jsonify({
        "prediction": label,
        "confidence": {
            "benign": float(probs[0]),
            "malicious": float(probs[1])
        },
        "influential_features": influential_features,
        "explanation": explanation
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
