import React from 'react';
import './App.css';
import Cell from './game-logic/Cell';
import Board from './game-logic/Board';
import CellState from './game-logic/CellState';
import Game from './game-logic/Game';

const { ALIVE, DEAD } = CellState;
const { DEADBOARD } = Board;


const game = new Game(DEADBOARD);

class App extends React.Component {
  
  state = {
    cells: game.state,
    running: true,
    interval: null,
    speed: 200,
    count: 0,
    currentGameInstance: game
  }


  runSimulation = () => {
    this.setRunning();
    if(this.state.running) {
      const timer = setInterval(this.updateGameState, this.state.speed)
      this.setState({interval: timer})
    }
    clearInterval(this.state.interval)
  }

  updateGameState = () => {
    const nextState = this.state.currentGameInstance.nextGeneration();
    
    this.state.currentGameInstance.state = nextState;
    this.setState({cells: nextState});
    this.updateCount();  
  }
  
  updateCount = () => {
    this.setState((prevState) => {
      const newCount = prevState.count + 1
      return {count: newCount}
    })
  }

  setRunning = () => {
    this.setState(() => {
      return this.state.running ? {running: false} : {running: true}
    })
  }

  switchCellState = (rowIndex, colIndex) => {
    this.setState((prevState) => {
      const cells = prevState.cells.map((row, rowNumber) => (
        row.map((cell, colNumber) => {
          if(rowNumber === rowIndex && colNumber === colIndex) {
            return new Cell(cell.state === ALIVE ? DEAD : ALIVE);
          }
          return cell;
        })
      ));
      game.state = cells;
      return {
        cells
      }
    });
  }

  speedChange = (event) => {
    this.setState({speed: event.target.value})    
  }

  clear = () => {
    const resettedGame = new Game(DEADBOARD);
    
    this.setState({
      cells: resettedGame.state,
      count: 0
    })
  }
  
  reSeed = () => {
    const randomBoard = this.generateRandomBoard();
    const randomSeededGame = new Game(randomBoard)
    this.setState({
      currentGameInstance: randomSeededGame,
      cells: randomSeededGame.state
    })
  }  

  generateRandomBoard = () => {
    const boardSize = 32;
    const board = Array()
    for(let row = 1; row <= boardSize; row++) {
      const row = Array()
      board.push(row)
      for(let col = 1; col <= boardSize; col++) {
        row.push(Math.round(Math.random()* 0.6))
      }
    }

    return board
  }

  render() {
  return (
    <div className="App">
      
      <div className="header">
        <div>
            <h1> Conway's Game Of Life </h1>
        </div>
        <div className="button-group">
          <button className="btn item" onClick={() => this.runSimulation() }> {this.state.running ? "Play" : "Stop!"} </button>
          <button className="btn item" onClick={() => this.clear() }> Clear </button>
          <button className="btn item" onClick={() => this.reSeed() }> Re-Seed </button>
        </div>
        <div className="speed">
          <label className="item" htmlFor="speed">Fast - Slow</label>
          <input className="item" type="range" id="speed" value={this.state.speed}
                min="50" max="1000" step="50" onChange={this.speedChange}/>
        </div>
        <div className="generations">
          <h4 className="item">Generations: {this.state.count}</h4>
        </div>
      </div>
      
      <table>
        <tbody>
        {
          this.state.cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {
                row.map((cell, colIndex) => (
                  <td key={colIndex} 
                      className="cell" 
                      onClick={() => this.switchCellState(rowIndex, colIndex)}
                      style={{background: cell.state === ALIVE ? 'white' : '#212121'}}>
                  </td>
                ))
              }
            </tr>
          ))
        }
        </tbody>
      </table>
     
      <div className="signature">
          <p>Coded with <span role="img" aria-label="love"> &#128153; </span> by <a href="https://github.com/solive93">Sergi Oliveres</a>. In memory of John Horton Conway, the <span role="img" aria-label="mind"> &#129504; </span> behind this game.</p>
        </div>
    </div>
  );
  }
}

export default App;
