import { useState } from 'react';
import { Check, Clock, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  time: string;
  completed: boolean;
}

interface MedicationChecklistProps {
  onProgressUpdate: (completedCount: number, totalCount: number) => void;
}

const MedicationChecklist = ({ onProgressUpdate }: MedicationChecklistProps) => {
  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: '1',
      name: 'Sertraline (Zoloft)',
      dosage: '50mg',
      time: 'Morning',
      completed: false
    },
    {
      id: '2',
      name: 'Breathing Exercise',
      dosage: '10 minutes',
      time: 'Afternoon',
      completed: false
    },
    {
      id: '3',
      name: 'Mindfulness Meditation',
      dosage: '15 minutes',
      time: 'Evening',
      completed: true
    },
    {
      id: '4',
      name: 'Journal Writing',
      dosage: '5 minutes',
      time: 'Before Bed',
      completed: false
    },
    {
      id: '5',
      name: 'Light Exercise',
      dosage: '20 minutes',
      time: 'Morning',
      completed: true
    }
  ]);

  const toggleMedication = (id: string) => {
    setMedications(prev => {
      const updated = prev.map(med => 
        med.id === id ? { ...med, completed: !med.completed } : med
      );
      
      const completedCount = updated.filter(med => med.completed).length;
      onProgressUpdate(completedCount, updated.length);
      
      return updated;
    });
  };

  const completedCount = medications.filter(med => med.completed).length;
  const progressPercentage = Math.round((completedCount / medications.length) * 100);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-heading flex items-center">
          <Pill className="w-6 h-6 text-primary mr-2" />
          Today's Recovery Plan
        </CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-body">
            {completedCount} of {medications.length} completed
          </span>
          <span className="text-lg font-heading font-bold text-primary">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-mood h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {medications.map((medication) => (
          <div 
            key={medication.id}
            className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
              medication.completed 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'border-glass-border hover:bg-muted/50'
            }`}
            onClick={() => toggleMedication(medication.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  medication.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-muted-foreground hover:border-primary'
                }`}>
                  {medication.completed && <Check className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h4 className={`font-heading font-medium ${
                    medication.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-foreground'
                  }`}>
                    {medication.name}
                  </h4>
                  <p className="text-sm text-muted-foreground font-body">
                    {medication.dosage} • {medication.time}
                  </p>
                </div>
              </div>
              <Clock className={`w-4 h-4 ${
                medication.completed ? 'text-green-500' : 'text-muted-foreground'
              }`} />
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => {
            setMedications(prev => prev.map(med => ({ ...med, completed: false })));
            onProgressUpdate(0, medications.length);
          }}
        >
          Reset Daily Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicationChecklist;