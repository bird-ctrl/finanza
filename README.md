# Finanzas - Your Personal AI Finance Coach

A modern, voice-enabled AI chatbot designed to provide financial education and guidance to Indian youth. Built with vanilla HTML, CSS, and JavaScript, integrated with Google's Gemini AI API.

## 🚀 Features

### 🤖 AI-Powered Financial Guidance
- Intelligent responses powered by Google Gemini AI
- Specialized in Indian financial context (SIP, mutual funds, tax planning, etc.)
- Personalized advice for users aged 16-30
- Educational content with practical examples

### 🎤 Voice Integration
- Speech-to-text input using Web Speech API
- Text-to-speech responses with Indian English voice
- Hands-free interaction for accessibility
- Real-time voice recognition with visual feedback

### 💬 Modern Chat Interface
- Clean, responsive design with smooth animations
- Real-time typing indicators
- Message history persistence
- Quick-start buttons for common questions

### ⚙️ Customizable Settings
- Secure API key management (stored locally)
- Voice settings toggle
- Multi-language support (English, Hindi)
- User preference persistence

### 📱 Responsive Design
- Mobile-first responsive design
- Works seamlessly on desktop, tablet, and mobile
- Touch-friendly interface
- Progressive Web App ready

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Integration**: Google Gemini AI API
- **Voice**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Storage**: LocalStorage for settings and chat history
- **Styling**: Custom CSS with modern design system
- **Icons**: Font Awesome 6
- **Fonts**: Inter font family

## 📂 Project Structure

```
finanzas/
├── index.html          # Main HTML file
├── style.css           # Comprehensive styling
├── script.js           # Main application logic
├── config.js           # Configuration and constants
└── README.md           # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API key ([Get it free here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or Download**
   ```bash
   # Clone the repository (if using git)
   git clone https://github.com/your-username/finanzas.git
   cd finanzas
   
   # Or simply download the files to a folder
   ```

2. **Local Development**
   ```bash
   # Option 1: Use Python's built-in server
   python -m http.server 8000
   
   # Option 2: Use Node.js http-server
   npx http-server -p 8000
   
   # Option 3: Use Live Server extension in VS Code
   # Right-click on index.html and select "Open with Live Server"
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - The app will prompt you to enter your Gemini API key

### Getting Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in Finanzas when prompted

**Note**: Your API key is stored locally in your browser and never sent to any external servers except Google's Gemini API.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Using Vercel CLI**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Using Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository or upload files
   - Deploy automatically

3. **Using GitHub Integration**
   - Push code to GitHub
   - Connect repository to Vercel
   - Automatic deployments on push

### Deploy to Netlify

1. **Drag and Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag your project folder to the deployment area

2. **Git Integration**
   - Connect your GitHub repository
   - Set build command: `# (none needed for static site)`
   - Set publish directory: `./`

### Deploy to GitHub Pages

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select source branch (usually `main`)
   - Your site will be available at `https://username.github.io/repository-name`

## 🔧 Configuration

### Environment Variables

For production deployment, you can set these environment variables:

```javascript
// In config.js, you can modify:
CONFIG.API.GEMINI_ENDPOINT = 'your-custom-endpoint';
CONFIG.DEBUG.ENABLED = false; // Disable debug logs
CONFIG.FEATURES.ANALYTICS = true; // Enable analytics
```

### Customizing Financial Context

Edit the `CONTEXT.SYSTEM_PROMPT` in `config.js` to customize the AI's personality and knowledge base:

```javascript
CONTEXT: {
    SYSTEM_PROMPT: `Your custom financial advisor personality and instructions...`,
    QUICK_RESPONSES: {
        'custom_topic': 'Your custom quick response...'
    }
}
```

## 🎯 Usage Examples

### Basic Financial Questions
- "What is SIP?"
- "How to start investing with ₹1000?"
- "Explain mutual funds"
- "Best tax-saving investments in India"

### Voice Commands
- Click the microphone button
- Say your question clearly
- The app will automatically transcribe and respond

### Quick Start Options
- Use the quick-start buttons for common topics
- Perfect for first-time users
- Covers essential financial concepts

## 🔒 Security & Privacy

### Data Protection
- **API Key**: Stored locally using browser's LocalStorage, never transmitted to our servers
- **Chat History**: Stored locally, can be cleared anytime
- **No Tracking**: No analytics or tracking by default
- **HTTPS Only**: Works only on secure connections in production

### API Key Security
- Keys are masked in the UI
- Stored securely in browser storage
- Can be updated or removed anytime
- Never logged or transmitted except to Google's Gemini API

## 🌍 Internationalization

### Supported Languages
- **English (US)**: Default interface language
- **English (India)**: Localized for Indian users
- **Hindi**: हिंदी interface support (partial)

### Adding New Languages
1. Update `CONFIG.VOICE.RECOGNITION_LANGUAGE` in config.js
2. Add language options in HTML
3. Implement translation strings
4. Update voice synthesis settings

## 🧪 Testing

### Manual Testing Checklist
- [ ] Chat functionality with valid API key
- [ ] Voice input and output
- [ ] Settings persistence
- [ ] Mobile responsiveness
- [ ] Error handling (invalid API key, network issues)
- [ ] Chat history save/load
- [ ] Quick start buttons

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ❌ Internet Explorer (not supported)

## 🚨 Troubleshooting

### Common Issues

1. **"API Key Required" Error**
   - Ensure you have a valid Gemini API key
   - Check if the key is properly saved in settings
   - Verify the key hasn't expired

2. **Voice Not Working**
   - Ensure microphone permissions are granted
   - Check if your browser supports Web Speech API
   - Try using Chrome or Edge for best compatibility

3. **Network Errors**
   - Check internet connection
   - Verify API key is valid
   - Check if you've exceeded API rate limits

4. **Chat History Lost**
   - Check if browser storage is enabled
   - Clear browser cache and try again
   - History is tied to the specific domain/port

### Debug Mode

Enable debug mode in `config.js`:

```javascript
DEBUG: {
    ENABLED: true,
    LOG_API_CALLS: true,
    LOG_VOICE_EVENTS: true
}
```

This will show detailed logs in browser console.

## 📈 Performance Optimization

### Loading Performance
- Minified CSS and JavaScript (in production)
- Optimized font loading with font-display: swap
- Lazy loading for non-critical resources

### Runtime Performance
- Debounced input validation
- Efficient DOM manipulation
- Memory management for chat history
- Optimized API calls with rate limiting

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use ES6+ features
- Follow existing naming conventions
- Add comments for complex functions
- Maintain responsive design principles

### Feature Requests
- Open an issue with detailed description
- Include use cases and benefits
- Consider implementation complexity

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Team Technocrats

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Team

**Team Technocrats**
- AI-powered financial education for Indian youth
- Built with ❤️ for financial literacy

## 🔗 Links

- **Live Demo**: [Add your deployed URL here]
- **API Documentation**: [Google Gemini AI](https://ai.google.dev/)
- **Voice API**: [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- **Support**: [Create an issue](https://github.com/your-username/finanzas/issues)

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed description
4. For urgent support, contact the team

---

**Disclaimer**: Finanzas provides educational content only. Always consult qualified financial advisors for personalized investment advice. Past performance does not guarantee future returns.

**Start small. Learn smart. Build wealth with Finanzas! 💰**