console.log("lang.js loaded");

// -------------------- TỪ ĐÂY TRỞ XUỐNG THÊM VÀO --------------------

// 1️⃣ Tạo từ điển ngôn ngữ
const translations = {
  vi: {
    title: "AI Life Skills",
    home: "Trang chủ",
    settings: "Cài đặt",
    language: "Ngôn ngữ",
    theme: "Giao diện",
    switchLang: "Chuyển ngôn ngữ",
    switchTheme: "Chuyển chế độ",
    back: "Quay lại Trang chính",
    description: "Trang web giúp học sinh rèn luyện kỹ năng sống qua bài học sâu, video & trò chơi tương tác."
  },
  en: {
    title: "AI Life Skills",
    home: "Home",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    switchLang: "Switch Language",
    switchTheme: "Switch Theme",
    back: "← Back to Main Page",
    description: "A site that helps students learn life skills through in-depth lessons, videos & interactive games."
  }
};

// 2️⃣ Hàm cập nhật giao diện
function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
}

// 3️⃣ Sự kiện khi nhấn nút
document.querySelector(".lang-toggle")?.addEventListener("click", () => {
  const currentLang = localStorage.getItem("lang") || "vi";
  const newLang = currentLang === "vi" ? "en" : "vi";
  localStorage.setItem("lang", newLang);
  applyLanguage(newLang);
  console.log("Đã đổi sang:", newLang);
});

// 4️⃣ Khi load trang, tự động áp dụng ngôn ngữ đã lưu
const savedLang = localStorage.getItem("lang") || "vi";
applyLanguage(savedLang);
