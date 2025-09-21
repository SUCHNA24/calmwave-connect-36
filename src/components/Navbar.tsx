import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart, MessageCircle, BarChart3, BookOpen, Phone, Home, HeartHandshake, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user, signOut } = useAuth();

  // Fetch user profile to get the name
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setUserProfile(data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get display name (prefer full_name, fallback to email username)
  const getDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Get username part of email
    }
    return 'User';
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
    { href: '/mood', label: 'Mood Tracker', icon: BarChart3 },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/resources', label: 'Resources', icon: BookOpen },
    { href: '/support', label: 'Support', icon: HeartHandshake },
  ];

  return (
    <nav className="glass-nav mx-4 my-2 p-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-heading font-bold text-primary">WellnessAI</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center space-x-1 text-slate-900 hover:text-primary transition-colors duration-300 dark:text-white dark:hover:text-primary-glow font-semibold"
            >
              <item.icon className="w-4 h-4" />
              <span className="font-body">{item.label}</span>
            </Link>
          ))}
          <Link
            to="/crisis"
            className="bg-gradient-accent text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-1"
          >
            <Phone className="w-4 h-4" />
            <span>Crisis Support</span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{getDisplayName()}</span>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
          )}
          
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            className="p-2 text-slate-900 hover:text-primary transition-colors dark:text-white dark:hover:text-primary-glow font-semibold"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-glass-border">
          <div className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-2 p-2 text-slate-900 hover:text-primary transition-colors duration-300 dark:text-white dark:hover:text-primary-glow font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-body">{item.label}</span>
              </Link>
            ))}
            <Link
              to="/crisis"
              className="bg-gradient-accent text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="w-4 h-4" />
              <span>Crisis Support</span>
            </Link>
            
            {user ? (
              <div className="pt-4 border-t border-glass-border">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>{getDisplayName()}</span>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}