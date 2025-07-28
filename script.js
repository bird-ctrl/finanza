// Finanzas - AI Finance Coach JavaScript Application
// Author: Team Technocrats
// Description: Complete functionality for the Finanzas financial chatbot

class FinanzasApp {
    constructor() {
        this.isInitialized = false;
        this.chatHistory = [];
        this.isListening = false;
        this.recognition = null;
        this.synthesis = null;
        this.apiRequestCount = 0;
        this.lastApiCall = 0;
        
        // Initialize app when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    async init() {
        try {
            CONFIG.log('Initializing Finanzas App...');
            
            // Show loading screen
            await this.showLoadingScreen();
            
            // Initialize components
            this.initializeElements();
            this.initializeEventListeners();
            this.initializeVoice();
            this.loadChatHistory();
            this.checkApiKey();
            
            // Hide loading screen and show app
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            CONFIG.log('Finanzas App initialized successfully');
            
        } catch (error) {
            CONFIG.logError('Failed to initialize app', error);
            this.showToast('Failed to initialize app', 'error');
        }
    }
    
    initializeElements() {
        // Main app elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.appContainer = document.getElementById('app-container');
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.voiceBtn = document.getElementById('voice-btn');
        this.voiceStatus = document.getElementById('voice-status');
        this.voiceStatusText = document.getElementById('voice-status-text');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.welcomeSection = document.getElementById('welcome-section');
        
        // Modal elements
        this.settingsModal = document.getElementById('settings-modal');
        this.apiKeyModal = document.getElementById('api-key-modal');
        this.settingsBtn = document.getElementById('settings-btn');
        this.closeSettingsBtn = document.getElementById('close-settings');
        this.apiKeyInput = document.getElementById('api-key-input');
        this.initialApiKeyInput = document.getElementById('initial-api-key');
        this.saveSettingsBtn = document.getElementById('save-settings');
        this.saveInitialApiKeyBtn = document.getElementById('save-initial-api-key');
        this.clearChatBtn = document.getElementById('clear-chat');
        this.voiceToggle = document.getElementById('voice-toggle');
        this.languageSelect = document.getElementById('language-select');
        
        // Toast container
        this.toastContainer = document.getElementById('toast-container');
        
        CONFIG.log('UI elements initialized');
    }
    
