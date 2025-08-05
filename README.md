# Leetquiz - AI Coding Interview Platform

An advanced, AI-powered platform designed to simulate real-world coding interviews. **Leetquiz** helps developers prepare for technical interviews by providing a dynamic, feature-rich environment for practicing DSA problems.

---

## 🎥 Visual Demonstration

<img width="1366" height="768" alt="Screenshot 2025-08-05 163052" src="https://github.com/user-attachments/assets/724a3218-cef2-4f0f-8d09-ddc96993dbc7" />

---

## ✨ Core Features

This project is a fully-featured frontend application with a wide range of functionalities:

- **🤖 AI-Generated Questions**: Dynamically generates unique DSA problems using the **Mistral AI API**.
- **🌐 Multi-Language Support**: Solve problems in **JavaScript**, **Python**, **Java**, **C++**, **C**, and **Go**.
- **🧠 AI-Powered Feedback**: Submit your code to receive instant, detailed feedback on syntax, completeness, and logic.
- **🧑‍💻 Advanced Code Editor**: Powered by **Monaco Editor** (the engine behind VS Code) with syntax highlighting and boilerplate for each language.
- **🛠️ Customizable Sessions**:
  - Topic selection from over 20 DSA topics
  - Difficulty levels: Easy, Medium, Hard
  - Adjustable countdown timer (0–60 minutes)
- **📱 Fully Responsive Design**: Seamlessly works on both desktop and mobile.
- **💻 Professional UI/UX**:
  - Resizable panels for layout control
  - Collapsible AI feedback section
  - Shimmering skeleton loaders for better UX
  - Futuristic, neuromorphic-inspired design

---

## 🛠️ Tech Stack

- Frontend: React, Vite
- Styling: Tailwind CSS
- AI Integration: Mistral AI API
- Code Editor: Monaco Editor (`@monaco-editor/react`) |

---

## ⚠️ Important Note on API Key
This project uses the Mistral AI API to fetch coding questions.
To run the app properly, you must provide your own API key.

If you run the project without setting your API key, you’ll see the following error in the app:

❌ Failed to get questions. Check your console.

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have **Node.js** and **npm** installed.

### 2. Installation

- Clone the repository:

git clone https://github.com/your-username/Leetquiz-AI-Interviewer-.git

- Navigate to the project folder:

cd Leetquiz-AI-Interviewer

- Install dependencies:

npm install

### 3. Set Up Your API Key

Create a .env.local file in the root directory:

VITE_MISTRAL_API_KEY="YOUR_API_KEY_HERE"

### 4. Run the Application

npm run dev
The app will be live at http://localhost:5173


### 👤 Author
Priyanshu Singh Chauhan

📎Linkedin: https://www.linkedin.com/in/priyanshusinghchauhan/
