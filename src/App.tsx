import { useState, useCallback, useEffect } from 'react';
import reactLogo from './assets/react.svg';
// import { invoke } from '@tauri-apps/api/core';
import { callFunction } from 'tauri-plugin-python-api';
import './App.css';
import { Button } from './components/ui/button';
import { Command } from '@tauri-apps/plugin-shell';
import { WebSocketProvider } from './components/WebSocketProvider';
import { WebSocketTest } from './components/WebSocketTest';

function LoadingScreen({
  onComplete,
  error,
}: {
  onComplete: () => void;
  error: string | null;
}) {
  return (
    <div className='fixed inset-0 bg-background flex flex-col items-center justify-center gap-4'>
      <h2 className='text-2xl font-bold'>Khởi động API Server</h2>

      {error ? (
        <>
          <div className='text-red-500 text-center max-w-md'>
            <p className='text-lg font-semibold mb-2'>Lỗi kết nối server:</p>
            <p className='bg-red-50 p-3 rounded-md text-sm break-words'>
              {error}
            </p>
          </div>
          <Button onClick={onComplete} className='mt-4'>
            Tiếp tục vào ứng dụng
          </Button>
        </>
      ) : (
        <>
          <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
          <p className='text-gray-500'>
            Đang kết nối đến server, vui lòng đợi...
          </p>
        </>
      )}
    </div>
  );
}

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [serverStatus, setServerStatus] = useState<
    'starting' | 'running' | 'error'
  >('starting');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const greet = useCallback(async () => {
    setGreetMsg(await callFunction('greet_py', [name]));
  }, [name]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      greet();
    },
    [greet]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.currentTarget.value);
    },
    []
  );

  // Chỉ kiểm tra kết nối server, không khởi động server từ JavaScript
  const checkServerConnection = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8008/api/v1/connect');
      if (response.ok) {
        setServerStatus('running');
        return true;
      } else {
        setServerStatus('error');
        const errorMessage = `Server responded with status: ${response.status}`;
        setServerError(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error checking server connection:', error);
      setServerStatus('error');
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setServerError(errorMessage);
      return false;
    }
  }, []);

  // Chỉ kiểm tra kết nối đến server, không cố gắng khởi động lại từ JavaScript
  useEffect(() => {
    const waitForServer = async () => {
      // Đợi server khởi động (tối đa 20 lần, 500ms mỗi lần)
      let isRunning = false;

      for (let i = 0; i < 20; i++) {
        console.log(`Checking server connection attempt ${i + 1}...`);
        isRunning = await checkServerConnection();

        if (isRunning) {
          console.log('Server connection established!');
          break;
        }

        // Đợi 500ms trước khi thử lại
        if (i < 19) {
          // Không đợi sau lần cuối cùng
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // Sau khi thử kết nối server nhiều lần, cập nhật trạng thái
      if (!isRunning) {
        setLoadingError(
          `Không thể kết nối đến server sau nhiều lần thử. ${serverError || ''}`
        );
      }

      // Cho phép hiển thị ứng dụng chính sau 1 giây hiển thị kết quả
      setTimeout(
        () => {
          setIsLoading(false);
        },
        isRunning ? 500 : 1000
      );
    };

    waitForServer();
  }, [checkServerConnection, serverError]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Render màn hình loading nếu đang trong quá trình kết nối server
  if (isLoading) {
    return (
      <LoadingScreen onComplete={handleLoadingComplete} error={loadingError} />
    );
  }

  return (
    <WebSocketProvider wsUrl='ws://localhost:8008/ws'>
      <main className='flex min-h-screen flex-col items-center justify-center gap-8 p-8'>
        <h1 className='text-4xl font-bold text-foreground'>
          Welcome to Tauri + React
        </h1>

        {/* Server Status Display */}
        <div className='w-full max-w-md p-4 border rounded-lg'>
          <h2 className='text-lg font-semibold mb-2'>API Server Status</h2>
          <div className='flex items-center mb-2'>
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                serverStatus === 'running'
                  ? 'bg-green-500'
                  : serverStatus === 'starting'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            ></div>
            <span>
              {serverStatus === 'running'
                ? 'Server Running'
                : serverStatus === 'starting'
                ? 'Server Starting...'
                : 'Server Error'}
            </span>
          </div>

          {serverError && (
            <div className='text-red-500 text-sm mb-2 overflow-auto max-h-24 p-2 bg-red-50 rounded'>
              {serverError}
            </div>
          )}

          <div className='flex gap-2'>
            <Button onClick={checkServerConnection} size='sm'>
              Check Status
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-8'>
          <a
            href='https://vitejs.dev'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Visit Vite website'
            className='transition-transform hover:scale-110'
          >
            <img src='/vite.svg' className='h-24 w-24' alt='Vite logo' />
          </a>
          <a
            href='https://tauri.app'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Visit Tauri website'
            className='transition-transform hover:scale-110'
          >
            <img src='/tauri.svg' className='h-24 w-24' alt='Tauri logo' />
          </a>
          <a
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Visit React website'
            className='transition-transform hover:scale-110'
          >
            <img
              src={reactLogo}
              className='h-24 w-24 animate-[spin_20s_linear_infinite]'
              alt='React logo'
            />
          </a>
        </div>
        <p className='text-muted-foreground'>
          Click on the Tauri, Vite, and React logos to learn more.
        </p>

        <form
          className='flex w-full max-w-md items-center gap-4'
          onSubmit={handleSubmit}
        >
          <input
            id='greet-input'
            onChange={handleNameChange}
            placeholder='Enter a name...'
            aria-label='Enter name'
            className='h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          />
          <Button type='submit'>Greet</Button>
        </form>
        <p className='text-lg text-foreground'>{greetMsg}</p>

        {/* WebSocket Test Component */}
        <WebSocketTest />
      </main>
    </WebSocketProvider>
  );
}

export default App;
