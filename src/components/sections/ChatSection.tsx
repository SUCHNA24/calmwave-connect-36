import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import AnimateIn from '../AnimateIn';
import EmojiPicker from '../EmojiPicker';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🌟 नमस्ते! Hello! I\'m here to support you. How are you feeling today? 😊 आप कैसा महसूस कर रहे हैं आज? 💙',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: '💝 Thank you for sharing that with me. It takes courage to open up about your feelings. 🤗 I\'m here to listen and support you through this. Would you like to tell me more about what\'s on your mind? 🌈 धन्यवाद आपने मेरे साथ साझा किया।',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  return (
    <section id="chat" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              🤖💬 AI Chat Support / एआई चैट सपोर्ट
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Confidential conversations with our culturally-aware AI companion 🌍💙
              <br />
              हमारे सांस्कृतिक रूप से जागरूक एआई साथी के साथ गोपनीय बातचीत
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="glass-card">
            {/* Chat Header */}
            <div className="p-4 border-b border-glass-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">WellnessAI Assistant</h3>
                  <p className="text-sm text-muted-foreground">Online • Culturally aware</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white/50 text-foreground border border-glass-border'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && (
                        <Bot className="w-4 h-4 mt-1 text-primary" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-1 text-primary-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-body">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-glass-border">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Share your thoughts... 😊💭 अपने विचार साझा करें... 🌟"
                  className="flex-1 px-4 py-2 bg-input border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-body"
                />
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-accent text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}