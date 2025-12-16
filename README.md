# 🛍️ Lido Mall Chatbot - React Frontend

A modern, responsive React frontend for the Lido Mall Shopping Assistant chatbot.

## ✨ Features

- **Modern Design**: Sleek gradient theme with smooth animations
- **Mobile-First**: Fully responsive, optimized for all screen sizes
- **Real-time Chat**: Seamless integration with FastAPI backend
- **Rich Formatting**: Markdown support for bot responses
- **Smart Parsing**: Handles various response formats from backend
- **Quick Actions**: Suggestion cards for common queries
- **Typing Indicators**: Visual feedback during message processing
- **Error Handling**: User-friendly error messages

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn)
- Backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure API URL (optional):**

   Create a `.env` file in the frontend directory:

   ```bash
   VITE_API_URL=http://localhost:8000
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📱 Mobile Optimization

The frontend is fully optimized for mobile devices with:

- Touch-friendly interface
- Responsive layout that adapts to any screen size
- iOS Safari zoom prevention
- Smooth scrolling and animations
- Optimized font sizes for readability

## 🎨 Design Highlights

- **Color Scheme**: Purple gradient theme (#667eea to #764ba2)
- **Typography**: System fonts for optimal performance
- **Animations**: Smooth transitions and micro-interactions
- **Shadows**: Layered depth for modern feel
- **Spacing**: Consistent padding and margins

## 🔧 Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client with interceptors
- **React Markdown**: Rich text formatting
- **CSS Modules**: Scoped styling

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatHeader.jsx
│   │   ├── ChatMessages.jsx
│   │   ├── Message.jsx
│   │   ├── TypingIndicator.jsx
│   │   ├── ChatInput.jsx
│   │   └── WelcomeScreen.jsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── ChatHeader.css
│   │   ├── ChatMessages.css
│   │   ├── Message.css
│   │   ├── TypingIndicator.css
│   │   ├── ChatInput.css
│   │   └── WelcomeScreen.css
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🔌 API Integration

The frontend connects to your FastAPI backend through the `/chat` endpoint:

**Request:**

```json
{
  "query": "What stores are in the mall?"
}
```

**Response:**

```json
{
  "response": "Here are the stores in Lido Mall..."
}
```

The frontend automatically handles:

- String responses
- Object responses with `response` field
- Object responses with `message` field
- JSON objects (stringified)
- Error responses

## 🎯 Usage Tips

1. **Quick Start**: Click any suggestion card on the welcome screen
2. **Natural Queries**: Ask questions in natural language
3. **Multi-line**: Use Shift+Enter for new lines in input
4. **Mobile**: Works great on phones - try it!

## 🐛 Troubleshooting

**Issue**: Can't connect to backend

- Ensure backend is running on port 8000
- Check CORS is enabled in FastAPI
- Verify `VITE_API_URL` in .env

**Issue**: Styling issues on mobile

- Clear browser cache
- Check viewport meta tag in index.html
- Test in different browsers

**Issue**: Messages not displaying correctly

- Check backend response format
- Verify axios interceptors
- Check browser console for errors

## 📝 Customization

### Change API URL

Edit `src/utils/api.js`:

```javascript
const API_BASE_URL = "http://your-api-url.com";
```

### Change Theme Colors

Edit `src/styles/index.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Modify Suggestions

Edit `src/components/WelcomeScreen.jsx`:

```javascript
const suggestions = [
  { icon: "🏪", text: "Your custom suggestion" },
  // Add more...
];
```

## 📄 License

This project is part of the Mall Chatbot system.

---

Built with ❤️ using React & Vite
