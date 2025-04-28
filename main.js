// =====================================================================
// Language Switching Logic (Top Level Scope)
// =====================================================================
let i18n_translations = {}; // Renamed to avoid potential global conflicts
let i18n_currentLang = localStorage.getItem('language') || 'tr'; // Renamed

// Helper function to get nested translation values
function i18n_getTranslation(key) {
    return key.split('.').reduce((obj, i) => (obj ? obj[i] : undefined), i18n_translations);
}

// Apply translations to the document
function i18n_applyTranslations(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Translate elements with data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = i18n_getTranslation(key);
        if (translation !== undefined) {
            const icon = element.querySelector('i'); // Keep icon if present
            if (icon) {
                element.innerHTML = translation + ' ' + icon.outerHTML;
            } else {
                element.textContent = translation;
            }
        } else {
            console.warn(`Translation key not found: ${key}`);
        }
    });

    // Translate elements with data-translate-placeholder
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = i18n_getTranslation(key);
        if (translation !== undefined) {
            element.placeholder = translation;
        } else {
            console.warn(`Translation key not found for placeholder: ${key}`);
        }
    });

    // Translate elements with data-translate-aria-label
    document.querySelectorAll('[data-translate-aria-label]').forEach(element => {
        const key = element.getAttribute('data-translate-aria-label');
        const translation = i18n_getTranslation(key);
        if (translation !== undefined) {
            element.setAttribute('aria-label', translation);
        } else {
            console.warn(`Translation key not found for aria-label: ${key}`);
        }
    });

    // Update active class on language buttons (assuming they are available)
    document.querySelectorAll('.lang-switch a').forEach(button => {
         if (button.getAttribute('data-lang') === lang) {
             button.classList.add('active');
         } else {
             button.classList.remove('active');
         }
     });
}

// Load translation file and apply
async function i18n_loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        i18n_translations = await response.json();
        i18n_applyTranslations(lang); // Apply immediately after loading
    } catch (error) {
        console.error("Could not load translations:", error);
    }
}

// Initial language load triggered later by DOMContentLoaded
// =====================================================================

/*=============== Navbar js =============================== */
document.addEventListener('DOMContentLoaded', () => {
  const menuToggleButtons = document.querySelectorAll('.nav-toggle-button'); // Menüyü açan/kapatan tüm butonlar/linkler
  const closeMenuButton = document.querySelector('.close-menu-btn');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  const body = document.body;
  // Menü içindeki başlıklar (bunlara tıklanınca da kapanması için) - İsteğe bağlı
  const menuTitleLinks = document.querySelectorAll('.fullscreen-menu .menu-column h3');

  // Menüyü Açma Fonksiyonu
  const openMenu = () => {
      if (!fullscreenMenu.classList.contains('active')) {
          fullscreenMenu.classList.add('active');
          body.classList.add('menu-open'); // Scroll engelleme için body'e class ekle
      }
  };

  // Menüyü Kapatma Fonksiyonu
  const closeMenu = () => {
      if (fullscreenMenu.classList.contains('active')) {
          fullscreenMenu.classList.remove('active');
          body.classList.remove('menu-open'); // Scroll engellemeyi kaldır
      }
  };

  // Menüyü Aç/Kapat Butonlarına Tıklama Olayı
  menuToggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          e.preventDefault(); // Linklerin (#) sayfayı yukarı atmasını engelle

          // Eğer tıklanan buton mobil toggle ise veya menü kapalıysa, menünün durumunu değiştir.
          // Eğer menü zaten açıksa ve tıklanan normal bir menü linkiyse, sadece kapat.
          if (button.classList.contains('mobile-menu-toggle')) {
               if (fullscreenMenu.classList.contains('active')) {
                  closeMenu();
               } else {
                  openMenu();
               }
          } else if (button.closest('.fullscreen-menu') && fullscreenMenu.classList.contains('active')){
               // Eğer açık menü içindeki bir başlığa tıklandıysa kapat
               closeMenu();
          }
          else {
              // Diğer tüm durumlarda (ana navbardaki linkler, arama ikonu) menüyü aç
              openMenu();
          }
      });
  });

  // Kapatma (X) Butonuna Tıklama Olayı
  if (closeMenuButton) {
      closeMenuButton.addEventListener('click', () => {
          closeMenu();
      });
  }

  // İsteğe Bağlı: Esc tuşu ile menüyü kapatma
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
          closeMenu();
      }
  });
});

