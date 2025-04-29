document.addEventListener("DOMContentLoaded", () => {
    // View switching functionality
    const viewButtons = document.querySelectorAll(".view-btn")
    const viewContents = document.querySelectorAll(".view-content")
  
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        viewButtons.forEach((btn) => btn.classList.remove("active"))
  
        // Add active class to clicked button
        this.classList.add("active")
  
        // Get the view type from data attribute
        const viewType = this.getAttribute("data-view")
  
        // Hide all content views
        viewContents.forEach((content) => content.classList.remove("active"))
  
        // Show the selected view content
        document.getElementById(viewType + "View").classList.add("active")
      })
    })
  
    // Search functionality
    const searchInput = document.getElementById("searchInput")
  
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      console.log("Searching for:", searchTerm)
  
      // Örnek arama fonksiyonu - Liste görünümü için
      const fairItems = document.querySelectorAll(".fair-item")
  
      fairItems.forEach((item) => {
        const fairTitle = item.querySelector("h3").textContent.toLowerCase()
        const fairLocation = item.querySelector(".location").textContent.toLowerCase()
        const fairDescription = item.querySelector(".description").textContent.toLowerCase()
  
        if (fairTitle.includes(searchTerm) || fairLocation.includes(searchTerm) || fairDescription.includes(searchTerm)) {
          item.style.display = "flex"
        } else {
          item.style.display = "none"
        }
      })
    })
  
    // Aylık görünüm için olay işleyicileri
    const daysWithEvents = document.querySelectorAll(".day.has-event")
  
    daysWithEvents.forEach((day) => {
      day.addEventListener("mouseover", function () {
        this.querySelector(".event-popup").style.display = "block"
      })
  
      day.addEventListener("mouseout", function () {
        this.querySelector(".event-popup").style.display = "none"
      })
    })
  })
  