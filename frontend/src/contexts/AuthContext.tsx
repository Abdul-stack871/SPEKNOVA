import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface UserSession {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    target_industry?: string;
  };
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  updateProfile: (fullName: string, targetIndustry?: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = !supabase;

  // Listen to Supabase auth state changes or local storage session initialization
  useEffect(() => {
    if (supabase) {
      // Real Supabase Mode
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata
          });
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local Storage Demo Mode
      const activeSession = localStorage.getItem('speknova_demo_session');
      if (activeSession) {
        setUser(JSON.parse(activeSession));
      }
      setIsLoading(false);
    }
  }, []);

  // Helper to fetch local demo user registry
  const getDemoUsers = (): any[] => {
    const list = localStorage.getItem('speknova_demo_users');
    return list ? JSON.parse(list) : [];
  };

  // Auth Operations
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
            }
          }
        });
        if (error) return { error: error.message };
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            user_metadata: data.user.user_metadata
          });
        }
        return { error: null };
      } else {
        const demoUsers = getDemoUsers();
        if (demoUsers.find((u) => u.email === email)) {
          return { error: 'An account with this email already exists.' };
        }
        const newUser: UserSession = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          user_metadata: {
            full_name: fullName,
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            target_industry: 'Technology / Software Engineering'
          }
        };
        // Save user and password
        demoUsers.push({ ...newUser, password });
        localStorage.setItem('speknova_demo_users', JSON.stringify(demoUsers));
        // Save current active session
        localStorage.setItem('speknova_demo_session', JSON.stringify(newUser));
        setUser(newUser);
        return { error: null };
      }
    } catch (err: any) {
      return { error: err.message || 'An error occurred during sign up.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) return { error: error.message };
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            user_metadata: data.user.user_metadata
          });
        }
        return { error: null };
      } else {
        const demoUsers = getDemoUsers();
        const existing = demoUsers.find((u) => u.email === email && u.password === password);
        if (!existing) {
          return { error: 'Invalid email or password.' };
        }
        const userSession: UserSession = {
          id: existing.id,
          email: existing.email,
          user_metadata: existing.user_metadata
        };
        localStorage.setItem('speknova_demo_session', JSON.stringify(userSession));
        setUser(userSession);
        return { error: null };
      }
    } catch (err: any) {
      return { error: err.message || 'An error occurred during sign in.' };
    }
  };

  const signOut = async () => {
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) return { error: error.message };
        setUser(null);
        return { error: null };
      } else {
        localStorage.removeItem('speknova_demo_session');
        setUser(null);
        return { error: null };
      }
    } catch (err: any) {
      return { error: err.message || 'An error occurred during sign out.' };
    }
  };

  const updateProfile = async (fullName: string, targetIndustry?: string) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            target_industry: targetIndustry
          }
        });
        if (error) return { error: error.message };
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            user_metadata: data.user.user_metadata
          });
        }
        return { error: null };
      } else {
        if (!user) return { error: 'No active session found.' };
        const updatedMetadata = {
          ...user.user_metadata,
          full_name: fullName,
          target_industry: targetIndustry
        };
        const updatedUser = {
          ...user,
          user_metadata: updatedMetadata
        };
        // Update registry
        const demoUsers = getDemoUsers();
        const updatedUsers = demoUsers.map((u) => 
          u.id === user.id ? { ...u, user_metadata: updatedMetadata } : u
        );
        localStorage.setItem('speknova_demo_users', JSON.stringify(updatedUsers));
        localStorage.setItem('speknova_demo_session', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { error: null };
      }
    } catch (err: any) {
      return { error: err.message || 'An error occurred updating profile.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemoMode,
        signUp,
        signIn,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
