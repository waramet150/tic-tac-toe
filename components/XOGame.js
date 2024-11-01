import React, { useState, useEffect } from "react";
import { updateScore } from "@/utils/scoreService";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const XOGame = ({ data }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scoreData, setScoreData] = useState({ score: 0, streak: 0 });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const initialScoreData = await updateScore(0);
        setScoreData(initialScoreData);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      handleScoreUpdate(gameWinner === "X" ? 1 : -1);
    } else if (board.every((cell) => cell !== null)) {
      setIsDraw(true);
      handleScoreUpdate(0);
    }
  }, [board]);

  const handleScoreUpdate = async (scoreChange) => {
    const updatedScoreData = await updateScore(scoreChange);
    setScoreData(updatedScoreData);
  };

  const handleClick = (index) => {
    if (!data || !data.auth) return;

    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXTurn(false);

    if (!calculateWinner(newBoard)) {
      const emptyIndices = newBoard
        .map((cell, idx) => (cell === null ? idx : null))
        .filter((idx) => idx !== null);
      if (emptyIndices.length > 0) {
        const randomIndex =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        newBoard[randomIndex] = "O";
        setBoard(newBoard);
        setIsXTurn(true);
      }
    }
  };

  const calculateWinner = (board) => {
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
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-4xl font-bold mb-6">XO Game</h1>
      <div className="mb-5">
        <div>Score: {scoreData.score}</div>
        <div>Win Streak: {scoreData.streak}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-24 h-24 text-3xl font-bold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 rounded"
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-green-600">
            {winner === "X" ? "You Win!!" : "You Lose!"}
          </h2>
          <button
            onClick={resetGame}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Play Again
          </button>
        </div>
      )}
      {isDraw && (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-yellow-600">Draw!</h2>
          <button
            onClick={resetGame}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Play Again
          </button>
        </div>
      )}
      <div className="mt-6 text-xl text-gray-800"></div>
    </div>
  );
};

export default XOGame;
