import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TERRITORIES = {
  rsa: {
    path: "M0,0 L410,0 L390,30 L420,55 L400,90 L380,120 L350,155 L330,180 L310,210 L290,235 L270,210 L240,220 L210,200 L180,210 L150,200 L120,210 L90,200 L60,215 L30,210 L0,220 Z",
    fillColor: "#3d1a1a",
  },
  vigenere: {
    path: "M410,0 L680,0 L680,240 L650,230 L610,245 L580,230 L560,245 L530,235 L510,245 L490,230 L460,240 L440,225 L420,240 L400,220 L390,200 L410,175 L430,155 L450,130 L420,100 L440,70 L420,45 L440,20 L410,0 Z",
    fillColor: "#0d2e2a",
  },
  playfair: {
    path: "M0,220 L30,210 L60,215 L90,200 L120,210 L150,200 L180,210 L210,200 L240,220 L270,210 L290,235 L310,260 L280,270 L300,290 L280,310 L300,330 L270,345 L290,360 L260,370 L270,385 L240,395 L210,385 L180,395 L150,385 L120,395 L90,385 L60,395 L30,385 L0,390 Z",
    fillColor: "#0d1e30",
  },
  hill: {
    path: "M290,235 L310,210 L330,180 L350,155 L410,175 L390,200 L400,220 L420,240 L440,225 L460,240 L490,230 L510,245 L530,235 L560,245 L580,230 L610,245 L650,230 L680,240 L680,420 L0,420 L0,390 L30,385 L60,395 L90,385 L120,395 L150,385 L180,395 L210,385 L240,395 L270,385 L260,370 L290,360 L270,345 L300,330 L280,310 L300,290 L280,270 L310,260 L290,235 Z",
    fillColor: "#2a1e08",
  },
};

const TERRAIN_ICONS = {
  rsa: [
    { x: 70, y: 50 },
    { x: 120, y: 80 },
    { x: 200, y: 60 },
    { x: 300, y: 100 },
    { x: 150, y: 150 },
    { x: 80, y: 180 },
    { x: 250, y: 170 },
  ],
  vigenere: [
    { x: 450, y: 30 },
    { x: 520, y: 80 },
    { x: 600, y: 50 },
    { x: 500, y: 150 },
    { x: 580, y: 130 },
    { x: 630, y: 180 },
    { x: 540, y: 200 },
  ],
  playfair: [
    { x: 40, y: 280 },
    { x: 90, y: 250 },
    { x: 160, y: 300 },
    { x: 70, y: 350 },
    { x: 130, y: 380 },
    { x: 210, y: 310 },
    { x: 240, y: 370 },
  ],
  hill: [
    { x: 350, y: 280 },
    { x: 440, y: 260 },
    { x: 510, y: 300 },
    { x: 570, y: 280 },
    { x: 420, y: 350 },
    { x: 490, y: 380 },
    { x: 560, y: 360 },
  ],
};

function Mountain({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx},${cy})`} opacity="0.2">
      <polyline
        points="-6,4 -3,-4 0,2 3,-5 6,4"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Tree({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx},${cy})`} opacity="0.2">
      <line x1="0" y1="2" x2="0" y2="6" stroke={color} strokeWidth="0.8" />
      <circle
        cx="0"
        cy="-1"
        r="3"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
      />
      <circle
        cx="-2"
        cy="0"
        r="2.5"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
      />
      <circle
        cx="2"
        cy="0"
        r="2.5"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
      />
    </g>
  );
}

