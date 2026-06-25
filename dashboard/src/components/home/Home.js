"use client";

import { useEffect } from "react";
import CommoditiesTicker from "./CommoditiesTicker";
import Nav from "./Nav";
import Hero from "./Hero";
import TrustStrip from "./TrustStrip";
import StatsBand from "./StatsBand";
import Modules from "./Modules";
import VisionSpotlight from "./VisionSpotlight";
import ColdChain from "./ColdChain";
import Testimonial from "./Testimonial";
import BigCTA from "./BigCTA";
import Footer from "./Footer";

// Responsive rules for the home page. globals.css carries the keyframes and
// reduced-motion handling; these media queries collapse the multi-column
// layouts on smaller screens (mobile-first via stacking).
const RESPONSIVE_CSS = `
.bf-nav-link:hover { color: #1A1C1F; }
.bf-module-card:hover { background: #FCFBF8; }
@media (max-width: 880px) {
  .bf-hero-grid,
  .bf-vision-grid,
  .bf-frio-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
  .bf-frio-grid > *:first-child { order: 2 !important; }
  .bf-frio-grid > *:last-child { order: 1 !important; }
  .bf-modules-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .bf-nav-links { display: none !important; }
}
@media (max-width: 720px) {
  .bf-stats-grid,
  .bf-realstats-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .bf-stats-grid > div { border-right: none !important; padding: 24px 0 !important; }
  .bf-footer-grid { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 520px) {
  .bf-modules-grid { grid-template-columns: 1fr !important; }
  .bf-nav-login { display: none !important; }
  .bf-footer-grid { grid-template-columns: 1fr !important; }
}
`;

export default function Home() {
  // The shared globals.css sets `body { overflow: hidden }` for the dashboard
  // shell. The landing page is a long scrollable document, so re-enable scroll
  // while mounted and restore on unmount.
  useEffect(() => {
    const prev = {
      overflow: document.body.style.overflow,
      overflowY: document.body.style.overflowY,
      overflowX: document.body.style.overflowX,
    };
    document.body.style.overflow = "";
    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.overflowY = prev.overflowY;
      document.body.style.overflowX = prev.overflowX;
    };
  }, []);

  return (
    <div
      className="bf-home"
      style={{
        "--ac": "#C0392B",
        "--acd": "#7A1E12",
        fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
        color: "#1A1C1F",
        background: "#F3F0E9",
        overflow: "hidden",
      }}
    >
      <style>{RESPONSIVE_CSS}</style>
      <CommoditiesTicker />
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <StatsBand />
        <Modules />
        <VisionSpotlight />
        <ColdChain />
        <Testimonial />
        <BigCTA />
      </main>
      <Footer />
    </div>
  );
}
