# 📖 Chronicle Forge

Chronicle Forge is an **AI-powered storytelling tool** built with **FastAPI + Vanilla JS**.  
It lets you create story sections, chat with an AI to extend them, and view your story either as a **chat view** (prompt + replies) or as a **scrollable story view**.  

---

## ✨ Features

- 📝 **Create Sections** – Organize your story into different sections/chapters.  
- 💬 **Chat View** – Interactively provide prompts (e.g., *“continue with a suspenseful twist”*) and see the AI’s response.  
- 📜 **Story View** – Read your story as a seamless narrative with scroll support.  
- 💾 **Persistent History** – Your prompts and AI replies are stored per section (using `localStorage`).  
- ❌ **Modern Delete Button** – Easily remove sections with a sleek “×” button.  
- 🎨 **Clean UI** – Built with custom CSS, togglable between Story and Chat views.  

---

## 🎥 Demo

Here’s Chronicle Forge in action:  

![Chronicle Forge](demo.gif)

---

## 🛠️ Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/)  
- **Frontend**: HTML, CSS, Vanilla JavaScript  
- **AI Model**: Google Gemini API (`gemini-1.5-flash-latest`)  
- **Persistence**: Local text files (`stories/`) + browser localStorage  

---

## 📂 Project Structure

