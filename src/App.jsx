import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import WelcomeScreen from "./components/WelcomeScreen";
import ScrollToBottomButton from "./components/ScrollToBottomButton";
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContentRef = useRef(null);

  // Log session ID for debugging
  useEffect(() => {
    console.log("🔑 Session ID:", sessionId);
  }, [sessionId]);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Auto-scroll when messages or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Visual Viewport API listener for keyboard open/close
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportResize = () => {
      // Instantly scroll to bottom when keyboard opens (viewport height changes)
      scrollToBottom("instant");
    };

    window.visualViewport.addEventListener("resize", handleViewportResize);

    return () => {
      window.visualViewport.removeEventListener("resize", handleViewportResize);
    };
  }, []);

  // Scroll detection to show/hide scroll-to-bottom button
  useEffect(() => {
    const chatContent = chatContentRef.current;
    if (!chatContent) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContent;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    chatContent.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      chatContent.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  const handleScrollToBottom = () => {
    scrollToBottom("smooth");
  };

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

        <div className="chat-content" ref={chatContentRef}>
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

        <ScrollToBottomButton
          isVisible={showScrollButton}
          onClick={handleScrollToBottom}
        />
      </div>
    </div>
  );
}

export default App;
