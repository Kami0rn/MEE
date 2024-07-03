import React, { useState, useEffect } from 'react';
import Nav from "../Nav/Nav";
import "./Chat.css";
import { CreateChat } from "../../service/http/Chat";
import { FetchChatStatus } from "../../service/http/Admin";
import width_194 from "./width_194.png";
import Swal from 'sweetalert2';
import { Rings } from 'react-loader-spinner'; // Import the spinner

interface ChatFormData {
  user_input: string;
  conversation_history: string;
}

function Chat() {
  const [conversation, setConversation] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [chatAvailable, setChatAvailable] = useState(true);
  const [loading, setLoading] = useState(false); // State to manage loading

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

    setLoading(true); // Show loading spinner

    const formData: ChatFormData = {
      user_input: conversation,
      conversation_history: conversationHistory.join("\n"),
    };

    const response = await CreateChat(formData);
    if (response && response.ai_response) {
      const updatedHistory = [
        ...conversationHistory,
        ` ${conversation}`,
        ` ${response.ai_response}`,
      ];
      setConversationHistory(updatedHistory);
      setAiResponse(response.ai_response);
      setConversation("");  // Reset input field
    } else {
      console.log("Failed to get AI response");
    }

    setLoading(false); // Hide loading spinner
  };

  return (
    <div>
      <Nav />
      <div className="chat-container">
        {conversationHistory.map((msg, index) => (
          <div key={index} className={index % 2 === 0 ? "sendBG" : "respondBG"}>
            {index % 2 !== 0 && (
              <div className="message-flex">
                <div className='flex-in'>
                  <img src={width_194} alt="AI" className="ai-profile-icon" />
                  <h4>MEE</h4>
                </div>
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
        {loading && (
          <div className="loading-spinner">
            <Rings color="#00BFFF" height={80} width={80} />
          </div>
        )}
      </div>
      <div className="textArea">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              value={conversation}
              placeholder="Say some thing:"
              onChange={(e) => setConversation(e.target.value)}
            />
          </label>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