/*=============== Language Switcher Event Listener Setup =============================== */
// Setup language button listeners and trigger initial load
document.addEventListener('DOMContentLoaded', () => {
    const languageButtons = document.querySelectorAll('.lang-switch a');

    languageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-lang');
            if (lang && lang !== i18n_currentLang) {
                i18n_currentLang = lang;
                localStorage.setItem('language', lang); // Save selected language
                i18n_loadTranslations(lang); // Use top-level function
            }
        });
    });

    // Initial language load
    i18n_loadTranslations(i18n_currentLang); // Use top-level function and variable
});

/*================== Card-Slider-1 Js ======================*/
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  const cards = document.querySelectorAll('.card');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const progressFill = document.querySelector('.progress-fill');
  
  let currentIndex = 0;
  const cardWidth = cards[0].offsetWidth + 20; // 20px for gap
  const visibleCards = getVisibleCards();
  const maxIndex = cards.length - visibleCards;
  
  // İlk yüklemede ilerleme çubuğunu ayarla
  updateProgressBar();
  
  // Görünür kart sayısını hesapla (responsive için)
  function getVisibleCards() {
      const containerWidth = slider.parentElement.offsetWidth;
      if (containerWidth >= 992) {
          return 3; // Büyük ekranlarda 3 kart
      } else if (containerWidth >= 768) {
          return 2; // Orta ekranlarda 2 kart
      } else {
          return 1; // Küçük ekranlarda 1 kart
      }
  }
  
  // İlerleme çubuğunu güncelle
  function updateProgressBar() {
      const progress = (currentIndex / maxIndex) * 100;
      progressFill.style.width = `${progress}%`;
  }
  
  // Slider'ı güncelle
  function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateProgressBar();
  }
  
  // Önceki karta git
  prevBtn.addEventListener('click', function() {
      if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
      }
  });
  
  // Sonraki karta git
  nextBtn.addEventListener('click', function() {
      if (currentIndex < maxIndex) {
          currentIndex++;
          updateSlider();
      }
  });
  
  // Doknuma olayları için destek
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
  });
  
  slider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
  });
  
  function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
          // Sola kaydırma
          if (currentIndex < maxIndex) {
              currentIndex++;
              updateSlider();
          }
      } else if (touchEndX > touchStartX + swipeThreshold) {
          // Sağa kaydırma
          if (currentIndex > 0) {
              currentIndex--;
              updateSlider();
          }
      }
  }
  
  // Pencere boyutu değiştiğinde slider'ı güncelle
  window.addEventListener('resize', function() {
      const newVisibleCards = getVisibleCards();
      const newMaxIndex = cards.length - newVisibleCards;
      
      // Eğer mevcut indeks yeni maksimum indeksten büyükse, güncelle
      if (currentIndex > newMaxIndex) {
          currentIndex = newMaxIndex;
      }
      
      // Kart genişliğini yeniden hesapla
      const newCardWidth = cards[0].offsetWidth + 20;
      
      // Slider'ı güncelle
      slider.style.transform = `translateX(-${currentIndex * newCardWidth}px)`;
      updateProgressBar();
  });

  // Yeni değişkenler ekleyin
  let isDragging = false;
  let startPosX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // Slider için mousedown event listener ekleyin
  slider.addEventListener('mousedown', dragStart);
  slider.addEventListener('mouseup', dragEnd);
  slider.addEventListener('mouseleave', dragEnd);
  slider.addEventListener('mousemove', drag);

  // Dokunmatik event listener'ları güncelleyin
  slider.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      dragStart(e.touches[0]);
  });
  
  slider.addEventListener('touchend', dragEnd);
  slider.addEventListener('touchmove', function(e) {
      touchEndX = e.touches[0].clientX;
      drag(e.touches[0]);
  });

  function dragStart(e) {
      isDragging = true;
      startPosX = e.clientX;
      prevTranslate = currentTranslate;
      
      // Animasyonu durdur ve transition'ı kapat
      slider.style.transition = 'none';
      cancelAnimationFrame(animationID);
  }

  function drag(e) {
      if(isDragging) {
          const currentPosX = e.clientX;
          const deltaX = currentPosX - startPosX;
          currentTranslate = prevTranslate + deltaX;
          
          // Gerçek zamanlı slider pozisyonunu güncelle
          slider.style.transform = `translateX(${currentTranslate}px)`;
      }
  }

  function dragEnd() {
      if(!isDragging) return;
      isDragging = false;
      
      // Transition'ı yeniden etkinleştir
      slider.style.transition = 'transform 0.5s ease';
      
      // Minimum kaydırma mesafesi
      const movedBy = currentTranslate - prevTranslate;
      const threshold = cardWidth * 0.2; // %20 kaydırma eşiği
      
      if(movedBy < -threshold && currentIndex < maxIndex) {
          currentIndex++;
      } else if(movedBy > threshold && currentIndex > 0) {
          currentIndex--;
      }
      
      // Slider'ı son pozisyona animasyonla getir
      updateSlider();
  }

  // Mevcut updateSlider fonksiyonunu güncelleyin
  function updateSlider() {
      currentTranslate = -currentIndex * cardWidth;
      slider.style.transform = `translateX(${currentTranslate}px)`;
      updateProgressBar();
  }

  // ... mevcut diğer fonksiyonlar ...
  
  // Pencere boyutu değiştiğinde currentTranslate'ı güncelle
  window.addEventListener('resize', function() {
      // ... mevcut resize kodu ...
      currentTranslate = -currentIndex * newCardWidth;
  });
});

