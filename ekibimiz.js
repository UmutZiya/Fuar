// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('keyup', function() {
      const searchTerm = searchInput.value.toLowerCase();
      
      // Search in all tables
      const tables = document.querySelectorAll('.team-section table');
      tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        let hasVisibleRows = false;
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            row.style.display = '';
            hasVisibleRows = true;
          } else {
            row.style.display = 'none';
          }
        });
        
        // Hide the entire section if no rows match
        const section = table.closest('.team-section');
        section.style.display = hasVisibleRows || searchTerm === '' ? '' : 'none';
      });
      
      // Search in management team
      const managementCards = document.querySelectorAll('.management-team .col');
      let hasVisibleCards = false;
      
      managementCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          card.style.display = '';
          hasVisibleCards = true;
        } else {
          card.style.display = 'none';
        }
      });
      
      // Hide the entire management section if no cards match
      const managementSection = document.querySelector('.management-team');
      managementSection.style.display = hasVisibleCards || searchTerm === '' ? '' : 'none';
    });
  });