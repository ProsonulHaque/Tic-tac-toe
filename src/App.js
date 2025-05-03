import { useState } from "react";

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;

  const currentBoard = history[currentMove];
  
  function handlePlay(nextBoard){
    setHistory([...history.slice(0, currentMove+1), nextBoard]);
    setCurrentMove(currentMove + 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove); 
  }

  const moves = history.map((board, move) => {
    const description = move == currentMove? `You're at move #${move}` : move ?  `Go to move #${move}` : 'Go to game start';
    
    return (
      <li key={move}>
        {move == currentMove? (<div>{description}</div>) : (<button onClick={() => jumpTo(move)}>{description}</button>)}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board currentBoard = {currentBoard} xIsNext = {xIsNext} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({currentBoard, xIsNext, onPlay}) {
  function handleClick(i) {
    if(currentBoard[i] || calculateWinner(currentBoard)){
      // If the square is already filled or there's a winner, do nothing
      return;
    }

    const newBoard = currentBoard.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    onPlay(newBoard);
  }

  let status;
  const winner = calculateWinner(currentBoard);

  if(winner) {
    status = `Winner: ${winner}`;
  }
  else{
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }
  
  return (
    <>
      <div className="status">{status}</div>
      
      {[...Array(3)].map((_, i) => (
        <div className="board-row" key={i}>
          {[...Array(3)].map((_, j) => (
            <Square value={currentBoard[i * 3 + j]} onSquareClick={() => handleClick(i * 3 + j)} />
          ))}
        </div>
      ))}
    </>
  );
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}