function Crystal({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx},${cy})`} opacity="0.2">
      <polygon
        points="0,-5 3,-1 2,4 -2,4 -3,-1"
        fill="none"
        stroke={color}
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <line
        x1="0"
        y1="-5"
        x2="0"
        y2="4"
        stroke={color}
        strokeWidth="0.4"
        opacity="0.5"
      />
    </g>
  );
}

function Wheat({ cx, cy, color }) {
  return (
    <g transform={`translate(${cx},${cy})`} opacity="0.2">
      <line x1="0" y1="5" x2="0" y2="-2" stroke={color} strokeWidth="0.7" />
      <ellipse
        cx="0"
        cy="-3"
        rx="1.5"
        ry="3"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
      />
      <line
        x1="-1.5"
        y1="-3"
        x2="-3"
        y2="-5"
        stroke={color}
        strokeWidth="0.5"
      />
      <line x1="1.5" y1="-3" x2="3" y2="-5" stroke={color} strokeWidth="0.5" />
    </g>
  );
}

function RsaEmblem() {
  return (
    <g transform="translate(140, 74)" opacity="0.85">
      <circle
        cx="0"
        cy="0"
        r="16"
        fill="none"
        stroke="#e08080"
        strokeWidth="1.2"
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fontSize="12"
        fontFamily="monospace"
        fill="#e08080"
        fontWeight="bold"
      >
        K
      </text>
      <text
        x="0"
        y="-7"
        textAnchor="middle"
        fontSize="7"
        fontFamily="monospace"
        fill="#e08080"
        opacity="0.7"
      >
        &#123;e,d&#125;
      </text>
    </g>
  );
}

function VigenereEmblem() {
  return (
    <g transform="translate(555, 84)" opacity="0.85">
      <rect
        x="-14"
        y="-14"
        width="28"
        height="28"
        fill="none"
        stroke="#60c0a0"
        strokeWidth="1"
      />
      <line
        x1="-14"
        y1="-7"
        x2="14"
        y2="-7"
        stroke="#60c0a0"
        strokeWidth="0.5"
      />
      <line x1="-14" y1="0" x2="14" y2="0" stroke="#60c0a0" strokeWidth="0.5" />
      <line x1="-14" y1="7" x2="14" y2="7" stroke="#60c0a0" strokeWidth="0.5" />
      <line
        x1="-7"
        y1="-14"
        x2="-7"
        y2="14"
        stroke="#60c0a0"
        strokeWidth="0.5"
      />
      <line x1="0" y1="-14" x2="0" y2="14" stroke="#60c0a0" strokeWidth="0.5" />
      <line x1="7" y1="-14" x2="7" y2="14" stroke="#60c0a0" strokeWidth="0.5" />
    </g>
  );
}

function PlayfairEmblem() {
  return (
    <g transform="translate(120, 284)" opacity="0.85">
      <rect
        x="-14"
        y="-14"
        width="28"
        height="28"
        fill="none"
        stroke="#7090c0"
        strokeWidth="1"
      />
      <line
        x1="-14"
        y1="-8.4"
        x2="14"
        y2="-8.4"
        stroke="#7090c0"
        strokeWidth="0.4"
      />
      <line
        x1="-14"
        y1="-2.8"
        x2="14"
        y2="-2.8"
        stroke="#7090c0"
        strokeWidth="0.4"
      />
      <line
        x1="-14"
        y1="2.8"
        x2="14"
        y2="2.8"
        stroke="#7090c0"
        strokeWidth="0.4"
      />
      <line
        x1="-14"
        y1="8.4"
        x2="14"
        y2="8.4"
        stroke="#7090c0"
        strokeWidth="0.4"
      />
      <line
        x1="-8.4"
        y1="-14"
        x2="-8.4"
        y2="14"
        stroke="#7090c0"
        strokeWidth="0.4"
      />
      <line
        x1="-2.8"
        y1="-14"
        x2="-2.8"
        y2="14"
        stroke="#7090c0"
        strokeWidth="0.4"
      />
      <line
        x1="2.8"
        y1="-14"
        x2="2.8"
        y2="14"
        stroke="#7090c0"
        strokeWidth="0.4"
      />
      <line
        x1="8.4"
        y1="-14"
        x2="8.4"
        y2="14"
        stroke="#7090c0"
        strokeWidth="0.4"
      />
    </g>
  );
}

function HillEmblem() {
  return (
    <g transform="translate(490, 314)" opacity="0.85">
      <rect
        x="-14"
        y="-14"
        width="28"
        height="28"
        fill="none"
        stroke="#e0a040"
        strokeWidth="1.2"
      />
      <line x1="-14" y1="0" x2="14" y2="0" stroke="#e0a040" strokeWidth="0.7" />
      <line x1="0" y1="-14" x2="0" y2="14" stroke="#e0a040" strokeWidth="0.7" />
      <circle cx="-5" cy="-5" r="2" fill="#e0a040" opacity="0.5" />
      <circle cx="5" cy="-5" r="2" fill="#e0a040" opacity="0.5" />
      <circle cx="-5" cy="5" r="2" fill="#e0a040" opacity="0.5" />
      <circle cx="5" cy="5" r="2" fill="#e0a040" opacity="0.5" />
    </g>
  );
}

export default function FantasyMap({ isChatOpen = false }) {
  const navigate = useNavigate();
  const [hoveredTerritory, setHoveredTerritory] = useState(null);
  const containerRef = useRef(null);

  const handleTerritoryClick = (territoryId) => {
    if (isChatOpen) return;
    const routes = {
      rsa: "/cipher/rsa",
      vigenere: "/cipher/vigenere",
      playfair: "/cipher/playfair",
      hill: "/cipher/hill",
    };
    navigate(routes[territoryId]);
  };

  const handleMouseEnter = (territoryId) => {
    if (isChatOpen) return;
    setHoveredTerritory(territoryId);
  };

  const handleMouseLeave = () => {
    setHoveredTerritory(null);
  };

  const terrainIcons = [
    {
      id: "rsa",
      Icon: Mountain,
      color: "#e08080",
      positions: TERRAIN_ICONS.rsa,
    },
    {
      id: "vigenere",
      Icon: Tree,
      color: "#60c0a0",
      positions: TERRAIN_ICONS.vigenere,
    },
    {
      id: "playfair",
      Icon: Crystal,
      color: "#7090c0",
      positions: TERRAIN_ICONS.playfair,
    },
    {
      id: "hill",
      Icon: Wheat,
      color: "#e0a040",
      positions: TERRAIN_ICONS.hill,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        pointerEvents: isChatOpen ? "none" : "auto",
      }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Map background layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
          radial-gradient(ellipse at 50% 40%, rgba(255,200,120,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%),
          repeating-linear-gradient(0deg, rgba(212,175,122,0.02) 0px, transparent 1px, transparent 72px),
          repeating-linear-gradient(90deg, rgba(212,175,122,0.018) 0px, transparent 1px, transparent 72px),
          #0a0806
        `,
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Candlelit glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,180,80,0.05) 0%, transparent 55%)",
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 680 420"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
        style={{
          zIndex: 1,
        }}
      >
        <defs>
          {/* Roughen filter for hand-inked border effect */}
          <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Decorative frame engraving pattern */}
          <pattern
            id="frame-dots"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
          >
            <circle cx="3" cy="3" r="0.5" fill="rgba(212,175,122,0.3)" />
          </pattern>

          {/* Hatch patterns */}
          <pattern
            id="hatch-iron"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="#a04040"
              strokeWidth="0.5"
              opacity="0.25"
            />
          </pattern>
          <pattern
            id="hatch-emerald"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(30)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="#206060"
              strokeWidth="0.5"
              opacity="0.25"
            />
          </pattern>
          <pattern
            id="hatch-frost"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(60)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="#2040a0"
              strokeWidth="0.5"
              opacity="0.25"
            />
          </pattern>
          <pattern
            id="hatch-gold"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(15)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="#a06010"
              strokeWidth="0.5"
              opacity="0.25"
            />
          </pattern>
        </defs>

        {/* Outer decorative frame */}
        <rect
          x="2"
          y="2"
          width="676"
          height="416"
          fill="none"
          stroke="rgba(212,175,122,0.35)"
          strokeWidth="1.5"
          rx="2"
        />
        <rect
          x="6"
          y="6"
          width="668"
          height="408"
          fill="none"
          stroke="rgba(212,175,122,0.15)"
          strokeWidth="0.5"
          rx="1"
        />
        <rect x="2" y="2" width="676" height="416" fill="url(#frame-dots)" />

        {/* Corner flourishes */}
        <g stroke="rgba(212,175,122,0.3)" fill="none" strokeWidth="0.8">
          {/* Top-left */}
          <path d="M2,20 Q12,10 20,2" />
          <path d="M2,30 Q20,15 30,2" />
          <path d="M6,14 Q14,6 14,6" strokeWidth="0.5" />
          {/* Top-right */}
          <path d="M678,20 Q668,10 660,2" />
          <path d="M678,30 Q660,15 650,2" />
          <path d="M674,14 Q666,6 666,6" strokeWidth="0.5" />
          {/* Bottom-left */}
          <path d="M2,400 Q12,410 20,418" />
          <path d="M2,390 Q20,405 30,418" />
          <path d="M6,406 Q14,414 14,414" strokeWidth="0.5" />
          {/* Bottom-right */}
          <path d="M678,400 Q668,410 660,418" />
          <path d="M678,390 Q660,405 650,418" />
          <path d="M674,406 Q666,414 666,414" strokeWidth="0.5" />
        </g>

        {/* IRON SANCTUM - RSA */}
        <path
          d={TERRITORIES.rsa.path}
          fill={TERRITORIES.rsa.fillColor}
          stroke="none"
          style={{
            cursor: "pointer",
            opacity: hoveredTerritory === "rsa" ? 1 : 0.9,
            filter:
              hoveredTerritory === "rsa" ? "brightness(1.2)" : "brightness(1)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => handleMouseEnter("rsa")}
          onClick={() => handleTerritoryClick("rsa")}
        />
        <path
          d={TERRITORIES.rsa.path}
          fill="url(#hatch-iron)"
          stroke="none"
          pointerEvents="none"
        />

        {/* EMERALD ARCHIVES - Vigenere */}
        <path
          d={TERRITORIES.vigenere.path}
          fill={TERRITORIES.vigenere.fillColor}
          stroke="none"
          style={{
            cursor: "pointer",
            opacity: hoveredTerritory === "vigenere" ? 1 : 0.9,
            filter:
              hoveredTerritory === "vigenere"
                ? "brightness(1.2)"
                : "brightness(1)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => handleMouseEnter("vigenere")}
          onClick={() => handleTerritoryClick("vigenere")}
        />
        <path
          d={TERRITORIES.vigenere.path}
          fill="url(#hatch-emerald)"
          stroke="none"
          pointerEvents="none"
        />

        {/* FROST CITADEL - Playfair */}
        <path
          d={TERRITORIES.playfair.path}
          fill={TERRITORIES.playfair.fillColor}
          stroke="none"
          style={{
            cursor: "pointer",
            opacity: hoveredTerritory === "playfair" ? 1 : 0.9,
            filter:
              hoveredTerritory === "playfair"
                ? "brightness(1.2)"
                : "brightness(1)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => handleMouseEnter("playfair")}
          onClick={() => handleTerritoryClick("playfair")}
        />
        <path
          d={TERRITORIES.playfair.path}
          fill="url(#hatch-frost)"
          stroke="none"
          pointerEvents="none"
        />

        {/* GOLDEN KINGDOM - Hill */}
        <path
          d={TERRITORIES.hill.path}
          fill={TERRITORIES.hill.fillColor}
          stroke="none"
          style={{
            cursor: "pointer",
            opacity: hoveredTerritory === "hill" ? 1 : 0.9,
            filter:
              hoveredTerritory === "hill" ? "brightness(1.2)" : "brightness(1)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => handleMouseEnter("hill")}
          onClick={() => handleTerritoryClick("hill")}
        />
        <path
          d={TERRITORIES.hill.path}
          fill="url(#hatch-gold)"
          stroke="none"
          pointerEvents="none"
        />

        {/* Terrain icons */}
        {terrainIcons.map(({ id, Icon, color, positions }) =>
          positions.map((pos, i) => (
            <Icon key={`${id}-${i}`} cx={pos.x} cy={pos.y} color={color} />
          )),
        )}

        {/* Hand-inked border paths (roughened) */}
        <g
          fill="none"
          stroke="rgba(200,190,160,0.5)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          filter="url(#roughen)"
        >
          <path d="M410,0 L440,20 L420,45 L440,70 L420,100 L450,130 L430,155 L410,175 L350,155 L330,180 L310,210 L290,235" />
          <path d="M0,220 L30,210 L60,215 L90,200 L120,210 L150,200 L180,210 L210,200 L240,220 L270,210 L290,235" />
          <path d="M680,240 L650,230 L610,245 L580,230 L560,245 L530,235 L510,245 L490,230 L460,240 L440,225 L420,240 L400,220 L390,200 L400,220" />
          <path d="M290,235 L310,260 L280,270 L300,290 L280,310 L300,330 L270,345 L290,360 L260,370 L270,385 L240,395" />
        </g>

        {/* Second subtle offset border line for double-line effect */}
        <g
          fill="none"
          stroke="rgba(200,190,160,0.15)"
          strokeWidth="0.8"
          strokeLinejoin="round"
          filter="url(#roughen)"
          transform="translate(1.5, 1.5)"
        >
          <path d="M410,0 L440,20 L420,45 L440,70 L420,100 L450,130 L430,155 L410,175 L350,155 L330,180 L310,210 L290,235" />
          <path d="M0,220 L30,210 L60,215 L90,200 L120,210 L150,200 L180,210 L210,200 L240,220 L270,210 L290,235" />
          <path d="M680,240 L650,230 L610,245 L580,230 L560,245 L530,235 L510,245 L490,230 L460,240 L440,225 L420,240 L400,220 L390,200 L400,220" />
          <path d="M290,235 L310,260 L280,270 L300,290 L280,310 L300,330 L270,345 L290,360 L260,370 L270,385 L240,395" />
        </g>

        {/* Kingdom emblems */}
        <RsaEmblem />
        <VigenereEmblem />
        <PlayfairEmblem />
        <HillEmblem />

        {/* Kingdom labels */}
        <text
          x="140"
          y="100"
          fontFamily="Georgia, serif"
          fontSize="13"
          fontWeight="600"
          fill="#e08080"
          textAnchor="middle"
          opacity="0.9"
          letterSpacing="2"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
        >
          IRON SANCTUM
        </text>
        <text
          x="140"
          y="116"
          fontFamily="monospace"
          fontSize="9"
          fill="#c07070"
          textAnchor="middle"
          opacity="0.7"
          letterSpacing="2"
          style={{ fontVariant: "small-caps" }}
        >
          ⸻ RSA Cipher ⸻
        </text>

        <text
          x="555"
          y="110"
          fontFamily="Georgia, serif"
          fontSize="13"
          fontWeight="600"
          fill="#60c0a0"
          textAnchor="middle"
          opacity="0.9"
          letterSpacing="2"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
        >
          EMERALD ARCHIVES
        </text>
        <text
          x="555"
          y="126"
          fontFamily="monospace"
          fontSize="9"
          fill="#40a080"
          textAnchor="middle"
          opacity="0.7"
          letterSpacing="2"
          style={{ fontVariant: "small-caps" }}
        >
          ⸻ Vigenère Cipher ⸻
        </text>

        <text
          x="120"
          y="310"
          fontFamily="Georgia, serif"
          fontSize="13"
          fontWeight="600"
          fill="#7090c0"
          textAnchor="middle"
          opacity="0.9"
          letterSpacing="2"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
        >
          FROST CITADEL
        </text>
        <text
          x="120"
          y="326"
          fontFamily="monospace"
          fontSize="9"
          fill="#5080b0"
          textAnchor="middle"
          opacity="0.7"
          letterSpacing="2"
          style={{ fontVariant: "small-caps" }}
        >
          ⸻ Playfair Cipher ⸻
        </text>

        <text
          x="490"
          y="340"
          fontFamily="Georgia, serif"
          fontSize="13"
          fontWeight="600"
          fill="#e0a040"
          textAnchor="middle"
          opacity="0.9"
          letterSpacing="2"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
        >
          GOLDEN KINGDOM
        </text>
        <text
          x="490"
          y="356"
          fontFamily="monospace"
          fontSize="9"
          fill="#c08020"
          textAnchor="middle"
          opacity="0.7"
          letterSpacing="2"
          style={{ fontVariant: "small-caps" }}
        >
          ⸻ Hill Cipher ⸻
        </text>

        {/* Compass Rose - ornate 8-point star */}
        <g transform="translate(625, 380)" opacity="0.5">
          {/* Outer ring */}
          <circle
            cx="0"
            cy="0"
            r="22"
            fill="none"
            stroke="rgba(212,175,122,0.4)"
            strokeWidth="0.6"
          />
          <circle
            cx="0"
            cy="0"
            r="20"
            fill="none"
            stroke="rgba(212,175,122,0.15)"
            strokeWidth="0.3"
          />

          {/* Cardinal points */}
          <polygon
            points="0,-18 3,-5 0,-2 -3,-5"
            fill="rgba(212,175,122,0.5)"
          />
          <polygon points="0,18 3,5 0,2 -3,5" fill="rgba(212,175,122,0.3)" />
          <polygon
            points="-18,0 -5,3 -2,0 -5,-3"
            fill="rgba(212,175,122,0.3)"
          />
          <polygon points="18,0 5,3 2,0 5,-3" fill="rgba(212,175,122,0.3)" />

          {/* Intercardinal points */}
          <polygon
            points="-12,-12 -3,-4 -1,-1 -4,-3"
            fill="rgba(212,175,122,0.2)"
          />
          <polygon
            points="12,-12 3,-4 1,-1 4,-3"
            fill="rgba(212,175,122,0.2)"
          />
          <polygon
            points="-12,12 -3,4 -1,1 -4,3"
            fill="rgba(212,175,122,0.2)"
          />
          <polygon points="12,12 3,4 1,1 4,3" fill="rgba(212,175,122,0.2)" />

          {/* Center */}
          <circle cx="0" cy="0" r="2" fill="rgba(212,175,122,0.5)" />

          {/* Labels */}
          <text
            x="0"
            y="-24"
            fontFamily="Georgia, serif"
            fontSize="6"
            fill="rgba(212,175,122,0.5)"
            textAnchor="middle"
            fontWeight="bold"
          >
            N
          </text>
          <text
            x="0"
            y="30"
            fontFamily="Georgia, serif"
            fontSize="6"
            fill="rgba(212,175,122,0.4)"
            textAnchor="middle"
            fontWeight="bold"
          >
            S
          </text>
          <text
            x="-28"
            y="2.5"
            fontFamily="Georgia, serif"
            fontSize="6"
            fill="rgba(212,175,122,0.4)"
            textAnchor="middle"
            fontWeight="bold"
          >
            W
          </text>
          <text
            x="28"
            y="2.5"
            fontFamily="Georgia, serif"
            fontSize="6"
            fill="rgba(212,175,122,0.4)"
            textAnchor="middle"
            fontWeight="bold"
          >
            E
          </text>
        </g>
      </svg>
    </div>
  );
}
