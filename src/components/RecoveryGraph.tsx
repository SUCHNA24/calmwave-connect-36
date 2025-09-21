import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DayProgress {
  day: string;
  percentage: number;
  date: string;
}

interface RecoveryGraphProps {
  currentProgress: number;
}

const RecoveryGraph = ({ currentProgress }: RecoveryGraphProps) => {
  const [weeklyData, setWeeklyData] = useState<DayProgress[]>([
    { day: 'Mon', percentage: 85, date: '2024-01-15' },
    { day: 'Tue', percentage: 75, date: '2024-01-16' },
    { day: 'Wed', percentage: 90, date: '2024-01-17' },
    { day: 'Thu', percentage: 60, date: '2024-01-18' },
    { day: 'Fri', percentage: 95, date: '2024-01-19' },
    { day: 'Sat', percentage: 70, date: '2024-01-20' },
    { day: 'Today', percentage: currentProgress, date: new Date().toISOString().split('T')[0] }
  ]);

  useEffect(() => {
    setWeeklyData(prev => 
      prev.map((day, index) => 
        index === prev.length - 1 ? { ...day, percentage: currentProgress } : day
      )
    );
  }, [currentProgress]);

  const averageProgress = Math.round(
    weeklyData.reduce((sum, day) => sum + day.percentage, 0) / weeklyData.length
  );

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

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-heading flex items-center">
          <BarChart3 className="w-6 h-6 text-secondary mr-2" />
          Weekly Recovery Progress
        </CardTitle>
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
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-sm font-heading font-medium text-foreground">Best Day</span>
              </div>
              <p className="text-lg font-bold text-secondary">
                {Math.max(...weeklyData.slice(0, -1).map(d => d.percentage))}%
              </p>
              <p className="text-xs text-muted-foreground font-body">
                Keep up the momentum!
              </p>
            </div>
          </div>

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