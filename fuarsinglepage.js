document.addEventListener('DOMContentLoaded', function() {
    // Takvime Ekle butonu işlevselliği
    const takvimEkleBtn = document.querySelector('.takvim-ekle-btn');
    
    takvimEkleBtn.addEventListener('click', function() {
        // Fuar bilgilerini al
        const fairTitle = document.querySelector('.fair-title').textContent;
        const startDate = '2025-04-24';
        const endDate = '2025-04-26';
        const location = 'İstanbul Fuar Merkezi';
        const description = document.querySelector('.fair-description p').textContent;
        
        // Google Calendar için URL oluştur
        const googleCalendarUrl = createGoogleCalendarUrl(fairTitle, startDate, endDate, location, description);
        
        // Takvim seçeneklerini göster
        showCalendarOptions(googleCalendarUrl);
    });
    
    // Paylaş butonu işlevselliği
    const shareBtn = document.querySelector('.share-btn');
    
    shareBtn.addEventListener('click', function() {
        // Web Share API kullanılabilir mi kontrol et
        if (navigator.share) {
            navigator.share({
                title: document.querySelector('.fair-title').textContent,
                text: 'ICCI 2025 - Uluslararası Enerji ve Çevre Fuarı ve Konferansı hakkında bilgi',
                url: window.location.href
            })
            .catch(error => {
                console.log('Paylaşım işlemi iptal edildi veya başarısız oldu', error);
            });
        } else {
            // Web Share API desteklenmiyorsa basit bir paylaşım menüsü göster
            alert('Bu etkinliği paylaşmak için URL\'yi kopyalayabilirsiniz: ' + window.location.href);
        }
    });
});

// Google Calendar için URL oluşturma fonksiyonu
function createGoogleCalendarUrl(title, startDate, endDate, location, description) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    // Google Calendar için tarihleri formatla
    const startDateFormatted = formatDateForGoogleCalendar(startDateTime);
    const endDateFormatted = formatDateForGoogleCalendar(endDateTime);
    
    // URL parametrelerini oluştur
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${startDateFormatted}/${endDateFormatted}`,
        location: location,
        details: description
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Google Calendar için tarih formatı (YYYYMMDDTHHMMSSZ)
function formatDateForGoogleCalendar(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}${month}${day}T000000Z`;
}

// Takvim seçeneklerini gösteren fonksiyon
function showCalendarOptions(googleCalendarUrl) {
    // Basit bir modal oluştur
    const modal = document.createElement('div');
    modal.className = 'calendar-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // Modal içeriği
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.maxWidth = '400px';
    modalContent.style.width = '90%';
    
    // Başlık
    const title = document.createElement('h4');
    title.textContent = 'Takvime Ekle';
    title.style.marginBottom = '15px';
    
    // Google Calendar butonu
    const googleBtn = document.createElement('a');
    googleBtn.href = googleCalendarUrl;
    googleBtn.target = '_blank';
    googleBtn.className = 'btn btn-primary w-100 mb-2';
    googleBtn.textContent = 'Google Calendar';
    
    // Outlook butonu
    const outlookBtn = document.createElement('button');
    outlookBtn.className = 'btn btn-secondary w-100 mb-2';
    outlookBtn.textContent = 'Outlook Calendar';
    outlookBtn.onclick = function() {
        alert('Outlook Calendar entegrasyonu için geliştirme yapılacak');
    };
    
    // Apple Calendar butonu
    const appleBtn = document.createElement('button');
    appleBtn.className = 'btn btn-secondary w-100 mb-3';
    appleBtn.textContent = 'Apple Calendar';
    appleBtn.onclick = function() {
        alert('Apple Calendar entegrasyonu için geliştirme yapılacak');
    };
    
    // Kapat butonu
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-outline-danger w-100';
    closeBtn.textContent = 'Kapat';
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Elementleri birleştir
    modalContent.appendChild(title);
    modalContent.appendChild(googleBtn);
    modalContent.appendChild(outlookBtn);
    modalContent.appendChild(appleBtn);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    
    // Modal'ı sayfaya ekle
    document.body.appendChild(modal);
    
    // Modal dışına tıklandığında kapat
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}