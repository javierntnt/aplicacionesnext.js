"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./aplicacion.module.css";

type ColorName = "ROJO" | "AZUL" | "VERDE" | "AMARILLO";

const COLOR_MAP: Record<ColorName, string> = {
  ROJO: "#e63946",
  AZUL: "#1d4ed8",
  VERDE: "#2a9d8f",
  AMARILLO: "#f4c430",
};

const COLOR_KEYS: ColorName[] = ["ROJO", "AZUL", "VERDE", "AMARILLO"];

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function pickPair(): { word: ColorName; font: ColorName } {
  const word = COLOR_KEYS[randomInt(COLOR_KEYS.length)];
  const font = COLOR_KEYS[randomInt(COLOR_KEYS.length)];
  return { word, font };
}

export default function ReflexMind() {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(4);
  const [pair, setPair] = useState(pickPair);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const streakRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      handleWrong("⏰ ¡Tiempo agotado! -1 vida");
      return;
    }
    timerRef.current = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isRunning]);

  function startGame() {
    setRound(1);
    setScore(0);
    setLives(3);
    streakRef.current = 0;
    setIsRunning(true);
    setTimeLeft(4);
    setPair(pickPair());
    setMessage(null);
  }

  function nextRound(success = false) {
    setRound((r) => r + 1);
    setTimeLeft((t) => Math.max(2, 4 - Math.floor((round + 1) / 5)));
    setPair(pickPair());
    setMessage(success ? "✅ ¡Correcto!" : null);
  }

  function finishGame() {
    setIsRunning(false);
    setMessage("🎮 Juego terminado");
    const best = localStorage.getItem("reflexmind_best");
    const prev = best ? Number(best) : 0;
    if (score > prev) localStorage.setItem("reflexmind_best", String(score));
  }

  function handleWrong(reason?: string) {
    streakRef.current = 0;
    setLives((l) => {
      const next = l - 1;
      if (next <= 0) finishGame();
      else {
        setTimeout(() => {
          setPair(pickPair());
          setTimeLeft(Math.max(2, 4 - Math.floor((round + 1) / 5)));
        }, 700);
      }
      return next;
    });
    setMessage(reason ?? "❌ Incorrecto");
  }

  function onChoose(choice: ColorName) {
    if (!isRunning) return;
    const correct = pair.font;
    if (choice === correct) {
      streakRef.current += 1;
      const gained = 10 + Math.min(50, streakRef.current * 2);
      setScore((s) => s + gained);
      setMessage("+" + gained + " pts");
      setTimeout(() => nextRound(true), 350);
    } else {
      handleWrong("❌ Respuesta incorrecta");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🧠 ReflexMind</h1>
        <p className={styles.subtitle}>
          Pulsa el color que coincide con <strong>el color del texto</strong>, no con la palabra.
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.stats}>
          <span>Ronda: <strong>{round}</strong></span>
          <span>Puntos: <strong>{score}</strong></span>
          <span>Vidas: <strong>{lives}</strong></span>
          <span>Tiempo: <strong>{timeLeft}s</strong></span>
        </div>

        <div className={styles.card}>
          <div className={styles.wordArea}>
            <span className={styles.word} style={{ color: COLOR_MAP[pair.font] }}>
              {pair.word}
            </span>
          </div>

          <div className={styles.options}>
            {COLOR_KEYS.map((c) => (
              <button
                key={c}
                className={styles.colorBtn}
                onClick={() => onChoose(c)}
                style={{ backgroundColor: COLOR_MAP[c] }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            {!isRunning ? (
              <button className={styles.primary} onClick={startGame}>Iniciar</button>
            ) : (
              <button className={styles.secondary} onClick={() => setIsRunning(false)}>Pausar</button>
            )}
            <button className={styles.secondary} onClick={() => finishGame()}>Terminar</button>
          </div>

          {message && <div className={styles.toast}>{message}</div>}
        </div>

        <footer className={styles.footer}>
          Mejor puntaje: <strong>{localStorage.getItem("reflexmind_best") ?? 0}</strong>
        </footer>
      </main>
    </div>
  );
}
