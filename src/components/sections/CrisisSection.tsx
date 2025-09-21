import { Phone, MessageCircle, Clock, Shield } from 'lucide-react';
import AnimateIn from '../AnimateIn';

const helplines = [
  {
    name: 'National Suicide Prevention Helpline',
    number: '9152987821',
    hours: '24/7',
    description: 'Immediate crisis support and suicide prevention'
  },
  {
    name: 'Vandrevala Foundation',
    number: '9999666555',
    hours: '24/7',
    description: 'Mental health support and counseling'
  },
  {
    name: 'AASRA',
    number: '9820466726',
    hours: '24/7',
    description: 'Emotional support and crisis intervention'
  },
  {
    name: 'Sneha India',
    number: '044-24640050',
    hours: '24/7',
    description: 'Suicide prevention and emotional support'
  },
  {
    name: 'iCall Tata Institute',
    number: '9152987821',
    hours: '10 AM - 8 PM (Mon-Sat)',
    description: 'Professional counseling support'
  },
  {
    name: 'Sumaitri',
    number: '011-23389090',
    hours: '2 PM - 10 PM',
    description: 'Delhi-based emotional support'
  }
];

const emergencyTips = [
  "If you're having thoughts of self-harm, reach out immediately",
  "You are not alone - crisis support is available 24/7",
  "It's okay to ask for help - seeking support shows strength",
  "Your feelings are valid and temporary - this will pass",
  "Emergency services: Call 100 (Police) or 102 (Ambulance)"
];

export default function CrisisSection() {
  return (
    <section id="crisis" className="py-20 px-4 bg-gradient-to-br from-destructive/5 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Crisis Support
            </h2>
            <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              Immediate help is available. You don't have to face this alone.
            </p>
          </div>
        </AnimateIn>

        {/* Emergency Alert */}
        <AnimateIn delay={0.2}>
          <div className="glass-card bg-destructive/5 border-destructive/20 p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-destructive mb-2">
                  In Crisis? Get Help Now
                </h3>
                <p className="text-foreground font-body mb-4">
                  If you're having thoughts of self-harm or suicide, please reach out immediately. 
                  Professional help is available 24/7.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="tel:9152987821" className="bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    Call 9152987821
                  </a>
                  <button className="bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Helplines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {helplines.map((helpline, index) => (
            <AnimateIn key={helpline.number} delay={0.1 * (index + 3)}>
              <div className="glass-card p-6 hover:shadow-hover transition-all duration-300">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground mb-1">
                      {helpline.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{helpline.hours}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 font-body">
                  {helpline.description}
                </p>
                
                <a
                  href={`tel:${helpline.number}`}
                  className="bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 w-full text-center block"
                >
                  Call {helpline.number}
                </a>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Emergency Tips */}
        <AnimateIn delay={0.8}>
          <div className="glass-card p-6">
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
              Remember
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {emergencyTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground font-body">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}