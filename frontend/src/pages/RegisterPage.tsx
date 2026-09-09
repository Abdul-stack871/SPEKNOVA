import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signUp, isDemoMode } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError);
      setIsSubmitting(false);
      showToast(signUpError, 'error');
    } else {
      showToast('Account registered successfully!', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      {/* Register container card */}
      <Card className="w-full max-w-md border border-border-dark/60 p-8 shadow-2xl flex flex-col gap-6 relative z-10">
        
        {/* Brand header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles size={20} className="text-bg-dark" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white tracking-tight mt-2">
            Create an Account
          </h2>
          <p className="text-xs text-text-dark-muted font-medium">
            Get instant AI analysis for your interviews
          </p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-[11px] text-primary font-semibold text-left">
            💡 Local Demo Auth active: Your account session details will be securely saved inside your local browser storage.
          </div>
        )}

        {/* Error panel */}
        {error && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 text-xs text-accent font-semibold text-left">
            ⚠️ {error}
          </div>
        )}

        {/* Form controls */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Alex Rivera"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User size={16} />}
            required
          />
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

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight size={16} />}
          >
            Register Account
          </Button>
        </form>

        {/* Toggle link */}
        <div className="text-center text-xs text-text-dark-muted font-medium border-t border-border-dark/40 pt-4 mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Log In
          </Link>
        </div>

      </Card>
    </div>
  );
};
