import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CIPHER_ALGORITHMS } from "../../services/cryptoService";

const KINGDOM_DATA = {
  caesar: {
    id: "caesar",
    name: "Iron Dominion",
    realm: "Caesar Cipher",
    description:
      "The ancient art of shifting letters by the power of Roman legions",
    invented: "100 BC",
    security: "Low",
    color: "#e05252",
    secCol: "#e05252",
  },
  vigenere: {
    id: "vigenere",
    name: "Emerald Archives",
    realm: "Vigenère Cipher",
    description:
      "Secrets of the scholarly councils, encrypted within an endless emerald key",
    invented: "1553",
    security: "Medium",
    color: "#2dd4a0",
    secCol: "#f5a623",
  },
  playfair: {
    id: "playfair",
    name: "Frost Citadel",
    realm: "Playfair Cipher",
    description:
      "Fortress of digraph encryption, crafted in the frozen northern halls",
    invented: "1854",
    security: "Medium",
    color: "#5b9bd5",
    secCol: "#f5a623",
  },
  hill: {
    id: "hill",
    name: "Golden Kingdom",
    realm: "Hill Cipher",
    description:
      "The mathematical empire, where matrix operations rule the realm",
    invented: "1929",
    security: "Medium-High",
    color: "#f5a623",
    secCol: "#2dd4a0",
  },
};

const TERRITORIES = {
  caesar: {
    // Iron Dominion - Jagged, angular, rocky highlands (upper-left) - SCALED 30%
    // Bounds: X 140→660, Y 55→455 (scaled to fit viewport)
    path: "M254 168L296 126L331 143.5L366 133L394 147L429 136.5L464 154L506 143.5L548 168Q562 196 558.5 224Q569 259 544.5 294Q562 329 527 364Q478 395.5 415 399Q359 402.5 310 392Q254 381.5 226 343Q215.5 301 229.5 259Q222.5 217 240 182Q233 164.5 254 168Z",
    center: { x: 380, y: 280 },
    iconPos: { x: 380, y: 250 },
    textPos: { x: 380, y: 310 },
    textPos2: { x: 380, y: 330 },
  },
  vigenere: {
    // Emerald Archives - Smooth, wavy, coastline (upper-right) - SCALED 30%
    // Bounds: X 740→1280, Y 55→455 (scaled to fit viewport)
    path: "M866 140Q908 133 950 143.5Q985 150.5 1013 161Q1041 154 1076 171.5Q1111 164.5 1146 182Q1181 192.5 1195 217Q1202 245 1188 273Q1198.5 301 1174 329Q1181 357 1146 378Q1111 395.5 1069 399Q1020 401.1 971 395.5Q922 392 880 378Q838 360.5 831 322Q824 280 838 238Q827.5 196 852 161Q859 150.5 866 140Z",
    center: { x: 1020, y: 280 },
    iconPos: { x: 1020, y: 250 },
    textPos: { x: 1020, y: 310 },
    textPos2: { x: 1020, y: 330 },
  },
  playfair: {
    // Frost Citadel - Wide, flat, tundra (lower-left) - SCALED 30%
    // Bounds: X 140→660, Y 490→730 (scaled to fit viewport)
    path: "M240 543Q282 536 324 541.6Q366 536 408 544.4Q450 539.5 492 548.6Q534 545.1 562 557Q567.6 581.5 562 606Q564.1 632.6 544.5 653.6Q506 690 450 695.6Q387 697 324 691.4Q268 684.4 226 667.6Q213.4 639.6 220.4 609.5Q216.9 578 240 543Z",
    center: { x: 380, y: 620 },
    iconPos: { x: 380, y: 590 },
    textPos: { x: 380, y: 650 },
    textPos2: { x: 380, y: 670 },
  },
  hill: {
    // Golden Kingdom - Rounded but irregular, rolling hills (lower-right) - SCALED 30%
    // Bounds: X 740→1280, Y 490→730 (scaled to fit viewport)
    path: "M880 550Q922 543 964 553.5Q999 546.5 1034 558.4Q1069 551.4 1104 569.6Q1132 581.5 1160 597.6Q1179.6 614.4 1186.6 639.6Q1182.4 665.5 1158.6 685.1Q1111 695.6 1055 698.4Q999 700.5 950 691.4Q901 684.4 859 667.6Q832.4 646.6 839.4 611.6Q836.6 578 866 550Q873 546.5 880 550Z",
    center: { x: 1020, y: 620 },
    iconPos: { x: 1020, y: 590 },
    textPos: { x: 1020, y: 650 },
    textPos2: { x: 1020, y: 670 },
  },
};

