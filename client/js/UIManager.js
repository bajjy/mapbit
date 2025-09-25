export class UIManager {
    constructor() {
        this.loadingElement = document.getElementById('loading');
        this.notifications = [];
    }
    
    showLoading(show, message = 'Loading...') {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'flex' : 'none';
            const messageElement = this.loadingElement.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }
    }
    
    showError(message, duration = 5000) {
        this.showNotification(message, 'error', duration);
    }
    
    showSuccess(message, duration = 3000) {
        this.showNotification(message, 'success', duration);
    }
    
    showInfo(message, duration = 4000) {
        this.showNotification(message, 'info', duration);
    }
    
    showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '4px',
            color: '#ecf0f1',
            fontWeight: 'bold',
            zIndex: '10000',
            maxWidth: '300px',
            wordWrap: 'break-word',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out'
        });
        
        // Set background color based on type
        switch (type) {
            case 'error':
                notification.style.backgroundColor = '#e74c3c';
                break;
            case 'success':
                notification.style.backgroundColor = '#27ae60';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#3498db';
                break;
        }
        
        document.body.appendChild(notification);
        this.notifications.push(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    }
    
    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }
    
    updateProgress(percentage, message = '') {
        // Create or update progress bar
        let progressBar = document.getElementById('progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'progress-bar';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: #34495e;
                z-index: 10001;
            `;
            
            const progressFill = document.createElement('div');
            progressFill.id = 'progress-fill';
            progressFill.style.cssText = `
                height: 100%;
                background: #3498db;
                width: 0%;
                transition: width 0.3s ease;
            `;
            
            progressBar.appendChild(progressFill);
            document.body.appendChild(progressBar);
        }
        
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
        
        if (message) {
            this.showInfo(message, 1000);
        }
    }
    
    hideProgress() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar && progressBar.parentNode) {
            progressBar.parentNode.removeChild(progressBar);
        }
    }
    
    showModal(title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: #2c3e50;
            border: 2px solid #3498db;
            border-radius: 8px;
            padding: 2rem;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            color: #ecf0f1;
        `;
        
        modalContent.innerHTML = `
            <h2 style="margin-bottom: 1rem; color: #3498db;">${title}</h2>
            <div style="margin-bottom: 2rem;">${content}</div>
            <div class="modal-buttons" style="display: flex; gap: 1rem; justify-content: flex-end;">
                ${buttons.map(btn => `
                    <button class="btn btn-${btn.type || 'primary'}" data-action="${btn.action || 'close'}">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add event listeners for buttons
        modalContent.querySelectorAll('.modal-buttons button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'close') {
                    this.closeModal(modal);
                } else {
                    // Find the button config and call its handler
                    const buttonConfig = buttons.find(btn => btn.action === action);
                    if (buttonConfig && buttonConfig.handler) {
                        buttonConfig.handler();
                    }
                    this.closeModal(modal);
                }
            });
        });
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        return modal;
    }
    
    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }
    
    updateStatsDisplay(stats) {
        const elements = {
            featureCount: document.getElementById('featureCount'),
            buildingCount: document.getElementById('buildingCount'),
            totalArea: document.getElementById('totalArea')
        };
        
        if (elements.featureCount) {
            elements.featureCount.textContent = stats.totalFeatures || 0;
        }
        
        if (elements.buildingCount) {
            elements.buildingCount.textContent = stats.polygons || 0;
        }
        
        if (elements.totalArea) {
            elements.totalArea.textContent = Math.round(stats.totalArea || 0).toLocaleString();
        }
    }
    
    setButtonState(buttonId, enabled, text = null) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !enabled;
            if (text) {
                button.textContent = text;
            }
        }
    }
    
    toggleFeatureCheckbox(featureType, enabled) {
        const checkbox = document.getElementById(`show${featureType.charAt(0).toUpperCase() + featureType.slice(1)}`);
        if (checkbox) {
            checkbox.checked = enabled;
        }
    }
    
    // Sprite system UI methods
    updateSpriteModeStatus(enabled) {
        const statusElement = document.getElementById('spriteModeStatus');
        if (statusElement) {
            statusElement.textContent = enabled ? 'Enabled' : 'Disabled';
            statusElement.style.color = enabled ? '#e74c3c' : '#3498db';
        }
        
        // Update sprite controls panel styling
        const spritePanel = document.querySelector('.sprite-controls').closest('.panel');
        if (spritePanel) {
            if (enabled) {
                spritePanel.classList.add('sprite-mode-active');
            } else {
                spritePanel.classList.remove('sprite-mode-active');
            }
        }
    }
    
    updateBuildingStyleStatus(style) {
        const statusElement = document.getElementById('buildingStyleStatus');
        if (statusElement) {
            const styleNames = {
                'basic': 'Basic House',
                'stone': 'Stone House',
                'wooden': 'Wooden House',
                'modern': 'Modern House'
            };
            statusElement.textContent = styleNames[style] || style;
        }
    }
    
    updateSpriteScaleStatus(scale) {
        const statusElement = document.getElementById('spriteScaleStatus');
        const valueElement = document.getElementById('spriteScaleValue');
        
        if (statusElement) {
            statusElement.textContent = `${scale}x`;
        }
        if (valueElement) {
            valueElement.textContent = `${scale}x`;
        }
    }
    
    updateSpriteControls(availableStyles) {
        const styleSelector = document.getElementById('buildingStyle');
        if (styleSelector && availableStyles) {
            // Clear existing options
            styleSelector.innerHTML = '';
            
            // Add available styles
            availableStyles.forEach(style => {
                const option = document.createElement('option');
                option.value = style;
                option.textContent = this.formatStyleName(style);
                styleSelector.appendChild(option);
            });
        }
    }
    
    formatStyleName(style) {
        const styleNames = {
            'basic': 'Basic House',
            'stone': 'Stone House',
            'wooden': 'Wooden House',
            'modern': 'Modern House',
            'castle': 'Castle',
            'cottage': 'Cottage'
        };
        return styleNames[style] || style.charAt(0).toUpperCase() + style.slice(1);
    }

    updateShapeStatus(enabled) {
        const statusElement = document.getElementById('shapeStatus');
        if (statusElement) {
            statusElement.textContent = enabled ? 'Enabled' : 'Disabled';
            statusElement.style.color = enabled ? '#e74c3c' : '#3498db';
        }
    }

    updateHideMapStatus(enabled) {
        const statusElement = document.getElementById('hideMapStatus');
        if (statusElement) {
            statusElement.textContent = enabled ? 'Hidden' : 'Visible';
            statusElement.style.color = enabled ? '#e74c3c' : '#3498db';
        }
    }

    updateHidePolygonStatus(enabled) {
        const statusElement = document.getElementById('hidePolygonStatus');
        if (statusElement) {
            statusElement.textContent = enabled ? 'Hidden' : 'Visible';
            statusElement.style.color = enabled ? '#e74c3c' : '#3498db';
            console.log(`🏠 UI Status updated: Polygon ${enabled ? 'Hidden' : 'Visible'}`);
        }
    }
}
