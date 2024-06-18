import React, { useState } from "react";
import Nav from "../Nav/Nav";
import "./Chat.css";
import { CreateChat } from "../../service/http/Chat"; // Adjust the path as per your actual structure

interface ChatFormData {
  user_input: string;
  conversation_history: string;
}

function Chat() {
  const [conversation, setConversation] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData: ChatFormData = {
      user_input: conversation,
      conversation_history: conversationHistory.join("\n"),
    };

    const response = await CreateChat(formData);

    if (response && response.ai_response) {
      const updatedHistory = [
        ...conversationHistory,
        `You: ${conversation}`,
        `AI: ${response.ai_response}`,
      ];
      setConversationHistory(updatedHistory);
      setAiResponse(response.ai_response);
      setConversation(""); // Reset input field

    } else {
      console.log("Failed to get AI response");
      // Handle error state if needed
    }
  };

  return (
    <div>
      <Nav />
      <div className="chat-container">
        {/* Conditionally render sendBG */}
        {conversation && (
          <div className="sendBG">
            <h2>U</h2>
            <div>{conversation}</div>
          </div>
        )}
        {/* Conditionally render respondBG */}
        {aiResponse && (
          <div className="respondBG">
            <h2>MEE</h2>
            <div>{aiResponse}</div>
          </div>
        )}
      </div>
      <div className="textArea">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              value={conversation}
              placeholder="Enter your Message:"
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
