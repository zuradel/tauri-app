import { useState, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useWebSocket } from './WebSocketProvider';

const SAMPLE_COMMANDS = [
  { name: 'Check Status', command: 'status' },
  { name: 'List Devices', command: 'devices' },
  { name: 'Screen Info', command: 'screen' },
  { name: 'App Info', command: 'appinfo' },
];

export const WebSocketTest = () => {
  const { wsConnected, sendMessage, wsResponse } = useWebSocket();
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [responseHistory, setResponseHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleCommandChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCommand(e.target.value);
    },
    []
  );

  const handleSendCommand = useCallback(() => {
    if (command && wsConnected) {
      sendMessage(command);
      setCommandHistory((prev) => [...prev, command]);
      setCommand('');
    }
  }, [command, wsConnected, sendMessage]);

  const handlePresetCommand = useCallback(
    (cmd: string) => {
      if (wsConnected) {
        sendMessage(cmd);
        setCommandHistory((prev) => [...prev, cmd]);
      }
    },
    [wsConnected, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSendCommand();
      }
    },
    [handleSendCommand]
  );

  const toggleHistory = useCallback(() => {
    setShowHistory((prev) => !prev);
  }, []);

  useEffect(() => {
    if (wsResponse) {
      setResponseHistory((prev) => [...prev, wsResponse]);
    }
  }, [wsResponse]);

  return (
    <div className='border rounded-lg p-4 w-full max-w-3xl'>
      <h2 className='text-xl font-bold mb-4'>WebSocket Test Console</h2>

      <div className='mb-4'>
        <div className='flex items-center mb-2'>
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              wsConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
          <span>{wsConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className='mb-4'>
        <h3 className='font-medium mb-2'>Quick Commands</h3>
        <div className='flex flex-wrap gap-2'>
          {SAMPLE_COMMANDS.map((cmd) => (
            <Button
              key={cmd.command}
              variant='outline'
              size='sm'
              disabled={!wsConnected}
              onClick={() => handlePresetCommand(cmd.command)}
            >
              {cmd.name}
            </Button>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-2 mb-4'>
        <Input
          value={command}
          onChange={handleCommandChange}
          onKeyDown={handleKeyDown}
          placeholder='Enter a command...'
          disabled={!wsConnected}
          className='flex-1'
        />
        <Button onClick={handleSendCommand} disabled={!wsConnected || !command}>
          Send
        </Button>
      </div>

      {wsResponse && (
        <div className='mb-4'>
          <h3 className='font-medium mb-2'>Latest Response:</h3>
          <pre className='bg-gray-100 p-3 rounded overflow-auto max-h-40 text-sm'>
            {JSON.stringify(wsResponse, null, 2)}
          </pre>
        </div>
      )}

      <div className='mt-4'>
        <Button variant='outline' onClick={toggleHistory} size='sm'>
          {showHistory ? 'Hide History' : 'Show History'} (
          {responseHistory.length})
        </Button>

        {showHistory && responseHistory.length > 0 && (
          <div className='mt-3'>
            <h3 className='font-medium mb-2'>Command History:</h3>
            <div className='space-y-3'>
              {responseHistory.map((response, index) => (
                <div key={index} className='border rounded p-2'>
                  <div className='text-xs text-gray-500 mb-1'>
                    Command: {commandHistory[index] || 'unknown'}
                  </div>
                  <pre className='bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32'>
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
