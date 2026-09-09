import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  User, 
  Mail, 
  Briefcase, 
  LogOut, 
  Save, 
  CheckCircle,
  Video,
  Award
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [targetIndustry, setTargetIndustry] = useState(user?.user_metadata?.target_industry || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      showToast('Name field cannot be empty.', 'error');
      return;
    }

    setIsSaving(true);
    const { error } = await updateProfile(fullName, targetIndustry);
    setIsSaving(false);

    if (error) {
      showToast(error, 'error');
    } else {
      showToast('Profile updated successfully!', 'success');
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      showToast(error, 'error');
    } else {
      showToast('Logged out successfully.', 'success');
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left max-w-4xl">
      
      {/* Page Title Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white flex items-center gap-3">
          <span className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
            <User size={24} />
          </span>
          User Profile
        </h2>
        <p className="text-xs text-text-dark-muted font-medium mt-1">
          Manage your personal metadata, target placement industries, and authentication sessions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar and Quick Stats */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card className="flex flex-col items-center text-center p-6 border border-border-dark/50 gap-4">
            <img 
              src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'} 
              alt="Profile Avatar" 
              className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/50"
            />
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {user?.user_metadata?.full_name || 'Alex Rivera'}
              </h3>
              <p className="text-xs text-text-dark-muted font-semibold mt-0.5">{user?.email}</p>
            </div>

            <div className="w-full border-t border-border-dark/50 pt-4 mt-2 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-text-dark-muted flex items-center gap-1.5"><Video size={14} /> Sessions</span>
                <span className="text-white">12 completed</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-text-dark-muted flex items-center gap-1.5"><Award size={14} /> Achievements</span>
                <span className="text-white">3 unlocked</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4 text-accent border-accent/20 hover:border-accent hover:bg-accent/5"
              leftIcon={<LogOut size={14} />}
              onClick={handleSignOut}
            >
              Log Out
            </Button>
          </Card>
        </div>

        {/* Right Side: Profile update form */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="p-6 border border-border-dark/50 text-left">
            <h3 className="font-display font-bold text-base text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-primary" size={18} /> Update Profile Credentials
            </h3>

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User size={16} />}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={user?.email || ''}
                  leftIcon={<Mail size={16} />}
                  disabled
                  className="opacity-50 cursor-not-allowed"
                />
              </div>

              <Input
                label="Target Industry / Focus Area"
                type="text"
                placeholder="Technology, Finance, Consulting, Management"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                leftIcon={<Briefcase size={16} />}
              />

              <div className="flex justify-end border-t border-border-dark/30 pt-4 mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  leftIcon={<Save size={16} />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

      </div>

    </div>
  );
};
