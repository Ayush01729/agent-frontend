import React from "react";
import "../styles/WelcomeScreen.css";

const WelcomeScreen = ({ onSuggestionClick }) => {
  const suggestions = [
    { icon: "🏪", text: "What stores are in the mall?" },
    { icon: "👕", text: "Show me clothing stores" },
    { icon: "🎁", text: "What are the current offers?" },
    { icon: "📱", text: "Where can I find electronics?" },
    { icon: "🍔", text: "Food options available" },
    { icon: "⏰", text: "What are the mall timings?" },
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">👋</div>
        <h2>Welcome to DLF Mall!</h2>
        <p>
          I'm your personal shopping assistant. Ask me about stores, products,
          offers, or anything else about the mall.
        </p>

        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-card"
              onClick={() => onSuggestionClick(suggestion.text)}
            >
              <span className="suggestion-icon">{suggestion.icon}</span>
              <span className="suggestion-text">{suggestion.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
