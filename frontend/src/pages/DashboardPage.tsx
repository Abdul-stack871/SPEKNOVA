import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Code, 
  Volume2, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  Award,
  Video,
  Play,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { SkeletonText } from '../components/LoadingSkeleton';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Modals & Tabs states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPracticeMode, setSelectedPracticeMode] = useState('gd');
  const [activeTab, setActiveTab] = useState('recent');
  const [isLoadingTabContent, setIsLoadingTabContent] = useState(false);

  // Trigger loading state briefly when switching tabs to demonstrate loading skeletons
  useEffect(() => {
    setIsLoadingTabContent(true);
    const timer = setTimeout(() => {
      setIsLoadingTabContent(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const practiceModes = [
    {
      id: 'gd',
      title: 'Group Discussion',
      icon: <Users className="text-primary" size={24} />,
      desc: 'Participate in AI-moderated discussions on current topics, debating with interactive AI personas.',
      duration: '10-15 mins',
      difficulty: 'Medium' as const
    },
    {
      id: 'hr',
      title: 'HR Interview Simulation',
      icon: <Briefcase className="text-secondary" size={24} />,
      desc: 'Practice classic behavioral questions, body language, and communication style simulations.',
      duration: '15-20 mins',
      difficulty: 'Easy' as const
    },
    {
      id: 'tech',
      title: 'Technical Interview',
      icon: <Code className="text-emerald-400" size={24} />,
      desc: 'Solve system design, algorithm explanations, or framework conceptual challenges live.',
      duration: '25-30 mins',
      difficulty: 'Hard' as const
    },
    {
      id: 'speech',
      title: 'Public Speaking Practice',
      icon: <Volume2 className="text-accent" size={24} />,
      desc: 'Deliver an impromptu speech on standard topics and track pacing, tone variation, and pause rates.',
      duration: '3-5 mins',
      difficulty: 'Easy' as const
    }
  ];

  const recentSessions = [
    { mode: 'HR Interview', date: 'Yesterday', score: 82, duration: '12m 40s', feedback: 'Great response length, reduce filler words.' },
    { mode: 'Group Discussion', date: '3 days ago', score: 75, duration: '15m 10s', feedback: 'Strong points raised, try taking leadership roles.' },
    { mode: 'Public Speaking', date: '1 week ago', score: 88, duration: '4m 12s', feedback: 'Excellent voice variation and eye contact.' }
  ];

  const recommendations = [
    { topic: 'AI Ethics in Medicine', type: 'GD Simulation', duration: '15 mins', reason: 'To improve logical structuring' },
    { topic: 'Tell me about yourself', type: 'HR Interview', duration: '10 mins', reason: 'High filler word rate detected here last time' },
    { topic: 'Explain React Concurrent Mode', type: 'Tech Concept', duration: '20 mins', reason: 'Placement target aligned' }
  ];

  const handleStartPractice = () => {
    setIsModalOpen(false);
    showToast(`Launching ${selectedPracticeMode.toUpperCase()} practice setup...`, 'success');
    navigate(`/practice?mode=${selectedPracticeMode}`);
  };

  const handleViewAll = () => {
    showToast('Loading full activity log...', 'info');
    navigate('/reports');
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Welcome Banner */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-card-dark to-border-dark/30 border border-border-dark/50 rounded-3xl p-6 md:p-8">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Sparkles size={12} /> Dashboard overview
          </span>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white">
            Welcome back, Alex!
          </h2>
          <p className="text-xs text-text-dark-muted font-medium mt-1">
            You're in the top <span className="text-secondary font-semibold">15%</span> of speakers this week. Ready to practice?
          </p>
        </div>
        <Button 
          variant="primary" 
          rightIcon={<Play size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Start Practice Session
        </Button>
      </section>

      {/* Main Grid: Practice Modes & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Practice Hub (Left 2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white">Practice Hub</h3>
            <span onClick={() => { showToast('Redirecting to Practice Hub...', 'info'); navigate('/practice'); }} className="text-xs text-primary font-semibold hover:underline cursor-pointer">
              View All
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {practiceModes.map((mode) => (
              <Card 
                key={mode.id} 
                hoverEffect={true} 
                className="flex flex-col justify-between gap-6 cursor-pointer border border-border-dark/50"
                onClick={() => {
                  setSelectedPracticeMode(mode.id);
                  setIsModalOpen(true);
                }}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-card-dark border border-border-dark/80 flex items-center justify-center">
                      {mode.icon}
                    </div>
                    <Badge variant={mode.difficulty === 'Hard' ? 'danger' : mode.difficulty === 'Medium' ? 'primary' : 'success'}>
                      {mode.difficulty}
                    </Badge>
                  </div>
                  <h4 className="font-display font-bold text-base text-white mt-4">{mode.title}</h4>
                  <p className="text-xs text-text-dark-muted font-medium mt-1 leading-relaxed">{mode.desc}</p>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-text-dark-muted font-bold border-t border-border-dark/30 pt-3.5 mt-2">
                  <span className="flex items-center gap-1"><Clock size={12} /> {mode.duration}</span>
                  <span className="flex items-center gap-1"><Video size={12} /> AI Simulation</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Widget metrics (Right 1 column) */}
        <div className="flex flex-col gap-6">
          <h3 className="font-display font-bold text-xl text-white">Performance Metrics</h3>
          
          <Card className="flex flex-col gap-6 border border-border-dark/50">
            {/* Placement readiness details */}
            <div className="flex justify-between items-center pb-4 border-b border-border-dark/45">
              <div>
                <p className="text-xs font-semibold text-text-dark-muted uppercase tracking-wider">Placement Readiness</p>
                <h4 className="font-display font-extrabold text-3xl text-white mt-1">78%</h4>
              </div>
              <div 
                onClick={() => showToast('Opening historical trends analysis', 'info')}
                className="w-12 h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400 cursor-pointer hover:bg-emerald-500/10 transition-all"
              >
                <ArrowUpRight size={24} />
              </div>
            </div>

            {/* Sub score lists */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-dark-muted">Speech & Clarity</span>
                  <span className="text-white">82%</span>
                </div>
                <div className="w-full bg-border-dark h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-dark-muted">Eye Contact / Gaze</span>
                  <span className="text-white">68%</span>
                </div>
                <div className="w-full bg-border-dark h-1 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-dark-muted">Content Structure</span>
                  <span className="text-white">74%</span>
                </div>
                <div className="w-full bg-border-dark h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '74%' }}></div>
                </div>
              </div>
            </div>

            {/* Achievements highlight */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <Award size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Next Milestone</p>
                <p className="text-[10px] text-text-dark-muted font-medium mt-0.5">Complete 3 Group Discussions to unlock "GD Expert" badge.</p>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Tabs and Session History / Recommended panel */}
      <section className="flex flex-col gap-5 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-dark/50 pb-2">
          <Tabs 
            tabs={[
              { id: 'recent', label: 'Recent Session Analytics', icon: <FileText size={16} /> },
              { id: 'recommended', label: 'AI Practice Recommendations', icon: <TrendingUp size={16} /> }
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id)}
            className="border-none"
          />
          {activeTab === 'recent' && (
            <button 
              onClick={handleViewAll}
              className="text-xs text-primary font-semibold hover:underline text-left pl-4 cursor-pointer"
            >
              View Full History
            </button>
          )}
        </div>

        {/* Tab Content Display */}
        <Card className="p-0 overflow-hidden border border-border-dark/50 min-h-[180px] flex flex-col justify-center">
          {isLoadingTabContent ? (
            <div className="p-6 flex flex-col gap-4">
              <SkeletonText lines={4} />
            </div>
          ) : activeTab === 'recent' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card-dark/60 border-b border-border-dark text-text-dark-muted font-semibold text-xs tracking-wider uppercase text-left">
                    <th className="px-6 py-4">Practice Mode</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 hidden md:table-cell">Key AI Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark/50">
                  {recentSessions.map((session, idx) => (
                    <tr key={idx} className="hover:bg-card-dark/30 transition-all">
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {session.mode}
                      </td>
                      <td className="px-6 py-4 text-text-dark-muted font-medium">{session.date}</td>
                      <td className="px-6 py-4 text-text-dark-muted font-medium">{session.duration}</td>
                      <td className="px-6 py-4">
                        <Badge variant={session.score >= 80 ? 'success' : 'primary'} size="sm">
                          {session.score}/100
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-text-dark-muted font-medium hidden md:table-cell max-w-sm truncate">
                        {session.feedback}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card-dark/60 border-b border-border-dark text-text-dark-muted font-semibold text-xs tracking-wider uppercase text-left">
                    <th className="px-6 py-4">Suggested Topic</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Reason for Recommendation</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark/50">
                  {recommendations.map((rec, idx) => (
                    <tr key={idx} className="hover:bg-card-dark/30 transition-all">
                      <td className="px-6 py-4 font-semibold text-white">{rec.topic}</td>
                      <td className="px-6 py-4 text-text-dark-muted font-medium">{rec.type}</td>
                      <td className="px-6 py-4 text-text-dark-muted font-medium">{rec.duration}</td>
                      <td className="px-6 py-4 text-text-dark-muted font-medium">{rec.reason}</td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary-hover p-1"
                          onClick={() => {
                            showToast(`Selected topic: "${rec.topic}"`, 'info');
                            setIsModalOpen(true);
                          }}
                        >
                          Launch
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* Modal - Quick Session configuration dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Quick Practice Session Configuration"
      >
        <div className="flex flex-col gap-6">
          <p className="text-xs text-text-dark-muted leading-relaxed">
            Select a mode to set up an intelligent AI session. SpekNova AI will configure mock participants, generate topic guidelines, and turn on observations.
          </p>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-dark-muted uppercase tracking-wider">Select practice mode</span>
            <div className="grid grid-cols-2 gap-3">
              {practiceModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedPracticeMode(mode.id)}
                  className={`
                    p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer
                    ${selectedPracticeMode === mode.id 
                      ? 'border-primary bg-primary/10 text-white' 
                      : 'border-border-dark bg-card-dark/30 text-text-dark-muted hover:border-border-dark/80 hover:text-text-dark'}
                  `}
                >
                  <span className="text-sm font-semibold">{mode.title}</span>
                  <Badge variant={mode.difficulty === 'Hard' ? 'danger' : mode.difficulty === 'Medium' ? 'primary' : 'success'} className="self-start">
                    {mode.difficulty}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-dark-muted uppercase tracking-wider">Session configuration</span>
            <div className="p-3.5 rounded-xl bg-card-dark/50 border border-border-dark/60 text-xs flex flex-col gap-2.5">
              <div className="flex justify-between">
                <span className="text-text-dark-muted">Observation indicators:</span>
                <span className="text-white font-medium">Eye Gaze, Speech Pacing, Filler Words</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dark-muted">Mock AI Co-participants:</span>
                <span className="text-white font-medium">{selectedPracticeMode === 'gd' ? '3 AI Personas (Supportive, Critic, Moderator)' : '1 AI Interlocutor'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end border-t border-border-dark/40 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStartPractice}>
              Start Session
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
