"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./navbar.module.css";

export default function NavBar() {
  const path = usePathname();
  const [navColor, setNavColor] = useState("#2563eb"); // color por defecto

  useEffect(() => {
    // 🌀 Cambia color del navbar según la página
    let color = "#2563eb"; // inicio (azul base)
    let bg = "#0f172a"; // fondo general

    if (path === "/App_1") {
      color = "#1e3a8a"; // ReflexMind
      bg = "#111827";
    } else if (path === "/App_2") {
      color = "#064e3b"; // SoundDNA
      bg = "#022c22";
    } else if (path === "/App_3") {
      color = "#7e22ce"; // otro ejemplo (App3)
      bg = "#1e1b4b";
    }

    setNavColor(color);
    // Cambiar color del body también
    document.body.style.backgroundColor = bg;
  }, [path]);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/App_1", label: "App_1" },
    { href: "/App_2", label: "App_2" },
    { href: "/App_3", label: "App_3" },
  ];

  return (
    <nav className={styles.navbar} style={{ backgroundColor: navColor }}>
      <ul className={styles.navList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`${styles.navLink} ${
                path === link.href ? styles.active : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
