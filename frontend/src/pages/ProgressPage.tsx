import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Legend 
} from 'recharts';
import { Card } from '../components/Card';
import { 
  TrendingUp, 
  Award, 
  Sparkles, 
  Video, 
  Mic
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  
  // Mock data for Recharts Area charts
  const scoreTrends = [
    { name: 'Mon', score: 72, gaze: 65, filler: 8 },
    { name: 'Tue', score: 75, gaze: 70, filler: 6 },
    { name: 'Wed', score: 78, gaze: 72, filler: 5 },
    { name: 'Thu', score: 76, gaze: 68, filler: 6 },
    { name: 'Fri', score: 82, gaze: 78, filler: 4 },
    { name: 'Sat', score: 85, gaze: 82, filler: 3 }
  ];

  const modeScores = [
    { name: 'Group Discussion', average: 78, target: 85 },
    { name: 'HR Interview', average: 82, target: 90 },
    { name: 'Tech Interview', average: 74, target: 85 },
    { name: 'Public Speaking', average: 88, target: 90 }
  ];

  const achievements = [
    { id: 'first_session', title: 'First Step', desc: 'Complete your very first practice session', icon: <Sparkles className="text-primary" size={20} />, date: 'Aug 18, 2026' },
    { id: 'confident_speaker', title: 'Confident Speaker', desc: 'Sustain a clarity score of 85%+', icon: <Mic className="text-secondary" size={20} />, date: 'Aug 21, 2026' },
    { id: 'eye_contact', title: 'Eye Contact Progress', desc: 'Sustain 80%+ eye-gaze indicators', icon: <Video className="text-emerald-400" size={20} />, date: 'Aug 22, 2026' }
  ];

  return (
    <div className="flex flex-col gap-8 text-left max-w-7xl mx-auto w-full pb-20">
      
      {/* Title Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white flex items-center gap-3">
          <span className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
            <TrendingUp size={24} />
          </span>
          Placement Readiness Progress
        </h2>
        <p className="text-xs text-text-dark-muted font-medium mt-1">
          Monitor your cumulative speaking scores, weekly filler word trends, and unlocked badges
        </p>
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Chart (2 columns) */}
        <Card className="lg:col-span-2 border border-border-dark/50 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-border-dark/40">
            <div>
              <h3 className="font-display font-bold text-base text-white">Weekly Progress Trends</h3>
              <p className="text-[10px] text-text-dark-muted font-medium mt-0.5">Overall score growth compared with Gaze approximation metrics</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-text-dark-muted">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary/80"></span> Score</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary/80"></span> Gaze Focus</span>
            </div>
          </div>

          <div className="h-64 w-full text-xs font-semibold mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrends}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGaze" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121624', border: '1px solid #1e2538', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
                <Area type="monotone" dataKey="gaze" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGaze)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Filler Word Decay Card (1 column) */}
        <Card className="border border-border-dark/50 p-6 flex flex-col gap-4">
          <div className="pb-2 border-b border-border-dark/40 text-left">
            <h3 className="font-display font-bold text-base text-white">Filler Word Count Decline</h3>
            <p className="text-[10px] text-text-dark-muted font-medium mt-0.5">Average count detected per practice session</p>
          </div>

          <div className="h-64 w-full text-xs font-semibold mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121624', border: '1px solid #1e2538', borderRadius: '12px' }}
                />
                <Bar dataKey="filler" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Mode Comparison charts & Achievements list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Practice Modes Comparisons (2 columns) */}
        <Card className="lg:col-span-2 border border-border-dark/50 p-6 flex flex-col gap-4">
          <div className="pb-2 border-b border-border-dark/40 text-left">
            <h3 className="font-display font-bold text-base text-white">Performance by Practice Mode</h3>
            <p className="text-[10px] text-text-dark-muted font-medium mt-0.5">Your average score vs. standard target score limits</p>
          </div>

          <div className="h-60 w-full text-xs font-semibold mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modeScores} margin={{ left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[50, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#121624', border: '1px solid #1e2538' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="average" name="Your Average Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Placement Target Score" fill="#1e2538" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Achievements badgework (1 column) */}
        <Card className="border border-border-dark/50 p-5 flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-white border-b border-border-dark/40 pb-2 flex items-center gap-2">
            <Award className="text-primary" size={18} /> Achievements Unlocked
          </h3>
          
          <div className="flex flex-col gap-3">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className="flex items-center gap-3.5 p-3 rounded-xl bg-card-dark/30 border border-border-dark/30 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-card-dark border border-border-dark flex items-center justify-center shrink-0 shadow-md">
                  {ach.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                    <span className="text-[9px] text-text-dark-muted font-medium">{ach.date}</span>
                  </div>
                  <p className="text-[10px] text-text-dark-muted font-medium leading-relaxed mt-0.5">
                    {ach.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};
