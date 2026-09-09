import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, isDemoMode } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setIsSubmitting(false);
      showToast(signInError, 'error');
    } else {
      showToast('Logged in successfully!', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Visual background elements */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      {/* Main Container Card */}
      <Card className="w-full max-w-md border border-border-dark/60 p-8 shadow-2xl flex flex-col gap-6 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles size={20} className="text-bg-dark" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white tracking-tight mt-2">
            Welcome to SpekNova
          </h2>
          <p className="text-xs text-text-dark-muted font-medium">
            Log in to continue your placement practice
          </p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-[11px] text-primary font-semibold text-left">
            💡 Local Demo Auth active: Enter any email/password you register, or test with mock user sessions.
          </div>
        )}

        {/* Auth Error Banner */}
        {error && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 text-xs text-accent font-semibold text-left">
            ⚠️ {error}
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
            required
          />

          <div className="text-right">
            <span 
              onClick={() => showToast('Demo recover trigger: Reset links require configured SMTP.', 'info')} 
              className="text-xs text-text-dark-muted hover:text-primary transition-all font-medium cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight size={16} />}
          >
            Sign In
          </Button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center text-xs text-text-dark-muted font-medium border-t border-border-dark/40 pt-4 mt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Create an Account
          </Link>
        </div>

      </Card>
    </div>
  );
};
