// --- 1. GLOBAL DEĞİŞKENLER ---
let currentImages = []; 
let currentIndex = 0;

// --- 2. TAB VE GALERİ SİSTEMİ (ŞEHİRLER İÇİN) ---
function openCity(cityId) {
  const allContents = document.querySelectorAll('.tab-content');
  allContents.forEach(content => content.style.display = 'none');

  const selected = document.getElementById(cityId);
  if (selected) {
    selected.style.display = 'block';
    selected.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toggleGallery(element) {
  const gallery = element.nextElementSibling;
  if (gallery && gallery.classList.contains('gallery')) {
    gallery.style.display = gallery.style.display === "grid" ? "none" : "grid";
  }
}

// --- 3. PROJE VERİLERİ ---
const projectData = {
  invest: {
  title: "Yatırım Araçları Performans Analizi",
  pdfLink: "#", // Henüz dosya yoksa '#' bırakabilirsin
  desc: `
    <div class="case-study pending">
      <div class="status-badge">Çalışma Devam Ediyor</div>
      <h3>Proje Hazırlık Aşamasında</h3>
      <p>En kısa sürede tüm bulgular ve rapor burada paylaşılacaktır.</p>
      <div class="loader-placeholder">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </div>
    </div>
  `,
  images: [] // Resim yoksa boş bırak, sistem hata vermez
},

  customer: {
    title: "Müşteri Satın Alma Davranışları Analizi",
    pdfLink: "assets/raporlar/musteri-analizi.pdf",
    desc: `
      <div class="case-study">
        <h3>Giriş ve Problem Tanımı</h3>
        <p>Dijital platformlardaki müşteri satın alma yolculuğunu etkileyen faktörlerin incelenmesi.</p>
        <div class="analysis-box">
          <h4>İstatistiksel Bulgular</h4>
          <ul>
            <li>Cinsiyet ve satın alma kararı (p < 0.05).</li>
            <li>Model isabet oranı: %82.</li>
          </ul>
        </div>
      </div>`,
    images: ["assets/raporlar/grafik1.png", "assets/raporlar/grafik2.png"]
  }
};

// --- 4. MODAL (PROJE) FONKSİYONLARI ---
function openProject(projectId) {
  const modal = document.getElementById('project-modal');
  const details = document.getElementById('project-details');
  const data = projectData[projectId];

  if (!data) return;

  details.innerHTML = `
    <div class="modal-body">
      <h2>${data.title}</h2>
      ${data.desc}
      <div class="project-visuals">
        ${data.images.map(img => `<img src="${img}" onclick="openLightbox(this)">`).join('')}
      </div>
      <div class="modal-footer-action">
        <a href="${data.pdfLink}" target="_blank" class="download-btn">Tam Raporu İndir (PDF)</a>
      </div>
    </div>`;

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  window.history.pushState({ modalOpen: true }, "");
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// --- 5. LIGHTBOX (EVRENSEL GALERİ) FONKSİYONLARI ---
function openLightbox(element) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  // Hem şehir galerilerinde hem proje görsellerinde çalışması için kapsayıcıyı bulur
  const container = element.closest('.gallery') || element.closest('.project-visuals');
  currentImages = Array.from(container.querySelectorAll('img')).map(img => img.src);
  currentIndex = currentImages.indexOf(element.src);

  lightboxImg.src = currentImages[currentIndex];
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => lightbox.classList.add('active'), 10);
}

function changeImage(direction, event) {
  if (event) event.stopPropagation(); // Kararmayı tıklatıp kapatmaması için
  
  currentIndex += direction;
  if (currentIndex >= currentImages.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = currentImages.length - 1;
  
  document.getElementById('lightbox-img').src = currentImages[currentIndex];
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const modal = document.getElementById('project-modal');
  
  lightbox.classList.remove('active');
  lightbox.style.display = 'none';
  
  // Eğer arkada proje modalı açık DEĞİLSE kaydırmayı aç
  if (!modal || modal.style.display !== 'block') {
    document.body.style.overflow = 'auto';
  }
}

// --- 6. OLAY DİNLEYİCİLER ---
window.onpopstate = function() {
  closeProjectModal();
  closeLightbox();
};

document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (lightbox.style.display === 'flex') {
    if (e.key === "ArrowRight") {
      e.preventDefault(); 
      changeImage(1); 
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      changeImage(-1);
    }
    if (e.key === "Escape") closeLightbox();
  } else {
    const modal = document.getElementById('project-modal');
    if (modal.style.display === 'block' && e.key === "Escape") closeProjectModal();
  }
});

// --- 7. ANIMASYON (REVEAL) ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.city-block, .gallery img, .project-card').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Sayfa 200px aşağı kayınca butonu göster
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  const btn = document.getElementById("scrollToTop");
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

// Yukarı çıkma fonksiyonu
function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}