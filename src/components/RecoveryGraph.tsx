import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3, Target, Award, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useWeeklyRecoveryData, useRecoveryEntries, useRecoveryGoals, useRecoveryMilestones } from '../hooks/useRecoveryTracking';
import { Button } from './ui/button';

interface RecoveryGraphProps {
  currentProgress: number;
}

const RecoveryGraph = ({ currentProgress }: RecoveryGraphProps) => {
  const { weeklyData, isLoading: weeklyLoading } = useWeeklyRecoveryData();
  const { recoveryEntries } = useRecoveryEntries();
  const { recoveryGoals } = useRecoveryGoals();
  const { recoveryMilestones } = useRecoveryMilestones();
  const [showDetails, setShowDetails] = useState(false);

  // Calculate statistics
  const averageProgress = weeklyData.length > 0 
    ? Math.round(weeklyData.reduce((sum, day) => sum + day.percentage, 0) / weeklyData.length)
    : 0;

  const completedGoals = recoveryGoals.filter(goal => goal.is_completed).length;
  const activeGoals = recoveryGoals.filter(goal => !goal.is_completed).length;
  const recentMilestones = recoveryMilestones.slice(0, 3);
  
  // Calculate streak (consecutive days with entries)
  const calculateStreak = () => {
    if (recoveryEntries.length === 0) return 0;
    
    const sortedEntries = [...recoveryEntries].sort((a, b) => 
      new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].entry_date);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressText = (percentage: number) => {
    if (percentage >= 80) return 'Excellent Progress';
    if (percentage >= 60) return 'Good Progress';
    if (percentage >= 40) return 'Fair Progress';
    return 'Needs Attention';
  };

  if (weeklyLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-heading flex items-center">
            <BarChart3 className="w-6 h-6 text-secondary mr-2" />
            Weekly Recovery Progress
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground font-body">
              Weekly Average: {averageProgress}%
            </span>
          </div>
          <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
            averageProgress >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
            averageProgress >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
            'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
          }`}>
            {getProgressText(averageProgress)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Bar Chart */}
          <div className="flex items-end justify-between h-40 bg-muted/30 rounded-lg p-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="relative w-8 bg-muted rounded-t-lg" style={{ height: '120px' }}>
                  <div 
                    className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${getBarColor(day.percentage)}`}
                    style={{ height: `${Math.max(day.percentage, 5)}%` }}
                  />
                  {day.day === 'Today' && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded-lg">
                      {day.percentage}%
                    </div>
                  )}
                </div>
                <span className={`text-xs font-body ${
                  day.day === 'Today' ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}>
                  {day.day}
                </span>
                <span className="text-xs text-muted-foreground">
                  {day.percentage}%
                </span>
                {day.entry && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Entry logged" />
                )}
              </div>
            ))}
          </div>

          {/* Progress Insights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-heading font-medium text-foreground">Today's Status</span>
              </div>
              <p className="text-lg font-bold text-primary">{currentProgress}%</p>
              <p className="text-xs text-muted-foreground font-body">
                {getProgressText(currentProgress)}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-secondary" />
                <span className="text-sm font-heading font-medium text-foreground">Current Streak</span>
              </div>
              <p className="text-lg font-bold text-secondary">{currentStreak} days</p>
              <p className="text-xs text-muted-foreground font-body">
                {currentStreak > 0 ? 'Keep it up!' : 'Start your streak today!'}
              </p>
            </div>
          </div>

          {/* Detailed Stats - Show when expanded */}
          {showDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-heading font-medium text-foreground">Goals Completed</span>
                  </div>
                  <p className="text-lg font-bold text-green-500">{completedGoals}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    {activeGoals} active goals
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-heading font-medium text-foreground">Recent Milestones</span>
                  </div>
                  <p className="text-lg font-bold text-yellow-500">{recentMilestones.length}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    Achievements unlocked
                  </p>
                </div>
              </div>

              {/* Recent Milestones */}
              {recentMilestones.length > 0 && (
                <div className="p-4 bg-gradient-accent/10 border border-accent/20 rounded-lg">
                  <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center">
                    <Award className="w-4 h-4 text-accent mr-2" />
                    Recent Achievements
                  </h4>
                  <div className="space-y-2">
                    {recentMilestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-body text-foreground font-medium">
                            {milestone.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(milestone.achieved_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-2xl">🏆</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Motivational Message */}
          <div className="p-4 bg-gradient-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm font-body text-foreground text-center">
              {currentProgress >= 80 ? 
                "🌟 Outstanding work! You're building strong healthy habits." :
                currentProgress >= 60 ?
                "💪 Great progress! Keep following your recovery plan." :
                "🤗 Every step counts. Small consistent actions lead to big changes."
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecoveryGraph;