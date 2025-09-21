import { useState } from 'react';
import { Phone, User, Stethoscope, Pill, MessageCircle, ChevronRight, AlertTriangle, Target, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import AnimateIn from '../components/AnimateIn';
import MedicationChecklist from '../components/MedicationChecklist';
import RecoveryGraph from '../components/RecoveryGraph';
import RecoveryTracker from '../components/RecoveryTracker';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const SupportPage = () => {
  const [selectedRecovery, setSelectedRecovery] = useState<string | null>(null);
  const [showChatResponses, setShowChatResponses] = useState(false);
  const [recoveryProgress, setRecoveryProgress] = useState(40); // Default progress

  const doctors = [
    {
      name: 'Dr. Priya Sharma',
      specialization: 'Clinical Psychologist',
      phone: '+91 98765 43210',
      experience: '12+ years in mental health counseling'
    },
    {
      name: 'Dr. Arjun Mehta',
      specialization: 'Psychiatrist',
      phone: '+91 87654 32109',
      experience: '15+ years in psychiatric care'
    },
    {
      name: 'Dr. Kavita Patel',
      specialization: 'Counseling Therapist',
      phone: '+91 76543 21098',
      experience: '8+ years in behavioral therapy'
    },
    {
      name: 'Dr. Rajesh Kumar',
      specialization: 'Addiction Specialist',
      phone: '+91 65432 10987',
      experience: '10+ years in addiction recovery'
    }
  ];

  const conditions = [
    {
      name: 'Anxiety Disorders',
      medications: [
        { name: 'Sertraline (Zoloft)', description: 'SSRI antidepressant commonly used for anxiety' },
        { name: 'Lorazepam (Ativan)', description: 'Short-term anxiety relief medication' },
        { name: 'Buspirone (Buspar)', description: 'Non-addictive anti-anxiety medication' }
      ]
    },
    {
      name: 'Depression',
      medications: [
        { name: 'Fluoxetine (Prozac)', description: 'SSRI antidepressant for major depression' },
        { name: 'Escitalopram (Lexapro)', description: 'SSRI with fewer side effects' },
        { name: 'Venlafaxine (Effexor)', description: 'SNRI for depression and anxiety' }
      ]
    },
    {
      name: 'Bipolar Disorder',
      medications: [
        { name: 'Lithium Carbonate', description: 'Mood stabilizer for bipolar disorder' },
        { name: 'Valproate (Depakote)', description: 'Anticonvulsant used as mood stabilizer' },
        { name: 'Quetiapine (Seroquel)', description: 'Atypical antipsychotic for mood episodes' }
      ]
    },
    {
      name: 'PTSD',
      medications: [
        { name: 'Paroxetine (Paxil)', description: 'SSRI approved for PTSD treatment' },
        { name: 'Prazosin', description: 'Helps reduce nightmares in PTSD' },
        { name: 'Risperidone', description: 'Adjunct therapy for severe PTSD symptoms' }
      ]
    }
  ];

  const recoveryResponses = {
    better: {
      title: "That's wonderful to hear! 🌟",
      message: "Your progress is inspiring. Keep up the great work! Remember to celebrate these small victories - they're building blocks to your overall wellness.",
      tip: "Consider keeping a gratitude journal to maintain this positive momentum."
    },
    same: {
      title: "Stability is progress too 💙",
      message: "Some days we maintain, and that's perfectly okay. Consistency in your recovery journey is valuable, even when it doesn't feel like forward movement.",
      tip: "Try a 5-minute breathing exercise or a short walk to refresh your perspective."
    },
    worse: {
      title: "It's okay to have difficult days 🤗",
      message: "Recovery isn't linear, and setbacks are part of the healing process. You're brave for reaching out and acknowledging how you feel.",
      tip: "Consider connecting with one of our doctors or practicing a grounding technique. You don't have to face this alone."
    }
  };

  const handleRecoverySelect = (option: string) => {
    setSelectedRecovery(option);
    setShowChatResponses(true);
  };

  const resetChat = () => {
    setSelectedRecovery(null);
    setShowChatResponses(false);
  };

  const handleProgressUpdate = (completedCount: number, totalCount: number) => {
    const newProgress = Math.round((completedCount / totalCount) * 100);
    setRecoveryProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <AnimateIn>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                Support & Recovery
              </h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                Comprehensive support resources for your mental health journey. 
                Professional care, medication information, and recovery check-ins.
              </p>
            </div>
          </AnimateIn>

          {/* Doctor's Contact Section */}
          <section className="mb-16">
            <AnimateIn delay={0.1}>
              <div className="flex items-center mb-8">
                <Stethoscope className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-3xl font-heading font-bold text-foreground">
                  Connect with Professionals
                </h2>
              </div>
            </AnimateIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doctor, index) => (
                <AnimateIn key={doctor.name} delay={0.1 * (index + 1)}>
                  <Card className="glass-card hover:scale-105 transition-all duration-300 h-full">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg font-heading">
                        {doctor.name}
                      </CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {doctor.specialization}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground font-body">
                        {doctor.experience}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-body text-foreground">
                          {doctor.phone}
                        </p>
                        <Button 
                          className="w-full"
                          onClick={() => window.open(`tel:${doctor.phone}`, '_self')}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              ))}
            </div>
          </section>

          {/* Medication Section */}
          <section className="mb-16">
            <AnimateIn delay={0.2}>
              <div className="flex items-center mb-8">
                <Pill className="w-8 h-8 text-secondary mr-3" />
                <h2 className="text-3xl font-heading font-bold text-foreground">
                  Medication Information
                </h2>
              </div>
            </AnimateIn>

            <div className="space-y-6">
              {conditions.map((condition, conditionIndex) => (
                <AnimateIn key={condition.name} delay={0.1 * conditionIndex}>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-xl font-heading text-primary">
                        {condition.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {condition.medications.map((medication, medIndex) => (
                          <div 
                            key={medication.name}
                            className="p-4 border border-glass-border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <h4 className="font-heading font-semibold text-foreground mb-2">
                              {medication.name}
                            </h4>
                            <p className="text-sm text-muted-foreground font-body">
                              {medication.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              ))}
            </div>

            <AnimateIn delay={0.3}>
              <Card className="glass-card mt-6 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        Important Disclaimer
                      </h3>
                      <p className="text-muted-foreground font-body">
                        Always consult a qualified doctor before taking any medication. 
                        This information is for educational purposes only and should not replace professional medical advice.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          </section>

          {/* Recovery Progress Tracking Section */}
          <section className="mb-16">
            <AnimateIn delay={0.3}>
              <div className="flex items-center mb-8">
                <Target className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-3xl font-heading font-bold text-foreground">
                  Recovery Tracking & Progress
                </h2>
              </div>
            </AnimateIn>

            <Tabs defaultValue="tracking" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="tracking" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Daily Tracking</span>
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Progress View</span>
                </TabsTrigger>
                <TabsTrigger value="medication" className="flex items-center space-x-2">
                  <Pill className="w-4 h-4" />
                  <span>Medication</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tracking" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recovery Tracker */}
                  <AnimateIn delay={0.4}>
                    <RecoveryTracker onProgressUpdate={handleProgressUpdate} />
                  </AnimateIn>

                  {/* Recovery Graph */}
                  <AnimateIn delay={0.5}>
                    <RecoveryGraph currentProgress={recoveryProgress} />
                  </AnimateIn>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recovery Graph */}
                  <AnimateIn delay={0.4}>
                    <RecoveryGraph currentProgress={recoveryProgress} />
                  </AnimateIn>

                  {/* Recovery Check-in Chat */}
                  <AnimateIn delay={0.5}>
                    <Card className="glass-card">
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl font-heading">
                          Daily Recovery Chat
                        </CardTitle>
                        <CardDescription className="font-body">
                          Let us know how you're feeling today
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {!showChatResponses ? (
                          <>
                            {/* Initial Question */}
                            <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                              <p className="font-body text-foreground">
                                "How is your recovery going today?"
                              </p>
                            </div>

                            {/* Quick Reply Options */}
                            <div className="space-y-3">
                              <p className="text-sm font-body text-muted-foreground text-center">
                                Choose how you're feeling:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Button
                                  variant="outline"
                                  className="h-auto py-4 px-6 flex flex-col items-center space-y-2"
                                  onClick={() => handleRecoverySelect('better')}
                                >
                                  <span className="text-2xl">🌟</span>
                                  <span className="font-body">Better</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-auto py-4 px-6 flex flex-col items-center space-y-2"
                                  onClick={() => handleRecoverySelect('same')}
                                >
                                  <span className="text-2xl">😐</span>
                                  <span className="font-body">Same</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-auto py-4 px-6 flex flex-col items-center space-y-2"
                                  onClick={() => handleRecoverySelect('worse')}
                                >
                                  <span className="text-2xl">😔</span>
                                  <span className="font-body">Worse</span>
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* User's Selection */}
                            <div className="bg-primary/10 rounded-lg p-4 border-l-4 border-primary ml-auto max-w-xs">
                              <p className="font-body text-foreground capitalize">
                                {selectedRecovery}
                              </p>
                            </div>

                            {/* AI Response */}
                            {selectedRecovery && (
                              <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-secondary">
                                <h4 className="font-heading font-semibold text-foreground mb-2">
                                  {recoveryResponses[selectedRecovery as keyof typeof recoveryResponses].title}
                                </h4>
                                <p className="font-body text-foreground mb-3">
                                  {recoveryResponses[selectedRecovery as keyof typeof recoveryResponses].message}
                                </p>
                                <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20">
                                  <p className="text-sm font-body text-foreground">
                                    💡 <strong>Tip:</strong> {recoveryResponses[selectedRecovery as keyof typeof recoveryResponses].tip}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Continue or Reset Chat */}
                            <div className="flex justify-center space-x-3">
                              <Button variant="outline" onClick={resetChat}>
                                Check In Again
                              </Button>
                              {selectedRecovery === 'worse' && (
                                <Button 
                                  className="bg-gradient-accent text-white"
                                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                >
                                  <ChevronRight className="w-4 h-4 mr-2" />
                                  Contact Doctor
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </AnimateIn>
                </div>
              </TabsContent>

              <TabsContent value="medication" className="space-y-6">
                <AnimateIn delay={0.4}>
                  <MedicationChecklist onProgressUpdate={handleProgressUpdate} />
                </AnimateIn>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;