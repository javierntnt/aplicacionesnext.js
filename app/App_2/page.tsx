"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./SoundDNA.module.css";

interface SoundLayer {
  name: string;
  type: OscillatorType | "noise";
  gain: number;
  active: boolean;
}

const INITIAL_LAYERS: SoundLayer[] = [
  { name: "Viento", type: "noise", gain: 0.3, active: true },
  { name: "Tono bajo", type: "sine", gain: 0.2, active: true },
  { name: "Tono medio", type: "triangle", gain: 0.15, active: false },
  { name: "Campanas", type: "square", gain: 0.1, active: false },
];

export default function SoundDNA() {
  const [layers, setLayers] = useState(INITIAL_LAYERS);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<{ [key: string]: AudioBufferSourceNode | OscillatorNode }>({});
  const gainNodesRef = useRef<{ [key: string]: GainNode }>({});

  // 🎨 Fondo con animación suave
  useEffect(() => {
    const prevBg = document.body.style.background;
    document.body.style.transition = "background 1.2s ease";
    document.body.style.background = "linear-gradient(180deg, #022c22, #064e3b)";
    return () => {
      document.body.style.background = prevBg;
    };
  }, []);

  // --- Limpiar audio al desmontar ---
  useEffect(() => {
    return () => stopAll();
  }, []);

  function createNoiseBuffer(ctx: AudioContext) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function startLayer(layer: SoundLayer, ctx: AudioContext) {
    if (sourcesRef.current[layer.name]) return;

    const gainNode = ctx.createGain();
    gainNode.gain.value = layer.gain;

    let source: OscillatorNode | AudioBufferSourceNode;

    if (layer.type === "noise") {
      const noise = createNoiseBuffer(ctx);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noise;
      noiseSource.loop = true;
      noiseSource.connect(gainNode).connect(ctx.destination);
      noiseSource.start();
      source = noiseSource;
    } else {
      const osc = ctx.createOscillator();
      osc.type = layer.type;
      osc.frequency.value =
        layer.name === "Tono bajo" ? 60 : layer.name === "Tono medio" ? 220 : 880;
      osc.connect(gainNode).connect(ctx.destination);
      osc.start();
      source = osc;
    }

    sourcesRef.current[layer.name] = source;
    gainNodesRef.current[layer.name] = gainNode;
  }

  function stopLayer(name: string) {
    const src = sourcesRef.current[name];
    if (src) {
      try {
        src.stop();
      } catch {}
      delete sourcesRef.current[name];
    }
  }

  function stopAll() {
    Object.keys(sourcesRef.current).forEach(stopLayer);
    setIsPlaying(false);
  }

  function togglePlay() {
    if (!isPlaying) {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      layers.forEach((l) => l.active && startLayer(l, ctx));
      setIsPlaying(true);
    } else {
      stopAll();
    }
  }

  function toggleLayer(index: number) {
    const newLayers = [...layers];
    newLayers[index].active = !newLayers[index].active;
    setLayers(newLayers);

    const ctx = audioCtxRef.current;
    if (ctx && isPlaying) {
      if (newLayers[index].active) startLayer(newLayers[index], ctx);
      else stopLayer(newLayers[index].name);
    }
  }

  function adjustGain(index: number, value: number) {
    const newLayers = [...layers];
    newLayers[index].gain = value;
    setLayers(newLayers);

    const gainNode = gainNodesRef.current[newLayers[index].name];
    if (gainNode) gainNode.gain.value = value;
  }

  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      <h1 className={styles.title}>🎧 SoundDNA</h1>
      <p className={styles.subtitle}>
        Genera paisajes sonoros relajantes combinando tonos, ruido y texturas.
      </p>

      <div className={styles.layers}>
        {layers.map((layer, i) => (
          <div
            key={layer.name}
            className={`${styles.layerCard} ${layer.active ? styles.active : ""}`}
          >
            <div className={styles.layerHeader}>
              <span>{layer.name}</span>
              <button className={styles.toggleBtn} onClick={() => toggleLayer(i)}>
                {layer.active ? "Desactivar" : "Activar"}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={layer.gain}
              onChange={(e) => adjustGain(i, parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.mainBtn} ${isPlaying ? styles.stop : styles.play}`}
          onClick={togglePlay}
        >
          {isPlaying ? "Detener" : "Iniciar"}
        </button>
      </div>
    </div>
  );
}
