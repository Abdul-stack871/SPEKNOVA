import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Video, Mic, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Video className="text-primary" size={24} />,
      title: "Real-time AI Simulations",
      desc: "Simulate live group discussions and technical or HR interviews with intelligent AI personas."
    },
    {
      icon: <Mic className="text-secondary" size={24} />,
      title: "Speech & Audio Analytics",
      desc: "Detect speech clarity, pacing, pause lengths, and filler-word usage dynamically."
    },
    {
      icon: <Sparkles className="text-accent" size={24} />,
      title: "Interactive AI Coaching",
      desc: "Receive observations on gaze, gestures, tone, vocabulary quality, and placement readiness."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark flex flex-col font-sans overflow-hidden relative">
      
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none"></div>

      {/* Main Header / Splash Top */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles size={16} className="text-bg-dark" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-wider text-gradient">
            SPEKNOVA
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          Launch App
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center max-w-5xl mx-auto w-full z-10 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-wide uppercase mb-2">
            <Sparkles size={12} /> Next-Gen AI Interview Coaching
          </div>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-none">
            Master the Art of <br />
            <span className="text-gradient">Communication & Placement</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-lg text-text-dark-muted font-medium leading-relaxed mt-4">
            Practice in immersive AI-driven simulation rooms. Perfect your body language, speaking pace, and content structure. Gain professional confidence with real-time feedback.
          </p>

          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Button 
              variant="primary" 
              size="lg" 
              rightIcon={<ArrowRight size={18} />}
              onClick={() => navigate('/dashboard')}
            >
              Get Started for Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.section 
          id="features"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24"
        >
          {features.map((feat, idx) => (
            <Card key={idx} hoverEffect={true} className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
              <div className="w-12 h-12 rounded-xl bg-card-dark border border-border-dark flex items-center justify-center shadow-md">
                {feat.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-white">{feat.title}</h3>
              <p className="text-xs text-text-dark-muted font-medium leading-relaxed">{feat.desc}</p>
            </Card>
          ))}
        </motion.section>

        {/* Platform stats / Quick facts */}
        <div className="w-full mt-20 border-t border-border-dark/50 pt-10 flex flex-wrap justify-center gap-12 text-center">
          <div>
            <p className="font-display font-extrabold text-3xl text-gradient">20+</p>
            <p className="text-xs font-bold text-text-dark-muted tracking-wide uppercase mt-1">AI Mock Personas</p>
          </div>
          <div>
            <p className="font-display font-extrabold text-3xl text-gradient">98%</p>
            <p className="text-xs font-bold text-text-dark-muted tracking-wide uppercase mt-1">Accuracy in Filler Words</p>
          </div>
          <div>
            <p className="font-display font-extrabold text-3xl text-gradient">&lt; 3 Secs</p>
            <p className="text-xs font-bold text-text-dark-muted tracking-wide uppercase mt-1">Real-time Vision Scoring</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-border-dark/30 mt-auto flex justify-between items-center text-xs text-text-dark-muted font-medium">
        <span>© 2026 SpekNova Platform. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="hover:text-text-dark transition-all cursor-pointer">Privacy Policy</span>
          <span className="hover:text-text-dark transition-all cursor-pointer">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
};
