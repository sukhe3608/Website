// assets/js/loadComponents.js
document.addEventListener('DOMContentLoaded', function() {
    // Function to load component from file
    function loadComponent(elementId, filePath) {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${filePath}: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
                console.log(`Loaded ${filePath} into #${elementId}`);
                return true;
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
                // Fallback content if file fails to load
                if (elementId === 'sidebar-placeholder') {
                    document.getElementById(elementId).innerHTML = `
                        <div style="padding: 20px; color: #666; text-align: center;">
                            Sidebar failed to load. Please check if components/sidebar.html exists.
                        </div>
                    `;
                } else if (elementId === 'header-placeholder') {
                    document.getElementById(elementId).innerHTML = `
                        <div style="padding: 20px; color: #666; text-align: center;">
                            Header failed to load. Please check if components/header.html exists.
                        </div>
                    `;
                }
                return false;
            });
    }

    // Load both components with updated paths
    Promise.all([
        loadComponent('sidebar-placeholder', 'components/sidebar.html'),
        loadComponent('header-placeholder', 'components/header.html')
    ]).then((results) => {
        console.log('All components loaded');
        
        // Wait a bit for the DOM to update with the new content
        setTimeout(() => {
            // Now initialize the JavaScript functionality
            if (typeof initComponents === 'function') {
                initComponents();
            }
        }, 100);
    });
});