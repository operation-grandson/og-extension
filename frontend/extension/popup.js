// Popup logic for Grandson Bot extension
class GrandsonBotPopup {
  constructor() {
    this.apiEndpoint = 'https://api.grandsonbot.com/check-credibility';
    this.currentArticle = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadArticle();
  }

  bindEvents() {
    const checkBtn = document.getElementById('check-btn');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => this.checkCredibility());
    }
  }

  async loadArticle() {
    try {
      // First try to get cached article data
      const stored = await chrome.storage.local.get(['lastExtractedArticle', 'extractedAt']);
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);

      if (stored.lastExtractedArticle && stored.extractedAt > fiveMinutesAgo) {
        this.displayArticle(stored.lastExtractedArticle);
        return;
      }

      // Get current tab and extract article
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.tabs.sendMessage(tab.id, { action: 'extractArticle' }, (response) => {
        if (chrome.runtime.lastError) {
          this.showNoArticle();
          return;
        }

        if (response && response.success) {
          this.displayArticle(response.data);
          // Cache the result
          chrome.storage.local.set({
            lastExtractedArticle: response.data,
            extractedAt: Date.now()
          });
        } else {
          this.showNoArticle(response?.error);
        }
      });

    } catch (error) {
      console.error('Error loading article:', error);
      this.showNoArticle();
    }
  }

  displayArticle(articleData) {
    this.currentArticle = articleData;

    const articleView = document.getElementById('article-view');
    const noArticleView = document.getElementById('no-article-view');
    const titleEl = document.getElementById('article-title');
    const metaEl = document.getElementById('article-meta');

    if (titleEl) titleEl.textContent = articleData.title;
    if (metaEl) {
      metaEl.textContent = `${articleData.wordCount} words • ${new URL(articleData.url).hostname}`;
    }

    this.showView('article-view');
  }

  async checkCredibility() {
    if (!this.currentArticle) {
      this.showError('No article data available');
      return;
    }

    this.showView('loading-view');

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: this.currentArticle.title,
          text: this.currentArticle.text,
          url: this.currentArticle.url,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      this.displayResult(result);

    } catch (error) {
      console.error('API Error:', error);
      this.showError('Failed to check credibility. Please try again.');
      this.showView('article-view');
    }
  }

  displayResult(result) {
    const scoreEl = document.getElementById('rating-score');
    const labelEl = document.getElementById('rating-label');
    const detailsEl = document.getElementById('rating-details');

    // Handle different possible API response formats
    let score, label, details;

    if (typeof result.rating === 'number') {
      score = `${result.rating}/10`;
      label = this.getRatingLabel(result.rating);
    } else if (result.credibility_score) {
      score = `${result.credibility_score}%`;
      label = this.getPercentageLabel(result.credibility_score);
    } else if (result.status) {
      score = '✓';
      label = result.status;
    } else {
      // Fallback for unknown format
      score = '?';
      label = 'Analysis Complete';
    }

    if (scoreEl) scoreEl.textContent = score;
    if (labelEl) labelEl.textContent = label;

    // Display additional details if available
    if (detailsEl) {
      let detailsHtml = '';
      if (result.summary) {
        detailsHtml += `<div style="margin-bottom: 8px; font-size: 14px;">${result.summary}</div>`;
      }
      if (result.concerns && result.concerns.length > 0) {
        detailsHtml += `<div style="font-size: 12px; opacity: 0.8;">Issues: ${result.concerns.join(', ')}</div>`;
      }
      if (result.confidence) {
        detailsHtml += `<div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Confidence: ${result.confidence}%</div>`;
      }
      detailsEl.innerHTML = detailsHtml;
    }

    this.showView('result-view');
  }

  getRatingLabel(rating) {
    if (rating >= 8) return 'Highly Credible';
    if (rating >= 6) return 'Mostly Credible';
    if (rating >= 4) return 'Mixed Credibility';
    if (rating >= 2) return 'Low Credibility';
    return 'Not Credible';
  }

  getPercentageLabel(percentage) {
    if (percentage >= 80) return 'Highly Credible';
    if (percentage >= 60) return 'Mostly Credible';
    if (percentage >= 40) return 'Mixed Credibility';
    if (percentage >= 20) return 'Low Credibility';
    return 'Not Credible';
  }

  showNoArticle(message = null) {
    const noArticleView = document.getElementById('no-article-view');
    if (message && noArticleView) {
      const existingText = noArticleView.querySelector('div:last-child');
      if (existingText) {
        existingText.textContent = message;
      }
    }
    this.showView('no-article-view');
  }

  showError(message) {
    const errorView = document.getElementById('error-view');
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) errorMessage.textContent = message;
    this.showView('error-view');
  }

  showView(viewId) {
    const views = ['article-view', 'loading-view', 'no-article-view', 'result-view', 'error-view'];

    views.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (id === viewId) {
          element.classList.remove('hidden');
          element.style.display = 'block';
        } else {
          element.classList.add('hidden');
          element.style.display = 'none';
        }
      }
    });
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GrandsonBotPopup();
});