/*============== Fuar Takvim Js ================*/
// Sample event data
const events = [
  {
    id: 1,
    title: "IJS İstanbul Jewelry Show 2025 - 57. İstanbul Uluslararası Mücevherat, Saat ve Malzemeleri Fuarı",
    date: "16 - 19 Nisan",
    year: "2025",
    month: "Nisan",
    sector: "Mücevherat",
    location: "İstanbul",
    organizer: "UBM İstanbul Fuarcılık ve Gösteri Hizmetleri A.Ş.",
    url: "event-details.html?id=1",
  },
  {
    id: 2,
    title: "Mobilefest - Agora, Avrasya Teknoloji Haftası",
    date: "17 - 19 Nisan 2025",
    year: "2025",
    month: "Nisan",
    sector: "Teknoloji",
    location: "Agora",
    organizer: "HİS Fuarcılık Hizmetleri Ltd. Şti.",
    url: "event-details.html?id=2",
  },
  {
    id: 3,
    title: "VIV SELECT TÜRKİYE 2025 - 11. Tavukçuluk ve Teknolojileri Uluslararası İhtisas Fuarı",
    date: "24 - 26 Nisan 2025",
    year: "2025",
    month: "Nisan",
    sector: "Tavukçuluk",
    location: "İstanbul",
    organizer: "HKF Fuarcılık A.Ş.",
    url: "event-details.html?id=3",
  },
  {
    id: 4,
    title: "FOTEG İstanbul 2025 - Gıda İşleme Teknolojileri Uluslararası İhtisas Fuarı",
    date: "24 - 26 Nisan 2025",
    year: "2025",
    month: "Nisan",
    sector: "Gıda İşleme",
    location: "İstanbul",
    organizer: "HKF Fuarcılık A.Ş.",
    url: "event-details.html?id=4",
  },
  {
    id: 5,
    title: "Teknoloji Fuarı 2025",
    date: "10 - 15 Temmuz 2025",
    year: "2025",
    month: "Temmuz",
    sector: "Teknoloji",
    location: "Ankara",
    organizer: "ABC Fuarcılık Ltd. Şti.",
    url: "event-details.html?id=5",
  },
  {
    id: 6,
    title: "Gıda Festivali 2026",
    date: "5 - 10 Ocak 2026",
    year: "2026",
    month: "Ocak",
    sector: "Gıda İşleme",
    location: "İstanbul",
    organizer: "XYZ Organizasyon A.Ş.",
    url: "event-details.html?id=6",
  },
  {
    id: 7,
    title: "Yapı Fuarı 2025",
    date: "15 - 20 Mayıs 2025",
    year: "2025",
    month: "Mayıs",
    sector: "İnşaat",
    location: "İstanbul",
    organizer: "DEF Fuarcılık A.Ş.",
    url: "event-details.html?id=7",
  },
  {
    id: 8,
    title: "Otomotiv Fuarı 2025",
    date: "1 - 5 Haziran 2025",
    year: "2025",
    month: "Haziran",
    sector: "Otomotiv",
    location: "İstanbul",
    organizer: "GHI Fuarcılık Ltd. Şti.",
    url: "event-details.html?id=8",
  },
  {
    id: 9,
    title: "Turizm Fuarı 2025",
    date: "10 - 15 Eylül 2025",
    year: "2025",
    month: "Eylül",
    sector: "Turizm",
    location: "Antalya",
    organizer: "JKL Organizasyon A.Ş.",
    url: "event-details.html?id=9",
  },
  {
    id: 10,
    title: "Mobilya Fuarı 2025",
    date: "20 - 25 Ekim 2025",
    year: "2025",
    month: "Ekim",
    sector: "Mobilya",
    location: "İstanbul",
    organizer: "MNO Fuarcılık A.Ş.",
    url: "event-details.html?id=10",
  },

  {
    id: 11,
    title: "İnşaat ve Gayrimenkul Fuarı",
    date: "24 - 27 Nisan 2025",
    year: "2025",
    month: "Nisan",
    sector: "İnşaat",
    location: "Bursa",
    organizer: "Bursa Fuar Merkezi",
    url: "./fuar-single-page.html",
  },
]
// DOM elements
const yearFilter = document.getElementById("yearFilter")
const monthFilter = document.getElementById("monthFilter")
const sectorFilter = document.getElementById("sectorFilter")
const locationFilter = document.getElementById("locationFilter")
const eventsList = document.getElementById("eventsList")
const paginationContainer = document.getElementById("pagination")

