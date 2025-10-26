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
