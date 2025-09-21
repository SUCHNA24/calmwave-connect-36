import { useEffect } from 'react';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import HeroSection from '../components/sections/HeroSection';
import ChatSection from '../components/sections/ChatSection';
import MoodSection from '../components/sections/MoodSection';
import CrisisSection from '../components/sections/CrisisSection';

const Index = () => {
  useEffect(() => {
    // Initialize GSAP animations
    gsap.registerPlugin();
    
    // Set up smooth scrolling
    const handleSmoothScroll = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      
      if (href?.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Add smooth scroll to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main>
        <HeroSection />
        <ChatSection />
        <MoodSection />
        <CrisisSection />
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-glass-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
              Your mental health matters
            </h3>
            <p className="text-muted-foreground font-body mb-6">
              WellnessAI is designed to support Indian youth with culturally sensitive, 
              confidential mental health assistance. Remember, seeking help is a sign of strength.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 WellnessAI</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
