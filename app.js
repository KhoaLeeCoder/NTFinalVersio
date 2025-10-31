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

function cleanMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/#+\s?(.*)/g, '$1')
    .replace(/\n{2,}/g, '\n')
    .trim();
}




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
      addMessage(cleanMarkdown(reply), "bot-msg");
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

  // Thay nguyên hàm getBotReply bằng đoạn này
async function getBotReply(prompt) {
  const API_KEY = "AIzaSyDhzzMsJddVFhqOkTNrPl2blCwbCZRYexk"; // Thay bằng API key thật của em
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Bộ lọc từ khóa nhạy cảm
  const forbidden = ["chính trị", "sex", "bạo lực", "người lớn", "ma túy", "tôn giáo"];
  const lower = prompt.toLowerCase();
  if (forbidden.some(word => lower.includes(word))) {
    return "⚠️ Xin lỗi, mình chỉ hỗ trợ các kỹ năng sống và học tập.";
  }

  // Hướng dẫn ngữ cảnh cho AI (dạng text gộp chung với câu hỏi)
  const systemPrompt =
    "Bạn là trợ lý AI giáo dục thân thiện dành cho học sinh. " +
    "Chỉ được nói về kỹ năng sống, học tập, cảm xúc, sinh tồn, giao tiếp, và xã hội. " +
    "Nếu bị hỏi ngoài phạm vi, hãy trả lời: 'Xin lỗi, mình chỉ hỗ trợ các kỹ năng sống và học tập.'\n\n" +
    "Câu hỏi của người dùng: " + prompt;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API error:", response.status, errText);
      return `⚠️ Lỗi ${response.status}: Yêu cầu không hợp lệ hoặc sai cấu trúc dữ liệu.`;
    }

    const data = await response.json();
    console.log("API response:", data);

    // Lấy nội dung phản hồi
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, mình chưa có câu trả lời phù hợp.";

    // Xóa markdown nếu có
    return reply
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/#+\s?(.*)/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .trim();
  } catch (err) {
    console.error("Lỗi kết nối API:", err);
    return "⚠️ Lỗi kết nối máy chủ, vui lòng thử lại sau.";
  }
}
});
