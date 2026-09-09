import React from 'react';
import { Card } from '../components/Card';
import { MessageSquare, TrendingUp, FileText, User, Settings } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  icon: React.ReactNode;
  desc: string;
}

const PlaceholderPage: React.FC<PlaceholderProps> = ({ title, icon, desc }) => {
  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl">
      <div>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white flex items-center gap-3">
          <span className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
            {icon}
          </span>
          {title}
        </h2>
        <p className="text-xs text-text-dark-muted font-medium mt-1">
          {desc}
        </p>
      </div>

      <Card className="border border-border-dark/50 flex flex-col items-center justify-center p-12 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-card-dark border border-border-dark/80 flex items-center justify-center text-primary/40 animate-pulse">
          {icon}
        </div>
        <h3 className="font-display font-bold text-lg text-white">Feature coming in the next Phase!</h3>
        <p className="text-xs text-text-dark-muted font-medium max-w-sm leading-relaxed">
          The SpekNova communication analyzer and simulation engine is undergoing phase-by-phase implementation. This feature will be active soon.
        </p>
      </Card>
    </div>
  );
};

export const PracticeHubPage = () => <PlaceholderPage title="Practice Hub" icon={<MessageSquare />} desc="Configure your simulations, select topics, and launch live AI sessions." />;
export const ProgressPage = () => <PlaceholderPage title="Communication Progress" icon={<TrendingUp />} desc="Track historical scores, consistency streaks, and placement readiness growth." />;
export const ReportsPage = () => <PlaceholderPage title="Session Reports" icon={<FileText />} desc="Analyze eye contact, filler words, speech clarity, and verbal arguments." />;
export const ProfilePage = () => <PlaceholderPage title="User Profile" icon={<User />} desc="Manage your personal info, placement focus areas, and achievements." />;
export const SettingsPage = () => <PlaceholderPage title="Settings" icon={<Settings />} desc="Configure API keys, camera permissions, theme parameters, and audio defaults." />;
