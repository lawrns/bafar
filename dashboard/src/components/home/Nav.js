"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#modulos", label: "Módulos" },
  { href: "#vision", label: "Visión IA" },
  { href: "#frio", label: "Cadena de frío" },
  { href: "#resultados", label: "Resultados" },
];

export default function Nav() {
  const navRef = useRef(null);

  // Sticky nav gains a border + shadow once the page scrolls (matches design).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y > 8) {
        nav.style.borderBottomColor = "#E2DBCD";
        nav.style.boxShadow = "0 1px 0 rgba(0,0,0,.02), 0 8px 24px -18px rgba(42,11,7,.4)";
        nav.style.background = "rgba(243,240,233,0.9)";
      } else {
        nav.style.borderBottomColor = "transparent";
        nav.style.boxShadow = "none";
        nav.style.background = "rgba(243,240,233,0.78)";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "rgba(243,240,233,0.78)",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        borderBottom: "1px solid transparent",
        transition: "border-color .3s, box-shadow .3s, background .3s",
      }}
    >
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "0 clamp(18px, 4vw, 34px)",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <Link
          href="/"
          aria-label="BAFAR OS — inicio"
          style={{ display: "flex", alignItems: "center", gap: "11px", textDecoration: "none" }}
        >
          <div
            aria-hidden="true"
            style={{
              width: "33px",
              height: "33px",
              borderRadius: "8px",
              background: "linear-gradient(150deg,var(--ac),var(--acd))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-archivo)",
              fontWeight: 900,
              fontSize: "16px",
              color: "#fff",
              letterSpacing: "-.02em",
            }}
          >
            B
          </div>
          <div
            style={{
              fontFamily: "var(--font-archivo)",
              fontWeight: 800,
              fontSize: "17px",
              letterSpacing: ".005em",
              color: "#1A1C1F",
              whiteSpace: "nowrap",
            }}
          >
            BAFAR <span style={{ color: "var(--ac)" }}>OS</span>
          </div>
        </Link>

        <nav aria-label="Secciones" className="bf-nav-links" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="bf-nav-link"
              style={{ fontSize: "13.5px", fontWeight: 500, color: "#5A5C5E", textDecoration: "none", transition: "color .2s" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 2vw, 20px)" }}>
          <Link
            href="/os"
            className="bf-nav-login"
            style={{ fontSize: "13.5px", fontWeight: 600, color: "#1A1C1F", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/os"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: "#1A1C1F",
              color: "#F3F0E9",
              fontSize: "13.5px",
              fontWeight: 600,
              padding: "10px 18px",
              borderRadius: "9px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "transform .2s, background .2s",
            }}
          >
            Abrir consola
          </Link>
        </div>
      </div>
    </header>
  );
}
