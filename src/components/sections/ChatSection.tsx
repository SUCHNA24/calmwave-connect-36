import { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import AnimateIn from '../AnimateIn';
import EmojiPicker from '../EmojiPicker';
import { geminiService } from '../../services/geminiService';
import { useChatConversations } from '../../hooks/useSupabase';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatSection() {
  const { user } = useAuth();
  const { 
    currentConversation, 
    messages, 
    loading, 
    error, 
    addMessage, 
    startNewConversation,
    setCurrentConversation 
  } = useChatConversations();
  
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Initialize conversation on mount
  useEffect(() => {
    if (user && !currentConversation) {
      startNewConversation();
    }
  }, [user, currentConversation, startNewConversation]);

  // Convert database messages to local format
  useEffect(() => {
    if (messages && messages.length > 0) {
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender as 'user' | 'ai',
        timestamp: new Date(msg.created_at)
      }));
      setLocalMessages(formattedMessages);
    } else if (user && messages.length === 0) {
      // Show welcome message for new users
      setLocalMessages([{
        id: 'welcome',
        text: '🌟 नमस्ते! Hello! I\'m here to support you. How are you feeling today? 😊 आप कैसा महसूस कर रहे हैं आज? 💙',
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [messages, user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Show user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setLocalMessages(prev => [...prev, userMsg]);

    try {
      // Generate AI response
      setIsGenerating(true);
      const aiResponse = await geminiService.generateMentalHealthResponse(userMessage);
      
      // Show AI response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setLocalMessages(prev => [...prev, aiMsg]);

      // Try to save to database if user is authenticated and conversation exists
      if (user && currentConversation) {
        try {
          await addMessage(currentConversation.id, userMessage, 'user');
          await addMessage(currentConversation.id, aiResponse, 'ai');
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          // Continue without showing error to user since chat still works
        }
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Show error message
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again. 😔',
        sender: 'ai',
        timestamp: new Date()
      };
      setLocalMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  // Show loading state only if we're actually loading data
  if (loading && user) {
    return (
      <section id="chat" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </section>
    );
  }

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
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                Error: {error}
              </div>
            )}
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
              {localMessages.map((message) => (
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
                  disabled={isGenerating || !inputValue.trim()}
                  className="bg-gradient-accent text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}