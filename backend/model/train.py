import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader
import joblib
from app.features import extract_features

# Параметры
BATCH_SIZE = 64
EPOCHS = 15
LEARNING_RATE = 0.001

# Установка многопоточности
torch.set_num_threads(12)
print(f"💡 Используем потоков CPU: {12}")
print(f"🖥️ Устройство: {'CUDA' if torch.cuda.is_available() else 'CPU'}")

# Пути к данным
benign_dir = "DikeDataset/files/benign"
malware_dir = "DikeDataset/files/malware"

def build_dataset():
    data = []
    labels = []

    print("📥 Чтение benign файлов...")
    for fname in os.listdir(benign_dir):
        path = os.path.join(benign_dir, fname)
        try:
            feats = extract_features(path)
            data.append(list(feats.values()))
            labels.append(0)
        except Exception as e:
            print(f"⚠️ Ошибка на benign {fname}: {e}")

    print("📥 Чтение malware файлов...")
    for fname in os.listdir(malware_dir):
        path = os.path.join(malware_dir, fname)
        try:
            feats = extract_features(path)
            data.append(list(feats.values()))
            labels.append(1)
        except Exception as e:
            print(f"⚠️ Ошибка на malware {fname}: {e}")

    return np.array(data), np.array(labels), list(feats.keys())

class MalwareClassifier(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 2)
        )

    def forward(self, x):
        return self.model(x)

def train():
    print("🚀 Построение датасета...")
    X, y, feature_names = build_dataset()
    print(f"✅ Размер датасета: X={X.shape}, y={y.shape}")

    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    train_ds = TensorDataset(torch.tensor(X_train, dtype=torch.float32), torch.tensor(y_train, dtype=torch.long))
    val_ds = TensorDataset(torch.tensor(X_val, dtype=torch.float32), torch.tensor(y_val, dtype=torch.long))

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE)

    model = MalwareClassifier(X.shape[1])
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

    print("🧠 Начало обучения...\n")
    for epoch in range(1, EPOCHS + 1):
        model.train()
        total_loss = 0
        for xb, yb in train_loader:
            optimizer.zero_grad()
            out = model(xb)
            loss = criterion(out, yb)
            loss.backward()
            optimizer.step()
            total_loss += loss.item() * xb.size(0)

        avg_loss = total_loss / len(train_ds)

        # Валидация
        model.eval()
        preds = []
        targets = []
        with torch.no_grad():
            for xb, yb in val_loader:
                out = model(xb)
                pred = torch.argmax(out, dim=1)
                preds.extend(pred.cpu().numpy())
                targets.extend(yb.cpu().numpy())

        acc = accuracy_score(targets, preds)
        prec = precision_score(targets, preds)
        rec = recall_score(targets, preds)
        f1 = f1_score(targets, preds)

        print(f"📊 Epoch {epoch:02d} | Loss: {avg_loss:.4f} | Acc: {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f}")

    # Сохранение
    torch.save(model.state_dict(), "model/malware_model.pt")
    joblib.dump(scaler, "model/scaler.pkl")
    print("\n✅ Обучение завершено. Модель и scaler сохранены в папке /model")

if __name__ == "__main__":
    train()
