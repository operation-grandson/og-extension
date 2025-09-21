class OperationGrandsonContent {
  constructor() {
    this.isActive = false;
    this.claims = [];
    this.highlightedElements = [];
    this.originalTexts = new Map();
    this.claimModal = null;
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupMessageListener();

    if (this.isActive) {
      await this.processPage();
    }
  }

  async loadSettings() {
    try {
      const settings = await chrome.storage.sync.get(['isActive']);
      this.isActive = settings.isActive || false;
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggleExtension') {
        this.isActive = request.isActive;
        if (this.isActive) {
          this.processPage();
        } else {
          this.removeHighlights();
        }
        sendResponse({ success: true });
      }
      return true;
    });
  }

  async processPage() {
    const articleText = this.extractArticleText();
    if (!articleText || articleText.length < 100) {
      return; // Not enough text to process
    }

    // Send article text to background script for claim checking
    chrome.runtime.sendMessage({
      action: 'checkClaims',
      articleText: articleText
    }, (response) => {
      if (response && response.success) {
        this.claims = response.data.claims || [];
        this.highlightClaims();
      }
    });
  }

  extractArticleText() {
    // Enhanced article extraction targeting common news/article selectors
    const selectors = [
      'article',
      '[role="main"]',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.content',
      'main',
      '.story-body',
      '.article-body',
      '.post-body'
    ];

    let contentElement = null;

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 200) {
        contentElement = element;
        break;
      }
    }

    if (!contentElement) {
      // Fallback: find largest text block
      const textElements = document.querySelectorAll('p, div');
      let maxLength = 0;
      for (const element of textElements) {
        if (element.textContent.length > maxLength) {
          maxLength = element.textContent.length;
          contentElement = element.closest('article, main, [role="main"], .content, .post, .story');
        }
      }
    }

    return contentElement ? contentElement.textContent.trim() : '';
  }

  highlightClaims() {
    if (!this.claims || this.claims.length === 0) return;

    // Remove any existing highlights first
    this.removeHighlights();

    for (const claim of this.claims) {
      if (claim.claim_text && claim.why_flagged) {
        this.highlightText(claim.claim_text, claim);
      }
    }
  }

  highlightText(claimText, claimData) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          return node.nodeValue.trim().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    // Find text that matches the claim
    for (const textNode of textNodes) {
      const text = textNode.nodeValue;
      const index = text.toLowerCase().indexOf(claimText.toLowerCase());

      if (index !== -1) {
        const parent = textNode.parentNode;

        // Skip if already highlighted or in sensitive areas
        if (parent.classList.contains('og-highlight') ||
            parent.closest('script, style, code, pre, .og-modal')) {
          continue;
        }

        // Store original text
        if (!this.originalTexts.has(parent)) {
          this.originalTexts.set(parent, parent.innerHTML);
        }

        // Create highlighted version
        const beforeText = text.substring(0, index);
        const highlightedText = text.substring(index, index + claimText.length);
        const afterText = text.substring(index + claimText.length);

        const highlightSpan = document.createElement('span');
        highlightSpan.className = 'og-highlight';
        highlightSpan.style.cssText = `
          background-color: #ffff00 !important;
          color: #000 !important;
          padding: 2px 4px !important;
          border: 2px solid #000 !important;
          cursor: pointer !important;
          font-weight: bold !important;
          position: relative !important;
          z-index: 1000 !important;
        `;
        highlightSpan.textContent = highlightedText;
        highlightSpan.dataset.claimData = JSON.stringify(claimData);

        // Add click handler
        highlightSpan.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.showClaimModal(claimData);
        });

        // Replace the text node
        const newTextNode = document.createTextNode(beforeText);
        const afterTextNode = document.createTextNode(afterText);

        parent.insertBefore(newTextNode, textNode);
        parent.insertBefore(highlightSpan, textNode);
        parent.insertBefore(afterTextNode, textNode);
        parent.removeChild(textNode);

        this.highlightedElements.push(highlightSpan);
        break; // Only highlight first occurrence
      }
    }
  }

  showClaimModal(claimData) {
    // Remove existing modal
    if (this.claimModal) {
      this.claimModal.remove();
    }

    // Create modal
    this.claimModal = document.createElement('div');
    this.claimModal.className = 'og-modal';
    this.claimModal.style.cssText = `
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      background: #000 !important;
      color: #fff !important;
      border: 3px solid #fff !important;
      padding: 20px !important;
      font-family: 'Courier New', monospace !important;
      font-size: 14px !important;
      max-width: 400px !important;
      width: 90% !important;
      z-index: 10000 !important;
      box-shadow: 0 0 20px rgba(0,0,0,0.8) !important;
    `;

    this.claimModal.innerHTML = `
      <div style="margin-bottom: 15px !important; text-transform: uppercase !important; font-weight: bold !important; border-bottom: 2px solid #fff !important; padding-bottom: 10px !important;">
        FLAGGED CLAIM
      </div>
      <div style="margin-bottom: 15px !important; line-height: 1.4 !important;">
        ${claimData.why_flagged}
      </div>
      <div style="display: flex !important; gap: 10px !important; justify-content: space-between !important;">
        <button id="og-close-btn" style="
          background: #000 !important;
          color: #fff !important;
          border: 2px solid #fff !important;
          padding: 8px 16px !important;
          font-family: 'Courier New', monospace !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
        ">CLOSE</button>
        <button id="og-talk-btn" style="
          background: #fff !important;
          color: #000 !important;
          border: 2px solid #fff !important;
          padding: 8px 16px !important;
          font-family: 'Courier New', monospace !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
          font-weight: bold !important;
        ">LET'S TALK</button>
      </div>
    `;

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0,0,0,0.7) !important;
      z-index: 9999 !important;
    `;

    // Add event listeners
    this.claimModal.querySelector('#og-close-btn').addEventListener('click', () => {
      this.claimModal.remove();
      backdrop.remove();
    });

    this.claimModal.querySelector('#og-talk-btn').addEventListener('click', () => {
      this.requestConversationPrompts(claimData);
      this.claimModal.remove();
      backdrop.remove();
    });

    backdrop.addEventListener('click', () => {
      this.claimModal.remove();
      backdrop.remove();
    });

    // Add to page
    document.body.appendChild(backdrop);
    document.body.appendChild(this.claimModal);
  }

  requestConversationPrompts(claimData) {
    // Send message to background script to trigger conversation prompts
    chrome.runtime.sendMessage({
      action: 'sendConversationRequest',
      claimText: claimData.claim_text
    }, (response) => {
      if (response && response.success) {
        console.log('Conversation request sent successfully');
      } else {
        console.error('Failed to send conversation request');
      }
    });
  }

  removeHighlights() {
    // Remove all highlighted elements
    for (const element of this.highlightedElements) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }

    // Restore original texts
    for (const [element, originalText] of this.originalTexts) {
      if (element.parentNode) {
        element.innerHTML = originalText;
      }
    }

    this.highlightedElements = [];
    this.originalTexts.clear();

    // Remove modal if present
    if (this.claimModal) {
      this.claimModal.remove();
    }
  }
}

// Initialize content script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new OperationGrandsonContent();
  });
} else {
  new OperationGrandsonContent();
}