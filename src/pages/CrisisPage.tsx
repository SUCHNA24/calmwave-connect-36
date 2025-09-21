import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import CrisisSection from '../components/sections/CrisisSection';
import AnimateIn from '../components/AnimateIn';
import { AlertTriangle, Phone, Heart } from 'lucide-react';

const CrisisPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <AnimateIn>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                Crisis Support
              </h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                If you're experiencing a mental health crisis, you're not alone. 
                Professional help is available 24/7 across India.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <div className="max-w-4xl mx-auto mb-12">
              <div className="glass-card p-6 border-l-4 border-red-500">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      Emergency Situations
                    </h3>
                    <p className="text-muted-foreground font-body">
                      If you are in immediate danger or having thoughts of self-harm, 
                      please contact emergency services (100/102/108) or visit your nearest hospital emergency room.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
        
        <CrisisSection />

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <AnimateIn>
              <div className="glass-card p-8 text-center">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  Remember: Seeking help is a sign of strength
                </h3>
                <p className="text-muted-foreground font-body mb-6">
                  Mental health professionals are trained to help you through difficult times. 
                  You deserve support, care, and the chance to feel better.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="tel:9152987821" className="bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Call AASRA: 91529 87821
                  </a>
                  <a href="tel:08046110007" className="bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Call Vandrevala: 080 4611 0007
                  </a>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CrisisPage;