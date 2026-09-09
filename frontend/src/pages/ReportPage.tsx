import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Pause, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useToast } from '../components/Toast';

interface ReplayEvent {
  timestamp_seconds: number;
  category: 'GOOD' | 'IMPROVEMENT';
  label: string;
  description: string;
}

export const ReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [session, setSession] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  


  // Load session report details
  useEffect(() => {
    // Attempt loading from local mock storage history
    const history = localStorage.getItem('speknova_mock_history');
    if (history) {
      const parsed = JSON.parse(history);
      const match = sessionId ? parsed.find((s: any) => s.id === sessionId) : parsed[0];
      if (match) {
        setSession(match);
        return;
      }
    }

    // Default mock report state if history is empty
    setSession({
      id: 'default-report',
      mode: 'gd',
      topic: 'AI Ethics & Autonomous Vehicles',
      duration_seconds: 45,
      metrics: {
        eye_contact_percentage: 82,
        words_per_minute: 140,
        filler_words_count: 4,
        pauses_count: 2,
        grammar_score: 88,
        content_relevance_score: 92
      },
      report: {
        overall_score: 85,
        grammar_score: 88,
        content_relevance_score: 92,
        strengths: ["Strong introduction delivery", "Structured transition flow"],
        weaknesses: ["Drifted eye contact when reviewing metrics", "Vocal fillers: 'basically'"],
        personalized_feedback: "Alex, you demonstrated good organization. Practice looking straight into the lens.",
        recommendations: ["Maintain central eye contact", "Focus on slow breathing"],
        replay_events: [
          { timestamp_seconds: 5, category: "GOOD", label: "Strong Opening", description: "Clear structural introduction hook" },
          { timestamp_seconds: 15, category: "IMPROVEMENT", label: "Filler Word", description: "Used 'basically' as a transition word" },
          { timestamp_seconds: 28, category: "IMPROVEMENT", label: "Eye contact loss", description: "Shifted gaze downwards" },
          { timestamp_seconds: 38, category: "GOOD", label: "Strong Conclusion", description: "Effective topic resolution statement" }
        ]
      }
    });
  }, [sessionId]);

  // Video Replay Sync
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= (session?.duration_seconds || 45)) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, session]);

  const handleTimelineJump = (seconds: number) => {
    setPlaybackTime(seconds);
    setIsPlaying(true);
    showToast(`Jumped to event at ${formatTime(seconds)}`, 'info');
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!session) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-7xl mx-auto w-full pb-20">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          leftIcon={<ArrowLeft size={14} />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
        <span className="text-xs text-text-dark-muted font-bold">
          Session ID: {session.id}
        </span>
      </div>

      {/* Main Grid: Evaluation Metrics & Video Replay */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Score details and feedback cards (2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Score & Feedback */}
          <Card className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-card-dark to-border-dark/20 border border-border-dark/50">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Sparkles size={12} /> Communication report card
              </span>
              <h2 className="font-display font-extrabold text-2xl text-white">
                {session.topic}
              </h2>
              <p className="text-xs text-text-dark-muted font-medium mt-2 leading-relaxed">
                {session.report.personalized_feedback}
              </p>
            </div>
            
            <div className="flex flex-col items-center shrink-0 w-full md:w-auto p-4 rounded-2xl bg-card-dark/60 border border-border-dark/60">
              <span className="text-[10px] font-bold text-text-dark-muted uppercase tracking-wider">Overall Score</span>
              <h3 className="font-display font-extrabold text-5xl text-gradient animate-glow mt-1">
                {session.report.overall_score}%
              </h3>
              <Badge variant="success" className="mt-2.5">
                Practice Complete
              </Badge>
            </div>
          </Card>

          {/* Breakdown stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-border-dark/50 p-4 text-center">
              <span className="text-[10px] font-bold text-text-dark-muted uppercase">Eye Gaze Focus</span>
              <p className="font-display font-extrabold text-2xl text-white mt-1.5">{session.metrics.eye_contact_percentage}%</p>
              <Badge variant="primary" className="mt-2">Good</Badge>
            </Card>
            
            <Card className="border border-border-dark/50 p-4 text-center">
              <span className="text-[10px] font-bold text-text-dark-muted uppercase">Speaking Pace</span>
              <p className="font-display font-extrabold text-2xl text-white mt-1.5">{session.metrics.words_per_minute} WPM</p>
              <Badge variant="success" className="mt-2">Steady</Badge>
            </Card>

            <Card className="border border-border-dark/50 p-4 text-center">
              <span className="text-[10px] font-bold text-text-dark-muted uppercase">Vocal Fillers</span>
              <p className="font-display font-extrabold text-2xl text-white mt-1.5">{session.metrics.filler_words_count} count</p>
              <Badge variant="danger" className="mt-2">Improve</Badge>
            </Card>
          </div>

          {/* Strengths and Weaknesses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <Card className="border border-emerald-500/20 bg-emerald-500/5 p-5">
              <h4 className="font-display font-bold text-sm text-emerald-400 flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} /> Strengths
              </h4>
              <ul className="flex flex-col gap-2">
                {session.report.strengths.map((str: string, idx: number) => (
                  <li key={idx} className="text-xs text-text-dark-muted font-medium flex items-start gap-1.5 leading-relaxed">
                    <span className="text-emerald-400 mt-0.5">•</span> {str}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Weaknesses */}
            <Card className="border-accent/20 bg-accent/5 p-5">
              <h4 className="font-display font-bold text-sm text-accent flex items-center gap-2 mb-3">
                <XCircle size={16} /> Improvement Areas
              </h4>
              <ul className="flex flex-col gap-2">
                {session.report.weaknesses.map((weak: string, idx: number) => (
                  <li key={idx} className="text-xs text-text-dark-muted font-medium flex items-start gap-1.5 leading-relaxed">
                    <span className="text-accent mt-0.5">•</span> {weak}
                  </li>
                ))}
              </ul>
            </Card>

          </div>

          {/* Recommendations checklist */}
          <Card className="border border-border-dark/50 p-5">
            <h4 className="font-display font-bold text-sm text-white mb-3">
              Personalized Coaching Strategy
            </h4>
            <div className="flex flex-col gap-3">
              {session.report.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="flex gap-3 text-xs font-semibold p-2.5 rounded-lg bg-card-dark/30 border border-border-dark/30">
                  <span className="text-primary mt-0.5"><TrendingUp size={14} /></span>
                  <span className="text-text-dark leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Right Side: Replay timeline with markers (1 column) */}
        <div className="flex flex-col gap-6">
          
          {/* Replay Screen */}
          <Card className="border border-border-dark/50 p-0 overflow-hidden flex flex-col gap-4">
            
            {/* Mock Player Box */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {/* Dummy avatar and visual visualizer representing replay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center flex-col gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  alt="Alex Rivera"
                  className="w-16 h-16 rounded-full object-cover border border-primary/20 shadow-md"
                />
                <span className="text-[10px] font-bold text-text-dark-muted tracking-widest uppercase mt-2">
                  Session Replay feed
                </span>
              </div>
              
              {/* Playback time Overlay */}
              <div className="absolute bottom-4 left-4 bg-bg-dark/80 px-2 py-1 rounded text-[10px] font-bold text-white">
                {formatTime(playbackTime)} / {formatTime(session.duration_seconds)}
              </div>
            </div>

            {/* Video Controls bar */}
            <div className="px-4 pb-4 flex justify-between items-center border-b border-border-dark/50">
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={isPlaying ? <Pause size={14} /> : <Play size={14} />}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <div className="flex gap-2 text-text-dark-muted font-bold text-[10px] items-center"><Clock size={12} /> Timeline Replay</div>
            </div>

            {/* AI timeline events list */}
            <div className="px-4 pb-5 flex flex-col gap-2.5 max-h-[300px] overflow-y-auto">
              <span className="text-[10px] font-bold text-text-dark-muted uppercase tracking-wider block mb-1">
                AI Timeline Markers
              </span>

              {session.report.replay_events.map((event: ReplayEvent, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleTimelineJump(event.timestamp_seconds)}
                  className={`
                    p-3 rounded-xl border text-left flex justify-between items-start gap-4 cursor-pointer hover:border-primary/50 transition-all
                    ${event.category === 'GOOD' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-accent/20 bg-accent/5'}
                  `}
                >
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${event.category === 'GOOD' ? 'bg-emerald-400' : 'bg-accent'}`}></span>
                      {event.label}
                    </span>
                    <span className="text-[10px] text-text-dark-muted font-semibold leading-relaxed">
                      {event.description}
                    </span>
                  </div>
                  
                  <span className="text-[10px] font-bold font-display text-text-dark-muted whitespace-nowrap pt-0.5">
                    {formatTime(event.timestamp_seconds)}
                  </span>
                </button>
              ))}
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
};
