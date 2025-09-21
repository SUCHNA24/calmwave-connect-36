import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Custom hook for mood entries
export const useMoodEntries = () => {
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMoodEntries = async () => {
    if (!user) {
      setMoodEntries([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mood entries');
    } finally {
      setLoading(false);
    }
  };

  const addMoodEntry = async (entry: {
    mood_level: number;
    emotions: string[];
    triggers: string[];
    additional_thoughts?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_level: entry.mood_level,
          emotions: entry.emotions,
          triggers: entry.triggers,
          additional_thoughts: entry.additional_thoughts || null,
        })
        .select()
        .single();

      if (error) throw error;
      setMoodEntries(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add mood entry');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  return {
    moodEntries,
    loading,
    error,
    addMoodEntry,
    refetch: fetchMoodEntries
  };
};

// Custom hook for journal entries
export const useJournalEntries = () => {
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchJournalEntries = async () => {
    if (!user) {
      setJournalEntries([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJournalEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  };

  const addJournalEntry = async (entry: {
    title: string;
    content: string;
    mood: 'happy' | 'good' | 'okay' | 'low' | 'sad';
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
        })
        .select()
        .single();

      if (error) throw error;
      setJournalEntries(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add journal entry');
      throw err;
    }
  };

  const updateJournalEntry = async (id: string, updates: {
    title?: string;
    content?: string;
    mood?: 'happy' | 'good' | 'okay' | 'low' | 'sad';
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setJournalEntries(prev => 
        prev.map(entry => entry.id === id ? data : entry)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update journal entry');
      throw err;
    }
  };

  const deleteJournalEntry = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setJournalEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete journal entry');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchJournalEntries();
    }
  }, [user]);

  return {
    journalEntries,
    loading,
    error,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    refetch: fetchJournalEntries
  };
};

// Custom hook for chat conversations
export const useChatConversations = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: title || 'New Conversation',
        })
        .select()
        .single();

      if (error) throw error;
      setConversations(prev => [data, ...prev]);
      setCurrentConversation(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      throw err;
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    }
  };

  const addMessage = async (conversationId: string, content: string, sender: 'user' | 'ai') => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          content,
          sender,
        })
        .select()
        .single();

      if (error) throw error;
      setMessages(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add message');
      throw err;
    }
  };

  const startNewConversation = async () => {
    const conversation = await createConversation();
    setMessages([]);
    return conversation;
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
    }
  }, [currentConversation]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    createConversation,
    addMessage,
    startNewConversation,
    setCurrentConversation,
    refetch: fetchConversations
  };
};
