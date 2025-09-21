#!python3
from flask import Flask, request, jsonify
from flask_cors import CORS
from langflow.load import load_flow_from_json
import os 

app = Flask(__name__)
CORS(app)

flow_path = os.path.join(os.path.dirname(__file__), "../flows/Operation_Grandson.json")
flow = load_flow_from_json(flow_path)

@app.route('/process_article', methods=['POST'])
def process_article():
    data = request.get_json()
    article_text = data.get("article_text")

    if not article_text:
        return jsonify({"error": "Missing article_text field"}), 400

    try:
        # Run the Langflow flow with the article text as input
        # Assumes your flow expects a single string input like article_text
        result = flow(article_text)

        # result can be a string or dict, adjust if needed
        # If your flow returns complex outputs, you might want to serialize it properly
        return jsonify({"result": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
