import torch
import torch.nn as nn
import joblib
import numpy as np

class MalwareClassifier(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 2)
        )

    def forward(self, x):
        return self.model(x)

# Загрузка модели
def load_model():
    scaler = joblib.load("model/scaler.pkl")
    model = MalwareClassifier(input_dim=10)  # признаков 10
    model.load_state_dict(torch.load("model/model.pt", map_location="cpu"))
    model.eval()
    return model, scaler

def predict(data: np.ndarray):
    model, scaler = load_model()
    data = scaler.transform(data)
    inputs = torch.tensor(data, dtype=torch.float32)
    with torch.no_grad():
        outputs = model(inputs)
        preds = torch.argmax(outputs, dim=1)
    return preds.numpy().tolist()
