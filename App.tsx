import PyExecutor from './components/PyExecutor';

function App() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Tauri + RustPython Demo</h1>
      <PyExecutor />
    </div>
  );
}

export default App;
