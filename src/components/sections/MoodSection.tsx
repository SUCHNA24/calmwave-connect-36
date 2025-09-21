import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Meh, Frown, Heart, Zap, Cloud } from 'lucide-react';
import AnimateIn from '../AnimateIn';

const moodData = [
  { day: 'Mon', mood: 7, label: 'Good' },
  { day: 'Tue', mood: 5, label: 'Okay' },
  { day: 'Wed', mood: 8, label: 'Great' },
  { day: 'Thu', mood: 6, label: 'Good' },
  { day: 'Fri', mood: 4, label: 'Low' },
  { day: 'Sat', mood: 9, label: 'Excellent' },
  { day: 'Sun', mood: 7, label: 'Good' },
];

const moodOptions = [
  { value: 1, label: 'Very Low', icon: Frown, color: 'text-red-500' },
  { value: 2, label: 'Low', icon: Cloud, color: 'text-orange-500' },
  { value: 3, label: 'Okay', icon: Meh, color: 'text-yellow-500' },
  { value: 4, label: 'Good', icon: Smile, color: 'text-secondary' },
  { value: 5, label: 'Excellent', icon: Heart, color: 'text-primary' },
];

export default function MoodSection() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <section id="mood" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Mood Tracker
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Track and visualize your emotional journey
            </p>
          </div>
        </AnimateIn>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mood Input */}
          <AnimateIn delay={0.2} direction="left">
            <div className="glass-card p-6">
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                How are you feeling today?
              </h3>
              
              <div className="space-y-4">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                      selectedMood === mood.value
                        ? 'border-primary bg-primary/10'
                        : 'border-glass-border hover:border-primary/50'
                    }`}
                  >
                    <mood.icon className={`w-6 h-6 ${mood.color}`} />
                    <span className="font-body text-lg">{mood.label}</span>
                  </button>
                ))}
              </div>

              {selectedMood && (
                <div className="mt-6">
                  <button className="bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 w-full">
                    Log Mood Entry
                  </button>
                </div>
              )}
            </div>
          </AnimateIn>

          {/* Mood Chart */}
          <AnimateIn delay={0.4} direction="right">
            <div className="glass-card p-6">
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                Your Weekly Mood Trends
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      domain={[1, 10]}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--glass-border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar 
                      dataKey="mood" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-secondary/10 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span className="font-heading font-semibold text-foreground">Insight</span>
                </div>
                <p className="text-sm text-muted-foreground font-body">
                  Your mood has been generally positive this week! Friday showed a dip - 
                  consider what might have contributed to that and how you can support yourself better.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}