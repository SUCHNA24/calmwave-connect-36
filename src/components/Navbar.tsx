import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart, MessageCircle, BarChart3, BookOpen, Phone, Home, HeartHandshake } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              className="flex items-center space-x-1 text-slate-700 hover:text-primary transition-colors duration-300 dark:text-white dark:hover:text-primary-glow font-medium"
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
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            className="p-2 text-slate-700 hover:text-primary transition-colors dark:text-white dark:hover:text-primary-glow"
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
                className="flex items-center space-x-2 p-2 text-slate-700 hover:text-primary transition-colors duration-300 dark:text-white dark:hover:text-primary-glow font-medium"
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
          </div>
        </div>
      )}
    </nav>
  );
}