console.log("Chronicle Forge UI loaded");

const API_URL = "http://127.0.0.1:8000";

// Elements
const $ = (id) => document.getElementById(id);
const listEl = $("section-list");
const titleEl = $("section-title");
const storyEl = $("story-content");
const chatHistoryEl = $("chat-history");
const chatPane = $("chat-pane");
const storyPane = $("story-pane");
const toggleBtn = $("toggle-view");
const newSectionBtn = $("new-section");
const chatForm = $("chat-form");
const chatInput = $("chat-input");
const spinner = $("spinner");

// ✅ New download buttons
const downloadDocxBtn = $("download-docx");
const downloadPdfBtn = $("download-pdf");

let currentSection = null;
let messages = []; // per section [{role,text}]

// ---------- Helpers ----------
function showSpinner() { spinner.classList.remove("spinner-hidden"); }
function hideSpinner() { spinner.classList.add("spinner-hidden"); }

function autosize(el){
  el.style.height = "0px";
  el.style.height = Math.min(150, el.scrollHeight) + "px";
}

function saveHistory(){
  if(!currentSection) return;
  localStorage.setItem("history:"+currentSection, JSON.stringify(messages));
}
function loadHistory(){
  if(!currentSection) return;
  messages = JSON.parse(localStorage.getItem("history:"+currentSection) || "[]");
  renderChat();
}
function addMsg(role, text){
  messages.push({role, text});
  renderChat();
  saveHistory();
}
function renderChat(){
  chatHistoryEl.innerHTML = "";
  for(const m of messages){
    const b = document.createElement("div");
    b.className = "bubble " + (m.role === "user" ? "user" : "ai");
    b.innerHTML = marked.parse(m.text);
    chatHistoryEl.appendChild(b);
  }
  chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
}

// ---------- Sections ----------
async function fetchSections(){
  try{
    const res = await fetch(`${API_URL}/sections`);
    const data = await res.json();
    listEl.innerHTML = "";

    data.sections.forEach(sec => {
      const row = document.createElement("div");
      row.className = "section-item" + (sec === currentSection ? " active" : "");

      const name = document.createElement("div");
      name.className = "section-name";
      name.textContent = sec;
      name.title = sec;
      name.onclick = () => loadSection(sec);

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.title = "Delete section";
      del.innerHTML = "&times;";  // ✅ modern delete symbol

      del.onclick = async (e) => {
        e.stopPropagation();
        if(confirm(`Delete section "${sec}"?`)){
          await fetch(`${API_URL}/delete_section/${encodeURIComponent(sec)}`, { method:"DELETE" });
          if(currentSection === sec){
            currentSection = null;
            titleEl.textContent = "Select or create a section";
            storyEl.innerHTML = "";
            messages = [];
            renderChat();
            // disable downloads when no section
            downloadDocxBtn.disabled = true;
            downloadPdfBtn.disabled = true;
          }
          fetchSections();
        }
      };

      row.appendChild(name);
      row.appendChild(del);
      listEl.appendChild(row);
    });
  }catch(err){
    console.error("Failed to load sections", err);
  }
}

async function loadSection(sectionName){
  currentSection = sectionName;
  await fetchSections(); // refresh active state
  titleEl.textContent = sectionName;
  showSpinner();
  try{
    const res = await fetch(`${API_URL}/get_section_content/${encodeURIComponent(sectionName)}`);
    const data = await res.json();
    storyEl.innerHTML = marked.parse(data.content || "");
    loadHistory();
    // ✅ enable download buttons when a section is loaded
    downloadDocxBtn.disabled = false;
    downloadPdfBtn.disabled = false;
    // Default to Story view on selecting
    if (storyPane.classList.contains("hidden")) toggleView();
  }catch(err){
    storyEl.textContent = "Error loading section.";
    console.error(err);
  }finally{
    hideSpinner();
  }
}

// ---------- Create Section ----------
newSectionBtn.addEventListener("click", async () => {
  const name = prompt("Section title:");
  if(!name) return;
  showSpinner();
  try{
    const res = await fetch(`${API_URL}/start_new_section/`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name })   // ✅ fixed key to match backend
    });
    const data = await res.json();
    await fetchSections();
    await loadSection(name);
  }catch(err){
    console.error("Failed to create section", err);
  }finally{
    hideSpinner();
  }
});

// ---------- Chat ----------
chatForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const text = chatInput.value.trim();
  if(!text){ return; }
  if(!currentSection){
    alert("Please select or create a section first.");
    return;
  }
  addMsg("user", text);
  chatInput.value = "";
  autosize(chatInput);
  showSpinner();
  try{
    const res = await fetch(`${API_URL}/generate_next_part/`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        section: currentSection,   // ✅ FIXED to match backend
        user_prompt: text
      })
    });
    const data = await res.json();
    const ai = data.new_story_part || "*No content returned.*";
    addMsg("ai", ai);
    // Also append to story pane
    storyEl.innerHTML += marked.parse(ai);
    storyEl.scrollTop = storyEl.scrollHeight;
  }catch(err){
    console.error("Generate failed", err);
    addMsg("ai", "_Sorry, something went wrong._");
  }finally{
    hideSpinner();
  }
});

chatInput.addEventListener("input", () => autosize(chatInput));
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    $("send-btn").click();
  }
});

// ---------- Toggle View ----------
function toggleView(){
  chatPane.classList.toggle("hidden");
  storyPane.classList.toggle("hidden");
  const inStory = !storyPane.classList.contains("hidden");
  toggleBtn.textContent = inStory ? "Chat View" : "Story View";
}
toggleBtn.addEventListener("click", toggleView);

// ---------- Downloads ----------
// helper to trigger file download
function triggerDownload(url, filename){
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

downloadDocxBtn.addEventListener("click", () => {
  if(!currentSection) return;
  triggerDownload(`${API_URL}/download_docx/${encodeURIComponent(currentSection)}`, `${currentSection}.docx`);
});

downloadPdfBtn.addEventListener("click", () => {
  if(!currentSection) return;
  triggerDownload(`${API_URL}/download_pdf/${encodeURIComponent(currentSection)}`, `${currentSection}.pdf`);
});

// ---------- Init ----------
fetchSections();
