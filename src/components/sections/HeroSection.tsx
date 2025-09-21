import AnimateIn from '../AnimateIn';

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <iframe 
          src='https://my.spline.design/aibrain-RZKUHclIuHmIhvS7Mj14CqLM/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full"
        />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <AnimateIn delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6">
            Your Mental Wellness
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Journey Starts Here
            </span>
            <span className="block text-3xl md:text-4xl mt-4 text-primary font-semibold">
              आपकी मानसिक स्वास्थ्य यात्रा यहाँ शुरू होती है
            </span>
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.4}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
            AI-powered support designed for Indian youth. Confidential, empathetic, 
            and culturally sensitive mental health assistance.
            <br />
            <span className="text-lg md:text-xl">
              भारतीय युवाओं के लिए डिज़ाइन किया गया एआई-संचालित सहायता। गोपनीय, सहानुभूतिपूर्ण, और सांस्कृतिक रूप से संवेदनशील मानसिक स्वास्थ्य सहायता।
            </span>
          </p>
        </AnimateIn>

        <AnimateIn delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-accent text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium">
              Start Your Journey / यात्रा शुरू करें
            </button>
            <button className="border-2 border-accent-gradient-end bg-transparent text-foreground px-8 py-4 rounded-2xl hover:bg-gradient-accent hover:text-white hover:border-transparent transition-all duration-300 font-medium">
              Learn More / और जानें
            </button>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.8}>
          <div className="mt-12 glass-card p-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide pb-2 min-w-max">
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div className="w-px h-12 bg-glass-border"></div>
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-secondary">Confidential</div>
                <div className="text-sm text-muted-foreground">& Safe</div>
              </div>
              <div className="w-px h-12 bg-glass-border"></div>
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-primary">Hindi/English</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}