// Pagination variables
let currentPage = 1
const eventsPerPage = 6
let filteredEvents = events

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  updateEvents()

  // Add event listeners to filters
  yearFilter.addEventListener("change", () => {
    currentPage = 1 // Reset to first page when filter changes
    filterEvents()
  })
  monthFilter.addEventListener("change", () => {
    currentPage = 1
    filterEvents()
  })
  sectorFilter.addEventListener("change", () => {
    currentPage = 1
    filterEvents()
  })
  locationFilter.addEventListener("change", () => {
    currentPage = 1
    filterEvents()
  })
})

// Filter events based on selected criteria
function filterEvents() {
  const selectedYear = yearFilter.value
  const selectedMonth = monthFilter.value
  const selectedSector = sectorFilter.value
  const selectedLocation = locationFilter.value

  filteredEvents = events

  // Apply filters
  if (selectedYear) {
    filteredEvents = filteredEvents.filter((event) => event.year === selectedYear)
  }

  if (selectedMonth) {
    filteredEvents = filteredEvents.filter((event) => event.month === selectedMonth)
  }

  if (selectedSector) {
    filteredEvents = filteredEvents.filter((event) => event.sector === selectedSector)
  }

  if (selectedLocation) {
    filteredEvents = filteredEvents.filter((event) => event.location === selectedLocation)
  }

  // Update display with filtered events
  updateEvents()
}

// Update events display and pagination
function updateEvents() {
  displayEvents()
  setupPagination()
}

// Display events in the DOM
function displayEvents() {
  eventsList.innerHTML = ""

  if (filteredEvents.length === 0) {
    eventsList.innerHTML = '<div class="alert alert-info">Seçilen kriterlere uygun etkinlik bulunamadı.</div>'
    return
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * eventsPerPage
  const endIndex = Math.min(startIndex + eventsPerPage, filteredEvents.length)
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

  paginatedEvents.forEach((event) => {
    const eventElement = document.createElement("div")
    eventElement.className = "event-item"

    eventElement.innerHTML = `
            <a href="${event.url}" class="event-link">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${event.date}</div>
                <div class="event-organizer">${event.organizer}</div>
            </a>
        `

    eventsList.appendChild(eventElement)
  })
}

// Setup pagination
function setupPagination() {
  paginationContainer.innerHTML = ""

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)

  if (totalPages <= 1) {
    return // Don't show pagination if there's only one page
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li")
    pageItem.className = `page-item ${i === currentPage ? "active" : ""}`

    const pageLink = document.createElement("a")
    pageLink.className = "page-link"
    pageLink.href = "#"
    pageLink.textContent = i

    pageLink.addEventListener("click", (e) => {
      e.preventDefault()
      currentPage = i
      updateEvents()
    })

    pageItem.appendChild(pageLink)
    paginationContainer.appendChild(pageItem)
  }
}

