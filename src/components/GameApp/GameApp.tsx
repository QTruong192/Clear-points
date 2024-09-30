import React, { useState, useEffect, useRef } from "react";
import "./GameApp.css";

interface NumberCircle {
  id: number;
  x: number;
  y: number;
  isVisible: boolean;
  isClicked: boolean;
}

const GameApp: React.FC = () => {
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(0);
  const [circles, setCircles] = useState<NumberCircle[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [totalNumbers, setTotalNumbers] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStatus, setGameStatus] = useState<
    "playing" | "allCleared" | "gameOver"
  >("playing");
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const generateCircles = (num: number) => {
    const newCircles = Array.from({ length: num }, (_, i) => ({
      id: i + 1,
      x: Math.random() * 85 + 1,
      y: Math.random() * 85 + 1,
      isVisible: true,
      isClicked: false,
    }));

    newCircles.sort((a, b) => b.id - a.id);
    setCircles(newCircles);
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        setTime(
          parseFloat(((Date.now() - startTimeRef.current) / 1000).toFixed(1))
        );
      }
    }, 100);
  };

  const resetTimer = () => {
    setTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = null;
  };

  const handleCircleClick = (id: number) => {
    if (!isPlaying || gameStatus !== "playing") return;

    const clickedCircle = circles.find((circle) => circle.id === id);

    if (clickedCircle && id === currentNumber) {
      setPoints(points + 1);
      setCurrentNumber(currentNumber + 1);
      setCircles((prevCircles) =>
        prevCircles.map((circle) =>
          circle.id === id ? { ...circle, isClicked: true } : circle
        )
      );

      setTimeout(() => {
        setCircles((prevCircles) =>
          prevCircles.map((circle) =>
            circle.id === id ? { ...circle, isVisible: false } : circle
          )
        );
      }, 500);

      if (id === totalNumbers) {
        setGameStatus("allCleared");
        clearInterval(timerRef.current!);
      }
    } else {
      setGameStatus("gameOver");
      clearInterval(timerRef.current!);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = parseInt(e.target.value, 10);
    if (newTotal > 0) {
      setTotalNumbers(newTotal);
      resetGame();
    }
  };

  const resetGame = () => {
    setPoints(0);
    setCurrentNumber(1);
    setIsPlaying(false);
    setGameStatus("playing");
    setCircles([]);
    resetTimer();
  };

  const handlePlayReset = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      resetTimer();
      startTimer();
      generateCircles(totalNumbers);
    } else {
      resetGame();
    }
  };

  return (
    <div>
      <h1>
        {gameStatus === "allCleared"
          ? <h1 className="p_done">All Cleared!</h1>
          : gameStatus === "gameOver"
          ? <h1 className="p_over">Game Over</h1>
          : <h1 className="p_play">Let's play</h1>}
      </h1>
      <div>Points: {points}</div>
      <div>Time: {time}s</div>
      <div>
        Number of points:
        <input
          type="number"
          value={totalNumbers}
          onChange={handleNumberChange}
          min="1"
          disabled={isPlaying}
        />
      </div>
      <button onClick={handlePlayReset}>{isPlaying ? "Restart" : "Play"}</button>
      <div className="game-area">
        {isPlaying &&
          circles.map((circle) =>
            circle.isVisible ? (
              <div
                key={circle.id}
                onClick={() => handleCircleClick(circle.id)}
                className={`circle ${circle.isClicked ? "clicked" : ""}`}
                style={{
                  left: `${circle.x}%`,
                  top: `${circle.y}%`,
                  zIndex: totalNumbers - circle.id + 1,
                }}
              >
                {circle.id}
              </div>
            ) : null
          )}
      </div>
    </div>
  );
};

export default GameApp;
