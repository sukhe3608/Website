// assets/js/app.js

// This function will be called after components are loaded
function initComponents() {
    // Now all DOM elements should be available
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const methodBtns = document.querySelectorAll('.method-btn');
    const numbersTextarea = document.querySelector('.numbers-textarea');
    const numbersCount = document.querySelector('.numbers-count');
    const currentTimeEl = document.getElementById('currentTime');

    // Initialize sidebar toggle
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active');
            }
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Initialize sidebar overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            this.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Initialize method buttons
    if (methodBtns.length > 0) {
        methodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                methodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Initialize numbers count
    if (numbersTextarea && numbersCount) {
        function updateNumbersCount() {
            const text = numbersTextarea.value.trim();
            const numbers = text ? text.split('\n').filter(n => n.trim() !== '') : [];
            numbersCount.textContent = `Total Numbers: ${numbers.length}`;
        }

        numbersTextarea.addEventListener('input', updateNumbersCount);
        updateNumbersCount(); // Initial count
    }

    // Initialize time display
    if (currentTimeEl) {
        function updateTime() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
            currentTimeEl.textContent = timeString;
        }

        updateTime();
        setInterval(updateTime, 1000);
    }

    // Initialize delete button
    const deleteBtn = document.querySelector('.delete-btn');
    if (deleteBtn && numbersTextarea) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all numbers?')) {
                numbersTextarea.value = '';
                const numbersCount = document.querySelector('.numbers-count');
                if (numbersCount) {
                    numbersCount.textContent = 'Total Numbers: 0';
                }
            }
        });
    }

    // Initialize download button
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn && numbersTextarea) {
        downloadBtn.addEventListener('click', function() {
            const text = numbersTextarea.value.trim();
            if (!text) {
                alert('No numbers to download');
                return;
            }
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'phone_numbers.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Initialize upload area
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,video/*,.pdf';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    alert(`Selected file: ${file.name}`);
                }
            };
            input.click();
        });

        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.background = 'rgba(79, 70, 229, 0.05)';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                alert(`Dropped file: ${files[0].name}`);
            }
        });
    }

    // Initialize submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn && numbersTextarea) {
        submitBtn.addEventListener('click', function() {
            const numbers = numbersTextarea.value.trim();
            if (!numbers) {
                alert('Please enter at least one phone number');
                return;
            }
            
            const sender = document.querySelector('.form-group:nth-child(1) .select-value');
            const campaign = document.querySelector('.form-input');
            
            alert(`Broadcasting to ${numbers.split('\n').filter(n => n.trim()).length} numbers\nSender: ${sender ? sender.textContent : 'N/A'}\nCampaign: ${campaign ? campaign.value : 'N/A'}`);
        });
    }

    // Initialize custom selects
    const customSelects = document.querySelectorAll('.custom-select');
    if (customSelects.length > 0) {
        customSelects.forEach(select => {
            select.addEventListener('click', function(e) {
                if (!e.target.classList.contains('clear-btn')) {
                    console.log('Dropdown would open here');
                }
            });

            const clearBtn = select.querySelector('.clear-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const valueEl = select.querySelector('.select-value');
                    if (valueEl) {
                        valueEl.textContent = 'Select...';
                        valueEl.style.color = 'var(--text-light)';
                    }
                });
            }
        });
    }

    // Initialize sidebar navigation (from sidebar.html)
    const navItems = document.querySelectorAll('.nav-item.has-submenu .nav-item-main');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const parent = this.closest('.nav-item.has-submenu');
                const submenu = parent.querySelector('.submenu');
                const arrow = this.querySelector('.nav-arrow');
                
                if (submenu && arrow) {
                    const isOpen = submenu.style.display !== 'none';
                    submenu.style.display = isOpen ? 'none' : 'block';
                    arrow.classList.toggle('rotated', !isOpen);
                }
            });
        });
    }

    // Initialize window resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && sidebar) {
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        }
    });

    console.log('Components initialized successfully');
}

// This runs when the DOM is initially loaded (main content only)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main DOM loaded');
    
    // If components are already loaded (they might be if not using async loading)
    if (document.getElementById('sidebar') && document.getElementById('header')) {
        initComponents();
    }
    // If using async loading, initComponents will be called from loadComponents.js
});