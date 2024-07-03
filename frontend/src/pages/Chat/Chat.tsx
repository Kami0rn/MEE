import React, { useState, useEffect } from 'react';
import Nav from "../Nav/Nav";
import "./Chat.css";
import { CreateChat } from "../../service/http/Chat";
import {FetchChatStatus } from "../../service/http/Admin"
import width_194 from "./width_194.png";
import Swal from 'sweetalert2';


interface ChatFormData {
  user_input: string;
  conversation_history: string;
}

function Chat() {
  const [conversation, setConversation] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [chatAvailable, setChatAvailable] = useState(true);

  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [conversationHistory]);

  useEffect(() => {
    const initializeChatStatus = async () => {
      const isActive = await FetchChatStatus();
      setChatAvailable(isActive);
    };

    initializeChatStatus();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check chat availability before sending messages
    const chatIsActive = await FetchChatStatus();
    if (!chatIsActive) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Admin has currently deactivated the chat. Please try again later. LineID : @pypuni',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        });
        setChatAvailable(false);
        return;  // Exit the function early if chat is not available
    }

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
      setConversation("");  // Reset input field
    } else {
      console.log("Failed to get AI response");
    }
  };

  return (
    <div>
      <Nav />
      <div className="chat-container">
        {conversationHistory.map((msg, index) => (
          <div key={index} className={index % 2 === 0 ? "sendBG" : "respondBG"}>
            {index % 2 !== 0 && (
              <div className="message-flex">
                <img src={width_194} alt="AI" className="ai-profile-icon" />
                <div>{msg}</div>
              </div>
            )}
            {index % 2 === 0 && (
              <div className="message-flex">
                <div>{msg}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="textArea">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              value={conversation}
              placeholder="Enter your Message:"
              onChange={(e) => setConversation(e.target.value)}
               // Disable input if chat is not available
            />
          </label>
          <button type="submit" >Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
