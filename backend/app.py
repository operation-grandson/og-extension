#!python3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# LangFlow processing function
def process_article_text(article_text):
    # TODO: Replace this with your actual LangFlow API call or processing logic
    # For now, just returning a dummy response
    return {
        "article_no": 123,
        "full_text": "Lorem ipsem",
        "summary": "Lorem ipsem",
        "claims": [
            {
                "claim_no": 1,
                "truth_value": 0.84,
                "why_flagged": "Empathetic text goes here.",
                "facts": [
                    {
                        "url": "https://example.com",
                        "reason": "Empathetic text"
                    }
                ]
            }
        ]
    }

@app.route('/process_article', methods=['POST'])
def process_article():
    data = request.get_json()
    article_text = data.get("article_text")

    if not article_text:
        return jsonify({"error": "Missing article_text field"}), 400

    # Call your processing function (LangFlow or similar)
    result = process_article_text(article_text)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
