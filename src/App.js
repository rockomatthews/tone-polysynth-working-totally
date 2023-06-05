import logo from './logo.svg';
import './App.css';
import Sandbox from './pages/Sandbox'

function App() {
  return (
  <>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>  
    <div className='App-body'>
        <Sandbox />
    </div>
  </>
  );
}

export default App;
