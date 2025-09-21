class OperationGrandsonBackground {
  constructor() {
    this.claimApiEndpoint = 'https://api.operationgrandson.com/check-claims';
    this.promptApiEndpoint = 'https://api.operationgrandson.com/conversation-prompts';
    this.init();
  }

  init() {
    this.setupMessageListeners();
  }

  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

      // Expected result format based on the ERD:
      // {
      //   article: {
      //     article_no: number,
      //     full_text: string,
      //     summary: string
      //   },
      //   claims: [
      //     {
      //       claim_no: number,
      //       truth_value: number,
      //       why_flagged: string,
      //       article_no: number,
      //       claim_text: string, // The actual text from the article
      //       facts: [
      //         {
      //           fact_id: number,
      //           claim_no: number,
      //           url: string,
      //           reason: string
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
      const settings = await chrome.storage.sync.get(['politicalStance', 'grandkidPhone']);

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