import { useState } from 'react';
import { Calendar, Target, Award, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useRecoveryEntries, useRecoveryGoals, RecoveryEntry } from '../hooks/useRecoveryTracking';
import { useAuth } from '../hooks/useAuth';

interface RecoveryTrackerProps {
  onProgressUpdate?: (progress: number) => void;
}

const RecoveryTracker = ({ onProgressUpdate }: RecoveryTrackerProps) => {
  const { user } = useAuth();
  const { addRecoveryEntry, isAdding } = useRecoveryEntries();
  const { recoveryGoals, addRecoveryGoal, isAdding: isAddingGoal } = useRecoveryGoals();
  
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [entryData, setEntryData] = useState({
    recovery_status: 'same' as 'better' | 'same' | 'worse',
    mood_score: 5,
    energy_level: 5,
    sleep_quality: 5,
    medication_adherence: false,
    therapy_session: false,
    exercise_completed: false,
    social_connection: false,
    notes: ''
  });
  
  const [goalData, setGoalData] = useState({
    goal_type: 'weekly' as 'weekly' | 'monthly' | 'custom',
    title: '',
    description: '',
    target_value: 1,
    unit: 'times',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
  });

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await addRecoveryEntry({
        entry_date: today,
        ...entryData
      });

      // Calculate progress percentage
      const progress = Math.round(
        ((entryData.mood_score + entryData.energy_level + entryData.sleep_quality) / 3) * 10 +
        ([entryData.medication_adherence, entryData.therapy_session, entryData.exercise_completed, entryData.social_connection]
          .filter(Boolean).length * 5)
      );

      onProgressUpdate?.(Math.min(100, progress));
      
      setShowEntryForm(false);
      setEntryData({
        recovery_status: 'same',
        mood_score: 5,
        energy_level: 5,
        sleep_quality: 5,
        medication_adherence: false,
        therapy_session: false,
        exercise_completed: false,
        social_connection: false,
        notes: ''
      });
    } catch (error) {
      console.error('Error adding recovery entry:', error);
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addRecoveryGoal(goalData);
      setShowGoalForm(false);
      setGoalData({
        goal_type: 'weekly',
        title: '',
        description: '',
        target_value: 1,
        unit: 'times',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding recovery goal:', error);
    }
  };

  const activeGoals = recoveryGoals.filter(goal => !goal.is_completed);
  const completedGoals = recoveryGoals.filter(goal => goal.is_completed);

  return (
    <div className="space-y-6">
      {/* Quick Entry Form */}
      {!showEntryForm ? (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading flex items-center">
                <Calendar className="w-5 h-5 text-primary mr-2" />
                Daily Recovery Check-in
              </CardTitle>
              <Button onClick={() => setShowEntryForm(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Log Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground font-body text-sm">
              Track your daily recovery progress with mood, energy, sleep, and activities.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center">
              <Calendar className="w-5 h-5 text-primary mr-2" />
              Today's Recovery Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEntrySubmit} className="space-y-4">
              {/* Recovery Status */}
              <div>
                <Label className="text-sm font-medium">How are you feeling today?</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['better', 'same', 'worse'] as const).map((status) => (
                    <Button
                      key={status}
                      type="button"
                      variant={entryData.recovery_status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEntryData(prev => ({ ...prev, recovery_status: status }))}
                      className="capitalize"
                    >
                      {status === 'better' && '🌟 Better'}
                      {status === 'same' && '😐 Same'}
                      {status === 'worse' && '😔 Worse'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mood, Energy, Sleep Scores */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mood_score" className="text-sm font-medium">Mood (1-10)</Label>
                  <Input
                    id="mood_score"
                    type="number"
                    min="1"
                    max="10"
                    value={entryData.mood_score}
                    onChange={(e) => setEntryData(prev => ({ ...prev, mood_score: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="energy_level" className="text-sm font-medium">Energy (1-10)</Label>
                  <Input
                    id="energy_level"
                    type="number"
                    min="1"
                    max="10"
                    value={entryData.energy_level}
                    onChange={(e) => setEntryData(prev => ({ ...prev, energy_level: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sleep_quality" className="text-sm font-medium">Sleep (1-10)</Label>
                  <Input
                    id="sleep_quality"
                    type="number"
                    min="1"
                    max="10"
                    value={entryData.sleep_quality}
                    onChange={(e) => setEntryData(prev => ({ ...prev, sleep_quality: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Activities */}
              <div>
                <Label className="text-sm font-medium">Activities Today</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { key: 'medication_adherence', label: '💊 Took Medication' },
                    { key: 'therapy_session', label: '🧠 Therapy Session' },
                    { key: 'exercise_completed', label: '🏃 Exercise' },
                    { key: 'social_connection', label: '👥 Social Connection' }
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      type="button"
                      variant={entryData[key as keyof typeof entryData] ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEntryData(prev => ({ 
                        ...prev, 
                        [key]: !prev[key as keyof typeof entryData] 
                      }))}
                      className="justify-start"
                    >
                      {entryData[key as keyof typeof entryData] ? (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={entryData.notes}
                  onChange={(e) => setEntryData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How are you feeling? Any thoughts or observations?"
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-2">
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Saving...' : 'Save Entry'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEntryForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Goals Section */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-heading flex items-center">
              <Target className="w-5 h-5 text-secondary mr-2" />
              Recovery Goals
            </CardTitle>
            <Button onClick={() => setShowGoalForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeGoals.length > 0 ? (
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-medium text-foreground">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground font-body">{goal.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {goal.current_value}/{goal.target_value} {goal.unit}
                      </p>
                      <div className="w-20 bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-secondary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-body text-sm">
              No active goals. Create your first recovery goal to start tracking progress!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Goal Form */}
      {showGoalForm && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center">
              <Target className="w-5 h-5 text-secondary mr-2" />
              Create New Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal_type" className="text-sm font-medium">Goal Type</Label>
                  <select
                    id="goal_type"
                    value={goalData.goal_type}
                    onChange={(e) => setGoalData(prev => ({ ...prev, goal_type: e.target.value as any }))}
                    className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="target_value" className="text-sm font-medium">Target Value</Label>
                  <Input
                    id="target_value"
                    type="number"
                    min="1"
                    value={goalData.target_value}
                    onChange={(e) => setGoalData(prev => ({ ...prev, target_value: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title" className="text-sm font-medium">Goal Title</Label>
                <Input
                  id="title"
                  value={goalData.title}
                  onChange={(e) => setGoalData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Exercise 3 times this week"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={goalData.description}
                  onChange={(e) => setGoalData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your goal and why it's important to you"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date" className="text-sm font-medium">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={goalData.start_date}
                    onChange={(e) => setGoalData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end_date" className="text-sm font-medium">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={goalData.end_date}
                    onChange={(e) => setGoalData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isAddingGoal}>
                  {isAddingGoal ? 'Creating...' : 'Create Goal'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowGoalForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center">
              <Award className="w-5 h-5 text-green-500 mr-2" />
              Completed Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-medium text-green-800 dark:text-green-200 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {goal.title}
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400 font-body">
                        Completed on {new Date(goal.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-2xl">🏆</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecoveryTracker;
