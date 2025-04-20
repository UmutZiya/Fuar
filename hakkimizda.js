document.addEventListener("DOMContentLoaded", () => {
    try {
      console.log("Script loaded and running")
  
      // Get all dropdown toggles
      const dropdownToggles = document.querySelectorAll(".dropdown-toggle")
      console.log("Found dropdown toggles:", dropdownToggles.length)
  
      // Initialize collapse elements
      const collapseElements = document.querySelectorAll(".collapse")
      console.log("Found collapse elements:", collapseElements.length)
  
      collapseElements.forEach((collapse) => {
        // Set initial state
        if (!collapse.classList.contains("show")) {
          collapse.style.height = "0px"
        } else {
          // For initially open menus
          setTimeout(() => {
            collapse.style.height = collapse.scrollHeight + "px"
          }, 100)
        }
      })
  
      // Add click event to each dropdown toggle
      dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
          e.preventDefault()
          console.log("Toggle clicked:", this)
  
          // Get target submenu ID
          const targetId = this.getAttribute("data-bs-target")
          console.log("Target ID:", targetId)
  
          if (!targetId) {
            console.error("No target ID found on toggle")
            return
          }
  
          // Get target submenu element
          const targetSubmenu = document.querySelector(targetId)
          console.log("Target submenu:", targetSubmenu)
  
          if (!targetSubmenu) {
            console.error("Target submenu not found:", targetId)
            return
          }
  
          // Toggle the menu
          const isOpen = targetSubmenu.classList.contains("show")
          console.log("Menu is currently open:", isOpen)
  
          if (isOpen) {
            // Close menu
            console.log("Closing menu")
            targetSubmenu.style.height = "0px"
            this.setAttribute("aria-expanded", "false")
  
            // Remove show class after animation completes
            setTimeout(() => {
              targetSubmenu.classList.remove("show")
            }, 1000) // Match the CSS transition duration
          } else {
            // Open menu
            console.log("Opening menu")
            targetSubmenu.classList.add("show")
            this.setAttribute("aria-expanded", "true")
  
            // Set height after a small delay to ensure transition works
            setTimeout(() => {
              targetSubmenu.style.height = targetSubmenu.scrollHeight + "px"
            }, 10)
          }
        })
      })
  
      // Mobile menu toggle
      const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
      const sidebar = document.querySelector(".sidebar")
  
      if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener("click", () => {
          sidebar.classList.toggle("show")
        })
      }
  
      // Close sidebar when clicking outside on mobile
      document.addEventListener("click", (event) => {
        const isClickInsideSidebar = sidebar.contains(event.target)
        const isClickOnToggle = mobileMenuToggle && mobileMenuToggle.contains(event.target)
  
        if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768 && sidebar.classList.contains("show")) {
          sidebar.classList.remove("show")
        }
      })
  
      // Handle window resize
      window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
          sidebar.classList.remove("show")
        }
      })
  
      // Add active class to current page link
      const currentPath = window.location.pathname
      const navLinks = document.querySelectorAll(".sidebar .nav-link")
  
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPath) {
          link.classList.add("active")
  
          // If it's a submenu item, expand its parent
          const parentSubmenu = link.closest(".collapse")
          if (parentSubmenu) {
            parentSubmenu.classList.add("show")
            parentSubmenu.style.height = parentSubmenu.scrollHeight + "px"
            const parentToggle = document.querySelector(`[data-bs-target="#${parentSubmenu.id}"]`)
            if (parentToggle) {
              parentToggle.setAttribute("aria-expanded", "true")
            }
          }
        }
      })
    } catch (error) {
      console.error("Error in sidebar script:", error)
    }
  })
  