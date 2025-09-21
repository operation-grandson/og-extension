class OperationGrandsonPopup {
  constructor() {
    this.claimApiEndpoint = 'http://127.0.0.1:5000/check-claims';
    this.promptApiEndpoint = 'http://127.0.0.1:5000/conversation-prompts';
    this.isExtensionActive = true;
    this.politicalStance = 0; // -50 to 50, left to right
    this.grandkidPhone = '';
    // Cross-browser API compatibility
    this.extensionAPI = typeof browser !== 'undefined' ? browser : chrome;
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.bindEvents();
    this.updateUI();
  }

  async loadSettings() {
    const settings = await this.extensionAPI.storage.sync.get([
      'politicalStance',
      'grandkidPhone'
    ]);

    this.isExtensionActive = true;
    this.politicalStance = settings.politicalStance || 0;
    this.grandkidPhone = settings.grandkidPhone || '';
  }

  async saveSettings() {
    await this.extensionAPI.storage.sync.set({
      politicalStance: this.politicalStance,
      grandkidPhone: this.grandkidPhone
    });
  }

  bindEvents() {

    // Political slider - Firefox Android compatible implementation
    const slider = document.getElementById('political-slider');
    const thumb = document.getElementById('slider-thumb');

    let isDragging = false;
    let startX = 0;
    let startValue = 0;
    let isTouch = false;

    const getEventX = (e) => {
      if (e.touches && e.touches.length > 0) {
        return e.touches[0].clientX;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        return e.changedTouches[0].clientX;
      }
      return e.clientX;
    };

    const updateSliderValue = (x) => {
      const rect = slider.getBoundingClientRect();
      const clampedX = Math.max(0, Math.min(rect.width, x - rect.left));
      const percentage = clampedX / rect.width;
      this.politicalStance = Math.round((percentage - 0.5) * 100);
      this.updateSlider();
      this.saveSettings();
    };

    const startDrag = (e) => {
      isDragging = true;
      isTouch = e.type.startsWith('touch');
      startX = getEventX(e);
      startValue = this.politicalStance;

      if (isTouch) {
        e.preventDefault();
      }

      // Immediate update on tap/click
      updateSliderValue(getEventX(e));
    };

    const doDrag = (e) => {
      if (!isDragging) return;

      // Only prevent default for touch events to avoid Firefox issues
      if (isTouch) {
        e.preventDefault();
      }

      updateSliderValue(getEventX(e));
    };

    const stopDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;

      if (isTouch) {
        e.preventDefault();
      }
    };

    // Mouse events for desktop
    thumb.addEventListener('mousedown', startDrag);
    slider.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);

    // Touch events for mobile - optimized for Firefox Android
    thumb.addEventListener('touchstart', startDrag, { passive: false });
    slider.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', stopDrag, { passive: false });

    // Additional Firefox Android fixes
    slider.addEventListener('click', (e) => {
      if (!isTouch) {
        updateSliderValue(getEventX(e));
      }
    });

    // Phone input
    const phoneInput = document.getElementById('grandkid-phone');
    phoneInput.addEventListener('input', (e) => {
      this.grandkidPhone = e.target.value;
      this.saveSettings();
    });
  }

  updateUI() {
    this.updateSlider();
    this.updatePhoneInput();
  }

  updateSlider() {
    const thumb = document.getElementById('slider-thumb');
    const percentage = (this.politicalStance + 50) / 100;
    thumb.style.left = `${percentage * 100}%`;
  }

  updatePhoneInput() {
    const phoneInput = document.getElementById('grandkid-phone');
    phoneInput.value = this.grandkidPhone;

    // Ensure the input is focusable and add click handler for better focus
    phoneInput.addEventListener('click', () => {
      phoneInput.focus();
    });

    // Add focus handler to ensure proper selection
    phoneInput.addEventListener('focus', () => {
      setTimeout(() => {
        phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
      }, 0);
    });
  }

  async notifyContentScript() {
    try {
      const [tab] = await this.extensionAPI.tabs.query({ active: true, currentWindow: true });
      this.extensionAPI.tabs.sendMessage(tab.id, {
        action: 'toggleExtension',
        isActive: this.isExtensionActive
      });
    } catch (error) {
      console.error('Failed to notify content script:', error);
    }
  }

  async sendConversationRequest(claimText) {
    if (!this.grandkidPhone) {
      console.error('No grandkid phone number set');
      return;
    }

    try {
      const response = await fetch(this.promptApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          claimText: claimText,
          politicalStance: this.politicalStance,
          phoneNumber: this.grandkidPhone
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Conversation prompts sent:', result);

    } catch (error) {
      console.error('Failed to send conversation request:', error);
    }
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new OperationGrandsonPopup();
});

