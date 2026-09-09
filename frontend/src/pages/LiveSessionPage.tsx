import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Sparkles, 
  MessageSquare, 
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useToast } from '../components/Toast';

export const LiveSessionPage: React.FC = () => {
  const navigate = useSearchParams()[0];
  const mode = navigate.get('mode') || 'gd';
  const routerNavigate = useNavigate();
  const { showToast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const [videoActive, setVideoActive] = useState(true);
  const [audioActive, setAudioActive] = useState(true);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [liveObservations, setLiveObservations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Mock topic and participants based on selected mode
  const sessionConfig = {
    gd: {
      title: 'Group Discussion',
      topic: 'AI Ethics & Autonomous Vehicles',
      participants: [
        { name: 'Sarah Jenkins', role: 'Supportive', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { name: 'David K.', role: 'Critical', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { name: 'Moderator AI', role: 'Moderator', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' }
      ]
    },
    hr: {
      title: 'HR Behavioral Interview',
      topic: 'Handling Team Conflicts & Targets Alignment',
      participants: [
        { name: 'Director Harris', role: 'Interviewer', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100' }
      ]
    },
    tech: {
      title: 'Technical Architect Concept review',
      topic: 'Scalability limits of Microservices vs Monoliths',
      participants: [
        { name: 'Principal Engineer Roy', role: 'Evaluator', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }
      ]
    },
    speech: {
      title: 'Impromptu Speaking Exercise',
      topic: 'The Future of Renewable Energy Networks',
      participants: []
    }
  }[mode as 'gd' | 'hr' | 'tech' | 'speech'] || { title: 'Practice Session', topic: 'Communication Practise', participants: [] };

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Request camera and microphone permissions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      showToast('Camera and Microphone activated!', 'success');
    } catch (err) {
      console.warn('Webcam stream unavailable, using avatar simulation box.', err);
      showToast('No camera found or permission denied. Running in simulator mode.', 'info');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Simulator scripts generating mock spoken phrases and vision observations
  useEffect(() => {
    if (!isRecording) return;

    const mockPhrases = [
      "In my opinion, AI systems are key drivers for industrial scale. Basically, we need automation.",
      "Actually, that ignores the critical privacy parameters David raised. We must structure guardrails.",
      "Like, if you look at the resource costs, it is extremely expensive to run LLM workloads locally.",
      "I mean, autonomous vehicles will prevent 90% of current road casualties in the next decade.",
      "Basically, we must transition to clean networks. Uh, let's explore grid integration options."
    ];

    const mockObs = [
      "👁️ Eye Gaze deviation detected",
      "⚡ Speaking rate increased: WPM 165",
      "⚠️ Filler word burst: 'basically'",
      "👁️ Eye Contact maintained: Strong",
      "⏳ Pause length exceeded 3.5 seconds"
    ];

    const phraseTimer = setInterval(() => {
      const p = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      setTranscript((prev) => [...prev, p]);
    }, 8000);

    const obsTimer = setInterval(() => {
      const o = mockObs[Math.floor(Math.random() * mockObs.length)];
      setLiveObservations((prev) => [o, ...prev].slice(0, 8));
    }, 6000);

    return () => {
      clearInterval(phraseTimer);
      clearInterval(obsTimer);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Finish session
      handleFinishSession();
    } else {
      setIsRecording(true);
      setTranscript(["Session started. Speak clearly into your microphone."]);
      showToast("Practice session started! AI observations active.", "success");
    }
  };

  const handleFinishSession = async () => {
    setIsSubmitting(true);
    showToast("Analyzing session metrics and AI response transcripts...", "info");

    const fullTranscript = transcript.join(" ");

    try {
      // Submit session logs to backend
      const res = await fetch('http://localhost:8000/api/v1/sessions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer demo-session-token`
        },
        body: JSON.stringify({
          mode,
          topic: sessionConfig.topic,
          duration_seconds: timer,
          transcript_text: fullTranscript || "This was an excellent speech focusing on scalability parameters.",
          eye_contact_percentage: 82
        })
      });

      if (res.ok) {
        showToast("Analysis complete! Loading report...", "success");
        // Create mockup session index or route directly
        routerNavigate('/reports');
      } else {
        throw new Error("Evaluation upload failed");
      }
    } catch (err) {
      showToast("Saving session locally in Demo mode...", "info");
      // Fallback: save to mock local storage if API server isn't running
      const dummyId = Math.random().toString(36).substring(2, 9);
      const dummyReport = {
        id: dummyId,
        mode,
        topic: sessionConfig.topic,
        duration_seconds: timer,
        metrics: {
          eye_contact_percentage: 78,
          words_per_minute: 135,
          filler_words_count: 5,
          pauses_count: 3,
          grammar_score: 84,
          content_relevance_score: 90
        },
        report: {
          overall_score: 83,
          grammar_score: 84,
          content_relevance_score: 90,
          strengths: ["Strong opening structural layout", "Excellent pacing"],
          weaknesses: ["Eye contact drifted when describing system bottlenecks"],
          personalized_feedback: "Demonstrated clear organization. Practice reducing facial deviations.",
          recommendations: ["Maintain lens focus", "Keep pacing below 140 WPM"],
          replay_events: [
            { timestamp_seconds: 5, category: "GOOD", label: "Strong Opening", description: "Clear vocal introduction" },
            { timestamp_seconds: 15, category: "IMPROVEMENT", label: "Eye-drift", description: "Drifted gaze" }
          ]
        }
      };
      
      const localHistory = localStorage.getItem('speknova_mock_history');
      const parsedHistory = localHistory ? JSON.parse(localHistory) : [];
      parsedHistory.unshift(dummyReport);
      localStorage.setItem('speknova_mock_history', JSON.stringify(parsedHistory));
      
      routerNavigate(`/reports?id=${dummyId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full pb-20">
      
      {/* Session Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Badge variant="primary" size="md" className="mb-2">
            Live {sessionConfig.title}
          </Badge>
          <h2 className="font-display font-extrabold text-2xl text-white">
            {sessionConfig.topic}
          </h2>
        </div>
        <div className="flex items-center gap-4 bg-card-dark border border-border-dark px-4 py-2.5 rounded-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
          <span className="font-display font-bold text-xl text-white">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Webcam / Video participants */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* User Webcam Screen */}
            <div className="relative aspect-video rounded-2xl bg-black border border-border-dark/80 overflow-hidden shadow-lg flex items-center justify-center">
              {videoActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-text-dark-muted flex flex-col items-center gap-2">
                  <VideoOff size={32} />
                  <span className="text-xs font-semibold">Video Feed Off</span>
                </div>
              )}
              
              {/* Badge info overlay */}
              <div className="absolute bottom-4 left-4 bg-bg-dark/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border-dark text-[10px] font-bold text-white uppercase tracking-wider">
                You (Alex Rivera)
              </div>
            </div>

            {/* AI Participant Screens */}
            {sessionConfig.participants.map((part, idx) => (
              <div 
                key={idx} 
                className="relative aspect-video rounded-2xl bg-card-dark/40 border border-border-dark/80 overflow-hidden shadow-lg flex items-center justify-center"
              >
                <img 
                  src={part.avatar} 
                  alt={part.name} 
                  className="w-16 h-16 rounded-full object-cover border border-primary/20 blur-[0.5px] hover:blur-none transition-all duration-300"
                />
                
                <div className="absolute bottom-4 left-4 bg-bg-dark/85 backdrop-blur px-3 py-1.5 rounded-lg border border-border-dark text-[10px] font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {part.name} <span className="text-primary-hover font-semibold">({part.role})</span>
                </div>
              </div>
            ))}

            {/* Empty state if speech / solo round */}
            {sessionConfig.participants.length === 0 && (
              <div className="aspect-video rounded-2xl border border-dashed border-border-dark/80 bg-card-dark/10 flex flex-col items-center justify-center p-6 text-center text-text-dark-muted">
                <Sparkles size={24} className="text-primary/40 animate-pulse mb-2" />
                <span className="text-xs font-semibold">Solo Presentation Mode</span>
                <span className="text-[10px] mt-1 max-w-xs leading-relaxed">No AI co-participants. Focus fully on eye contact and speech delivery indicators.</span>
              </div>
            )}

          </div>

          {/* Transcript / Spoken sentences panel */}
          <Card className="flex flex-col gap-4 border border-border-dark/50 flex-1 min-h-[200px]">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <MessageSquare className="text-primary" size={18} /> Live Speech Transcript
            </h3>
            <div className="flex-1 overflow-y-auto max-h-[160px] flex flex-col gap-2.5 pr-2">
              {transcript.map((sentence, idx) => (
                <div key={idx} className="text-xs bg-card-dark/30 border border-border-dark/30 p-2.5 rounded-xl text-left leading-relaxed">
                  {sentence}
                </div>
              ))}
              {transcript.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs text-text-dark-muted font-medium py-10">
                  Awaiting audio capture stream. Click Start Session.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: AI observations tracker & Session controllers */}
        <div className="flex flex-col gap-6">
          
          {/* Controllers Card */}
          <Card className="border border-border-dark/50 flex flex-col gap-4 p-5">
            <span className="text-[10px] font-bold text-text-dark-muted uppercase tracking-widest">
              Session Actions
            </span>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant={isRecording ? "glow" : "primary"} 
                className="w-full justify-center" 
                leftIcon={isRecording ? <Square size={16} /> : <Play size={16} />}
                onClick={toggleRecording}
                isLoading={isSubmitting}
              >
                {isRecording ? "Complete & Analyze" : "Start Session"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border-dark/30 pt-4">
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={videoActive ? <Video size={14} /> : <VideoOff size={14} />}
                onClick={() => setVideoActive(!videoActive)}
              >
                {videoActive ? "Mute Cam" : "Show Cam"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={audioActive ? <Mic size={14} /> : <MicOff size={14} />}
                onClick={() => setAudioActive(!audioActive)}
              >
                {audioActive ? "Mute Mic" : "Show Mic"}
              </Button>
            </div>
          </Card>

          {/* AI Landmark/Vision Observations Panel */}
          <Card className="flex-1 flex flex-col gap-4 border border-border-dark/50 min-h-[300px]">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <AlertCircle className="text-secondary" size={18} /> Observation Signals
            </h3>
            
            <div className="flex-1 overflow-y-auto max-h-[320px] flex flex-col gap-2.5 pr-2">
              {liveObservations.map((obs, idx) => (
                <div 
                  key={idx} 
                  className={`
                    p-3 rounded-xl border text-[11px] font-semibold text-left transition-all duration-300
                    ${obs.includes("⚠️") ? "border-accent/20 bg-accent/5 text-accent" : 
                      obs.includes("👁️ Eye Contact maintained") ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" :
                      "border-border-dark bg-card-dark/30 text-text-dark"}
                  `}
                >
                  {obs}
                </div>
              ))}
              {liveObservations.length === 0 && (
                <div className="h-full flex items-center justify-center text-xs text-text-dark-muted font-medium py-16 text-center px-4">
                  Vision indicators (gaze, pose deviations) will show here dynamically during live capture.
                </div>
              )}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
