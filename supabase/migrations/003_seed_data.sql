-- Insert sample mental health resources
INSERT INTO public.resources (title, description, url, category, language) VALUES
-- English Resources
('National Suicide Prevention Lifeline', '24/7 crisis support and suicide prevention services', 'https://suicidepreventionlifeline.org/', 'crisis', 'en'),
('Crisis Text Line', 'Text HOME to 741741 for 24/7 crisis support', 'https://www.crisistextline.org/', 'crisis', 'en'),
('Mental Health America', 'Resources and tools for mental health support', 'https://www.mhanational.org/', 'general', 'en'),
('NAMI (National Alliance on Mental Illness)', 'Support groups and educational resources', 'https://www.nami.org/', 'support', 'en'),
('SAMHSA National Helpline', '24/7 treatment referral and information service', 'https://www.samhsa.gov/find-help/national-helpline', 'crisis', 'en'),
('Headspace', 'Meditation and mindfulness app', 'https://www.headspace.com/', 'wellness', 'en'),
('Calm', 'Sleep, meditation and relaxation app', 'https://www.calm.com/', 'wellness', 'en'),
('BetterHelp', 'Online therapy and counseling services', 'https://www.betterhelp.com/', 'therapy', 'en'),
('Talkspace', 'Online therapy platform', 'https://www.talkspace.com/', 'therapy', 'en'),
('Mindfulness-Based Stress Reduction', 'Evidence-based mindfulness program', 'https://www.umassmed.edu/cfm/mindfulness-based-programs/', 'wellness', 'en'),

-- Hindi/Indian Resources
('iCall Psychosocial Helpline', 'Mental health counseling in Hindi and English', 'https://icallhelpline.org/', 'crisis', 'hi'),
('KIRAN Mental Health Helpline', '24/7 mental health support helpline', '1800-599-0019', 'crisis', 'hi'),
('Vandrevala Foundation', 'Mental health support and counseling', 'https://www.vandrevalafoundation.com/', 'support', 'hi'),
('Sangath', 'Mental health research and services', 'https://www.sangath.in/', 'general', 'hi'),
('The Live Love Laugh Foundation', 'Mental health awareness and support', 'https://www.thelivelovelaughfoundation.org/', 'general', 'hi'),
('Mindroot', 'Mental health support for students', 'https://mindroot.org/', 'support', 'hi'),
('Manas Foundation', 'Mental health and psychosocial support', 'https://www.manas.org.in/', 'support', 'hi'),
('Pratyush', 'Mental health awareness and support', 'https://pratyush.org/', 'general', 'hi'),
('Mental Health India', 'Comprehensive mental health resources', 'https://www.mentalhealthindia.org/', 'general', 'hi'),
('Aasra', 'Suicide prevention and crisis intervention', 'https://www.aasra.info/', 'crisis', 'hi'),

-- Wellness and Self-Help Resources
('Breathing Exercises Guide', 'Simple breathing techniques for anxiety and stress', NULL, 'wellness', 'en'),
('Progressive Muscle Relaxation', 'Step-by-step relaxation technique', NULL, 'wellness', 'en'),
('Gratitude Journal Template', 'Daily gratitude practice guide', NULL, 'wellness', 'en'),
('Sleep Hygiene Tips', 'Guidelines for better sleep quality', NULL, 'wellness', 'en'),
('Stress Management Techniques', 'Evidence-based stress reduction methods', NULL, 'wellness', 'en'),
('Mindful Eating Guide', 'Eating with awareness and intention', NULL, 'wellness', 'en'),
('Digital Detox Plan', 'Reducing screen time for mental health', NULL, 'wellness', 'en'),
('Exercise for Mental Health', 'Physical activity recommendations for mood', NULL, 'wellness', 'en'),
('Social Connection Tips', 'Building and maintaining healthy relationships', NULL, 'wellness', 'en'),
('Goal Setting for Mental Health', 'Setting realistic and achievable wellness goals', NULL, 'wellness', 'en'),

-- Crisis Resources
('Safety Planning Template', 'Creating a personal safety plan', NULL, 'crisis', 'en'),
('Emergency Contacts Template', 'Important numbers and contacts', NULL, 'crisis', 'en'),
('Warning Signs of Crisis', 'Recognizing when to seek immediate help', NULL, 'crisis', 'en'),
('Coping Strategies for Crisis', 'Immediate techniques for crisis situations', NULL, 'crisis', 'en'),
('Support System Mapping', 'Identifying your support network', NULL, 'crisis', 'en');

-- Insert sample medication entries (these will be user-specific, so we'll just create the structure)
-- Users will add their own medications through the app

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
