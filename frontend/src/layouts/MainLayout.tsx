import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  User, 
  Settings, 
  Bell, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Practice', path: '/practice', icon: <MessageSquare size={20} /> },
    { name: 'Progress', path: '/progress', icon: <TrendingUp size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-bg-dark text-text-dark flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-border-dark/50 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles size={16} className="text-bg-dark" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-wider text-gradient animate-glow">
            SPEKNOVA
          </span>
        </Link>

        {/* Action Items */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-xl border border-border-dark bg-card-dark/30 hover:border-primary/50 text-text-dark-muted hover:text-text-dark transition-all cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-bg-dark"></span>
          </button>
          
          <Link to="/profile" className="flex items-center gap-3 pl-2 border-l border-border-dark/50">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
              alt="User Profile" 
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary/45 hover:ring-primary transition-all duration-300"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-text-dark">Alex Rivera</p>
              <p className="text-[10px] text-text-dark-muted font-medium">Student / User</p>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-text-dark-muted hover:text-text-dark cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border-dark/50 bg-card-dark/20 p-6 gap-6 shrink-0">
          <div className="text-left px-2">
            <span className="text-[10px] font-bold text-text-dark-muted uppercase tracking-widest">
              Navigation
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300
                  ${isActive(item.path) 
                    ? 'bg-gradient-to-r from-primary/15 to-secondary/5 text-primary border-l-4 border-primary pl-3.5 shadow-sm' 
                    : 'text-text-dark-muted hover:text-text-dark hover:bg-card-dark/30'}
                `}
              >
                <span className={isActive(item.path) ? 'text-primary' : 'text-text-dark-muted'}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Quick Stats Widget */}
          <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border-dark/30 text-left">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">
              Placement Readiness
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-2xl text-text-dark">78%</span>
              <span className="text-[10px] text-emerald-400 font-bold font-sans">+3% this week</span>
            </div>
            <div className="w-full bg-border-dark h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[73px] z-30 bg-bg-dark/95 backdrop-blur-md md:hidden flex flex-col p-6 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-base transition-all
                    ${isActive(item.path) 
                      ? 'bg-primary/10 text-primary border-l-4 border-primary pl-3' 
                      : 'text-text-dark-muted hover:text-text-dark'}
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-border-dark/50 py-2 px-4 flex justify-around items-center">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`
              flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-all
              ${isActive(item.path) ? 'text-primary' : 'text-text-dark-muted'}
            `}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        <Link
          to="/profile"
          className={`
            flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-all
            ${isActive('/profile') ? 'text-primary' : 'text-text-dark-muted'}
          `}
        >
          <User size={20} />
          <span>Profile</span>
        </Link>
      </nav>
      {/* Spacer to prevent bottom nav overlay */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};
