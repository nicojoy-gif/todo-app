# 📱 To-Do App (React Native + Expo + TypeScript)

A simple, fast, and modern To-Do application built with **Expo**, **React Native**, **TypeScript**, **Redux Toolkit**, and optional **AI-powered voice task generation** using OpenAI.

---

## Features

- Add, edit, and delete tasks  
- Mark tasks as complete/incomplete  
- Local storage with AsyncStorage  
- Light & Dark theme support  
- Voice input → automatic task extraction (optional)  
- Expo Router navigation  
- Clean & reusable components  

---

##  Tech Stack

- **React Native + Expo**  
- **TypeScript**  
- **Redux Toolkit**  
- **AsyncStorage**  
- **OpenAI API** (optional voice-to-task)  
- **Expo Router**  
- **React Native Reanimated**  

---

# 🛠 Installation & Setup

###  **Clone the repository**
```sh
git clone https://github.com/nicojoy-gif/todo-app.git
cd todo-app
1. npm install 
If you’re using voice task extraction:

2. Create .env file at the root of the project
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here

3. Restart the server so Expo loads environment variables:
npx expo start -c