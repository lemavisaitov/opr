# Используем официальный образ Python 3.10 slim для легковесности
FROM python:3.10-slim

# Обновляем пакеты и устанавливаем wget, unzip для скачивания и распаковки датасета
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget unzip \
    && rm -rf /var/lib/apt/lists/*

# Создаем рабочую директорию
WORKDIR /app

# Скачиваем и распаковываем датасет DikeDataset
RUN wget https://github.com/iosifache/DikeDataset/archive/refs/heads/main.zip -O dike.zip && \
    unzip dike.zip && \
    rm dike.zip

# Переименуем папку с датасетом в удобное имя (если нужно)
RUN mv DikeDataset-main DikeDataset

# Копируем файл с зависимостями, если есть, или установим нужные пакеты сразу
# Здесь перечислены основные библиотеки для ML и анализа PE-файлов
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app

# Копируем твои скрипты в контейнер
COPY . /app

# Указываем, что по умолчанию запускается train.py (можно изменить на сервер и т.п.)
CMD ["python", "model/train.py"]
