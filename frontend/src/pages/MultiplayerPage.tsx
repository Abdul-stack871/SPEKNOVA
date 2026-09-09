import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { 
  Users, 
  Plus, 
  ArrowRight, 
  Play, 
  UserPlus,
  Video,
  LogOut,
  Sparkles
} from 'lucide-react';

interface Participant {
  user_id: string;
  name: string;
  email: string;
}

export const MultiplayerPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Screen View state: 'MENU' | 'LOBBY' | 'SESSION'
  const [viewState, setViewState] = useState<'MENU' | 'LOBBY' | 'SESSION'>('MENU');
  
  // Create / Join variables
  const [topic, setTopic] = useState('AI Regulation and Global Privacy Guidelines');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Live session messages
  const [messages, setMessages] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState('');

  const socketRef = useRef<WebSocket | null>(null);

  // Connect to room websocket
  const connectWebSocket = (code: string) => {
    setIsConnecting(true);
    const wsUrl = `ws://localhost:8000/ws/${code}`;
    
    try {
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnecting(false);
        setViewState('LOBBY');
        showToast(`Connected to room ${code}!`, 'success');
      };

      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        
        if (payload.event === 'participant_joined') {
          // Add peer mock details
          setParticipants((prev) => {
            const exists = prev.find((p) => p.user_id === payload.user_id);
            if (exists) return prev;
            return [...prev, {
              user_id: payload.user_id || Math.random().toString(36).substring(2, 9),
              name: payload.name || "Peer Participant",
              email: payload.email || "peer@example.com"
            }];
          });
          showToast(payload.message, 'info');
        } else if (payload.event === 'session_start') {
          setViewState('SESSION');
          showToast('Discussion started by host!', 'success');
        } else if (payload.event === 'speech_started') {
          setMessages((prev) => [...prev, `${payload.name}: ${payload.text}`]);
        } else if (payload.event === 'participant_left') {
          showToast(payload.message, 'info');
        }
      };

      socket.onerror = () => {
        // Fallback for offline local dev demo mode runs
        setIsConnecting(false);
        setViewState('LOBBY');
        showToast('WebSocket server offline. Running Lobby in local offline simulator mode.', 'info');
      };

      socket.onclose = () => {
        socketRef.current = null;
      };

    } catch (err) {
      setIsConnecting(false);
      setViewState('LOBBY');
    }
  };

  const handleCreateRoom = async () => {
    if (!topic) {
      showToast('Please specify a discussion topic.', 'error');
      return;
    }
    
    setIsConnecting(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/rooms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo'
        },
        body: JSON.stringify({ topic })
      });

      if (res.ok) {
        const data = await res.json();
        setRoomCode(data.room_code);
        setIsHost(true);
        setParticipants([{
          user_id: user?.id || 'host-id',
          name: user?.user_metadata?.full_name || 'Alex Rivera',
          email: user?.email || 'alex@example.com'
        }]);
        connectWebSocket(data.room_code);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Fallback
      const code = 'SPK' + Math.floor(100 + Math.random() * 900);
      setRoomCode(code);
      setIsHost(true);
      setParticipants([
        { user_id: user?.id || 'host-id', name: user?.user_metadata?.full_name || 'Alex Rivera', email: user?.email || 'alex@example.com' },
        { user_id: 'peer-1', name: 'John Doe', email: 'john@example.com' },
        { user_id: 'peer-2', name: 'Sarah Connor', email: 'sarah@example.com' }
      ]);
      setIsConnecting(false);
      setViewState('LOBBY');
      showToast('Created local offline lobby room.', 'success');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCodeInput) {
      showToast('Please enter a 6-digit room code.', 'error');
      return;
    }

    const code = roomCodeInput.toUpperCase();
    setIsConnecting(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/rooms/${code}`, {
        headers: { 'Authorization': 'Bearer demo' }
      });
      if (res.ok) {
        const data = await res.json();
        setRoomCode(data.room_code);
        setIsHost(false);
        setTopic(data.topic);
        setParticipants(data.participants);
        connectWebSocket(data.room_code);
        
        // Broadcast join via socket
        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({
            event: 'participant_joined',
            user_id: user?.id,
            name: user?.user_metadata?.full_name || 'Guest User',
            email: user?.email,
            message: `${user?.user_metadata?.full_name || 'Guest User'} has joined the room.`
          }));
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      // Offline fallback join
      setRoomCode(code);
      setIsHost(false);
      setTopic('Local Offline Practice Room');
      setParticipants([
        { user_id: 'host-id', name: 'Alex Rivera (Host)', email: 'alex@example.com' },
        { user_id: user?.id || 'your-id', name: user?.user_metadata?.full_name || 'Guest User', email: user?.email || 'guest@example.com' }
      ]);
      setIsConnecting(false);
      setViewState('LOBBY');
      showToast('Joined local offline lobby room.', 'success');
    }
  };

  const handleStartSession = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ event: 'session_start' }));
    } else {
      setViewState('SESSION');
    }
  };

  const handleSendSpeech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage) return;

    const payload = {
      event: 'speech_started',
      name: user?.user_metadata?.full_name || 'You',
      text: chatMessage
    };

    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      setMessages((prev) => [...prev, `${payload.name}: ${payload.text}`]);
    }
    setChatMessage('');
  };

  const handleLeaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setViewState('MENU');
    setRoomCode('');
    setParticipants([]);
    setMessages([]);
    showToast('Left discussion lobby.', 'info');
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full pb-20">
      
      {/* 1. Menu Selection View */}
      {viewState === 'MENU' && (
        <div className="max-w-4xl flex flex-col gap-8">
          <div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Users size={24} />
              </span>
              Multiplayer Practice Rooms
            </h2>
            <p className="text-xs text-text-dark-muted font-medium mt-1">
              Create a custom debate lobby or join an existing peer session using code parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Create Room Box */}
            <Card className="border border-border-dark/50 p-6 flex flex-col gap-5 justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Plus className="text-primary" size={18} /> Host New Session Lobbies
                </h3>
                <p className="text-xs text-text-dark-muted font-medium leading-relaxed mt-2">
                  Generate a join code, define customized topic prompts, and invite peers for collaborative scoring.
                </p>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <Input
                  label="Topic for Discussion"
                  type="text"
                  placeholder="e.g. Electric Vehicle Subsidies"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Button 
                  variant="primary" 
                  className="w-full" 
                  onClick={handleCreateRoom}
                  isLoading={isConnecting}
                >
                  Create Room
                </Button>
              </div>
            </Card>

            {/* Join Room Box */}
            <Card className="border border-border-dark/50 p-6 flex flex-col gap-5 justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <UserPlus className="text-secondary" size={18} /> Enter Join Room Code
                </h3>
                <p className="text-xs text-text-dark-muted font-medium leading-relaxed mt-2">
                  Type the 6-character code parameters shared by your coach or peers to enter their active lobby.
                </p>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <Input
                  label="6-Digit Join Code"
                  type="text"
                  placeholder="e.g. SPK123"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value)}
                />
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  onClick={handleJoinRoom}
                  isLoading={isConnecting}
                >
                  Join Lobby
                </Button>
              </div>
            </Card>

          </div>
        </div>
      )}

      {/* 2. Room Lobby View */}
      {viewState === 'LOBBY' && (
        <div className="max-w-4xl flex flex-col gap-8">
          
          {/* Lobby title card */}
          <Card className="bg-gradient-to-tr from-card-dark to-border-dark/20 border border-border-dark/50 p-6 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">
                Lobby Active
              </span>
              <h2 className="font-display font-extrabold text-xl text-white">
                {topic}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-text-dark-muted uppercase tracking-wider block">Join Code</span>
              <span className="font-display font-extrabold text-2xl text-gradient tracking-widest">{roomCode}</span>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Participants list */}
            <Card className="md:col-span-2 border border-border-dark/50 p-5 flex flex-col gap-4">
              <h3 className="font-display font-bold text-sm text-white border-b border-border-dark/40 pb-2">
                Participants ({participants.length})
              </h3>
              
              <div className="flex flex-col gap-3">
                {participants.map((part) => (
                  <div key={part.user_id} className="flex justify-between items-center p-3 rounded-xl bg-card-dark/30 border border-border-dark/30 text-xs font-semibold">
                    <span className="text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {part.name}
                    </span>
                    <span className="text-text-dark-muted">{part.email}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions Panel */}
            <Card className="border border-border-dark/50 p-5 flex flex-col gap-4 justify-between h-fit">
              <div>
                <span className="text-[10px] font-bold text-text-dark-muted uppercase tracking-widest">
                  Lobby Admin Actions
                </span>
                <p className="text-[10px] text-text-dark-muted mt-2 leading-relaxed">
                  {isHost ? "You are the Host. Start the live debate once all participants have entered." : "Waiting for host to initiate the discussion session."}
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                {isHost && (
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    leftIcon={<Play size={14} />}
                    onClick={handleStartSession}
                  >
                    Start Session
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full text-accent border-accent/20 hover:border-accent hover:bg-accent/5" 
                  leftIcon={<LogOut size={14} />}
                  onClick={handleLeaveRoom}
                >
                  Leave Lobby
                </Button>
              </div>
            </Card>

          </div>
        </div>
      )}

      {/* 3. Live Simulation Panel */}
      {viewState === 'SESSION' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-border-dark pb-4">
            <div>
              <Badge variant="secondary">Live Group Discussion</Badge>
              <h2 className="font-display font-extrabold text-xl text-white mt-1.5">{topic}</h2>
            </div>
            <Button 
              variant="outline" 
              className="text-accent border-accent/20"
              onClick={() => {
                showToast('Closing discussion session...', 'info');
                navigate('/dashboard');
              }}
            >
              End Session
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual grid streams */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Active user grid */}
                <div className="relative aspect-video rounded-2xl bg-black border border-border-dark flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/5 flex flex-col items-center justify-center gap-2">
                    <Video className="text-primary/60" size={32} />
                    <span className="text-[10px] font-bold text-text-dark-muted">Local camera active</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-bg-dark/85 px-3 py-1 rounded border text-[10px] font-bold text-white uppercase tracking-wider">
                    You (Alex Rivera)
                  </div>
                </div>

                {/* Peer grid placeholders */}
                {participants.filter(p => p.user_id !== user?.id).map((part, idx) => (
                  <div key={idx} className="relative aspect-video rounded-2xl bg-card-dark border border-border-dark/60 flex items-center justify-center">
                    <div className="absolute inset-0 bg-secondary/5 flex flex-col items-center justify-center gap-2">
                      <Sparkles className="text-secondary/60" size={32} />
                      <span className="text-[10px] font-bold text-text-dark-muted">Synchronizing streaming parameters</span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-bg-dark/85 px-3 py-1 rounded border text-[10px] font-bold text-white">
                      {part.name}
                    </div>
                  </div>
                ))}

              </div>

              {/* Chat / Speech messages */}
              <Card className="flex flex-col gap-4 border border-border-dark/50 min-h-[220px]">
                <h3 className="font-display font-bold text-sm text-white">Discussion logs</h3>
                <div className="flex-1 overflow-y-auto max-h-[160px] flex flex-col gap-2.5 pr-2">
                  {messages.map((msg, idx) => {
                    const isOwn = msg.startsWith('You:') || msg.startsWith(user?.user_metadata?.full_name || 'You');
                    return (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl border text-xs max-w-lg leading-relaxed text-left
                          ${isOwn ? 'border-primary/20 bg-primary/5 self-end' : 'border-border-dark bg-card-dark/30 self-start'}`}
                      >
                        {msg}
                      </div>
                    );
                  })}
                  {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-xs text-text-dark-muted">
                      No speech actions recorded yet. Use form below to speak.
                    </div>
                  )}
                </div>

                {/* Form to submit chat text to mimic speech input */}
                <form onSubmit={handleSendSpeech} className="flex gap-3 border-t border-border-dark/40 pt-4">
                  <Input 
                    type="text" 
                    placeholder="Enter discussion argument content (e.g. I agree, and we should focus on cost...)"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <Button variant="primary" type="submit" rightIcon={<ArrowRight size={16} />}>
                    Speak
                  </Button>
                </form>
              </Card>

            </div>

            {/* Sidebar list of participant overview details */}
            <Card className="border border-border-dark/50 p-5 flex flex-col gap-4">
              <h3 className="font-display font-bold text-sm text-white border-b border-border-dark/40 pb-2">Active debate metadata</h3>
              
              <div className="flex flex-col gap-3 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-text-dark-muted">Room Code:</span>
                  <span className="text-white tracking-widest font-bold">{roomCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dark-muted">Total Peers:</span>
                  <span className="text-white">{participants.length} connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dark-muted">Turn Tracker:</span>
                  <span className="text-primary font-bold">Free Debate Round</span>
                </div>
              </div>
            </Card>

          </div>
        </div>
      )}

    </div>
  );
};
