import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import ParticleCursor from '../components/ParticleCursor';
import AnimateIn from '../components/AnimateIn';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const AuthPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, { full_name: fullName });
        if (error) throw error;
        alert('Account created successfully! Please check your email to verify your account.');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        // Redirect will happen automatically via auth state change
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <ParticleCursor />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <AnimateIn>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
                Welcome to CalmWave Connect
              </h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
                Sign in to access your personal mental health journey and track your wellness.
              </p>
            </div>
          </AnimateIn>

          <div className="max-w-md mx-auto">
            <AnimateIn delay={0.2}>
              <Card className="glass-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-heading">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </CardTitle>
                  <CardDescription>
                    {isSignUp 
                      ? 'Join CalmWave Connect to start your wellness journey'
                      : 'Welcome back! Sign in to continue your journey'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </Button>
                  </form>


                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isSignUp 
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Sign up"
                      }
                    </button>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
