import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from the .env file
load_dotenv()

# Configure the API key
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Initialize the model
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# Create the Flask application
app = Flask(__name__)

# Initialize chat status (enabled by default)
chat_enabled = True

# Route for toggling chat enable/disable
@app.route('/chat_toggle', methods=['POST'])
def toggle_chat():
    global chat_enabled
    data = request.json
    action = data.get('action')

    if action == 'enable':
        chat_enabled = True
        return jsonify({"message": "Chat enabled"})
    elif action == 'disable':
        chat_enabled = False
        return jsonify({"message": "Chat disabled"})
    else:
        return jsonify({"error": "Invalid action"}), 400

# Route for getting chat status
@app.route('/status', methods=['GET'])
def get_chat_status():
    global chat_enabled
    return jsonify({"chat_enabled": chat_enabled})

# Route for the chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    if not chat_enabled:
        return jsonify({"error": "Chat is currently disabled"}), 403

    data = request.json
    user_input = data.get('user_input')

    if not user_input:
        return jsonify({"error": "No user input provided"}), 400

    # Define the prompt template
    prompt_template = "From this word '{user_input}' I want you to answer like human talk to person who facing with depression. In term of friend with no judging. using user user_input language as respond language"

    # Maintain conversation history
    conversation_history = data.get('conversation_history', "")

    # Format the prompt with the user's input
    prompt = prompt_template.format(user_input=user_input)

    # Update conversation history
    if conversation_history:
        conversation_history += f"\nYou: {user_input}"
    else:
        conversation_history = f"You: {user_input}"

    # Generate a response from the model with the formatted prompt and conversation history
    full_prompt = f"{conversation_history}\n\n{prompt}"
    response = model.generate_content([full_prompt])

    # Get the AI's response
    ai_response = response.text

    # Update conversation history with AI response
    conversation_history += f"\nAI: {ai_response}"

    # Return the response and updated conversation history
    return jsonify({"ai_response": ai_response, "conversation_history": conversation_history})

if __name__ == '__main__':
    app.run(debug=True)
