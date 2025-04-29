document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Script loaded and running")

    // Dropdown toggle and mobile menu logic removed as Bootstrap handles it.

    // Add active class to current page link
    const currentPath = window.location.pathname
    const navLinks = document.querySelectorAll(".sidebar .nav-link")

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href")
      // Check if href exists and matches the current path or a relevant anchor
      if (linkHref && (linkHref === currentPath || currentPath.endsWith(linkHref) || linkHref.startsWith('#') && window.location.hash === linkHref)) {
        link.classList.add("active")

        // If it's a submenu item, expand its parent
        const parentSubmenu = link.closest(".collapse")
        if (parentSubmenu && !parentSubmenu.classList.contains('show')) {
          parentSubmenu.classList.add("show") // Let Bootstrap handle showing
          const parentToggle = document.querySelector(`[data-bs-target="#${parentSubmenu.id}"]`)
          if (parentToggle) {
            parentToggle.setAttribute("aria-expanded", "true")
            parentToggle.classList.remove('collapsed') // Ensure toggle reflects expanded state
          }
        }
      }
    })
  } catch (error) {
    console.error("Error in sidebar active link script:", error)
  }

  // Sidebar mobile toggle functionality
  const sidebarToggleButton = document.querySelector('.sidebar-toggle-button');
  const sidebar = document.querySelector('.sidebar');

  if (sidebarToggleButton && sidebar) {
    sidebarToggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });

    // Optional: Close sidebar if clicking outside of it on mobile
    document.addEventListener('click', (event) => {
      if (window.innerWidth < 768 && sidebar.classList.contains('show') && 
          !sidebar.contains(event.target) && 
          !sidebarToggleButton.contains(event.target)) {
        sidebar.classList.remove('show');
      }
    });
  }
})