function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export default function FantasyMap({ isChatOpen = false }) {
  const navigate = useNavigate();
  const [activeTerritory, setActiveTerritory] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(null);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (isChatOpen) return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left + 14;
      let y = e.clientY - rect.top + 14;

      if (x + 240 > rect.width - 8) {
        x = e.clientX - rect.left - 240 - 14;
      }
      if (y + 155 > rect.height - 8) {
        y = e.clientY - rect.top - 155 - 14;
      }
      if (x < 8) x = 8;
      if (y < 8) y = 8;

      setTooltipPos({ x, y });
    }
  };

  const handleMouseEnter = (id) => {
    if (isChatOpen) return;
    setActiveTerritory(id);
    setIsHovered(id);
  };

  const handleMouseLeave = () => {
    if (isChatOpen) return;
    setActiveTerritory(null);
    setIsHovered(null);
  };

  const getFill = (color, isActive) => hexAlpha(color, isActive ? 0.18 : 0.09);
  const getStrokeWidth = (isActive) => (isActive ? 2.5 : 1.5);

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-screen ${isChatOpen ? "pointer-events-none" : ""}`}
      style={{ background: "#0d1117", overflow: "visible" }}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        viewBox="0 0 1400 780"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        style={{ display: "block", cursor: "default" }}
        onMouseMove={handleMouseMove}
      >
        <defs>
          {/* ANCIENT PARCHMENT NOISE TEXTURE */}
          <filter id="parchmentNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              result="noise"
              stitchTiles="stitch"
            />
            <feColorMatrix in="noise" type="saturate" values="0" />
          </filter>

          {/* KINGDOM-SPECIFIC RADIAL GRADIENTS */}
          <radialGradient id="ironDominionGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#3d1515" />
            <stop offset="100%" stopColor="#1a0808" />
          </radialGradient>
          <radialGradient id="emeraldArchivesGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#0d2e2e" />
            <stop offset="100%" stopColor="#061818" />
          </radialGradient>
          <radialGradient id="frostCitadelGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#0d1e2e" />
            <stop offset="100%" stopColor="#060f1a" />
          </radialGradient>
          <radialGradient id="goldenKingdomGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#2e1f08" />
            <stop offset="100%" stopColor="#160e04" />
          </radialGradient>

          {/* KINGDOM GLOW EFFECTS */}
          <filter id="ironGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="frostGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* PATTERN TEXTURES */}
          <pattern
            id="sea"
            patternUnits="userSpaceOnUse"
            width="28"
            height="28"
          >
            <circle cx="5" cy="5" r="1" fill="rgba(255,255,255,0.022)" />
            <circle cx="14" cy="14" r="1.3" fill="rgba(255,255,255,0.016)" />
            <circle cx="23" cy="23" r="1" fill="rgba(255,255,255,0.02)" />
          </pattern>
          <pattern
            id="hi"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="#e05252"
              strokeWidth="0.38"
              opacity="0.22"
            />
          </pattern>
          <pattern
            id="he"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="#2dd4a0"
              strokeWidth="0.38"
              opacity="0.22"
            />
          </pattern>
          <pattern
            id="hf"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="#5b9bd5"
              strokeWidth="0.38"
              opacity="0.22"
            />
          </pattern>
          <pattern
            id="hg"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="#f5a623"
              strokeWidth="0.38"
              opacity="0.22"
            />
          </pattern>

          {/* LEGACY FILTERS */}
          <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="vig" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </radialGradient>
          <linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a2235" />
            <stop offset="50%" stopColor="#0d1117" />
            <stop offset="100%" stopColor="#1a2235" />
          </linearGradient>
          <radialGradient id="radialMapBg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#0a0f1a" />
          </radialGradient>
        </defs>

        {/* LAYERED BACKGROUND - ANCIENT MAP ATMOSPHERE */}
        <rect width="1400" height="780" fill="#0a0f1a" />
        <rect width="1400" height="780" fill="url(#radialMapBg)" rx="0" />

        {/* CONCENTRIC DEPTH RINGS */}
        <circle
          cx="700"
          cy="390"
          r="300"
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="0.8"
        />
        <circle
          cx="700"
          cy="390"
          r="200"
          fill="none"
          stroke="rgba(255,255,255,0.02)"
          strokeWidth="0.8"
        />
        <circle
          cx="700"
          cy="390"
          r="100"
          fill="none"
          stroke="rgba(255,255,255,0.02)"
          strokeWidth="0.8"
        />

        <rect width="1400" height="780" fill="url(#sea)" />

        <g opacity="1">
          <line
            x1="280"
            y1="0"
            x2="280"
            y2="780"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
          <line
            x1="560"
            y1="0"
            x2="560"
            y2="780"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
          <line
            x1="700"
            y1="0"
            x2="700"
            y2="780"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
          <line
            x1="840"
            y1="0"
            x2="840"
            y2="780"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
          <line
            x1="1120"
            y1="0"
            x2="1120"
            y2="780"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="280"
            x2="1400"
            y2="280"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="520"
            x2="1400"
            y2="520"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
        </g>

        <g opacity="0.5">
          <path
            d="M670 320 Q685 312 700 320 Q715 328 730 320"
            fill="none"
            stroke="rgba(255,255,255,0.055)"
            strokeWidth="1"
          />
          <path
            d="M668 340 Q685 332 700 340 Q715 348 730 340"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.8"
          />
          <path
            d="M670 440 Q685 432 700 440 Q715 448 730 440"
            fill="none"
            stroke="rgba(255,255,255,0.055)"
            strokeWidth="1"
          />
          <path
            d="M668 460 Q685 452 700 460 Q715 468 730 460"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.8"
          />
        </g>

        {/* ANCIENT TRADE ROUTES WITH WAYPOINTS */}
        {/* Caesar to Playfair */}
        <path
          d="M490 280 L580 280"
          fill="none"
          stroke="#8b9ab5"
          strokeWidth="1"
          strokeDasharray="6,4"
          opacity="0.35"
          className="animate-ancient-routes"
        />
        <text
          x="535"
          y="273"
          fontSize="10"
          fill="#8b9ab5"
          opacity="0.5"
          textAnchor="middle"
        >
          ◆
        </text>

        {/* Caesar to Playfair vertical */}
        <path
          d="M380 380 L380 405"
          fill="none"
          stroke="#8b9ab5"
          strokeWidth="1"
          strokeDasharray="6,4"
          opacity="0.35"
          className="animate-ancient-routes"
        />
        <text
          x="372"
          y="392"
          fontSize="10"
          fill="#8b9ab5"
          opacity="0.5"
          textAnchor="middle"
        >
          ◆
        </text>

        {/* Vigenere to Hill vertical */}
        <path
          d="M1020 380 L1020 405"
          fill="none"
          stroke="#8b9ab5"
          strokeWidth="1"
          strokeDasharray="6,4"
          opacity="0.35"
          className="animate-ancient-routes"
        />
        <text
          x="1028"
          y="392"
          fontSize="10"
          fill="#8b9ab5"
          opacity="0.5"
          textAnchor="middle"
        >
          ◆
        </text>

        {/* Playfair to Hill */}
        <path
          d="M490 620 L580 620"
          fill="none"
          stroke="#8b9ab5"
          strokeWidth="1"
          strokeDasharray="6,4"
          opacity="0.35"
          className="animate-ancient-routes"
        />
        <text
          x="535"
          y="613"
          fontSize="10"
          fill="#8b9ab5"
          opacity="0.5"
          textAnchor="middle"
        >
          ◆
        </text>

        <Territory
          id="caesar"
          territory={TERRITORIES.caesar}
          data={KINGDOM_DATA.caesar}
          isHovered={isHovered === "caesar"}
          onMouseEnter={() => handleMouseEnter("caesar")}
          onClick={() => navigate("/cipher/caesar")}
        />

        <Territory
          id="vigenere"
          territory={TERRITORIES.vigenere}
          data={KINGDOM_DATA.vigenere}
          isHovered={isHovered === "vigenere"}
          onMouseEnter={() => handleMouseEnter("vigenere")}
          onClick={() => navigate("/cipher/vigenere")}
        />

        <Territory
          id="playfair"
          territory={TERRITORIES.playfair}
          data={KINGDOM_DATA.playfair}
          isHovered={isHovered === "playfair"}
          onMouseEnter={() => handleMouseEnter("playfair")}
          onClick={() => navigate("/cipher/playfair")}
        />

        <Territory
          id="hill"
          territory={TERRITORIES.hill}
          data={KINGDOM_DATA.hill}
          isHovered={isHovered === "hill"}
          onMouseEnter={() => handleMouseEnter("hill")}
          onClick={() => navigate("/cipher/hill")}
        />

        {/* AMBIENT PARTICLES / STARS */}
        <g opacity="0.15" className="ambient-stars">
          <circle
            cx="120"
            cy="100"
            r="1.2"
            fill="white"
            className="twinkle-slow"
          />
          <circle
            cx="250"
            cy="75"
            r="0.8"
            fill="white"
            className="twinkle-med"
          />
          <circle
            cx="450"
            cy="50"
            r="1"
            fill="white"
            className="twinkle-fast"
          />
          <circle
            cx="650"
            cy="120"
            r="0.7"
            fill="white"
            className="twinkle-med"
          />
          <circle
            cx="900"
            cy="90"
            r="1.1"
            fill="white"
            className="twinkle-slow"
          />
          <circle
            cx="1100"
            cy="140"
            r="0.9"
            fill="white"
            className="twinkle-fast"
          />
          <circle
            cx="1250"
            cy="70"
            r="1"
            fill="white"
            className="twinkle-med"
          />
          <circle
            cx="1350"
            cy="110"
            r="0.8"
            fill="white"
            className="twinkle-slow"
          />
          <circle
            cx="150"
            cy="730"
            r="1"
            fill="white"
            className="twinkle-med"
          />
          <circle
            cx="400"
            cy="750"
            r="0.9"
            fill="white"
            className="twinkle-fast"
          />
          <circle
            cx="700"
            cy="760"
            r="1.1"
            fill="white"
            className="twinkle-slow"
          />
          <circle
            cx="1000"
            cy="720"
            r="0.8"
            fill="white"
            className="twinkle-med"
          />
          <circle
            cx="1300"
            cy="745"
            r="1"
            fill="white"
            className="twinkle-fast"
          />
          <circle
            cx="80"
            cy="350"
            r="0.7"
            fill="white"
            className="twinkle-slow"
          />
          <circle
            cx="1350"
            cy="400"
            r="0.9"
            fill="white"
            className="twinkle-med"
          />
          <circle
            cx="200"
            cy="500"
            r="1"
            fill="white"
            className="twinkle-fast"
          />
          <circle
            cx="1200"
            cy="550"
            r="0.8"
            fill="white"
            className="twinkle-slow"
          />
          <circle
            cx="500"
            cy="680"
            r="1.1"
            fill="white"
            className="twinkle-med"
          />
          <circle
            cx="1100"
            cy="200"
            r="0.9"
            fill="white"
            className="twinkle-fast"
          />
          <circle
            cx="350"
            cy="300"
            r="1"
            fill="white"
            className="twinkle-slow"
          />
        </g>

        <g
          transform="translate(1320, 720)"
          className="opacity-60 hover:opacity-100 transition-opacity duration-300 z-10"
        >
          {/* COMPASS ROSE HALO */}
          <circle
            cx="0"
            cy="0"
            r="36"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
          />
          <circle
            cx="0"
            cy="0"
            r="28"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.8"
          />

          {/* COMPASS ROSE BODY */}
          <circle
            cx="0"
            cy="0"
            r="36"
            fill="rgba(13,17,23,0.93)"
            stroke="#2a3a52"
            strokeWidth="1.8"
          />
          <circle
            cx="0"
            cy="0"
            r="28"
            fill="none"
            stroke="#c9a96e"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path d="M0 -25 L3.5 -11 L0 -15 L-3.5 -11 Z" fill="#c9a96e" />
          <path d="M0 25 L3.5 11 L0 15 L-3.5 11 Z" fill="#4a5568" />
          <path d="M-25 0 L-11 3.5 L-15 0 L-11 -3.5 Z" fill="#4a5568" />
          <path d="M25 0 L11 3.5 L15 0 L11 -3.5 Z" fill="#4a5568" />
          <text
            x="0"
            y="-31"
            textAnchor="middle"
            fill="#c9a96e"
            fontSize="9"
            fontFamily="'Cinzel', serif"
            fontWeight="bold"
          >
            N
          </text>
          <circle cx="0" cy="0" r="3.5" fill="#c9a96e" />
        </g>

        <rect width="1400" height="780" fill="url(#vig)" pointerEvents="none" />
      </svg>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div className="relative flex items-center justify-center">
          {/* Background glow layers */}
          <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-r from-red-500/20 via-transparent to-purple-500/20 -m-8" />
          <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-b from-white/10 to-transparent -m-6" />

          {/* Main container */}
          <div className="relative px-6 py-2 rounded-full border border-white/20 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl shadow-2xl">
            {/* Inner shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />

            {/* Text with enhanced styling */}
            <span className="relative block text-xs font-cinzel tracking-[0.35em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 font-semibold drop-shadow-lg">
              ✦ The Four Cipher Kingdoms ✦
            </span>
          </div>
        </div>
      </div>

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 1400 780"
        preserveAspectRatio="none"
      >
        {/* ORNATE MAP FRAME - DOUBLE BORDER */}
        {/* Outer border */}
        <rect
          x="10"
          y="10"
          width="1380"
          height="760"
          rx="4"
          fill="none"
          stroke="rgba(180,140,60,0.4)"
          strokeWidth="2"
          opacity="0.8"
        />
        {/* Inner border */}
        <rect
          x="16"
          y="16"
          width="1368"
          height="748"
          rx="3"
          fill="none"
          stroke="rgba(180,140,60,0.15)"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* GOLD ORNAMENTS AT FRAME EDGES */}
        {/* Top center */}
        <text
          x="700"
          y="25"
          textAnchor="middle"
          fill="#c9a96e"
          fontSize="12"
          opacity="0.4"
        >
          +
        </text>
        {/* Bottom center */}
        <text
          x="700"
          y="765"
          textAnchor="middle"
          fill="#c9a96e"
          fontSize="12"
          opacity="0.4"
        >
          +
        </text>
        {/* Left center */}
        <text
          x="20"
          y="395"
          textAnchor="middle"
          fill="#c9a96e"
          fontSize="12"
          opacity="0.4"
        >
          +
        </text>
        {/* Right center */}
        <text
          x="1380"
          y="395"
          textAnchor="middle"
          fill="#c9a96e"
          fontSize="12"
          opacity="0.4"
        >
          +
        </text>

        {/* CORNER ORNAMENTS (existing ones) */}
        <path
          d="M10 40 L28 22 L46 10"
          fill="none"
          stroke="#c9a96e"
          strokeWidth="1.8"
        />
        <circle cx="10" cy="40" r="3" fill="#c9a96e" />
        <circle cx="46" cy="10" r="3" fill="#c9a96e" />
        <path
          d="M1390 40 L1372 22 L1354 10"
          fill="none"
          stroke="#c9a96e"
          strokeWidth="1.8"
        />
        <circle cx="1390" cy="40" r="3" fill="#c9a96e" />
        <circle cx="1354" cy="10" r="3" fill="#c9a96e" />
        <path
          d="M10 740 L28 758 L46 770"
          fill="none"
          stroke="#c9a96e"
          strokeWidth="1.8"
        />
        <circle cx="10" cy="740" r="3" fill="#c9a96e" />
        <circle cx="46" cy="770" r="3" fill="#c9a96e" />
        <path
          d="M1390 740 L1372 758 L1354 770"
          fill="none"
          stroke="#c9a96e"
          strokeWidth="1.8"
        />
        <circle cx="1390" cy="740" r="3" fill="#c9a96e" />
        <circle cx="1354" cy="770" r="3" fill="#c9a96e" />
      </svg>

      {activeTerritory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute z-50"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            pointerEvents: "none",
          }}
        >
          <div
            className="bg-[#0d1117]/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-5 min-w-[220px] max-w-[260px]"
            style={{
              borderLeft: `3px solid ${KINGDOM_DATA[activeTerritory].color}`,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23ffffff' opacity='0.02' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "100px 100px",
            }}
          >
            <div
              className="text-base font-cinzel font-bold tracking-wide"
              style={{ color: KINGDOM_DATA[activeTerritory].color }}
            >
              {KINGDOM_DATA[activeTerritory].name}
            </div>
            <div
              className="text-[11px] tracking-widest uppercase opacity-60 mt-0.5 font-cinzel"
              style={{ color: "#6b7a8d" }}
            >
              {KINGDOM_DATA[activeTerritory].realm}
            </div>
            <div className="text-xs leading-relaxed text-white/55 mt-2 font-mono">
              {KINGDOM_DATA[activeTerritory].description}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-xs text-white/40 font-mono">
                Invented:{" "}
                <span className="text-xs font-semibold text-white/80">
                  {KINGDOM_DATA[activeTerritory].invented}
                </span>
              </span>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wider ${
                  KINGDOM_DATA[activeTerritory].security === "Low"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : KINGDOM_DATA[activeTerritory].security === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : KINGDOM_DATA[activeTerritory].security === "Medium-High"
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {KINGDOM_DATA[activeTerritory].security}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Territory({ id, territory, data, isHovered, onMouseEnter, onClick }) {
  // Determine gradient and glow filter based on kingdom
  const gradientMap = {
    caesar: "ironDominionGrad",
    vigenere: "emeraldArchivesGrad",
    playfair: "frostCitadelGrad",
    hill: "goldenKingdomGrad",
  };
  const glowMap = {
    caesar: "ironGlow",
    vigenere: "emeraldGlow",
    playfair: "frostGlow",
    hill: "goldGlow",
  };

  return (
    <g
      className="cursor-pointer"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* KINGDOM FILL WITH RADIAL GRADIENT */}
      <path
        className="base"
        d={territory.path}
        fill={`url(#${gradientMap[id]})`}
        stroke={data.color}
        strokeWidth={isHovered ? 2.5 : 1.5}
        strokeLinejoin="round"
        filter={isHovered ? `url(#${glowMap[id]})` : "none"}
        style={{ transition: "fill 0.3s, stroke-width 0.3s" }}
      />

      {/* PARCHMENT NOISE TEXTURE OVERLAY */}
      <path
        d={territory.path}
        fill={`url(#${id === "caesar" ? "hi" : id === "vigenere" ? "he" : id === "playfair" ? "hf" : "hg"})`}
        opacity="0.13"
      />

      {/* TERRAIN DETAILS INSIDE KINGDOMS */}
      {id === "caesar" && (
        <>
          {/* Iron Dominion: Crossed Swords Icon */}
          <g opacity="0.4">
            {/* First sword - diagonal down-right */}
            <line
              x1="373"
              y1="248.5"
              x2="387"
              y2="262.5"
              stroke="#e05252"
              strokeWidth="2"
            />
            {/* Second sword - diagonal down-left */}
            <line
              x1="387"
              y1="248.5"
              x2="373"
              y2="262.5"
              stroke="#e05252"
              strokeWidth="2"
            />
            {/* Left crossguard */}
            <line
              x1="371.6"
              y1="252"
              x2="368.1"
              y2="248.5"
              stroke="#e05252"
              strokeWidth="1.5"
            />
            {/* Right crossguard */}
            <line
              x1="388.4"
              y1="252"
              x2="391.9"
              y2="248.5"
              stroke="#e05252"
              strokeWidth="1.5"
            />
          </g>
        </>
      )}

      {id === "vigenere" && (
        <>
          {/* Emerald Archives: Scroll Icon */}
          <g opacity="0.4">
            {/* Scroll body - rounded rectangle */}
            <rect
              x="1008.1"
              y="250.6"
              width="12.6"
              height="15.4"
              rx="3"
              fill="none"
              stroke="#2dd4a0"
              strokeWidth="1.5"
            />
            {/* Text lines inside scroll */}
            <line
              x1="1010.9"
              y1="255.5"
              x2="1017.9"
              y2="255.5"
              stroke="#2dd4a0"
              strokeWidth="1.2"
            />
            <line
              x1="1010.9"
              y1="258.3"
              x2="1017.9"
              y2="258.3"
              stroke="#2dd4a0"
              strokeWidth="1.2"
            />
            <line
              x1="1010.9"
              y1="261.1"
              x2="1015.1"
              y2="261.1"
              stroke="#2dd4a0"
              strokeWidth="1.2"
            />
          </g>
        </>
      )}

      {id === "playfair" && (
        <>
          {/* Frost Citadel: Frozen Plains Hatching */}
          <g opacity="0.1">
            <line
              x1="254"
              y1="571"
              x2="499"
              y2="571"
              stroke="#5b9bd5"
              strokeWidth="0.8"
            />
            <line
              x1="254"
              y1="585"
              x2="499"
              y2="585"
              stroke="#5b9bd5"
              strokeWidth="0.8"
            />
            <line
              x1="254"
              y1="599"
              x2="499"
              y2="599"
              stroke="#5b9bd5"
              strokeWidth="0.8"
            />
            <line
              x1="254"
              y1="613"
              x2="499"
              y2="613"
              stroke="#5b9bd5"
              strokeWidth="0.8"
            />
            <line
              x1="254"
              y1="627"
              x2="499"
              y2="627"
              stroke="#5b9bd5"
              strokeWidth="0.8"
            />
          </g>
        </>
      )}

      {id === "hill" && (
        <>
          {/* Golden Kingdom: City Dots */}
          <g opacity="0.3">
            <circle cx="901" cy="578" r="3" fill="#f5a623" />
            <circle cx="908" cy="574.5" r="2" fill="#f5a623" opacity="0.6" />
            <circle cx="894" cy="574.5" r="2" fill="#f5a623" opacity="0.6" />
            <circle cx="1041" cy="620" r="3" fill="#f5a623" />
            <circle cx="1048" cy="616.5" r="2" fill="#f5a623" opacity="0.6" />
            <circle cx="1034" cy="616.5" r="2" fill="#f5a623" opacity="0.6" />
          </g>
        </>
      )}

      {/* MARCHING BORDER ON HOVER */}
      {isHovered && (
        <path
          className="marching"
          d={territory.path}
          fill="none"
          stroke={
            data.color === "#e05252"
              ? "#f87575"
              : data.color === "#2dd4a0"
                ? "#5eead4"
                : data.color === "#5b9bd5"
                  ? "#93c5fd"
                  : "#fcd34d"
          }
          strokeWidth="0.8"
          strokeDasharray="10,5"
          opacity="0"
          style={{
            animation: "dashMarch 2s linear infinite",
          }}
        />
      )}

      {/* CENTER PULSE CIRCLE */}
      <circle
        cx={territory.center.x}
        cy={territory.center.y}
        r="5"
        fill={data.color}
        opacity="0.55"
      />
      {isHovered && (
        <>
          <circle
            cx={territory.center.x}
            cy={territory.center.y}
            r="5"
            fill={data.color}
            style={{ animation: "sonar 1.4s ease-out infinite" }}
            opacity="0"
          />
          <circle
            cx={territory.center.x}
            cy={territory.center.y}
            r="5"
            fill={data.color}
            style={{
              animation: "sonar 1.4s ease-out infinite",
              animationDelay: "0.6s",
            }}
            opacity="0"
          />
        </>
      )}

      {/* KINGDOM NAME LABEL */}
      <text
        x={territory.textPos.x}
        y={territory.textPos.y}
        textAnchor="middle"
        fill={data.color}
        fontSize="14"
        fontFamily="'Cinzel', serif"
        fontWeight="bold"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.9))" }}
      >
        {data.name.toUpperCase()}
      </text>

      {/* CIPHER REALM SUBTITLE */}
      <text
        x={territory.textPos2.x}
        y={territory.textPos2.y}
        textAnchor="middle"
        fill={data.color}
        fontSize="10"
        fontFamily="'Courier Prime', monospace"
        opacity="0.7"
      >
        {data.realm}
      </text>
    </g>
  );
}
