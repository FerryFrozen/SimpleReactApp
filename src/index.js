import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardHistory: [{
              squares: Array(9).fill(null)
            }],
            stepsHistory: [],
            isXNext: true,
            stepNumber: 0
        }
    }

    handleClick(i) {
        const boardHistory = this.state.boardHistory.slice(0, this.state.stepNumber+1);
        const stepsHistory = this.state.stepsHistory.slice(0, this.state.stepNumber);
        const current = boardHistory[boardHistory.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.isXNext ? 'X' : 'O';
        this.setState({
          boardHistory: boardHistory.concat([{
            squares: squares,
          }]),
          stepsHistory: stepsHistory.concat([{
            step: {
              xPos: i%3+1,
              yPos: Math.floor(i/3)+1
            }
          }]),
          stepNumber:boardHistory.length,
          isXNext: !this.state.isXNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            isXNext: (step % 2) === 0
        });
    }

    render() {
        const boardHistory = this.state.boardHistory;
        const current = boardHistory[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = boardHistory.map((step,move) => {
            let previousMove = this.state.stepsHistory[move-1];
            const desc = move ?
                `Перейти к ходу #${move} ${
                  previousMove ? "["+previousMove.step.xPos+","+previousMove.step.yPos+"]" : ""
                }` :
                "Начало игры";
            return (
                <li key={move}> 
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Выиграли ' + winner;
        } else {
            status = 'Следующими ходят ' + (this.state.isXNext ? 'крестики' : 'нолики');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares = {current.squares}
                onClick = {(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  