/*============= Card-slider 2 JS ================= */
document.addEventListener('DOMContentLoaded', function() {
  const cardsData = {
    gundem: [
      { image: "./images/card-2-slider-1.png", date: "2024-05-01", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
      { image: "./images/card-2-slider-2.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
      { image: "./images/card-2-slider-6.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
      { image: "./images/card-2-slider-4.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
      { image: "./images/card-2-slider-5.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
      { image: "./images/card-2-slider-6.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
      { image: "./images/card-2-slider-7.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
    ],
    blog: [
      { image: "./images/card-2-slider-8.png", date: "2024-03-07", tag: "Blog", title: "Tekstil sektörünün kalbi Bursa Textile Show Fuarı'nda attı.", link: "blog-single-page.html" },
    ],
    duyurular: [
      { image: "./images/card-2-slider-10.jpg", date: "2024-05-04", tag: "Duyuru", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
      { image: "./images/card-2-slider-2.png", date: "2024-05-04", tag: "Duyuru", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
    ],
    haberler: [
      { image: "./images/card-2-slider-4.png", date: "2024-05-05", tag: "Haber", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!", link: "blog-single-page.html" },
    ]
  };

  let swiperInstance = null;
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const cardTemplate = document.getElementById('card-template-2');
  const categoryTabs = document.querySelectorAll('.category-tab-2');
  const cardSlider = document.querySelector('.card-slider-2');

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return {
      year: date.getFullYear(),
      day: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    };
  }

  function createCards(category) {
    const fragment = document.createDocumentFragment();
    cardsData[category].forEach(data => {
      const clone = cardTemplate.content.cloneNode(true);
      const formattedDate = formatDate(data.date);
      
      clone.querySelector('img').src = data.image;
      clone.querySelector('.date-year-2').textContent = formattedDate.year;
      clone.querySelector('.date-day-2').textContent = formattedDate.day;
      clone.querySelector('.card-tag-2').textContent = data.tag;
      clone.querySelector('.card-title-2').textContent = data.title;
      clone.querySelector('.card-discover-link-2').href = data.link;
      
      fragment.appendChild(clone);
    });
    return fragment;
  }

  function initSwiper() {
    swiperInstance = new Swiper('.swiper', {
      slidesPerView: 'auto',
      spaceBetween: 30,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        disabledClass: 'swiper-button-disabled',
      },
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      mousewheel: {
        forceToAxis: true,
      },
      touchEventsTarget: 'container',
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true,
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }
    });
  }

  function handleCategoryClick(e) {
    const category = e.target.dataset.category;
    
    categoryTabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    
    // Kartları gizle
    cardSlider.style.display = 'none';
    
    // Yeni kartları oluştur
    const newCards = createCards(category);
    
    // Eski kartları temizle ve yenilerini ekle
    swiperWrapper.innerHTML = '';
    swiperWrapper.appendChild(newCards);
    
    // Apply translations to the newly added cards
    if (typeof i18n_applyTranslations === 'function') {
        i18n_applyTranslations(i18n_currentLang); // Re-apply translations to the whole page
    } else {
        console.error("Translation function (i18n_applyTranslations) not accessible.");
        // As a fallback, you might manually translate items within swiperWrapper if needed
    }
    
    // Swiper'ı güncelle
    if (swiperInstance) {
      swiperInstance.update();
      swiperInstance.slideTo(0, 0);
    } else {
      initSwiper(); // Initialize if it wasn't (should be initialized on load)
    }
    
    // Kartları göster
    requestAnimationFrame(() => {
      cardSlider.style.display = 'block';
    });
  }

  // Event Listeners
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', handleCategoryClick);
  });

  // Initial Load
  const initialCards = createCards('gundem');
  swiperWrapper.appendChild(initialCards);
  initSwiper();
});
/*====== index.html js end =============*/

/*====== iletisim.html js start ====*/
// Wrap in DOMContentLoaded if this script might run before the form exists
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // CAPTCHA doğrulama
            const captchaTextEl = document.getElementById('captchaText');
            const captchaInputEl = document.getElementById('captchaInput');
            if (!captchaTextEl || !captchaInputEl) {
                console.error("Captcha elements not found");
                alert('CAPTCHA elements not found!');
                return;
            }
            const captchaText = captchaTextEl.textContent;
            const captchaInput = captchaInputEl.value;


            if (captchaText !== captchaInput) {
                alert('CAPTCHA kodu hatalı!');
                return;
            }

            // Form verilerini al
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Normalde burada bir AJAX isteği ile form verileri sunucuya gönderilir
            console.log('Form gönderildi:', { name, phone, email, message });
            alert('Mesajınız başarıyla gönderildi!');

            // Formu sıfırla
            this.reset();
             // Optionally refresh captcha after successful submission
             refreshCaptcha();
        });
    }

     // CAPTCHA yenileme
     const refreshButton = document.querySelector('.captcha-refresh');
     if (refreshButton) {
         refreshButton.addEventListener('click', refreshCaptcha);
         // Initial captcha generation
         refreshCaptcha();
     }

     function refreshCaptcha() {
        const captchaTextEl = document.getElementById('captchaText');
        if(!captchaTextEl) return;
        // Rastgele CAPTCHA kodu oluştur
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        captchaTextEl.textContent = captcha;
        // Clear previous input
        const captchaInputEl = document.getElementById('captchaInput');
        if(captchaInputEl) captchaInputEl.value = '';
     }
});

/*================ Hakkımızda Js ===============*/

