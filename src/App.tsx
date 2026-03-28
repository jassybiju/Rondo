import { useState, useEffect } from "react";
import SpinWheel from "./components/Wheel";

import "./App.css";
import { set1 } from "./data";

export default function App() {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState<number | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [color, setColor] = useState(
    Array.from({ length: set1.length }, () => "#fff"),
  );
  const [timeLeft, setTimeLeft] = useState(30); // 30 sec game
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [set, setSet] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setScore(0);
    setIndex(0);
    setShow(false);
    setColor(Array.from({ length: set1.length }, () => "#fff"));
    setTimeLeft(30);
    setGameOver(false);
    setIsPlaying(true);
  };
  const resetGame = () => {
    setScore(0);
  setIndex(null);
  setShow(false);
  setColor(
    Array.from({ length: set1.length }, () => "#fff"),
  );
  setTimeLeft(120); // 30 sec game
  setIsPlaying(false);
  setGameOver(false);
  }

  const skipGame = () => {
    if ((index as number) >= set1.length - 1) {
      setIsPlaying(false);
      setGameOver(true);
    } else {
      setIndex((prev) => (prev as number) + 1);
    }
    setShow(false);
  };
  const handleResult = (correct: boolean) => {
    if (correct) {
      setColor((prev) => prev.map((x, i) => (i === index ? "#008000" : x)));
      setScore((prev) => prev + 10);
    } else {
      setColor((prev) => prev.map((x, i) => (i === index ? "#ff0000" : x)));
      setScore((prev) => prev - 5);
    }

    if ((index as number) >= set1.length - 1) {
      setIsPlaying(false);
      setGameOver(true);
    } else {
      setIndex((prev) => (prev as number) + 1);
    }

    setShow(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
       {gameOver && (
            <div className="flex absolute bg-white/50 w-full flex-col items-center justify-center h-full text-center">
              <h2 className="text-3xl font-bold text-red-500 mb-4">
                ⏰ Time's Up!
              </h2>
              <p className="text-xl mb-4">Your Score</p>
              <p className="text-5xl font-extrabold text-green-600 mb-6">
                {score}
              </p>

              <button
                onClick={resetGame}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
              >
                Play Again
              </button>
            </div>
          )}

      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl flex gap-6">
        {/* 🎡 Wheel Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <SpinWheel index={index as number} color={color} />
        </div>

        {/* 🎮 Game Panel */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="text-center mb-2">
            <p className="text-sm text-gray-500">Select List</p>
            <select
            onChange={(e)=> setSet(Number(e.target.value))}
              className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gray-800"}`}
            >
              {Array.from({length : set1[0].qa.length}).map((x,i) => (
                <>
                  <option value={i}>Set{i + 1}</option>
                </>
              ))}
              </select>
          </div>
          
          <div className="text-center mb-2">
            <p className="text-sm text-gray-500">Time Left</p>
            <p
              className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gray-800"}`}
            >
              {timeLeft}s
            </p>
          </div>
          {/* 🏆 Score */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Score</h2>
            <p className="text-4xl font-extrabold text-green-600 transition-all duration-300">
              {score}
            </p>
          </div>

          {/* ❓ Question */}
          {typeof index === "number" && isPlaying && index < set1.length && (
            <div className="bg-gray-100 rounded-xl p-4 shadow-inner mb-4">
              <p className="text-lg font-semibold text-gray-800">
                {set1[index].qa[set].question}
              </p>

              {show && (
                <div className="mt-4">
                  <p className="text-green-700 font-medium mb-3">
                    ✅ {set1[index].qa[set].sol}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleResult(true)}
                      className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition"
                    >
                      Correct
                    </button>
                    <button
                      onClick={() => handleResult(false)}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                    >
                      Wrong
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

         
          {/* 🎯 Controls */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShow(true)}
              disabled={show || isPlaying == false}
              className="py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl transition"
            >
              Show Answer
            </button>

            <button
              onClick={skipGame}
              disabled={isPlaying == false}
              className="py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl transition"
            >
              Skip
            </button>

            <button
              onClick={startGame}
              className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
