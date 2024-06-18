import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import './Chat.css';
import { CreateChat } from '../../service/http/Chat'; // Adjust the path as per your actual structure

interface ChatFormData {
  user_input: string;
  conversation_history: string;
}

function Chat() {
  const [conversation, setConversation] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData: ChatFormData = {
      user_input: conversation,
      conversation_history: "" // You can initialize or handle conversation history as needed
    };

    // Call CreateChat function
    const response = await CreateChat(formData);

    if (response && response.ai_response) {
      setAiResponse(response.ai_response);
      console.log(response.ai_response)

      // Optionally, you can reset the input field after successful submission
      setConversation("");
    } else {
      console.log('Failed to get AI response');
      // Handle error state if needed
    }
  }

  return (
    <div>
      <Nav />
      <div className="chat-container">
        <body>{aiResponse}</body>
      </div>
      <div className='textArea'>
        <form onSubmit={handleSubmit}>
          <label>Enter your Message:
            <input 
              type="text" 
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
