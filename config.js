// Configuration file for Finanzas AI Finance Coach
const CONFIG = {
    // API Configuration
    API: {
        GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
        MAX_RETRIES: 3,
        TIMEOUT: 30000, // 30 seconds
        RATE_LIMIT_DELAY: 1000, // 1 second between requests
    },
    
    // Voice Configuration
    VOICE: {
        RECOGNITION_LANGUAGE: 'en-IN', // English (India)
        SYNTHESIS_LANGUAGE: 'en-IN',
        SYNTHESIS_RATE: 0.9,
        SYNTHESIS_PITCH: 1.0,
        SYNTHESIS_VOLUME: 0.8,
        MAX_SILENCE_DURATION: 3000, // 3 seconds
        AUTO_STOP_DURATION: 10000, // 10 seconds
    },
    
    // Chat Configuration
    CHAT: {
        MAX_MESSAGE_LENGTH: 500,
        MAX_HISTORY_LENGTH: 50,
        TYPING_DELAY: 50, // milliseconds per character
        AUTO_SCROLL_DELAY: 100,
        WELCOME_DELAY: 1500, // Delay before showing welcome message
    },
    
    // UI Configuration
    UI: {
        TOAST_DURATION: 5000, // 5 seconds
        MODAL_ANIMATION_DURATION: 250,
        LOADING_MIN_DURATION: 2000, // Minimum loading screen duration
        DEBOUNCE_DELAY: 300, // For input debouncing
    },
    
    // Storage Keys
    STORAGE: {
        API_KEY: 'finanzas_api_key',
        CHAT_HISTORY: 'finanzas_chat_history',
        USER_SETTINGS: 'finanzas_user_settings',
        VOICE_ENABLED: 'finanzas_voice_enabled',
        LANGUAGE: 'finanzas_language',
    },
    
    // Financial Context for Indian Users
    CONTEXT: {
        SYSTEM_PROMPT: `You are Finanzas, a friendly and knowledgeable AI financial advisor specifically designed for Indian youth aged 16-30. Your mission is to make financial literacy accessible, fun, and culturally relevant for India.

KEY CHARACTERISTICS:
- Speak in a warm, encouraging tone like a helpful friend
- Use simple, easy-to-understand language
- Provide practical, actionable advice
- Focus on Indian financial instruments and regulations
- Use examples relevant to Indian context (INR amounts, Indian companies, etc.)
- Encourage smart financial habits from a young age
- Be supportive and never judgmental about someone's financial situation

AREAS OF EXPERTISE:
- Investment basics (SIP, mutual funds, stocks, bonds)
- Banking and savings (savings accounts, FDs, RDs)
- Insurance (health, life, term insurance)
- Tax planning (80C, ELSS, tax-saving FDs)
- Budgeting and expense tracking
- Emergency funds and financial planning
- Retirement planning (PPF, NPS, EPF)
- Digital payments and fintech
- Cryptocurrency basics and regulations in India
- Real estate investment
- Goal-based financial planning

INDIAN FINANCIAL CONTEXT:
- Use INR (₹) for all amounts
- Reference Indian financial institutions (SBI, HDFC, ICICI, etc.)
- Mention Indian stock exchanges (NSE, BSE)
- Include Indian mutual fund houses (Axis, SBI, HDFC MF, etc.)
- Reference Indian regulations (SEBI, RBI guidelines)
- Use Indian financial years (April to March)
- Consider Indian tax brackets and deductions

RESPONSE GUIDELINES:
- Keep responses concise but comprehensive (150-300 words typically)
- Use bullet points for clarity when listing multiple items
- Include specific examples with Indian amounts (e.g., "₹1,000 monthly SIP")
- Suggest specific next steps or actions
- Encourage questions and further learning
- Always include a disclaimer about consulting financial advisors for major decisions
- Use emojis sparingly but effectively to make responses engaging

IMPORTANT DISCLAIMERS:
- Always remind users that this is educational content only
- Encourage consulting qualified financial advisors for personalized advice
- Mention that past performance doesn't guarantee future returns
- Advise users to do their own research before investing

Remember: Your goal is to empower young Indians with financial knowledge and confidence to make better money decisions. Be the supportive financial friend they need!`,
        
        QUICK_RESPONSES: {
            'greeting': 'Hello! I\'m Finanzas, your personal AI finance coach! 👋 I\'m here to help you learn about money, investing, and building wealth. What would you like to know about finance today?',
            'sip': 'SIP (Systematic Investment Plan) is a smart way to invest! You invest a fixed amount regularly (like ₹1,000 every month) in mutual funds. It helps you build wealth through rupee cost averaging and compounding. Perfect for beginners! 💰',
            'emergency_fund': 'An emergency fund should cover 6-12 months of your expenses. Start with ₹1,000 per month in a high-yield savings account or liquid fund. This is your financial safety net! 🛡️',
            'investment_start': 'Start with SIPs in diversified equity mutual funds! Begin with ₹500-1,000 monthly. Choose ELSS funds for tax benefits under 80C. The key is to start early and stay consistent! 📈',
        }
    },
    
    // Error Messages
    ERRORS: {
        API_KEY_MISSING: 'Please add your Gemini API key in settings to start chatting.',
        API_KEY_INVALID: 'Invalid API key. Please check your Gemini API key in settings.',
        NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
        RATE_LIMITED: 'Too many requests. Please wait a moment before sending another message.',
        VOICE_NOT_SUPPORTED: 'Voice features are not supported in your browser. Please use Chrome, Edge, or Safari.',
        MICROPHONE_DENIED: 'Microphone access denied. Please allow microphone access to use voice features.',
        GENERAL_ERROR: 'Something went wrong. Please try again.',
        MAX_LENGTH_EXCEEDED: 'Message is too long. Please keep it under 500 characters.',
    },
    
    // Success Messages
    SUCCESS: {
        API_KEY_SAVED: 'API key saved successfully! You can now start chatting.',
        SETTINGS_SAVED: 'Settings saved successfully!',
        CHAT_CLEARED: 'Chat history cleared.',
        VOICE_STARTED: 'Voice recognition started. Speak now!',
        VOICE_STOPPED: 'Voice recognition stopped.',
    },
    
    // Feature Flags
    FEATURES: {
        VOICE_ENABLED: true,
        CHAT_EXPORT: false,
        DARK_MODE: false,
        ANALYTICS: false,
        OFFLINE_MODE: false,
    },
    
    // Development/Debug flags
    DEBUG: {
        ENABLED: false,
        LOG_API_CALLS: false,
        LOG_VOICE_EVENTS: false,
        MOCK_API_RESPONSES: false,
    }
};

