import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';

interface WebSocketContextType {
  wsConnected: boolean;
  wsInstance: WebSocket | null;
  sendMessage: (message: string) => boolean;
  wsResponse: any;
  wsError: string | null;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
  wsUrl: string;
  reconnectDelay?: number;
}

export const WebSocketProvider = ({
  children,
  wsUrl,
  reconnectDelay = 3000,
}: WebSocketProviderProps) => {
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsResponse, setWsResponse] = useState<any>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const [shouldReconnect, setShouldReconnect] = useState(true);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (!shouldReconnect) return;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
        setWsError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          setWsResponse(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          setWsError(`Error parsing message: ${error}`);
        }
      };

      ws.onclose = (event) => {
        console.log(
          `WebSocket disconnected, code: ${event.code}, reason: ${event.reason}`
        );
        setWsConnected(false);
        setWsInstance(null);

        if (shouldReconnect) {
          console.log(`Attempting to reconnect in ${reconnectDelay}ms...`);
          setTimeout(connectWebSocket, reconnectDelay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsError(`WebSocket error: ${error}`);
      };

      setWsInstance(ws);
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setWsError(`Connection error: ${error}`);

      if (shouldReconnect) {
        setTimeout(connectWebSocket, reconnectDelay);
      }
    }
  }, [wsUrl, reconnectDelay, shouldReconnect]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      wsInstance.close();
    }
    setShouldReconnect(true);
    connectWebSocket();
  }, [wsInstance, connectWebSocket]);

  // Send message through WebSocket
  const sendMessage = useCallback(
    (message: string): boolean => {
      if (wsInstance && wsInstance.readyState === WebSocket.OPEN && message) {
        wsInstance.send(message);
        console.log('Sent WebSocket message:', message);
        return true;
      } else {
        const errorMsg = !wsInstance
          ? 'WebSocket not initialized'
          : wsInstance.readyState !== WebSocket.OPEN
          ? 'WebSocket not connected'
          : 'Message empty';

        console.error(`WebSocket send error: ${errorMsg}`);
        setWsError(`Send error: ${errorMsg}`);
        return false;
      }
    },
    [wsInstance]
  );

  // Connect on mount and reconnect when URL changes
  useEffect(() => {
    connectWebSocket();

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      setShouldReconnect(false);
      if (wsInstance) {
        wsInstance.close();
      }
    };
  }, [connectWebSocket]);

  // Create memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      wsConnected,
      wsInstance,
      sendMessage,
      wsResponse,
      wsError,
      reconnect,
    }),
    [wsConnected, wsInstance, sendMessage, wsResponse, wsError, reconnect]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
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
