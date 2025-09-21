class OperationGrandsonBackground {
  constructor() {
    this.claimApiEndpoint = 'http://127.0.0.1:5000/check-claims';
    this.promptApiEndpoint = 'http://127.0.0.1:5000/conversation-prompts';
    // Cross-browser API compatibility
    this.extensionAPI = typeof browser !== 'undefined' ? browser : chrome;
    this.init();
  }

  init() {
    this.setupMessageListeners();
  }

  setupMessageListeners() {
    this.extensionAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'checkClaims') {
        this.handleClaimCheck(request, sendResponse);
        return true; // Keep channel open for async response
      } else if (request.action === 'sendConversationRequest') {
        this.handleConversationRequest(request, sendResponse);
        return true; // Keep channel open for async response
      }
    });
  }

  async handleClaimCheck(request, sendResponse) {
    try {
      const response = await fetch(this.claimApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_text: request.articleText,
          summary: request.summary || ''
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      // Handle the actual API response format:
      // {
      //   "article_no": 123,
      //   "full_text": "Lorem ipsem",
      //   "summary": "Lorem ipsem",
      //   "claims": [
      //     {
      //       "claim_no": 1,
      //       "truth_value": 0.84,
      //       "why_flagged": "Empathetic text goes here.",
      //       "facts": [
      //         {
      //           "url": "https://example.com",
      //           "reason": "Empathetic text"
      //         }
      //       ]
      //     }
      //   ]
      // }

      sendResponse({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Claim check failed:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }

  async handleConversationRequest(request, sendResponse) {
    try {
      // Get user settings for political stance and phone number
      const settings = await this.extensionAPI.storage.sync.get(['politicalStance', 'grandkidPhone']);

      if (!settings.grandkidPhone) {
        throw new Error('No grandkid phone number configured');
      }

      const response = await fetch(this.promptApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          claimText: request.claimText,
          politicalStance: settings.politicalStance || 0,
          phoneNumber: settings.grandkidPhone
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      sendResponse({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Conversation request failed:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }
}

// Initialize background script
new OperationGrandsonBackground();