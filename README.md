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

![Chronicle-Forge](assets/demo.gif)


---

## 🛠️ Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/)  
- **Frontend**: HTML, CSS, Vanilla JavaScript  
- **AI Model**: Google Gemini API (`gemini-1.5-flash-latest`)  
- **Persistence**: Local text files (`stories/`) + browser localStorage  

---

## 📂 Project Structure
``` bash
creative-storyteller/
├── backend/
│ ├── main.py # FastAPI app
│ ├── story_manager.py # File operations for story storage
│ └── requirements.txt # Python dependencies
├── frontend/
│ ├── index.html # UI entry point
│ ├── style.css # UI styling
│ └── script.js # UI logic
├── stories/ # Folder for saved story files
│ └── example.txt
├── assets/
│ └── demo.gif # Demo animation
├── .env # API key configuration
└── README.md # Documentation
```



## ⚡ Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/yourusername/chronicle-forge.git
cd chronicle-forge
```

### 2️⃣ Backend setup

Install dependencies:
``` bash
cd backend
pip install -r requirements.txt
```
 Set up your .env file:

``` bash
GEMINI_API_KEY=your_api_key_here
```
 Run the FastAPI server:
``` bash
uvicorn main:app --reload
```

 This starts the backend at:
👉 http://127.0.0.1:8000

### 3️⃣ Frontend setup

 No build system required — just open the frontend:
```env
http://127.0.0.1:8000
```

## The backend automatically serves the frontend files.

## 🚀 Usage

1. Open the app in your browser.  
2. Create a new **Section** (like “Chapter 1”).  
3. Use **Chat View** to provide prompts to the AI.  
   - Example: *“Introduce a mysterious character entering the scene.”*  
4. Switch to **Story View** to read the compiled narrative.  
5. Delete sections when you no longer need them.

## ⚙️ API Endpoints

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| GET    | `/sections`                     | Get list of sections         |
| POST   | `/start_new_section/`           | Create a new section         |
| GET    | `/get_section_content/{name}`   | Get section content          |
| DELETE | `/delete_section/{name}`        | Delete a section             |
| POST   | `/generate_next_part/`          | Generate next story segment  |


## 🧑‍💻 Development Notes

- Frontend **chat history** is stored in `localStorage` per section.  
- Backend **story text** is saved as `.txt` files inside `/stories/`.  
- **Story View** and **Chat View** toggle is controlled via a single button in the top bar.  

