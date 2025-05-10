import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface WebSocketContextType {
  wsConnected: boolean;
  wsInstance: WebSocket | null;
  sendMessage: (message: string) => void;
  wsResponse: any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
  wsUrl: string;
}

export const WebSocketProvider = ({
  children,
  wsUrl,
}: WebSocketProviderProps) => {
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsResponse, setWsResponse] = useState<any>(null);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      setWsResponse(data);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
      setWsInstance(null);
      // Attempt to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWsInstance(ws);
  }, [wsUrl]);

  // Send message through WebSocket
  const sendMessage = useCallback(
    (message: string) => {
      if (wsInstance && wsInstance.readyState === WebSocket.OPEN && message) {
        wsInstance.send(message);
        console.log('Sent WebSocket message:', message);
        return true;
      } else {
        console.error('WebSocket not connected or message empty');
        return false;
      }
    },
    [wsInstance]
  );

  useEffect(() => {
    connectWebSocket();

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      if (wsInstance) {
        wsInstance.close();
      }
    };
  }, [connectWebSocket]);

  return (
    <WebSocketContext.Provider
      value={{ wsConnected, wsInstance, sendMessage, wsResponse }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
