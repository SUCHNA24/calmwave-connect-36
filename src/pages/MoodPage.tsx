import { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, Save, Smile } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import AnimateIn from '../components/AnimateIn';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { useMoodEntries } from '../hooks/useSupabase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';

interface MoodEntry {
  id: string;
  date: Date;
  moodLevel: number;
  emotions: string[];
  triggers: string[];
  additionalThoughts: string;
}

const moodData = [
  { day: 'Mon', mood: 7, label: 'Good' },
  { day: 'Tue', mood: 5, label: 'Okay' },
  { day: 'Wed', mood: 8, label: 'Great' },
  { day: 'Thu', mood: 6, label: 'Good' },
  { day: 'Fri', mood: 4, label: 'Low' },
  { day: 'Sat', mood: 9, label: 'Excellent' },
  { day: 'Sun', mood: 7, label: 'Good' },
];

const MoodPage = () => {
  const { user } = useAuth();
  const { moodEntries, loading, error, addMoodEntry } = useMoodEntries();
  const [currentMoodLevel, setCurrentMoodLevel] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [additionalThoughts, setAdditionalThoughts] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMoodEntries, setLocalMoodEntries] = useState<MoodEntry[]>([]);

  const emotions = [
    'खुश (Happy)', 'उदास (Sad)', 'चिंतित (Anxious)', 'तनावग्रस्त (Stressed)', 
    'शांत (Calm)', 'गुस्से में (Angry)', 'आशावादी (Hopeful)', 'अकेला (Lonely)', 
    'आभारी (Grateful)', 'अभिभूत (Overwhelmed)', 'शांतिपूर्ण (Peaceful)', 'निराश (Frustrated)'
  ];

  const triggers = [
    'पढ़ाई (Academics)', 'परिवार (Family)', 'रिश्ते (Relationships)', 'करियर (Career)', 
    'स्वास्थ्य (Health)', 'सोशल मीडिया (Social Media)', 'पैसा (Finances)', 
    'भविष्य की अनिश्चितता (Future Uncertainty)', 'दोस्तों का दबाव (Peer Pressure)', 'अन्य (Other)'
  ];

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSaveMoodEntry = async () => {
    if (selectedEmotions.length === 0) {
      alert('Please select at least one emotion');
      return;
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      moodLevel: currentMoodLevel,
      emotions: selectedEmotions,
      triggers: selectedTriggers,
      additionalThoughts
    };

    // Save locally first
    setLocalMoodEntries(prev => [newEntry, ...prev]);

    // Try to save to database if user is authenticated
    if (user) {
      try {
        setIsSubmitting(true);
        await addMoodEntry({
          mood_level: currentMoodLevel,
          emotions: selectedEmotions,
          triggers: selectedTriggers,
          additional_thoughts: additionalThoughts
        });
        alert('Mood entry saved successfully!');
      } catch (err) {
        console.error('Error saving to database:', err);
        alert('Saved locally! Sign in to sync across devices.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Mood entry saved locally! Sign in to sync across devices.');
    }
    
    // Reset form
    setCurrentMoodLevel(5);
    setSelectedEmotions([]);
    setSelectedTriggers([]);
    setAdditionalThoughts('');
  };

  // Use local entries if available, otherwise use database entries
  const displayEntries = localMoodEntries.length > 0 ? localMoodEntries : moodEntries;
  const averageMood = displayEntries.length > 0 
    ? (displayEntries.reduce((sum, entry) => sum + (entry.moodLevel || entry.mood_level), 0) / displayEntries.length).toFixed(1)
    : '0.0';

  const getMoodLabel = (level: number) => {
    if (level <= 2) return 'Very Low';
    if (level <= 4) return 'Low';
    if (level <= 6) return 'Okay';
    if (level <= 8) return 'Good';
    return 'Excellent';
  };

  const getMoodColor = (level: number) => {
    if (level <= 2) return 'text-red-500';
    if (level <= 4) return 'text-orange-500';
    if (level <= 6) return 'text-yellow-500';
    if (level <= 8) return 'text-secondary';
    return 'text-primary';
  };

  // Show loading state only if we're actually loading data
  if (loading && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <AnimateIn>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                Mood Tracker / मूड ट्रैकर
              </h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                Track your daily emotions and visualize your mental wellness journey. 
                अपनी दैनिक भावनाओं को ट्रैक करें और अपनी मानसिक स्वास्थ्य यात्रा को देखें।
              </p>
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                  Error: {error}
                </div>
              )}
            </div>
          </AnimateIn>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Mood Entry Form */}
            <AnimateIn delay={0.2}>
              <div className="glass-card p-6">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  Today's Mood Entry / आज की मूड एंट्री
                </h2>

                {/* Mood Level Slider */}
                <div className="mb-6">
                  <label className="block text-lg font-body text-foreground mb-4">
                    Mood Level (1 = Very Low, 10 = Excellent) / मूड स्तर
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentMoodLevel}
                      onChange={(e) => setCurrentMoodLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-glass-border rounded-lg appearance-none slider"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>Very Low</span>
                      <span className={`text-lg font-semibold ${getMoodColor(currentMoodLevel)}`}>
                        {currentMoodLevel} - {getMoodLabel(currentMoodLevel)}
                      </span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>

                {/* Emotions Selection */}
                <div className="mb-6">
                  <label className="block text-lg font-body text-foreground mb-4">
                    What emotions are you experiencing? / आप कौन सी भावनाएं अनुभव कर रहे हैं?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion}
                        onClick={() => handleEmotionToggle(emotion)}
                        className={`p-3 rounded-xl text-sm font-body transition-all ${
                          selectedEmotions.includes(emotion)
                            ? 'bg-gradient-accent text-white'
                            : 'bg-glass-card border border-glass-border text-muted-foreground hover:border-primary'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Triggers Selection */}
                <div className="mb-6">
                  <label className="block text-lg font-body text-foreground mb-4">
                    What might have triggered these feelings? / इन भावनाओं का कारण क्या हो सकता है?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {triggers.map((trigger) => (
                      <button
                        key={trigger}
                        onClick={() => handleTriggerToggle(trigger)}
                        className={`p-3 rounded-xl text-sm font-body transition-all ${
                          selectedTriggers.includes(trigger)
                            ? 'bg-gradient-accent text-white'
                            : 'bg-glass-card border border-glass-border text-muted-foreground hover:border-secondary'
                        }`}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Thoughts */}
                <div className="mb-6">
                  <label className="block text-lg font-body text-foreground mb-4">
                    Additional thoughts (optional) / अतिरिक्त विचार (वैकल्पिक)
                  </label>
                  <textarea
                    value={additionalThoughts}
                    onChange={(e) => setAdditionalThoughts(e.target.value)}
                    placeholder="Share any additional thoughts about your mood today... / आज अपने मूड के बारे में कोई अतिरिक्त विचार साझा करें..."
                    rows={4}
                    className="w-full px-4 py-3 bg-input border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-body resize-none"
                  />
                </div>

                <Button
                  onClick={handleSaveMoodEntry}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>
                    {isSubmitting ? 'Saving...' : 'Save Mood Entry / मूड एंट्री सेव करें'}
                  </span>
                </Button>
              </div>
            </AnimateIn>

            {/* Progress Stats */}
            <AnimateIn delay={0.4}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-3xl font-heading font-bold text-primary mb-2">
                    {averageMood}
                  </h3>
                  <p className="text-muted-foreground font-body">
                    Average Mood / औसत मूड
                  </p>
                </div>
                <div className="glass-card p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-3xl font-heading font-bold text-secondary mb-2">
                    {moodEntries.length}
                  </h3>
                  <p className="text-muted-foreground font-body">
                    Total Entries / कुल एंट्रीज़
                  </p>
                </div>
              </div>
            </AnimateIn>

            {/* Mood Trends Graph */}
            <AnimateIn delay={0.5}>
              <div className="glass-card p-6">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>Mood Trends / मूड ट्रेंड्स</span>
                </h3>
                
                <div className="h-64 w-full">
                  <ChartContainer
                    config={{
                      mood: {
                        label: "Mood Level",
                        color: "hsl(var(--primary))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={displayEntries.length > 0 
                          ? displayEntries
                              .slice(0, 10)
                              .reverse()
                              .map((entry, index) => ({
                                date: new Date(entry.date || entry.entry_date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                }),
                                mood: entry.moodLevel || entry.mood_level,
                                label: getMoodLabel(entry.moodLevel || entry.mood_level)
                              }))
                          : moodData.map(item => ({
                              date: item.day,
                              mood: item.mood,
                              label: item.label
                            }))
                        }
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          domain={[1, 10]}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="mood" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ 
                            fill: "hsl(var(--primary))", 
                            strokeWidth: 2, 
                            r: 6 
                          }}
                          activeDot={{ 
                            r: 8, 
                            fill: "hsl(var(--primary))" 
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {displayEntries.length > 0 
                        ? Math.max(...displayEntries.map(e => e.moodLevel || e.mood_level))
                        : Math.max(...moodData.map(e => e.mood))
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Highest / सबसे अच्छा</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      {displayEntries.length > 0 
                        ? Math.min(...displayEntries.map(e => e.moodLevel || e.mood_level))
                        : Math.min(...moodData.map(e => e.mood))
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Lowest / सबसे कम</div>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent-foreground">
                      {displayEntries.length >= 2 ? 
                        ((displayEntries[0].moodLevel || displayEntries[0].mood_level) > (displayEntries[1].moodLevel || displayEntries[1].mood_level) ? '↗️' : 
                         (displayEntries[0].moodLevel || displayEntries[0].mood_level) < (displayEntries[1].moodLevel || displayEntries[1].mood_level) ? '↘️' : '→') 
                        : '→'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Trend / रुझान</div>
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* Recent Entries */}
            <AnimateIn delay={0.7}>
              <div className="glass-card p-6">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center space-x-2">
                  <Calendar className="w-6 h-6" />
                  <span>Recent Entries / हाल की एंट्रीज़</span>
                </h3>

                {displayEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Smile className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-body">
                      No entries yet. Start tracking your mood today! / 
                      अभी तक कोई एंट्री नहीं। आज ही अपना मूड ट्रैक करना शुरू करें!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="bg-glass-card border border-glass-border rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`text-2xl font-bold ${getMoodColor(entry.moodLevel || entry.mood_level)}`}>
                              {entry.moodLevel || entry.mood_level}
                            </div>
                            <div>
                              <div className={`font-semibold ${getMoodColor(entry.moodLevel || entry.mood_level)}`}>
                                {getMoodLabel(entry.moodLevel || entry.mood_level)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(entry.date || entry.entry_date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {(entry.emotions || entry.emotions) && (entry.emotions || entry.emotions).length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-foreground">Emotions: </span>
                            <span className="text-sm text-muted-foreground">
                              {(entry.emotions || entry.emotions).join(', ')}
                            </span>
                          </div>
                        )}

                        {(entry.triggers || entry.triggers) && (entry.triggers || entry.triggers).length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-foreground">Triggers: </span>
                            <span className="text-sm text-muted-foreground">
                              {(entry.triggers || entry.triggers).join(', ')}
                            </span>
                          </div>
                        )}

                        {(entry.additionalThoughts || entry.additional_thoughts) && (
                          <div className="text-sm text-muted-foreground italic">
                            "{entry.additionalThoughts || entry.additional_thoughts}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimateIn>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoodPage;