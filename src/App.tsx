import Maze from './components/Maze';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Labirint o'yini</h1>
      <Maze />
    </div>
  );
}

export default App;