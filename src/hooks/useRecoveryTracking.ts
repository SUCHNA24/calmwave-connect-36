import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export interface RecoveryEntry {
  id: string;
  user_id: string;
  entry_date: string;
  recovery_status: 'better' | 'same' | 'worse';
  mood_score?: number;
  energy_level?: number;
  sleep_quality?: number;
  medication_adherence: boolean;
  therapy_session: boolean;
  exercise_completed: boolean;
  social_connection: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RecoveryGoal {
  id: string;
  user_id: string;
  goal_type: 'weekly' | 'monthly' | 'custom';
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit?: string;
  start_date: string;
  end_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecoveryMilestone {
  id: string;
  user_id: string;
  milestone_type: 'streak' | 'goal_completion' | 'improvement' | 'custom';
  title: string;
  description?: string;
  achieved_date: string;
  metadata?: any;
  created_at: string;
}

export interface WeeklyRecoveryData {
  date: string;
  day: string;
  percentage: number;
  entry?: RecoveryEntry;
}

export const useRecoveryEntries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchRecoveryEntries = async (): Promise<RecoveryEntry[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('recovery_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const addRecoveryEntry = async (entry: Omit<RecoveryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('recovery_entries')
      .upsert({
        ...entry,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateRecoveryEntry = async (id: string, updates: Partial<RecoveryEntry>) => {
    const { data, error } = await supabase
      .from('recovery_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteRecoveryEntry = async (id: string) => {
    const { error } = await supabase
      .from('recovery_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const {
    data: recoveryEntries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['recoveryEntries', user?.id],
    queryFn: fetchRecoveryEntries,
    enabled: !!user,
  });

  const addEntryMutation = useMutation({
    mutationFn: addRecoveryEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recoveryEntries', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['weeklyRecoveryData', user?.id] });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RecoveryEntry> }) =>
      updateRecoveryEntry(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recoveryEntries', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['weeklyRecoveryData', user?.id] });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: deleteRecoveryEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recoveryEntries', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['weeklyRecoveryData', user?.id] });
    },
  });

  return {
    recoveryEntries,
    isLoading,
    error,
    addRecoveryEntry: addEntryMutation.mutateAsync,
    updateRecoveryEntry: updateEntryMutation.mutateAsync,
    deleteRecoveryEntry: deleteEntryMutation.mutateAsync,
    isAdding: addEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
  };
};

export const useWeeklyRecoveryData = () => {
  const { user } = useAuth();

  const fetchWeeklyData = async (): Promise<WeeklyRecoveryData[]> => {
    if (!user) return [];

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    const { data: entries, error } = await supabase
      .from('recovery_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_date', startOfWeek.toISOString().split('T')[0])
      .lte('entry_date', today.toISOString().split('T')[0])
      .order('entry_date', { ascending: true });

    if (error) throw error;

    // Generate weekly data with entries
    const weeklyData: WeeklyRecoveryData[] = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const entry = entries?.find(e => e.entry_date === dateStr);
      let percentage = 0;
      
      if (entry) {
        // Calculate percentage based on mood, energy, sleep, and activities
        const moodScore = entry.mood_score || 5;
        const energyScore = entry.energy_level || 5;
        const sleepScore = entry.sleep_quality || 5;
        const activityBonus = [
          entry.medication_adherence,
          entry.therapy_session,
          entry.exercise_completed,
          entry.social_connection
        ].filter(Boolean).length * 5; // 5 points per activity
        
        percentage = Math.min(100, Math.round(
          ((moodScore + energyScore + sleepScore) / 3) * 10 + activityBonus
        ));
      }
      
      weeklyData.push({
        date: dateStr,
        day: i === 6 ? 'Today' : days[i],
        percentage,
        entry
      });
    }

    return weeklyData;
  };

  const {
    data: weeklyData = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['weeklyRecoveryData', user?.id],
    queryFn: fetchWeeklyData,
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    weeklyData,
    isLoading,
    error,
  };
};

export const useRecoveryGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchRecoveryGoals = async (): Promise<RecoveryGoal[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('recovery_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const addRecoveryGoal = async (goal: Omit<RecoveryGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('recovery_goals')
      .insert({
        ...goal,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateRecoveryGoal = async (id: string, updates: Partial<RecoveryGoal>) => {
    const { data, error } = await supabase
      .from('recovery_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteRecoveryGoal = async (id: string) => {
    const { error } = await supabase
      .from('recovery_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const {
    data: recoveryGoals = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['recoveryGoals', user?.id],
    queryFn: fetchRecoveryGoals,
    enabled: !!user,
  });

  const addGoalMutation = useMutation({
    mutationFn: addRecoveryGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recoveryGoals', user?.id] });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RecoveryGoal> }) =>
      updateRecoveryGoal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recoveryGoals', user?.id] });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: deleteRecoveryGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recoveryGoals', user?.id] });
    },
  });

  return {
    recoveryGoals,
    isLoading,
    error,
    addRecoveryGoal: addGoalMutation.mutateAsync,
    updateRecoveryGoal: updateGoalMutation.mutateAsync,
    deleteRecoveryGoal: deleteGoalMutation.mutateAsync,
    isAdding: addGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,
  };
};

export const useRecoveryMilestones = () => {
  const { user } = useAuth();

  const fetchRecoveryMilestones = async (): Promise<RecoveryMilestone[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('recovery_milestones')
      .select('*')
      .eq('user_id', user.id)
      .order('achieved_date', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const {
    data: recoveryMilestones = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['recoveryMilestones', user?.id],
    queryFn: fetchRecoveryMilestones,
    enabled: !!user,
  });

  return {
    recoveryMilestones,
    isLoading,
    error,
  };
};
