from flask import Flask, request, jsonify
import openai
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Use environment variable for API key
openai.api_key = os.getenv('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')

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    data = request.json
    resume_text = data.get('text', '')
    
    if not resume_text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        # Call ChatGPT for analysis
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """You are a professional resume coach. Analyze resumes and provide:
1. Overall score out of 100
2. 3 key issues found
3. 3 improvement suggestions
4. ATS compatibility note
Format as JSON with: score, issues[], suggestions[], ats_compatibility, note"""},
                {"role": "user", "content": f"Analyze this resume:\n\n{resume_text[:3000]}"}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        result = response.choices[0].message.content
        return jsonify({'analysis': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)