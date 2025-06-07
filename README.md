# Сервис для анализа файлов на основе модели
![1920w dark](https://github.com/user-attachments/assets/3b0ef379-ce9b-4e98-bf44-708fa325a19e)
![Scaled -2](https://github.com/user-attachments/assets/8c3a865e-f2b0-45de-bf86-f5c9481c6f6f)

> **Стек**: TypeScript (Next.js 15) и python, плюс Docker Compose для развёртывания. 


## Возможности

| Категория | Что умеет сервис |
|-----------|------------------|
| ⚡ Быстро | Потоковая обработка без записи файла на диск |
| 🔌 API    | `POST /api/files/upload` (multipart/form-data) с JSON-ответом |
| 💻 UI     | Фронтенд на Next.js 15 + Tailwind CSS |
| 📦 One-command run | `docker compose up --build` поднимает оба контейнера |

---

## Быстрый старт

```bash
git clone https://github.com/lemavisaitov/opr.git
cd opr

docker compose up --build
