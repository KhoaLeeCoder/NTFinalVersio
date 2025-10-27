/* Sidebar toggle */
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
if(menuToggle){
  menuToggle.addEventListener('click', ()=> sidebar.classList.toggle('open'));
}

/* Dark mode toggle via Ctrl+D for quick dev */
const darkKey = 'ai_dark_mode';
function applyDarkMode(on){ if(on) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }
const savedDark = localStorage.getItem(darkKey);
applyDarkMode(savedDark === '1');
window.addEventListener('keydown', e => {
  if(e.ctrlKey && e.key.toLowerCase()==='d'){
    const now = document.body.classList.toggle('dark');
    localStorage.setItem(darkKey, now ? '1' : '0');
    alert('Dark mode: ' + (now ? 'ON' : 'OFF'));
  }
});

/* Close sidebar when clicking outside on mobile */
document.addEventListener('click', (e)=>{
  if(window.innerWidth <= 900){
    if(!sidebar.contains(e.target) && !menuToggle.contains(e.target)){
      sidebar.classList.remove('open');
    }
  }
});
/* Dropdown functionality for sidebar */
document.querySelectorAll('.dropdown-toggle').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();

    // Toggle arrow rotation
    btn.classList.toggle('active');

    // Get next submenu and toggle open/close
    const submenu = btn.nextElementSibling;
    if (submenu) {
      submenu.classList.toggle('open');
    }
  });
});

// === Chatbot Google AI ===
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("chatbot-toggle");
  const chatbotBox = document.getElementById("chatbot-box");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const messages = document.getElementById("chatbot-messages");

  if (!toggleBtn || !chatbotBox) return;

  toggleBtn.onclick = () => {
    chatbotBox.classList.toggle("hidden");
  };

  // ✅ fix lỗi nút X không hoạt động
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation(); // tránh chồng sự kiện
      chatbotBox.classList.add("hidden");
    };
  }
  closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation(); // ✅ đảm bảo sự kiện không bị chặn
  chatbotBox.classList.add("hidden");
});


  if (sendBtn) {
    sendBtn.onclick = sendMessage;
  }

  if (userInput) {
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, "user-msg");
    userInput.value = "";
    addMessage("⏳ Đang phản hồi...", "bot-msg");

    try {
      const reply = await getBotReply(text);
      document
        .querySelectorAll(".bot-msg")
        [document.querySelectorAll(".bot-msg").length - 1].remove();
      addMessage(reply, "bot-msg");
    } catch (err) {
      addMessage("⚠️ Lỗi kết nối API Google AI.", "bot-msg");
    }
  }

  function addMessage(text, className) {
    const div = document.createElement("div");
    div.className = className;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function getBotReply(prompt) {
    const API_KEY = "DÁN_API_KEY_CỦA_EM_VÀO_ĐÂY";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Mình chưa hiểu câu hỏi đó."
    );
  }
});

