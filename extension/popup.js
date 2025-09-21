class OperationGrandsonPopup {
  constructor() {
    this.claimApiEndpoint = 'https://api.operationgrandson.com/check-claims';
    this.promptApiEndpoint = 'https://api.operationgrandson.com/conversation-prompts';
    this.isExtensionActive = false;
    this.politicalStance = 0; // -50 to 50, left to right
    this.grandkidPhone = '';
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.bindEvents();
    this.updateUI();
  }

  async loadSettings() {
    const settings = await chrome.storage.sync.get([
      'isActive',
      'politicalStance',
      'grandkidPhone'
    ]);

    this.isExtensionActive = settings.isActive || false;
    this.politicalStance = settings.politicalStance || 0;
    this.grandkidPhone = settings.grandkidPhone || '';
  }

  async saveSettings() {
    await chrome.storage.sync.set({
      isActive: this.isExtensionActive,
      politicalStance: this.politicalStance,
      grandkidPhone: this.grandkidPhone
    });
  }

  bindEvents() {
    // Toggle switch
    const toggle = document.getElementById('extension-toggle');
    toggle.addEventListener('click', () => {
      this.isExtensionActive = !this.isExtensionActive;
      this.updateToggle();
      this.saveSettings();
      this.notifyContentScript();
    });

    // Political slider
    const slider = document.getElementById('political-slider');
    const thumb = document.getElementById('slider-thumb');

    let isDragging = false;

    const startDrag = (e) => {
      isDragging = true;
      e.preventDefault();
    };

    const doDrag = (e) => {
      if (!isDragging) return;

      const rect = slider.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const percentage = x / rect.width;

      this.politicalStance = Math.round((percentage - 0.5) * 100);
      this.updateSlider();
      this.saveSettings();
    };

    const stopDrag = () => {
      isDragging = false;
    };

    thumb.addEventListener('mousedown', startDrag);
    slider.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);

    // Phone input
    const phoneInput = document.getElementById('grandkid-phone');
    phoneInput.addEventListener('input', (e) => {
      this.grandkidPhone = e.target.value;
      this.saveSettings();
    });
  }

  updateUI() {
    this.updateToggle();
    this.updateSlider();
    this.updatePhoneInput();
  }

  updateToggle() {
    const toggle = document.getElementById('extension-toggle');
    if (this.isExtensionActive) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }

  updateSlider() {
    const thumb = document.getElementById('slider-thumb');
    const percentage = (this.politicalStance + 50) / 100;
    thumb.style.left = `${percentage * 100}%`;
  }

  updatePhoneInput() {
    const phoneInput = document.getElementById('grandkid-phone');
    phoneInput.value = this.grandkidPhone;
  }

  async notifyContentScript() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, {
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

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendConversationRequest') {
    const popup = new OperationGrandsonPopup();
    popup.sendConversationRequest(request.claimText);
    sendResponse({ success: true });
  }
  return true;
});