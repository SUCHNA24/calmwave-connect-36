import { useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { MessageCircle, BarChart3, BookOpen, Phone, Heart, Shield, Globe2, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import HeroSection from '../components/sections/HeroSection';
import AnimateIn from '../components/AnimateIn';

const HomePage = () => {
  useEffect(() => {
    gsap.registerPlugin();
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chat Support',
      description: 'Confidential conversations with our culturally-aware AI companion',
      link: '/chat',
      color: 'text-primary'
    },
    {
      icon: BarChart3,
      title: 'Mood Tracker',
      description: 'Track and visualize your emotional journey over time',
      link: '/mood',
      color: 'text-secondary'
    },
    {
      icon: BookOpen,
      title: 'Private Journal',
      description: 'Safe space to express your thoughts and feelings',
      link: '/journal',
      color: 'text-primary'
    },
    {
      icon: Phone,
      title: 'Crisis Support',
      description: 'Immediate access to professional help when you need it most',
      link: '/crisis',
      color: 'text-red-500'
    }
  ];

  const highlights = [
    {
      icon: Shield,
      title: 'Completely Confidential',
      description: 'Your privacy is our priority. All conversations are encrypted and secure.'
    },
    {
      icon: Globe2,
      title: 'Hindi & English Support',
      description: 'Express yourself in the language you\'re most comfortable with.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Support when you need it, any time of day or night.'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced Background Pattern for Light Mode */}
      <div className="fixed inset-0 pointer-events-none opacity-40" style={{ background: 'var(--gradient-mesh)' }} />
      
      <ParticleCursor />
      <Navbar />
      
      <main className="relative z-10">
        <HeroSection />

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <AnimateIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
                  Everything you need for your wellness journey
                </h2>
                <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                  Comprehensive tools designed specifically for the mental health needs of Indian youth
                </p>
              </div>
            </AnimateIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <AnimateIn key={feature.title} delay={0.1 * index}>
                  <Link to={feature.link} className="group">
                    <div className="glass-card p-6 h-full hover:scale-105 transition-all duration-300">
                      <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground font-body">
                        {feature.description}
                      </p>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20 px-4" style={{ background: 'var(--gradient-subtle)' }}>
          <div className="max-w-4xl mx-auto">
            <AnimateIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
                  Why choose WellnessAI?
                </h2>
                <p className="text-xl text-muted-foreground font-body">
                  Built specifically for the unique challenges faced by Indian youth
                </p>
              </div>
            </AnimateIn>

            <div className="grid md:grid-cols-3 gap-8">
              {highlights.map((highlight, index) => (
                <AnimateIn key={highlight.title} delay={0.2 * index}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <highlight.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-muted-foreground font-body">
                      {highlight.description}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimateIn>
              <div className="glass-card p-12">
                <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-4xl font-heading font-bold text-foreground mb-6">
                  Ready to start your wellness journey?
                </h2>
                <p className="text-xl text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
                  Take the first step towards better mental health. Our AI companion is here to support you every step of the way.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/chat" className="bg-gradient-accent text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium">
                    Start Chatting Now
                  </Link>
                  <Link to="/mood" className="bg-gradient-accent text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium">
                    Track Your Mood
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
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

export default HomePage;