    initializeEventListeners() {
        // Send message listeners
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Voice listeners
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        
        // Modal listeners
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.saveInitialApiKeyBtn.addEventListener('click', () => this.saveInitialApiKey());
        
        // Utility listeners
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        
        // Quick start button listeners
        const quickBtns = document.querySelectorAll('.quick-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.userInput.value = message;
                this.sendMessage();
            });
        });
        
        // API key toggle listeners
        document.getElementById('toggle-api-key').addEventListener('click', () => {
            this.togglePasswordVisibility(this.apiKeyInput, document.getElementById('toggle-api-key'));
        });
        
        document.getElementById('toggle-initial-api-key').addEventListener('click', () => {
            this.togglePasswordVisibility(this.initialApiKeyInput, document.getElementById('toggle-initial-api-key'));
        });
        
        // Input validation
        this.userInput.addEventListener('input', () => this.validateInput());
        
        // Settings change listeners
        this.voiceToggle.addEventListener('change', () => this.updateVoiceSettings());
        this.languageSelect.addEventListener('change', () => this.updateLanguageSettings());
        
        // Modal backdrop listeners
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettings();
        });
        
        this.apiKeyModal.addEventListener('click', (e) => {
            if (e.target === this.apiKeyModal) {
                // Don't allow closing API key modal by clicking backdrop
            }
        });
        
        CONFIG.log('Event listeners initialized');
    }
    
    initializeVoice() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            CONFIG.log('Speech recognition not supported');
            this.voiceBtn.style.display = 'none';
            return;
        }
        
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = CONFIG.VOICE.RECOGNITION_LANGUAGE;
        
        this.recognition.onstart = () => {
            CONFIG.log('Voice recognition started');
            this.isListening = true;
            this.voiceBtn.classList.add('recording');
            this.voiceStatus.classList.add('active');
            this.voiceStatusText.textContent = 'Listening...';
        };
        
        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (finalTranscript) {
                this.userInput.value = finalTranscript.trim();
                this.stopVoiceRecognition();
                // Auto-send if voice input detected
                setTimeout(() => this.sendMessage(), 500);
            } else if (interimTranscript) {
                this.voiceStatusText.textContent = `Hearing: "${interimTranscript}"`;
            }
        };
        
        this.recognition.onerror = (event) => {
            CONFIG.logError('Voice recognition error', event.error);
            this.stopVoiceRecognition();
            
            if (event.error === 'not-allowed') {
                this.showToast(CONFIG.ERRORS.MICROPHONE_DENIED, 'error');
            } else {
                this.showToast('Voice recognition error. Please try again.', 'error');
            }
        };
        
        this.recognition.onend = () => {
            this.stopVoiceRecognition();
        };
        
        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
        
        CONFIG.log('Voice features initialized');
    }
    
    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.showToast(CONFIG.ERRORS.VOICE_NOT_SUPPORTED, 'error');
            return;
        }
        
        if (this.isListening) {
            this.stopVoiceRecognition();
        } else {
            this.startVoiceRecognition();
        }
    }
    
    startVoiceRecognition() {
        try {
            this.recognition.start();
        } catch (error) {
            CONFIG.logError('Failed to start voice recognition', error);
            this.showToast('Failed to start voice recognition', 'error');
        }
    }
    
    stopVoiceRecognition() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        
        this.isListening = false;
        this.voiceBtn.classList.remove('recording');
        this.voiceStatus.classList.remove('active');
        this.voiceStatusText.textContent = 'Listening...';
    }
    
    speakText(text) {
        if (!this.synthesis || !CONFIG.getUserSettings().voiceEnabled) {
            return;
        }
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = CONFIG.VOICE.SYNTHESIS_LANGUAGE;
        utterance.rate = CONFIG.VOICE.SYNTHESIS_RATE;
        utterance.pitch = CONFIG.VOICE.SYNTHESIS_PITCH;
        utterance.volume = CONFIG.VOICE.SYNTHESIS_VOLUME;
        
        utterance.onerror = (event) => {
            CONFIG.logError('Speech synthesis error', event);
        };
        
        this.synthesis.speak(utterance);
    }
    
    validateInput() {
        const text = this.userInput.value;
        const isValid = text.trim().length > 0 && text.length <= CONFIG.CHAT.MAX_MESSAGE_LENGTH;
        
        this.sendBtn.disabled = !isValid;
        
        if (text.length > CONFIG.CHAT.MAX_MESSAGE_LENGTH) {
            this.showToast(CONFIG.ERRORS.MAX_LENGTH_EXCEEDED, 'warning');
        }
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;
        
        if (!CONFIG.isApiKeySet()) {
            this.showApiKeyModal();
            return;
        }
        
        // Clear input and disable send button
        this.userInput.value = '';
        this.sendBtn.disabled = true;
        this.hideWelcomeSection();
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.scrollToBottom();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addMessage(response, 'bot');
            this.scrollToBottom();
            
            // Speak response if voice is enabled
            this.speakText(response);
            
        } catch (error) {
            CONFIG.logError('Failed to get AI response', error);
            this.hideTypingIndicator();
            
            let errorMessage = CONFIG.ERRORS.GENERAL_ERROR;
            if (error.message.includes('API key')) {
                errorMessage = CONFIG.ERRORS.API_KEY_INVALID;
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = CONFIG.ERRORS.NETWORK_ERROR;
            } else if (error.message.includes('rate')) {
                errorMessage = CONFIG.ERRORS.RATE_LIMITED;
            }
            
            this.addMessage(errorMessage, 'bot', true);
            this.showToast(errorMessage, 'error');
        }
        
        // Save chat history
        this.saveChatHistory();
    }
    
    async getAIResponse(message) {
        // Rate limiting
        const now = Date.now();
        if (now - this.lastApiCall < CONFIG.API.RATE_LIMIT_DELAY) {
            await this.sleep(CONFIG.API.RATE_LIMIT_DELAY - (now - this.lastApiCall));
        }
        this.lastApiCall = Date.now();
        
        const apiKey = CONFIG.getApiKey();
        if (!apiKey) {
            throw new Error('API key not found');
        }
        
        // Prepare the prompt with context
        const fullPrompt = this.buildPrompt(message);
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
                stopSequences: []
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
        
        const response = await fetch(`${CONFIG.API.GEMINI_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(CONFIG.API.TIMEOUT)
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            CONFIG.logError('API response error', { status: response.status, error: errorData });
            
            if (response.status === 400) {
                throw new Error('Invalid API key or request format');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded');
            } else {
                throw new Error('Network error occurred');
            }
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from API');
        }
        
        const aiResponse = data.candidates[0].content.parts[0].text;
        CONFIG.log('AI response received', { length: aiResponse.length });
        
        return aiResponse;
    }
    
    buildPrompt(userMessage) {
        // Get recent chat history for context
        const recentHistory = this.chatHistory.slice(-6); // Last 6 messages
        
        let contextMessages = '';
        if (recentHistory.length > 0) {
            contextMessages = '\nRecent conversation:\n';
            recentHistory.forEach(msg => {
                const role = msg.type === 'user' ? 'User' : 'Finanzas';
                contextMessages += `${role}: ${msg.text}\n`;
            });
        }
        
        return `${CONFIG.CONTEXT.SYSTEM_PROMPT}${contextMessages}\nUser: ${userMessage}\nFinanzas:`;
    }
    
    addMessage(text, type, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${isError ? 'error' : ''}`;
        bubble.textContent = text;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        content.appendChild(bubble);
        content.appendChild(time);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.chatMessages.appendChild(messageDiv);
        
        // Add to chat history
        this.chatHistory.push({
            text,
            type,
            timestamp: Date.now(),
            isError
        });
        
        // Animate message appearance
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.3s ease-out';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
    }
    
    showTypingIndicator() {
        this.typingIndicator.classList.remove('hidden');
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.classList.add('hidden');
    }
    
    hideWelcomeSection() {
        if (this.welcomeSection) {
            this.welcomeSection.style.display = 'none';
        }
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, CONFIG.UI.AUTO_SCROLL_DELAY);
    }
    
    loadChatHistory() {
        const history = CONFIG.getChatHistory();
        if (history.length > 0) {
            this.hideWelcomeSection();
            history.forEach(msg => {
                this.addMessageToUI(msg.text, msg.type, msg.isError || false);
            });
            this.chatHistory = history;
            this.scrollToBottom();
        }
    }
    
    addMessageToUI(text, type, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${isError ? 'error' : ''}`;
        bubble.textContent = text;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        content.appendChild(bubble);
        content.appendChild(time);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.chatMessages.appendChild(messageDiv);
    }
    
    saveChatHistory() {
        CONFIG.setChatHistory(this.chatHistory);
    }
    
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.chatMessages.innerHTML = '';
            this.chatHistory = [];
            CONFIG.clearChatHistory();
            this.welcomeSection.style.display = 'block';
            this.showToast(CONFIG.SUCCESS.CHAT_CLEARED, 'success');
        }
    }
    
    checkApiKey() {
        if (!CONFIG.isApiKeySet()) {
            setTimeout(() => this.showApiKeyModal(), 500);
        }
    }
    
    showApiKeyModal() {
        this.apiKeyModal.classList.remove('hidden');
        this.initialApiKeyInput.focus();
    }
    
    hideApiKeyModal() {
        this.apiKeyModal.classList.add('hidden');
    }
    
    saveInitialApiKey() {
        const apiKey = this.initialApiKeyInput.value.trim();
        if (!apiKey) {
            this.showToast('Please enter a valid API key', 'error');
            return;
        }
        
        CONFIG.setApiKey(apiKey);
        this.hideApiKeyModal();
        this.showToast(CONFIG.SUCCESS.API_KEY_SAVED, 'success');
        
        // Clear the input for security
        this.initialApiKeyInput.value = '';
    }
    
    openSettings() {
        // Load current settings
        const settings = CONFIG.getUserSettings();
        this.apiKeyInput.value = CONFIG.getApiKey();
        this.voiceToggle.checked = settings.voiceEnabled;
        this.languageSelect.value = settings.language;
        
        this.settingsModal.classList.remove('hidden');
    }
    
    closeSettings() {
        this.settingsModal.classList.add('hidden');
        
        // Clear API key input for security
        this.apiKeyInput.value = '';
    }
    
    saveSettings() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
            CONFIG.setApiKey(apiKey);
        }
        
        const settings = {
            voiceEnabled: this.voiceToggle.checked,
            language: this.languageSelect.value
        };
        
        CONFIG.setUserSettings(settings);
        this.closeSettings();
        this.showToast(CONFIG.SUCCESS.SETTINGS_SAVED, 'success');
        
        // Update voice recognition language
        if (this.recognition) {
            this.recognition.lang = settings.language;
        }
    }
    
    updateVoiceSettings() {
        const settings = CONFIG.getUserSettings();
        settings.voiceEnabled = this.voiceToggle.checked;
        CONFIG.setUserSettings(settings);
    }
    
    updateLanguageSettings() {
        const settings = CONFIG.getUserSettings();
        settings.language = this.languageSelect.value;
        CONFIG.setUserSettings(settings);
        
        if (this.recognition) {
            this.recognition.lang = settings.language;
        }
    }
    
    togglePasswordVisibility(input, button) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    }
    
    showToast(message, type = 'info', duration = CONFIG.UI.TOAST_DURATION) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Auto remove toast
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
    
    getToastIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }
    
    async showLoadingScreen() {
        // Ensure minimum loading duration for smooth UX
        await this.sleep(CONFIG.UI.LOADING_MIN_DURATION);
    }
    
    hideLoadingScreen() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.appContainer.classList.remove('hidden');
        }, 300);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CSS for slideOut animation (to be added to styles)
const additionalStyles = `
@keyframes slideOut {
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.message-bubble.error {
    background-color: #fee2e2;
    border-color: #fecaca;
    color: #dc2626;
}
`;

// Add additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the app
const finanzasApp = new FinanzasApp();

// Make app globally available for debugging
if (CONFIG.DEBUG.ENABLED) {
    window.finanzasApp = finanzasApp;
}

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator && !CONFIG.DEBUG.ENABLED) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                CONFIG.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                CONFIG.log('SW registration failed: ', registrationError);
            });
    });
}