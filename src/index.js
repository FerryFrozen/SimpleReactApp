import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button className={`square ${props.winner ? "active" : ""}`} onClick={props.onClick}>
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    gridSize = 3;

    renderSquare(i) {
      return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winner={this.props.winner&&this.props.winner.line.includes(i)}
            />
        );
    }

    render() {
      let rows = [];
      for (let i=0; i<this.gridSize; i++) {
        let row = [];
        for (let j=i*3; j<i*3+3; j++) {
          row.push(this.renderSquare(j));
        }
        rows.push(<div key={i} className="board-row">{row}</div>);
      }
      return <div>{rows}</div>;
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
        if (this.state.stepNumber == 8) {
          alert("Ничья!");
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
                "Перейти к началу игры";
            return (
                <li key={move}> 
                    <button className={move==this.state.stepNumber ? "active-list-item" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Выиграли ${winner.sign=="X" ? "крестики" : "нолики"}!`;
        } else {
            status = 'Следующими ходят ' + (this.state.isXNext ? 'крестики' : 'нолики');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares = {current.squares}
                onClick = {(i) => this.handleClick(i)}
                winner = {winner}
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
        console.log(squares[a]);
        return {
          sign: squares[a],
          line: [a, b, c]
        }
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  