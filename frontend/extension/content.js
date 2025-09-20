// Content script to extract article text and communicate with popup
class ArticleExtractor {
  constructor() {
    this.articleText = '';
    this.title = '';
    this.url = window.location.href;
  }

  extractArticleText() {
    // Try multiple selectors for article content
    const selectors = [
      'article',
      '[role="main"] p',
      '.post-content p',
      '.entry-content p',
      '.article-content p',
      '.content p',
      'main p',
      'p'
    ];

    let paragraphs = [];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        paragraphs = Array.from(elements)
          .filter(p => p.textContent.trim().length > 50)
          .slice(0, 20); // Limit to first 20 relevant paragraphs
        break;
      }
    }

    // Extract text content
    this.articleText = paragraphs
      .map(p => p.textContent.trim())
      .join('\n\n');

    // Get title
    this.title = document.title || document.querySelector('h1')?.textContent || 'Untitled';

    return {
      text: this.articleText,
      title: this.title,
      url: this.url,
      wordCount: this.articleText.split(/\s+/).length
    };
  }

  isArticlePage() {
    // Simple heuristic to detect if this is likely an article page
    const hasArticleTag = document.querySelector('article');
    const hasLongText = document.body.textContent.split(/\s+/).length > 300;
    const notHomePage = !window.location.pathname.match(/^\/?$/) &&
                       !window.location.pathname.match(/\/(home|index)$/);

    return hasArticleTag || (hasLongText && notHomePage);
  }
}

// Initialize extractor
const extractor = new ArticleExtractor();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractArticle') {
    if (extractor.isArticlePage()) {
      const articleData = extractor.extractArticleText();
      sendResponse({ success: true, data: articleData });
    } else {
      sendResponse({
        success: false,
        error: 'This page does not appear to contain an article'
      });
    }
  }
  return true; // Keep message channel open for async response
});

// Optional: Auto-extract on page load for better UX
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (extractor.isArticlePage()) {
      const articleData = extractor.extractArticleText();
      chrome.storage.local.set({
        lastExtractedArticle: articleData,
        extractedAt: Date.now()
      });
    }
  });
} else {
  if (extractor.isArticlePage()) {
    const articleData = extractor.extractArticleText();
    chrome.storage.local.set({
      lastExtractedArticle: articleData,
      extractedAt: Date.now()
    });
  }
}