// WebWizard AI Chat Widget
class WebWizardChat {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.init();
  }

  init() {
    this.createWidget();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  createWidget() {
    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'webwizard-chat';
    chatContainer.innerHTML = `
      <div class="chat-widget-container">
        <!-- Chat Toggle Button -->
        <button class="chat-toggle-btn" id="chatToggleBtn" aria-label="Open AI Chat">
          <div class="wizard-orb">
            <svg class="wizard-hat" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div class="orb-glow"></div>
          </div>
          <span class="chat-status">AI Assistant</span>
        </button>

        <!-- Chat Window -->
        <div class="chat-window" id="chatWindow">
          <div class="chat-header">
            <div class="chat-title">
              <div class="wizard-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h3>WebWizard AI</h3>
                <p class="status-text">Ready to help with your digital magic</p>
              </div>
            </div>
            <button class="close-btn" id="closeChatBtn" aria-label="Close Chat">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div class="chat-messages" id="chatMessages">
            <!-- Messages will be inserted here -->
          </div>

          <div class="chat-input-container">
            <div class="input-wrapper">
              <textarea 
                id="chatInput" 
                placeholder="Ask me about web development, AI, or digital solutions..."
                rows="1"
              ></textarea>
              <button class="send-btn" id="sendBtn" aria-label="Send Message">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
            <div class="typing-indicator" id="typingIndicator">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>WebWizard AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(chatContainer);
  }

  bindEvents() {
    const toggleBtn = document.getElementById('chatToggleBtn');
    const closeBtn = document.getElementById('closeChatBtn');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');

    toggleBtn.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    chatInput.addEventListener('input', () => {
      this.autoResizeTextarea(chatInput);
    });
  }

  toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const toggleBtn = document.getElementById('chatToggleBtn');
    
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    const chatWindow = document.getElementById('chatWindow');
    const toggleBtn = document.getElementById('chatToggleBtn');
    
    chatWindow.classList.add('chat-open');
    toggleBtn.classList.add('chat-active');
    this.isOpen = true;
    
    // Focus on input
    setTimeout(() => {
      document.getElementById('chatInput').focus();
    }, 300);
  }

  closeChat() {
    const chatWindow = document.getElementById('chatWindow');
    const toggleBtn = document.getElementById('chatToggleBtn');
    
    chatWindow.classList.remove('chat-open');
    toggleBtn.classList.remove('chat-active');
    this.isOpen = false;
  }

  addWelcomeMessage() {
    const welcomeMessage = {
      type: 'ai',
      content: `Welcome to WebWizard AI! I'm here to help you with all things digital magic. Whether you need help with web development, AI solutions, or just want to discuss your next project, I'm ready to assist. What can I help you with today?`,
      timestamp: new Date()
    };
    
    this.addMessage(welcomeMessage);
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    this.addMessage(userMessage);
    input.value = '';
    this.autoResizeTextarea(input);
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Call the real AI backend
    try {
      const aiReply = await this.sendMessageToAI(message);
      this.hideTypingIndicator();
      const aiMessage = {
        type: 'ai',
        content: aiReply,
        timestamp: new Date()
      };
      this.addMessage(aiMessage);
    } catch (err) {
      this.hideTypingIndicator();
      const aiMessage = {
        type: 'ai',
        content: 'Sorry, there was an error contacting the AI assistant.',
        timestamp: new Date()
      };
      this.addMessage(aiMessage);
    }
  }

  async sendMessageToAI(userMessage) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    return data.reply;
  }

  generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Web development related responses
    if (lowerMessage.includes('website') || lowerMessage.includes('web') || lowerMessage.includes('site')) {
      return {
        content: `Website Development - What type of website do you need?`,
        options: [
          { text: "E-commerce Store", action: "ecommerce" },
          { text: "Business Website", action: "business" },
          { text: "Portfolio Site", action: "portfolio" },
          { text: "Blog or Content Site", action: "blog" },
          { text: "Custom Web App", action: "webapp" }
        ]
      };
    }
    
    // App development related responses
    if (lowerMessage.includes('app') || lowerMessage.includes('mobile') || lowerMessage.includes('ios') || lowerMessage.includes('android')) {
      return {
        content: `Mobile App Development - What type of app are you looking for?`,
        options: [
          { text: "iOS App", action: "ios" },
          { text: "Android App", action: "android" },
          { text: "Cross-Platform App", action: "cross-platform" },
          { text: "E-commerce App", action: "ecommerce-app" },
          { text: "Social Media App", action: "social-app" }
        ]
      };
    }
    
    // AI related responses
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('chatbot') || lowerMessage.includes('automation')) {
      return {
        content: `AI Solutions - What type of AI service do you need?`,
        options: [
          { text: "Customer Service AI", action: "customer-ai" },
          { text: "Data Analysis AI", action: "data-ai" },
          { text: "Process Automation", action: "automation" },
          { text: "Recommendation Engine", action: "recommendations" },
          { text: "Custom AI Solution", action: "custom-ai" }
        ]
      };
    }
    
    // Pricing related responses
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote') || lowerMessage.includes('budget')) {
      return {
        content: `Pricing Information - What would you like to know about our pricing?`,
        options: [
          { text: "Website Pricing", action: "website-pricing" },
          { text: "App Development Cost", action: "app-pricing" },
          { text: "AI Solution Pricing", action: "ai-pricing" },
          { text: "Get Custom Quote", action: "custom-quote" },
          { text: "Payment Plans", action: "payment-plans" }
        ]
      };
    }
    
    // Contact related responses
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('reach')) {
      return {
        content: `Contact Information - How would you like to reach us?`,
        options: [
          { text: "Call Us", action: "call" },
          { text: "Email Us", action: "email" },
          { text: "Schedule Consultation", action: "consultation" },
          { text: "Live Chat", action: "live-chat" },
          { text: "Office Location", action: "location" }
        ]
      };
    }
    
    // Technology related responses
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('framework') || lowerMessage.includes('stack')) {
      return {
        content: `Technology Stack - What technology interests you?`,
        options: [
          { text: "Frontend Technologies", action: "frontend" },
          { text: "Backend Technologies", action: "backend" },
          { text: "Mobile Technologies", action: "mobile-tech" },
          { text: "AI and Machine Learning", action: "ai-tech" },
          { text: "Cloud Platforms", action: "cloud" }
        ]
      };
    }
    
    // Timeline related responses
    if (lowerMessage.includes('time') || lowerMessage.includes('duration') || lowerMessage.includes('how long') || lowerMessage.includes('deadline')) {
      return {
        content: `Project Timeline - What type of project timeline are you asking about?`,
        options: [
          { text: "Website Timeline", action: "website-timeline" },
          { text: "App Development Time", action: "app-timeline" },
          { text: "AI Project Duration", action: "ai-timeline" },
          { text: "Rush Project Options", action: "rush-project" },
          { text: "Project Phases", action: "project-phases" }
        ]
      };
    }
    
    // Portfolio related responses
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('examples') || lowerMessage.includes('projects')) {
      return {
        content: `Our Portfolio - What type of work would you like to see?`,
        options: [
          { text: "Website Examples", action: "website-examples" },
          { text: "Mobile App Portfolio", action: "app-portfolio" },
          { text: "AI Project Showcase", action: "ai-portfolio" },
          { text: "E-commerce Projects", action: "ecommerce-portfolio" },
          { text: "Case Studies", action: "case-studies" }
        ]
      };
    }
    
    // Default response with main service options (PLAIN TEXT ONLY)
    return {
      content: `Welcome to WebWizard AI! I'm here to help you with your digital needs. What service are you interested in?`,
      options: [
        { text: "Website Development", action: "website" },
        { text: "Mobile App Development", action: "app" },
        { text: "AI Solutions", action: "ai" },
        { text: "Pricing and Quotes", action: "pricing" },
        { text: "Contact Us", action: "contact" }
      ]
    };
  }

  handleOptionClick(action) {
    let response;
    
    switch(action) {
      // Website options
      case 'ecommerce':
        response = {
          content: `E-commerce websites typically cost $5,000-$25,000 depending on features. We include: payment processing, inventory management, user accounts, and mobile optimization. Would you like a detailed quote?`,
          options: [
            { text: "Get Quote", action: "get-quote" },
            { text: "See Examples", action: "ecommerce-examples" },
            { text: "Features List", action: "ecommerce-features" }
          ]
        };
        break;
        
      case 'business':
        response = {
          content: `Business websites range from $2,000-$8,000. We create professional sites with: contact forms, about pages, service listings, and SEO optimization. What industry are you in?`,
          options: [
            { text: "Get Quote", action: "get-quote" },
            { text: "Industry Examples", action: "business-examples" },
            { text: "SEO Services", action: "seo-services" }
          ]
        };
        break;
        
      case 'portfolio':
        response = {
          content: `Portfolio sites cost $1,500-$4,000. Perfect for showcasing your work with: project galleries, testimonials, contact forms, and social media integration.`,
          options: [
            { text: "Get Quote", action: "get-quote" },
            { text: "Portfolio Examples", action: "portfolio-examples" },
            { text: "Design Options", action: "design-options" }
          ]
        };
        break;
        
      // App options
      case 'ios':
        response = {
          content: `iOS apps typically cost $15,000-$50,000. We develop native iOS apps using Swift, ensuring optimal performance and App Store compliance.`,
          options: [
            { text: "Get Quote", action: "get-quote" },
            { text: "iOS Examples", action: "ios-examples" },
            { text: "App Store Process", action: "app-store" }
          ]
        };
        break;
        
      case 'android':
        response = {
          content: `Android apps cost $12,000-$45,000. We use Kotlin/Java for native development, ensuring compatibility across all Android devices.`,
          options: [
            { text: "Get Quote", action: "get-quote" },
            { text: "Android Examples", action: "android-examples" },
            { text: "Google Play Process", action: "google-play" }
          ]
        };
        break;
        
      // AI options
      case 'customer-ai':
        response = {
          content: `Customer service AI costs $3,000-$15,000. We create chatbots that handle FAQs, process orders, and provide 24/7 support.`,
          options: [
            { text: "Get Quote", action: "get-quote" },
            { text: "AI Examples", action: "ai-examples" },
            { text: "Integration Options", action: "ai-integration" }
          ]
        };
        break;
        
      // Pricing options
      case 'website-pricing':
        response = {
          content: `Website Pricing: Simple sites $1,500-$3,000, Business sites $3,000-$8,000, E-commerce $5,000-$25,000. All include hosting setup and 1 year support.`,
          options: [
            { text: "Get Custom Quote", action: "get-quote" },
            { text: "Payment Plans", action: "payment-plans" },
            { text: "What's Included", action: "whats-included" }
          ]
        };
        break;
        
      case 'app-pricing':
        response = {
          content: `App Pricing: Simple apps $8,000-$15,000, Complex apps $20,000-$50,000, Enterprise apps $50,000+. Includes testing and app store submission.`,
          options: [
            { text: "Get Custom Quote", action: "get-quote" },
            { text: "Development Phases", action: "dev-phases" },
            { text: "Maintenance Plans", action: "maintenance" }
          ]
        };
        break;
        
      // Contact options
      case 'call':
        response = {
          content: `Call us at (555) 123-4567. We're available Monday-Friday, 9 AM - 6 PM PST. For urgent inquiries, leave a message and we'll call back within 2 hours.`,
          options: [
            { text: "Schedule Call", action: "schedule-call" },
            { text: "Email Instead", action: "email" },
            { text: "Office Hours", action: "hours" }
          ]
        };
        break;
        
      case 'email':
        response = {
          content: `Email us at info@webwizard.com. We respond within 24 hours. For project inquiries, please include: project type, timeline, and budget range.`,
          options: [
            { text: "Send Email", action: "send-email" },
            { text: "Contact Form", action: "contact-form" },
            { text: "Call Instead", action: "call" }
          ]
        };
        break;
        
      case 'get-quote':
        response = {
          content: `To get your custom quote, I need some details: What type of project? Timeline? Budget range? You can also fill out our detailed quote form.`,
          options: [
            { text: "Fill Quote Form", action: "quote-form" },
            { text: "Schedule Consultation", action: "consultation" },
            { text: "Call for Quote", action: "call" }
          ]
        };
        break;
        
      default:
        response = {
          content: `I'm here to help! What specific information do you need about ${action}?`,
          options: [
            { text: "Get Quote", action: "get-quote" },
            { text: "See Examples", action: "examples" },
            { text: "Contact Us", action: "contact" }
          ]
        };
    }
    
    return response;
  }

  addMessage(message) {
    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();
  }

  renderMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}-message`;
    
    const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let optionsHtml = '';
    if (message.options && message.options.length > 0) {
      optionsHtml = `
        <div class="message-options">
          ${message.options.map(option => `
            <button class="option-btn" data-action="${option.action}">
              ${option.text}
            </button>
          `).join('')}
        </div>
      `;
    }
    
    messageElement.innerHTML = `
      <div class="message-content">
        <div class="message-bubble">
          <p>${this.escapeHtml(message.content)}</p>
        </div>
        ${optionsHtml}
        <div class="message-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // Add click handlers for option buttons
    if (message.options && message.options.length > 0) {
      messageElement.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const action = btn.getAttribute('data-action');
          this.handleOptionSelection(action);
        });
      });
    }
  }

  handleOptionSelection(action) {
    // Add user's selection as a message
    const selectedOption = this.findOptionText(action);
    const userMessage = {
      type: 'user',
      content: selectedOption,
      timestamp: new Date()
    };
    
    this.addMessage(userMessage);
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Generate AI response based on selection
    setTimeout(() => {
      this.hideTypingIndicator();
      const aiResponse = this.handleOptionClick(action);
      
      const aiMessage = {
        type: 'ai',
        content: aiResponse.content,
        options: aiResponse.options,
        timestamp: new Date()
      };
      
      this.addMessage(aiMessage);
    }, 1000);
  }

  findOptionText(action) {
    // Find the text for the selected option (simplified)
    const optionTexts = {
      'ecommerce': 'E-commerce Store',
      'business': 'Business Website',
      'portfolio': 'Portfolio Site',
      'ios': 'iOS App',
      'android': 'Android App',
      'customer-ai': 'Customer Service AI',
      'website-pricing': 'Website Pricing',
      'app-pricing': 'App Development Cost',
      'call': 'Call Us',
      'email': 'Email Us',
      'get-quote': 'Get Custom Quote'
    };
    
    return optionTexts[action] || action;
  }

  showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'flex';
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'none';
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WebWizardChat();
  console.log("WebWizardChat loaded - PLAIN");
}); 