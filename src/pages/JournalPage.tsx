import { useState } from 'react';
import { BookOpen, Plus, Calendar, Search, Edit3, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import AnimateIn from '../components/AnimateIn';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: 'happy' | 'good' | 'okay' | 'low' | 'sad';
}

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'My First Journal Entry',
      content: 'Today was a good day. I felt more positive about things and managed to complete my assignments on time. The AI chat support really helped me understand my feelings better.',
      date: new Date(Date.now() - 86400000),
      mood: 'good'
    }
  ]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('okay');

  const handleSaveEntry = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      date: new Date(),
      mood: selectedMood
    };

    setEntries([newEntry, ...entries]);
    setNewTitle('');
    setNewContent('');
    setShowNewEntry(false);
  };

  const getMoodColor = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'happy': return 'text-primary';
      case 'good': return 'text-secondary';
      case 'okay': return 'text-yellow-500';
      case 'low': return 'text-orange-500';
      case 'sad': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <AnimateIn>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                Personal Journal / व्यक्तिगत जर्नल
              </h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                A safe space to express your thoughts, feelings, and reflect on your mental wellness journey.
                अपने विचारों, भावनाओं को व्यक्त करने और अपनी मानसिक स्वास्थ्य यात्रा पर विचार करने के लिए एक सुरक्षित स्थान।
              </p>
            </div>
          </AnimateIn>

          <div className="max-w-4xl mx-auto">
            {/* Header Actions */}
            <AnimateIn delay={0.2}>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search journal entries..."
                      className="pl-10 pr-4 py-2 bg-input border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-gradient-end focus:border-transparent focus:shadow-md font-body transition-all duration-300 hover:shadow-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowNewEntry(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Entry</span>
                </button>
              </div>
            </AnimateIn>

            {/* New Entry Form */}
            {showNewEntry && (
              <AnimateIn>
                <div className="glass-card p-6 mb-8">
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Create New Journal Entry
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Entry title..."
                      className="w-full px-4 py-2 bg-input border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-body"
                    />
                    
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Write about your thoughts, feelings, or experiences today..."
                      rows={6}
                      className="w-full px-4 py-2 bg-input border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-body resize-none"
                    />

                    <div>
                      <label className="block text-sm font-body text-muted-foreground mb-2">
                        How are you feeling?
                      </label>
                      <div className="flex space-x-2">
                        {(['happy', 'good', 'okay', 'low', 'sad'] as const).map((mood) => (
                          <button
                            key={mood}
                            onClick={() => setSelectedMood(mood)}
                            className={`px-3 py-1 rounded-full text-sm font-body transition-all ${
                              selectedMood === mood
                                ? 'bg-primary text-white'
                                : 'bg-glass-card border border-glass-border text-muted-foreground hover:border-primary'
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveEntry}
                        className="btn-primary"
                      >
                        Save Entry
                      </button>
                      <button
                        onClick={() => setShowNewEntry(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            )}

            {/* Journal Entries */}
            <div className="space-y-6">
              {entries.map((entry, index) => (
                <AnimateIn key={entry.id} delay={0.1 * index}>
                  <div className="glass-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                          {entry.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{entry.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood).replace('text-', 'bg-')}`}></div>
                            <span className={getMoodColor(entry.mood)}>{entry.mood}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground font-body leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                </AnimateIn>
              ))}

              {entries.length === 0 && !showNewEntry && (
                <AnimateIn>
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                      Start your journal journey
                    </h3>
                    <p className="text-muted-foreground font-body mb-6">
                      Create your first entry to begin reflecting on your thoughts and emotions.
                    </p>
                    <button
                      onClick={() => setShowNewEntry(true)}
                      className="btn-primary"
                    >
                      Write Your First Entry
                    </button>
                  </div>
                </AnimateIn>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JournalPage;