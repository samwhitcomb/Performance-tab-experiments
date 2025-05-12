import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define a session data type
interface SessionData {
  duration: number;
  swings: number;
  avgExitVelo: number;
  topExitVelo: number;
  // Add other properties as needed
}

interface SessionContextType {
  pausedSession: boolean;
  sessionData: SessionData | null;
  pauseSession: (data: SessionData) => void;
  resumeSession: () => void;
  endSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [pausedSession, setPausedSession] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Debug log when session state changes
  useEffect(() => {
    console.log('Session context state:', { pausedSession, hasData: !!sessionData });
  }, [pausedSession, sessionData]);

  const pauseSession = (data: SessionData) => {
    console.log('pauseSession called with:', data);
    setPausedSession(true);
    setSessionData(data);
  };

  const resumeSession = () => {
    console.log('resumeSession called');
    // The session remains paused since we're still in a session
  };

  const endSession = () => {
    console.log('endSession called');
    setPausedSession(false);
    setSessionData(null);
  };

  // Create a value object
  const value = {
    pausedSession,
    sessionData,
    pauseSession,
    resumeSession,
    endSession
  };

  console.log('Rendering SessionProvider with pausedSession:', pausedSession);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Add a default export for Expo Router
export default SessionContext; 