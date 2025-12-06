document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const methodBtns = document.querySelectorAll('.method-btn');
    const numbersTextarea = document.querySelector('.numbers-textarea');
    const numbersCount = document.querySelector('.numbers-count');
    const currentTimeEl = document.getElementById('currentTime');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    methodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            methodBtns.forEach(b => {
                b.classList.remove('active');
                b.style.transform = '';
            });
            this.classList.add('active');
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    function updateNumbersCount() {
        const text = numbersTextarea.value.trim();
        const numbers = text ? text.split('\n').filter(n => n.trim() !== '') : [];
        numbersCount.textContent = `Total Numbers: ${numbers.length}`;
    }

    if (numbersTextarea) {
        numbersTextarea.addEventListener('input', updateNumbersCount);
        updateNumbersCount();
    }

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        if (currentTimeEl) {
            currentTimeEl.textContent = timeString;
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    const deleteBtn = document.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all numbers?')) {
                numbersTextarea.value = '';
                updateNumbersCount();
                showNotification('Numbers cleared successfully', 'success');
            }
        });
    }

    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const text = numbersTextarea.value.trim();
            if (!text) {
                showNotification('No numbers to download', 'warning');
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
            showNotification('Numbers downloaded successfully', 'success');
        });
    }

    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,video/*,.pdf';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    showNotification(`Selected: ${file.name}`, 'success');
                    uploadArea.innerHTML = `
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M9 12l2 2 4-4"/>
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                        <p style="color: var(--accent-green); font-weight: 600;">${file.name}</p>
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">Click to change file</p>
                    `;
                }
            };
            input.click();
        });

        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)';
            this.style.transform = 'scale(1.02)';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            this.style.transform = '';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            this.style.transform = '';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                showNotification(`Uploaded: ${files[0].name}`, 'success');
                this.innerHTML = `
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <p style="color: var(--accent-green); font-weight: 600;">${files[0].name}</p>
                    <p style="font-size: 0.75rem; margin-top: 0.5rem;">Click to change file</p>
                `;
            }
        });
    }

    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const numbers = numbersTextarea.value.trim();
            if (!numbers) {
                showNotification('Please enter at least one phone number', 'warning');
                return;
            }
            
            const sender = document.querySelector('.form-group:nth-child(1) .select-value').textContent;
            const campaign = document.querySelector('.form-input').value;
            const count = numbers.split('\n').filter(n => n.trim()).length;
            
            this.innerHTML = `
                <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
                </svg>
                Sending...
            `;
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send Broadcast
                `;
                this.disabled = false;
                showNotification(`Broadcast sent to ${count} numbers successfully!`, 'success');
            }, 2000);
        });
    }

    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(select => {
        select.addEventListener('click', function(e) {
            if (!e.target.classList.contains('clear-btn')) {
                this.style.borderColor = 'var(--primary-color)';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 200);
            }
        });

        const clearBtn = select.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const valueEl = select.querySelector('.select-value');
                valueEl.textContent = 'Select...';
                valueEl.style.color = 'var(--text-muted)';
            });
        }
    });

    const navItems = document.querySelectorAll('.nav-item.has-submenu .nav-item-main');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const parent = this.closest('.nav-item.has-submenu');
            const submenu = parent.querySelector('.submenu');
            const arrow = this.querySelector('.nav-arrow');
            
            const isOpen = submenu.style.display !== 'none';
            
            if (isOpen) {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    submenu.style.maxHeight = '0';
                    submenu.style.opacity = '0';
                });
                setTimeout(() => {
                    submenu.style.display = 'none';
                }, 200);
            } else {
                submenu.style.display = 'block';
                submenu.style.maxHeight = '0';
                submenu.style.opacity = '0';
                requestAnimationFrame(() => {
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    submenu.style.opacity = '1';
                });
            }
            
            arrow.classList.toggle('rotated', !isOpen);
        });
    });

    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
        submenu.style.transition = 'max-height 0.2s ease, opacity 0.2s ease';
        submenu.style.overflow = 'hidden';
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                         type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                         'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            animation: slideInNotification 0.3s ease;
            max-width: 400px;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInNotification {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutNotification {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            .notification-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transition: background 0.2s;
            }
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            .spinner {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutNotification 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutNotification 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    const navItemsAll = document.querySelectorAll('.nav-item:not(.has-submenu), .submenu-item');
    navItemsAll.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    
});


