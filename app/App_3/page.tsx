"use client";
import React, { useState, useRef } from "react";
import styles from "./PcBuilder.module.css";

interface Part {
  id: string;
  name: string;
  img: string;
  placed: boolean;
}

const INITIAL_PARTS: Part[] = [
  { id: "cpu", name: "Procesador", img: "/cpu.png", placed: false },
  { id: "gpu", name: "Tarjeta Gráfica", img: "/gpu.png", placed: false },
  { id: "ram", name: "Memoria RAM", img: "/ram.png", placed: false },
  { id: "ssd", name: "Disco SSD", img: "/ssd.png", placed: false },
];

export default function BuildYourPC() {
  const [parts, setParts] = useState(INITIAL_PARTS);
  const [selected, setSelected] = useState<string | null>(null);
  const [placedCount, setPlacedCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // --- Arrastre con mouse ---
  const handleDragStart = (id: string, e: React.DragEvent) => {
    setSelected(id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!selected) return;
    placePart(selected);
  };

  // --- Arrastre con dedo ---
  const handleTouchStart = (id: string, e: React.TouchEvent) => {
    setSelected(id);
    setDragging(true);
    const touch = e.touches[0];
    setDragPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setDragPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragging || !selected) return;
    setDragging(false);

    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const rect = dropZone.getBoundingClientRect();
    const touch = e.changedTouches[0];

    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      placePart(selected);
    }
  };

  // --- Lógica al colocar pieza ---
  function placePart(id: string) {
    const newParts = parts.map((p) =>
      p.id === id ? { ...p, placed: true } : p
    );
    setParts(newParts);
    setPlacedCount((prev) => prev + 1);
    setSelected(null);
  }

  function resetGame() {
    setParts(INITIAL_PARTS.map((p) => ({ ...p, placed: false })));
    setPlacedCount(0);
    setSelected(null);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧠 Arma tu PC</h1>
      <p className={styles.subtitle}>
        Arrastra o toca las piezas para colocarlas en el área de construcción.
      </p>

      <div className={styles.partsContainer}>
        {parts.map(
          (p) =>
            !p.placed && (
              <img
                key={p.id}
                src={p.img}
                alt={p.name}
                draggable
                onDragStart={(e) => handleDragStart(p.id, e)}
                onTouchStart={(e) => handleTouchStart(p.id, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`${styles.part} ${
                  selected === p.id ? styles.selected : ""
                }`}
                style={
                  dragging && selected === p.id
                    ? {
                        position: "fixed",
                        left: dragPos.x - 40,
                        top: dragPos.y - 40,
                        zIndex: 999,
                      }
                    : {}
                }
              />
            )
        )}
      </div>

      <div
        ref={dropZoneRef}
        className={styles.dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {placedCount === parts.length ? (
          <p className={styles.completed}>🎉 ¡PC Completa!</p>
        ) : (
          <p className={styles.dropText}>
            {placedCount === 0
              ? "Suelta o toca aquí para empezar a armar tu PC"
              : "¡Sigue agregando piezas!"}
          </p>
        )}
      </div>

      <button onClick={resetGame} className={styles.resetBtn}>
        Reiniciar
      </button>
    </div>
  );
}
