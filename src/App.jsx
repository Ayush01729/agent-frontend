import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import WelcomeScreen from "./components/WelcomeScreen";
import { sendMessageStreamingAPI } from "./utils/api";
import "./styles/App.css";

function App() {
  // Generate unique session ID once on component mount
  const [sessionId] = useState(() => {
    return (
      "session_" + Math.random().toString(36).substring(7) + "_" + Date.now()
    );
  });

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Log session ID for debugging
  useEffect(() => {
    console.log("🔑 Session ID:", sessionId);
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const botMessageId = Date.now() + 1;
    let botMessageCreated = false;

    try {
      await sendMessageStreamingAPI(text.trim(), sessionId, (token) => {
        // Create bot message on first token
        if (!botMessageCreated) {
          const botMessage = {
            id: botMessageId,
            text: token,
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          botMessageCreated = true;
        } else {
          // Append subsequent tokens to the bot message
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId ? { ...msg, text: msg.text + token } : msg
            )
          );
        }
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to get response from server");

      // Add or replace bot message with error
      if (botMessageCreated) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  text: `Sorry, I encountered an error: ${
                    err.message || "Please try again."
                  }`,
                  isError: true,
                }
              : msg
          )
        );
      } else {
        const errorMessage = {
          id: botMessageId,
          text: `Sorry, I encountered an error: ${
            err.message || "Please try again."
          }`,
          sender: "bot",
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <ChatHeader />

        <div className="chat-content">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
