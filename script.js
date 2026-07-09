/* =========================================================================
   MAISON AURÉLIA — SCRIPT.JS
   Struktur file ini:
   1.  Loading Screen
   2.  Scroll Progress Bar
   3.  Custom Cursor (desktop)
   4.  Navbar: efek scroll + scrollspy + smooth scroll + update hash
   5.  Dark Mode Toggle (localStorage)
   6.  Hero: Efek Ketik (Typing) & Partikel
   7.  Counter / Angka Berjalan (Intersection Observer)
   8.  Progress Bar & Circular Stat (Intersection Observer)
   9.  Produk: Populate Modal Detail
   10. Galeri: Filter + Lightbox
   11. Artikel: Data, Render, Pencarian, Filter Kategori, Paginasi
   12. Kontak: Validasi Form + Toast
   13. Newsletter Form (dummy submit)
   14. Back To Top
   15. Scroll Reveal Animation (Intersection Observer)
   16. Footer Year
   ========================================================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initLoadingScreen();
    initScrollProgress();
    initCustomCursor();
    initNavbar();
    initDarkMode();
    initHeroTyping();
    initHeroParticles();
    initCounters();
    initProgressBars();
    initCircularStats();
    initProductModal();
    initGalleryFilterAndLightbox();
    initArticles();
    initContactForm();
    initNewsletterForm();
    initBackToTop();
    initScrollReveal();
    initFooterYear();
  });

  /* =======================================================================
     1. LOADING SCREEN
     Mensimulasikan progress loading lalu memudar setelah window 'load'.
     ======================================================================= */
  function initLoadingScreen() {
    var screen = document.getElementById('loadingScreen');
    var fill = document.getElementById('loadingBarFill');
    if (!screen || !fill) return;

    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 18;
      if (progress > 92) progress = 92;
      fill.style.width = progress + '%';
    }, 160);

    function finish() {
      clearInterval(interval);
      fill.style.width = '100%';
      setTimeout(function () {
        screen.classList.add('is-hidden');
      }, 280);
    }

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish);
      // Fallback jika event 'load' lambat/tidak terpicu (mis. gambar eksternal lambat)
      setTimeout(finish, 3000);
    }
  }

  /* =======================================================================
     2. SCROLL PROGRESS BAR
     ======================================================================= */
  function initScrollProgress() {
    var fill = document.getElementById('scrollProgressFill');
    if (!fill) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      fill.style.width = pct + '%';
    }, { passive: true });
  }

  /* =======================================================================
     3. CUSTOM CURSOR (desktop only — CSS juga menyembunyikan pada touch)
     ======================================================================= */
  function initCustomCursor() {
    var isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    var cursor = document.getElementById('customCursor');
    var dot = cursor ? cursor.querySelector('.cursor-dot') : null;
    var ring = cursor ? cursor.querySelector('.cursor-ring') : null;
    if (!cursor || !dot || !ring) return;

    var ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.left = targetX + 'px';
      dot.style.top = targetY + 'px';
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    var interactiveSelectors = 'a, button, input, textarea, select, .product-card, .gallery-item, .service-card';
    document.querySelectorAll(interactiveSelectors).forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-active'); });
    });
  }

  /* =======================================================================
     4. NAVBAR — efek scroll, scrollspy, smooth scroll, update hash URL
     ======================================================================= */
  function initNavbar() {
    var navbar = document.getElementById('maNavbar');
    var navLinks = document.querySelectorAll('.nav-link-item, .ma-sidebar__nav a');
    var sections = [];

    navLinks.forEach(function (link) {
      var id = link.getAttribute('data-section');
      var section = document.getElementById(id);
      if (section) sections.push({ id: id, el: section });
    });

    // Navbar mengecil saat discroll
    function handleScroll() {
      if (!navbar) return;
      if (window.scrollY > 40) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Smooth scroll manual (agar offset navbar floating diperhitungkan) +
    // update hash URL tanpa reload, browser back tetap berfungsi karena
    // kita memakai history.pushState pada tiap klik menu.
    var allNavAnchors = document.querySelectorAll('a[href^="#"]');
    allNavAnchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href').substring(1);
        var targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        e.preventDefault();

        var offset = window.innerWidth < 992 ? 90 : 110;
        var top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });

        if (history.pushState) {
          history.pushState(null, '', '#' + targetId);
        }

        // Tutup sidebar/offcanvas jika sedang terbuka (mis. saat klik menu di mobile)
        var offcanvasEl = document.getElementById('sidebarMenu');
        if (offcanvasEl && offcanvasEl.classList.contains('show') && window.bootstrap) {
          var instance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
          if (instance) instance.hide();
        }
      });
    });

    // Scrollspy sederhana menggunakan IntersectionObserver
    if ('IntersectionObserver' in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

      sections.forEach(function (s) { observer.observe(s.el); });
    }

    function setActiveNav(activeId) {
      document.querySelectorAll('.nav-link-item').forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('data-section') === activeId);
      });
    }

    // Hamburger membuka offcanvas sidebar (state aria-expanded diselaraskan)
    var hamburger = document.getElementById('hamburgerBtn');
    var sidebarEl = document.getElementById('sidebarMenu');
    if (hamburger && sidebarEl && window.bootstrap) {
      var offcanvas = new window.bootstrap.Offcanvas(sidebarEl);
      hamburger.addEventListener('click', function () {
        offcanvas.show();
      });
      sidebarEl.addEventListener('show.bs.offcanvas', function () { hamburger.setAttribute('aria-expanded', 'true'); });
      sidebarEl.addEventListener('hidden.bs.offcanvas', function () { hamburger.setAttribute('aria-expanded', 'false'); });
    }
  }

  /* =======================================================================
     5. DARK MODE TOGGLE (localStorage)
     ======================================================================= */
  function initDarkMode() {
    var root = document.documentElement;
    var toggles = [document.getElementById('themeToggleDesktop'), document.getElementById('themeToggleSidebar')];
    var saved = null;
    try { saved = localStorage.getItem('ma-theme'); } catch (err) { saved = null; }

    if (saved === 'dark') {
      root.setAttribute('data-theme', 'dark');
      updateToggleIcons(true);
    }

    toggles.forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isDark = root.getAttribute('data-theme') === 'dark';
        var next = isDark ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('ma-theme', next); } catch (err) { /* localStorage tidak tersedia, lewati */ }
        updateToggleIcons(next === 'dark');
      });
    });

    function updateToggleIcons(isDark) {
      toggles.forEach(function (btn) {
        if (!btn) return;
        var icon = btn.querySelector('i');
        if (icon) icon.className = isDark ? 'bi bi-sun' : 'bi bi-moon-stars';
      });
    }
  }

  /* =======================================================================
     6. HERO: EFEK KETIK (TYPING) & PARTIKEL
     ======================================================================= */
  function initHeroTyping() {
    var el = document.getElementById('heroTyping');
    if (!el) return;
    var phrases = ['Menghadirkan Rasa', 'Menghadirkan Cerita', 'Menghadirkan Karakter'];
    var phraseIndex = 0, charIndex = 0, isDeleting = false;

    function tick() {
      var current = phrases[phraseIndex];
      if (!isDeleting) {
        charIndex++;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, isDeleting ? 45 : 85);
    }
    setTimeout(tick, 1200);
  }

  function initHeroParticles() {
    var container = document.getElementById('heroParticles');
    if (!container) return;
    var count = window.innerWidth < 768 ? 10 : 20;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = (Math.random() * -20) + 'px';
      p.style.animationDuration = (8 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
      container.appendChild(p);
    }
  }

  /* =======================================================================
     7. COUNTER / ANGKA BERJALAN
     ======================================================================= */
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var duration = 1600;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { observer.observe(c); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* =======================================================================
     8. PROGRESS BAR LINIER (section Tentang)
     ======================================================================= */
  function initProgressBars() {
    var bars = document.querySelectorAll('.progress-fill');
    if (!bars.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var bar = entry.target;
            bar.style.width = bar.getAttribute('data-progress') + '%';
            obs.unobserve(bar);
          }
        });
      }, { threshold: 0.4 });
      bars.forEach(function (b) { observer.observe(b); });
    } else {
      bars.forEach(function (b) { b.style.width = b.getAttribute('data-progress') + '%'; });
    }
  }

  /* =======================================================================
     8b. CIRCULAR STAT (section Statistik)
     ======================================================================= */
  function initCircularStats() {
    var circles = document.querySelectorAll('.stat-circle');
    if (!circles.length) return;
    var CIRCUMFERENCE = 2 * Math.PI * 52; // r=52, sesuai markup SVG

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var circle = entry.target;
            var pct = parseInt(circle.getAttribute('data-progress'), 10) || 0;
            var fillCircle = circle.querySelector('.stat-circle__fill');
            if (fillCircle) {
              var offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
              fillCircle.style.strokeDasharray = CIRCUMFERENCE;
              fillCircle.style.strokeDashoffset = offset;
            }
            obs.unobserve(circle);
          }
        });
      }, { threshold: 0.4 });
      circles.forEach(function (c) { observer.observe(c); });
    }
  }

  /* =======================================================================
     9. PRODUK — Populate Modal Detail dari data-* atribut kartu
     ======================================================================= */
  function initProductModal() {
    var cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    var modalImage = document.getElementById('modalProductImage');
    var modalCategory = document.getElementById('modalProductCategory');
    var modalLabel = document.getElementById('productModalLabel');
    var modalRating = document.getElementById('modalProductRating');
    var modalDesc = document.getElementById('modalProductDesc');
    var modalPrice = document.getElementById('modalProductPrice');
    var modalWA = document.getElementById('modalProductWA');

    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        // Jangan trigger modal jika yang diklik adalah tombol WhatsApp langsung
        if (e.target.closest('.btn-icon-circle--wa')) return;

        var name = card.getAttribute('data-name');
        var category = card.getAttribute('data-category');
        var price = card.getAttribute('data-price');
        var rating = card.getAttribute('data-rating');
        var desc = card.getAttribute('data-desc');
        var image = card.getAttribute('data-image');

        if (modalImage) { modalImage.src = image; modalImage.alt = name; }
        if (modalCategory) modalCategory.textContent = category;
        if (modalLabel) modalLabel.textContent = name;
        if (modalRating) modalRating.textContent = rating;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalPrice) modalPrice.textContent = price;
        if (modalWA) {
          var message = 'Halo Maison Aur\u00e9lia, saya tertarik dengan ' + name + '.';
          modalWA.href = 'https://wa.me/6281234567890?text=' + encodeURIComponent(message);
        }
      });
    });
  }

  /* =======================================================================
     10. GALERI — FILTER + LIGHTBOX
     ======================================================================= */
  function initGalleryFilterAndLightbox() {
    var filterButtons = document.querySelectorAll('.gallery-filters .gallery-filter-btn');
    var items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');

        items.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });

    // Lightbox
    var lightbox = document.getElementById('lightbox');
    var lightboxImage = document.getElementById('lightboxImage');
    var closeBtn = document.getElementById('lightboxClose');
    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');
    var currentIndex = 0;

    function getVisibleItems() {
      return Array.prototype.filter.call(items, function (item) {
        return !item.classList.contains('is-hidden');
      });
    }

    function openLightbox(index) {
      var visible = getVisibleItems();
      if (!visible.length) return;
      currentIndex = (index + visible.length) % visible.length;
      var img = visible[currentIndex].querySelector('img');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    items.forEach(function (item, index) {
      item.addEventListener('click', function () {
        var visible = getVisibleItems();
        var visibleIndex = visible.indexOf(item);
        openLightbox(visibleIndex);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { openLightbox(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { openLightbox(currentIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });
  }

  /* =======================================================================
     11. ARTIKEL — Data, Render, Pencarian, Filter Kategori, Paginasi
     ======================================================================= */
  function initArticles() {
    var grid = document.getElementById('articlesGrid');
    if (!grid) return;

    var ARTICLES_PER_PAGE = 6;
    var currentPage = 1;
    var currentFilter = 'all';
    var currentSearch = '';

    var articles = [
      { title: '5 Tren Warna Interior yang Akan Mendominasi 2026', category: 'Tren', date: '3 Jan 2026', author: 'Nadia Kirana', excerpt: 'Dari terracotta hangat hingga hijau sage, berikut palet warna yang akan banyak dipakai tahun ini.', image: 'https://picsum.photos/seed/artikel-1/600/400' },
      { title: 'Cara Memilih Material Marmer untuk Meja Kopi', category: 'Panduan', date: '18 Jan 2026', author: 'Reihan Pramudya', excerpt: 'Tidak semua marmer diciptakan setara. Kenali jenis, ketahanan, dan cara merawatnya di sini.', image: 'https://picsum.photos/seed/artikel-2/600/400' },
      { title: 'Menata Ruang Tamu Kecil agar Terasa Lapang', category: 'Desain Interior', date: '2 Feb 2026', author: 'Nadia Kirana', excerpt: 'Trik memilih furnitur multifungsi dan permainan cermin untuk ruang tamu berukuran terbatas.', image: 'https://picsum.photos/seed/artikel-3/600/400' },
      { title: 'Gaya Hidup Slow Living dan Pengaruhnya pada Desain Rumah', category: 'Gaya Hidup', date: '14 Feb 2026', author: 'Aditya Rahman', excerpt: 'Bagaimana filosofi hidup pelan-pelan mengubah cara kita mendesain ruang tinggal.', image: 'https://picsum.photos/seed/artikel-4/600/400' },
      { title: 'Panduan Memadupadankan Tekstur dalam Satu Ruangan', category: 'Panduan', date: '27 Feb 2026', author: 'Reihan Pramudya', excerpt: 'Kombinasi velvet, kayu, dan logam bisa terasa mewah jika mengikuti aturan proporsi ini.', image: 'https://picsum.photos/seed/artikel-5/600/400' },
      { title: 'Kenapa Pencahayaan Lapis Adalah Kunci Ruang Mewah', category: 'Desain Interior', date: '9 Mar 2026', author: 'Nadia Kirana', excerpt: 'Ambient, task, dan accent lighting — pelajari cara mengombinasikan ketiganya dengan benar.', image: 'https://picsum.photos/seed/artikel-6/600/400' },
      { title: 'Tren Dapur Terbuka dengan Sentuhan Klasik', category: 'Tren', date: '21 Mar 2026', author: 'Aditya Rahman', excerpt: 'Dapur terbuka kini tampil lebih personal dengan elemen klasik seperti kabinet panel dan kuningan.', image: 'https://picsum.photos/seed/artikel-7/600/400' },
      { title: 'Merawat Furnitur Kayu Solid agar Awet Puluhan Tahun', category: 'Panduan', date: '5 Apr 2026', author: 'Reihan Pramudya', excerpt: 'Tips kelembapan, pembersihan, dan pelapisan ulang untuk furnitur kayu kesayangan Anda.', image: 'https://picsum.photos/seed/artikel-8/600/400' },
      { title: 'Mindful Living: Mendesain Rumah yang Menenangkan', category: 'Gaya Hidup', date: '19 Apr 2026', author: 'Aditya Rahman', excerpt: 'Ruang yang tenang dimulai dari decluttering, palet netral, dan elemen alami di sekitar kita.', image: 'https://picsum.photos/seed/artikel-9/600/400' },
      { title: 'Inspirasi Ruang Makan untuk Menjamu Tamu Spesial', category: 'Desain Interior', date: '3 Mei 2026', author: 'Nadia Kirana', excerpt: 'Dari pemilihan meja hingga centerpiece, berikut cara menata ruang makan yang berkesan.', image: 'https://picsum.photos/seed/artikel-10/600/400' },
      { title: 'Warna Netral Hangat vs Netral Dingin, Mana yang Cocok?', category: 'Tren', date: '16 Mei 2026', author: 'Nadia Kirana', excerpt: 'Memahami undertone warna netral agar hasil akhir ruang sesuai dengan suasana yang diinginkan.', image: 'https://picsum.photos/seed/artikel-11/600/400' },
      { title: 'Panduan Menentukan Budget Renovasi Interior', category: 'Panduan', date: '30 Mei 2026', author: 'Reihan Pramudya', excerpt: 'Alokasi anggaran yang realistis antara jasa desain, material, dan furnitur baru.', image: 'https://picsum.photos/seed/artikel-12/600/400' }
    ];

    function renderArticles() {
      var filtered = articles.filter(function (article) {
        var matchCategory = currentFilter === 'all' || article.category === currentFilter;
        var matchSearch = article.title.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1 ||
                           article.excerpt.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1;
        return matchCategory && matchSearch;
      });

      var totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE));
      if (currentPage > totalPages) currentPage = totalPages;
      var start = (currentPage - 1) * ARTICLES_PER_PAGE;
      var pageItems = filtered.slice(start, start + ARTICLES_PER_PAGE);

      grid.innerHTML = '';
      var emptyState = document.getElementById('articlesEmpty');

      if (!pageItems.length) {
        if (emptyState) emptyState.classList.remove('d-none');
      } else {
        if (emptyState) emptyState.classList.add('d-none');
      }

      pageItems.forEach(function (article) {
        var col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 reveal is-visible';
        col.innerHTML =
          '<article class="article-card">' +
            '<div class="article-card__image"><img src="' + article.image + '" alt="' + escapeHtml(article.title) + '" loading="lazy"></div>' +
            '<div class="article-card__body">' +
              '<div class="article-meta"><span class="article-cat">' + escapeHtml(article.category) + '</span><span>' + escapeHtml(article.date) + '</span></div>' +
              '<h5>' + escapeHtml(article.title) + '</h5>' +
              '<p>' + escapeHtml(article.excerpt) + '</p>' +
              '<div class="article-author"><img src="https://ui-avatars.com/api/?name=' + encodeURIComponent(article.author) + '&background=C9A063&color=fff&size=64" alt="' + escapeHtml(article.author) + '"> ' + escapeHtml(article.author) + '</div>' +
            '</div>' +
          '</article>';
        grid.appendChild(col);
      });

      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      var nav = document.getElementById('articlesPagination');
      if (!nav) return;
      nav.innerHTML = '';

      if (totalPages <= 1) return;

      var prev = document.createElement('button');
      prev.innerHTML = '<i class="bi bi-chevron-left"></i>';
      prev.setAttribute('aria-label', 'Halaman sebelumnya');
      prev.disabled = currentPage === 1;
      prev.addEventListener('click', function () { currentPage--; renderArticles(); scrollToArticlesTop(); });
      nav.appendChild(prev);

      for (var i = 1; i <= totalPages; i++) {
        (function (page) {
          var btn = document.createElement('button');
          btn.textContent = page;
          if (page === currentPage) btn.classList.add('active');
          btn.addEventListener('click', function () { currentPage = page; renderArticles(); scrollToArticlesTop(); });
          nav.appendChild(btn);
        })(i);
      }

      var next = document.createElement('button');
      next.innerHTML = '<i class="bi bi-chevron-right"></i>';
      next.setAttribute('aria-label', 'Halaman berikutnya');
      next.disabled = currentPage === totalPages;
      next.addEventListener('click', function () { currentPage++; renderArticles(); scrollToArticlesTop(); });
      nav.appendChild(next);
    }

    function scrollToArticlesTop() {
      var section = document.getElementById('artikel');
      if (section) {
        var top = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Event: pencarian
    var searchInput = document.getElementById('articleSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        renderArticles();
      });
    }

    // Event: filter kategori
    var filterContainer = document.getElementById('articleFilterButtons');
    if (filterContainer) {
      filterContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('.gallery-filter-btn');
        if (!btn) return;
        filterContainer.querySelectorAll('.gallery-filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        currentPage = 1;
        renderArticles();
      });
    }

    renderArticles();
  }

  /* =======================================================================
     12. KONTAK — VALIDASI FORM + TOAST
     ======================================================================= */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      form.classList.add('was-validated');

      // Simulasi pengiriman berhasil (tidak ada backend pada proyek ini)
      var toastEl = document.getElementById('contactToast');
      if (toastEl && window.bootstrap) {
        var toast = new window.bootstrap.Toast(toastEl, { delay: 4500 });
        toast.show();
      }

      form.reset();
      form.classList.remove('was-validated');
    });
  }

  /* =======================================================================
     13. NEWSLETTER FORM (dummy submit di footer)
     ======================================================================= */
  function initNewsletterForm() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var toastEl = document.getElementById('contactToast');
      if (toastEl && window.bootstrap) {
        var toastBody = toastEl.querySelector('p');
        var originalText = toastBody ? toastBody.textContent : '';
        if (toastBody) toastBody.textContent = 'Anda berhasil berlangganan newsletter kami.';
        var toast = new window.bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();
        setTimeout(function () { if (toastBody) toastBody.textContent = originalText; }, 4200);
      }
      if (input) input.value = '';
    });
  }

  /* =======================================================================
     14. BACK TO TOP
     ======================================================================= */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =======================================================================
     15. SCROLL REVEAL ANIMATION
     ======================================================================= */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      elements.forEach(function (el) { observer.observe(el); });
    } else {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* =======================================================================
     16. FOOTER YEAR
     ======================================================================= */
  function initFooterYear() {
    var el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

})();
