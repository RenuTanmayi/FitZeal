# 🏋️ Fitzeal — Health & Lifestyle Management App

> **Track your habits. Understand your body. Live better.**

Fitzeal is a web-based health and lifestyle management application designed to help users monitor and improve their daily habits. It allows users to track key wellness parameters such as calorie intake, sleep patterns, and water consumption, while also recommending suitable exercises based on their data. The platform provides an intuitive interface for recording and visualizing information, helping users better understand their routines and make informed health decisions.

---

## ✨ Features

* 🍎 **Calorie Tracking** — Log daily food intake and monitor nutritional goals
* 💤 **Sleep Monitoring** — Record and visualize sleep patterns over time
* 💧 **Water Intake Tracking** — Stay on top of daily hydration targets
* 🏃 **Exercise Recommendations** — Get workout suggestions based on your personal data
* 📊 **Data Visualization** — Intuitive charts and dashboards to understand your routines
* 🔄 **Habit Building** — Consistent tracking tools to encourage a balanced lifestyle

---

## 🛠️ Tech Stack

| Layer    | Technology           |
| -------- | -------------------- |
| Frontend | React.js             |
| Backend  | Node.js / Express.js |
| Database | MySQL                |

---

## ▶️ Run Locally

### Prerequisites

* Node.js (v16+)
* MySQL

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/RenuTanmayi/FitZeal.git
cd FitZeal

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Configure environment variables
# Create a .env file in /server with:
# DB_HOST=localhost
# DB_USER=your_mysql_user
# DB_PASSWORD=your_mysql_password
# DB_NAME=fitzeal

# 5. Start the backend
cd ../server
npm start

# 6. Start the frontend
cd ../client
npm start
```

The app will be running at `http://localhost:3000`.

---

## 📌 Future Improvements

* AI-powered personalized diet and workout plans
* Mobile app (React Native)
* Wearable device integration (Fitbit, Apple Watch)
* Social features — challenges and leaderboards
* Push notifications for daily reminders
* BMI and health score calculator

---

## ⭐ Project Status

🚧 **Actively Developed**

Fitzeal is fully functional and demonstrates end-to-end health data tracking with a clean, scalable architecture. Future updates will focus on AI-driven recommendations and mobile support.