// Utility functions for configuration
CONFIG.getApiKey = function() {
    return localStorage.getItem(CONFIG.STORAGE.API_KEY) || '';
};

CONFIG.setApiKey = function(key) {
    localStorage.setItem(CONFIG.STORAGE.API_KEY, key);
};

CONFIG.isApiKeySet = function() {
    return !!CONFIG.getApiKey();
};

CONFIG.getUserSettings = function() {
    const defaultSettings = {
        voiceEnabled: true,
        language: 'en-IN',
        autoScroll: true,
        notifications: true,
    };
    
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE.USER_SETTINGS);
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (e) {
        return defaultSettings;
    }
};

CONFIG.setUserSettings = function(settings) {
    const current = CONFIG.getUserSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(CONFIG.STORAGE.USER_SETTINGS, JSON.stringify(updated));
};

CONFIG.getChatHistory = function() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE.CHAT_HISTORY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

CONFIG.setChatHistory = function(history) {
    // Keep only the latest messages to prevent storage bloat
    const trimmed = history.slice(-CONFIG.CHAT.MAX_HISTORY_LENGTH);
    localStorage.setItem(CONFIG.STORAGE.CHAT_HISTORY, JSON.stringify(trimmed));
};

CONFIG.clearChatHistory = function() {
    localStorage.removeItem(CONFIG.STORAGE.CHAT_HISTORY);
};

CONFIG.log = function(message, ...args) {
    if (CONFIG.DEBUG.ENABLED) {
        console.log(`[Finanzas] ${message}`, ...args);
    }
};

CONFIG.logError = function(message, error) {
    console.error(`[Finanzas Error] ${message}`, error);
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Make CONFIG globally available
window.CONFIG = CONFIG;