import { useState, useCallback } from 'react';
import reactLogo from './assets/react.svg';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import { Button } from './components/ui/button';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  const greet = useCallback(async () => {
    setGreetMsg(await invoke('greet', { name }));
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

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-8 p-8'>
      <h1 className='text-4xl font-bold text-foreground'>
        Welcome to Tauri + React
      </h1>

      <div className='flex items-center gap-8'>
        <a
          href='https://vitejs.dev'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Visit Vite website'
          className='transition-transform hover:scale-110'
        >
          å
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
    </main>
  );
}

export default App;
