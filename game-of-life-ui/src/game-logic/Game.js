import Cell from "./Cell";
import CellState from "./CellState";

export default class Game {

    constructor(state) {
        this.state = state.map(row => row.map(cellState => new Cell(cellState)))
    }

    getCell(row, col) {
        return this.state[row][col];
    }

    getAliveNeighbors(row, col) {
    
        const topRow = row -1;
        const thisRow = row;
        const bottomRow = row +1
        const leftColumn = col -1
        const thisColumn = col;
        const rightColumn = col +1;

        const isLeftEdgeCell = col === 0;
        const isRightEdgeCell = col === this.state.length -1;
        const isTopEdgeCell = row === 0;
        const isBottomEdgeCell = row === this.state.length -1;

        let aliveNeighbors = this.state[row][col].state === CellState.ALIVE ? -1 : 0;
        
        for(let rowIndex = (isTopEdgeCell ? thisRow : topRow); rowIndex <= (isBottomEdgeCell ? thisRow : bottomRow); rowIndex++) {
            for(let colIndex = (isLeftEdgeCell ? thisColumn : leftColumn); colIndex <= (isRightEdgeCell ? thisColumn : rightColumn); colIndex++) {
                // eslint-disable-next-line 
                this.state[rowIndex][colIndex].state == CellState.ALIVE ? aliveNeighbors++ : aliveNeighbors;
            }
        }
        return aliveNeighbors;
    }

    nextGeneration() {
        return this.state.map((row, rowIndex) => row.map((cell, colIndex) => new Cell(cell.getNextState(this.getAliveNeighbors(rowIndex, colIndex)))));
    }
}