"use client";

import Link from "next/link";
import styles from "./Home.module.css";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className={styles.container}>
      {/* Fondo animado */}
      <div className={styles.bg}></div>

      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🚀 Bienvenido al <span>Laboratorio Interactivo</span>
      </motion.h1>

      <p className={styles.subtitle}>
        Explora mini-apps creativas hechas con Next.js y React.
      </p>

      <div className={styles.grid}>
        <Link href="/App_1" className={`${styles.card} ${styles.app1}`}>
          <h2>🎮 Juego 1</h2>
          <p>Experimenta el sonido con <b>SoundDNA</b>.</p>
        </Link>

        <Link href="/App_2" className={`${styles.card} ${styles.app2}`}>
          <h2>🧠 Juego 2</h2>
          <p>Desafía tus sentidos con arte interactivo.</p>
        </Link>

        <Link href="/App_3" className={`${styles.card} ${styles.app3}`}>
          <h2>🖥️ Juego 3</h2>
          <p>Arma tu PC ideal arrastrando las piezas.</p>
        </Link>
      </div>
    </main>
  );
}
