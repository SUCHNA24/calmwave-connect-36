import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import ChatSection from '../components/sections/ChatSection';
import AnimateIn from '../components/AnimateIn';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <AnimateIn>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                AI Chat Support
              </h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                Connect with our culturally-aware AI companion for confidential mental health support. 
                Available in both Hindi and English.
              </p>
            </div>
          </AnimateIn>
        </div>
        
        <ChatSection />
      </main>
    </div>
  );
};

export default ChatPage;