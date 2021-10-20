import './App.css';
import Game from './Game';

function App() {
  const heading = "♠ - - Poker Time - - ♠";
  return (
    <div className="App">
      <div 
        className="App-header" 
        style={{
          background: "black", 
          padding: "10px", 
          top: "0px", 
          position: "sticky"
        }}
      >
        <h1 style={{color: "white"}}>{heading}</h1>
      </div>
      <Game/>
    </div>
  );
}

export default App;
