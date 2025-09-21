# Grandson Bot Extension

A cross-platform browser extension that analyzes article credibility using AI.

## Features

- **Article Detection**: Automatically detects and extracts article content from web pages
- **Mobile-Optimized UI**: Touch-friendly interface designed for mobile browsers
- **Cross-Platform**: Works on Chrome, Firefox, Safari, and other modern browsers
- **Real-time Analysis**: Sends article content to AI API for credibility scoring
- **Caching**: Stores recent analysis to reduce API calls

## Installation

### Chrome/Edge
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `frontend/extension` folder

### Firefox
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file in the `frontend/extension` folder

### Safari
1. Open Safari and go to Safari > Preferences > Advanced
2. Enable "Show Develop menu in menu bar"
3. Go to Develop > Allow Unsigned Extensions
4. Open the Extension Builder and load the extension folder

## Usage

1. Navigate to any news article or blog post
2. Click the Grandson Bot extension icon
3. Click "Check Credibility" to analyze the article
4. View the credibility rating and analysis

## API Integration

The extension sends article data to `https://api.grandsonbot.com/check-credibility` with the following payload:

```json
{
  "title": "Article title",
  "text": "Full article text content",
  "url": "https://example.com/article",
  "timestamp": 1234567890
}
```

Expected API response formats:

```json
{
  "rating": 8,
  "summary": "Analysis summary",
  "concerns": ["bias", "sourcing"],
  "confidence": 85
}
```

Or:

```json
{
  "credibility_score": 75,
  "status": "Mostly Credible"
}
```

## File Structure

```
frontend/extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic and API calls
├── content.js            # Content script for article extraction
├── icons/                # Extension icons
│   └── icon.svg         # SVG icon source
└── README.md            # This file
```

## Development

To modify the extension:

1. Edit the relevant files in `frontend/extension/`
2. Reload the extension in your browser's extension management page
3. Test on various article pages

## Mobile Considerations

- UI is optimized for touch interaction
- Large buttons and readable text
- Responsive design works on mobile browsers
- Efficient content extraction for mobile pages