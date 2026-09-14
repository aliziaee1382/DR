import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface RealtimeContextType {
  isConnected: boolean;
  activeRoom: string | null;
  joinRoom: (appointmentId: string, userId: string, userName: string, role: string) => void;
  sendSocketPayload: (payload: any) => void;
  subscribeSocketEvent: (handler: (data: any) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<(data: any) => void>>(new Set());

  useEffect(() => {
    let ws: WebSocket | null = null;

    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          listenersRef.current.forEach((handler) => handler(data));
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Attempt reconnection after 2 seconds
        setTimeout(() => {
          if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
            connect();
          }
        }, 2000);
      };

      ws.onerror = (err) => {
        console.warn('WebSocket connection error:', err);
      };
    }

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const joinRoom = (appointmentId: string, userId: string, userName: string, role: string) => {
    setActiveRoom(appointmentId);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'join_room',
          appointmentId,
          userId,
          userName,
          role
        })
      );
    }
  };

  const sendSocketPayload = (payload: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  };

  const subscribeSocketEvent = (handler: (data: any) => void) => {
    listenersRef.current.add(handler);
    return () => {
      listenersRef.current.delete(handler);
    };
  };

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        activeRoom,
        joinRoom,
        sendSocketPayload,
        subscribeSocketEvent
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
