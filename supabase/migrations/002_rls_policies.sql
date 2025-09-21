-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_resource_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_checkins ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Mood entries policies
CREATE POLICY "Users can view their own mood entries" ON public.mood_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries" ON public.mood_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries" ON public.mood_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries" ON public.mood_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view their own journal entries" ON public.journal_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries" ON public.journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" ON public.journal_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" ON public.journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON public.conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view messages from their conversations" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = chat_messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to their conversations" ON public.chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = chat_messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update messages in their conversations" ON public.chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = chat_messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages from their conversations" ON public.chat_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = chat_messages.conversation_id 
            AND conversations.user_id = auth.uid()
        )
    );

-- Crisis entries policies
CREATE POLICY "Users can view their own crisis entries" ON public.crisis_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crisis entries" ON public.crisis_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crisis entries" ON public.crisis_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crisis entries" ON public.crisis_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Resources policies (public read access)
CREATE POLICY "Anyone can view active resources" ON public.resources
    FOR SELECT USING (is_active = true);

-- User resource bookmarks policies
CREATE POLICY "Users can view their own bookmarks" ON public.user_resource_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON public.user_resource_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.user_resource_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- Medication entries policies
CREATE POLICY "Users can view their own medication entries" ON public.medication_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medication entries" ON public.medication_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication entries" ON public.medication_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication entries" ON public.medication_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Medication checkins policies
CREATE POLICY "Users can view checkins for their medications" ON public.medication_checkins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.medication_entries 
            WHERE medication_entries.id = medication_checkins.medication_entry_id 
            AND medication_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert checkins for their medications" ON public.medication_checkins
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.medication_entries 
            WHERE medication_entries.id = medication_checkins.medication_entry_id 
            AND medication_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update checkins for their medications" ON public.medication_checkins
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.medication_entries 
            WHERE medication_entries.id = medication_checkins.medication_entry_id 
            AND medication_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete checkins for their medications" ON public.medication_checkins
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.medication_entries 
            WHERE medication_entries.id = medication_checkins.medication_entry_id 
            AND medication_entries.user_id = auth.uid()
        )
    );
