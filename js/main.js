document.addEventListener("DOMContentLoaded", () => {
  // Header ve Footer bileşenlerini yükle
  const loadComponent = async (id, file) => {
    try {
      const res = await fetch(file);
      const html = await res.text();
      document.getElementById(id).innerHTML = html;

      // Header için özel olaylar
      if (id === "header-placeholder") {
        bindNavbarEvents();
      }

      return true;
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
      return false;
    }
  };

  loadComponent("header-placeholder", "components/header.html");
  loadComponent("footer-placeholder", "components/footer.html");
  loadComponent("announcement-placeholder", "components/announcement.html").then(() => {
    initAnnouncementPanel();
  });
  // Geri sayımı başlat
  startCountdown("October 30, 2025 09:00:00");

  // AOS başlat
  AOS.init({
    duration: 800,
    once: true,
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const cfpButton = document.getElementById('cfpDropdownButton');
  const cfpMenu = document.getElementById('cfpDropdownMenu');

  if (cfpButton && cfpMenu) {
    cfpButton.addEventListener('click', function (event) {
      event.stopPropagation();
      cfpMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', function () {
      cfpMenu.classList.add('hidden');
    });

    cfpMenu.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
});


// Navbar ve mobil menü event'lerini tanımlayan fonksiyon
function bindNavbarEvents() {
  const navbar = document.getElementById("navbar");
  const mobileBtn = document.getElementById("mobile-menu-button");
  const mobileClose = document.getElementById("mobile-menu-close");
  const mobileMenu = document.getElementById("mobile-menu");

  // === ✅ CFP Dropdown aç/kapat ===
  const cfpButton = document.getElementById("cfpDropdownButton");
  const cfpMenu = document.getElementById("cfpDropdownMenu");

  if (cfpButton && cfpMenu) {
    cfpButton.addEventListener("click", function (event) {
      event.stopPropagation();
      cfpMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", function () {
      cfpMenu.classList.add("hidden");
    });

    cfpMenu.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  // === Mobil CFP Dropdown ===
  const mobileCfpBtn = document.getElementById("mobileCfpButton");
  const mobileCfpMenu = document.getElementById("mobileCfpMenu");

  if (mobileCfpBtn && mobileCfpMenu) {
    mobileCfpBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      mobileCfpMenu.classList.toggle("hidden");
    });

    // Menü dışında bir yere tıklanırsa menüyü kapat
    document.addEventListener("click", () => {
      mobileCfpMenu.classList.add("hidden");
    });

    // Menüye tıklanırsa kapanmasın
    mobileCfpMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }


  // === Navbar scroll davranışı ===
  const navLinks = navbar.querySelectorAll("nav a, .text-white");
  const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

  if (isIndexPage) {
    window.addEventListener("scroll", () => {
      const isScrolled = window.scrollY > 50;
      navbar.classList.toggle("bg-white", isScrolled);
      navbar.classList.toggle("shadow-md", isScrolled);
      navbar.classList.toggle("text-gray-800", isScrolled);
      navbar.classList.toggle("bg-transparent", !isScrolled);

      navLinks.forEach(link => {
        link.classList.toggle("text-white", !isScrolled);
        link.classList.toggle("text-gray-800", isScrolled);
        link.classList.toggle("hover:text-yellow-300", !isScrolled);
        link.classList.toggle("hover:text-yellow-700", isScrolled);
      });
    });
  } else {
    navbar.classList.remove("bg-transparent");
    navbar.classList.add("bg-white", "shadow-md", "text-gray-800");

    navLinks.forEach(link => {
      link.classList.remove("text-white", "hover:text-yellow-300");
      link.classList.add("text-gray-800", "hover:text-yellow-700");
    });
  }

  // === Mobil menü aç/kapat ===
  mobileBtn?.addEventListener("click", () => {
    mobileMenu.classList.remove("hidden");
    setTimeout(() => {
      mobileMenu.classList.remove("translate-x-full");
    }, 10);
    mobileBtn.classList.add("hidden");
    document.body.classList.add("overflow-hidden");
  });

  mobileClose?.addEventListener("click", () => {
    mobileMenu.classList.add("translate-x-full");
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
    }, 300);
    mobileBtn.classList.remove("hidden");
    document.body.classList.remove("overflow-hidden");
  });
}



// Geri sayım (countdown) fonksiyonu
function startCountdown(targetDateStr) {
  const target = new Date(targetDateStr).getTime();

  const update = () => {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById("countdown").innerHTML = "<p class='text-xl text-red-600'>The conference has started!</p>";
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = d.toString().padStart(2, "0");
    document.getElementById("hours").textContent = h.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = m.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = s.toString().padStart(2, "0");
  };

  update(); // Sayfa yüklenince hemen göster
  const timer = setInterval(update, 1000);
}

function initAnnouncementPanel() {
  const panel = document.getElementById('announcement-panel');
  const icon = document.getElementById('announcement-icon');

  let isOpen = true;
  let autoCloseTimeout;

  function closePanel() {
    panel.classList.remove('animate-slide-in');
    panel.classList.add('animate-slide-out');
    setTimeout(() => {
      panel.style.display = 'none';
      icon.style.display = 'block';
      isOpen = false;
    }, 400);
  }

  function openPanel() {
    panel.style.display = 'block';
    panel.classList.remove('animate-slide-out');
    panel.classList.add('animate-slide-in');
    icon.style.display = 'none';
    isOpen = true;
    startAutoCloseTimer();
  }

  function startAutoCloseTimer() {
    clearTimeout(autoCloseTimeout);
    autoCloseTimeout = setTimeout(() => {
      if (isOpen) closePanel();
    }, 5000);
  }

  icon.addEventListener('click', openPanel);

  // SADECE İLK YÜKLEMEDE PANEL GÖRÜNSÜN
  const hasSeenAnnouncement = sessionStorage.getItem('announcementSeen');

  if (!hasSeenAnnouncement) {
    sessionStorage.setItem('announcementSeen', 'true');
    panel.style.display = 'block';
    startAutoCloseTimer();
  } else {
    panel.style.display = 'none';
    icon.style.display = 'block';
    isOpen = false;
  }
}
