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


/*============= Card-slider 2 JS ================= */
document.addEventListener('DOMContentLoaded', function() {
    const cardsData = {
      gundem: [
        { image: "./images/card-2-slider-1.png", date: "2024-05-01", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
        { image: "./images/card-2-slider-2.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
        { image: "./images/card-2-slider-3.jpg", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
        { image: "./images/card-2-slider-4.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
        { image: "./images/card-2-slider-5.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
        { image: "./images/card-2-slider-6.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
        { image: "./images/card-2-slider-7.png", date: "2024-05-02", tag: "Gündem", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
      ],
      blog: [
        { image: "./images/card-2-slider-8.png", date: "2024-05-03", tag: "Blog", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
        { image: "./images/card-2-slider-9.png", date: "2024-05-03", tag: "Blog", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
      ],
      duyurular: [
        { image: "./images/card-2-slider-10.jpg", date: "2024-05-04", tag: "Duyuru", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
        { image: "./images/card-2-slider-2.png", date: "2024-05-04", tag: "Duyuru", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
      ],
      haberler: [
        { image: "./images/card-2-slider-4.png", date: "2024-05-05", tag: "Haber", title: "Güneş Sektörünün Markalarını Dünya Liderleriyle Buluşturacak 17. SolarEX İstanbul İçin Geri Sayım Başladı!" },
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
      
      // Swiper'ı güncelle
      if (swiperInstance) {
        swiperInstance.update();
        swiperInstance.slideTo(0, 0);
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
  
  
  
  
  
  