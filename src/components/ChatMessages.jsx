import React from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import "../styles/ChatMessages.css";

const ChatMessages = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
