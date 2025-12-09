from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model, vectorizer and dataset using correct paths
model = pickle.load(open("../intent_model.pkl", "rb"))
vectorizer = pickle.load(open("../vectorizer.pkl", "rb"))
df = pd.read_csv("../dataset/it_support_dataset.csv")

def get_response(intent):
    responses = df[df['intent'] == intent]['response'].values
    if len(responses) > 0:
        return responses[0]
    return "Sorry, I didn't understand that."

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_msg = data.get("message", "")

    user_vec = vectorizer.transform([user_msg])
    intent = model.predict(user_vec)[0]
    reply = get_response(intent)

    return jsonify({"reply": reply})

@app.route("/")
def home():
    return "IT Support Chatbot Backend Running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
