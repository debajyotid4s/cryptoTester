import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Territory paths - EXACT from reference SVG
const TERRITORIES = {
  caesar: {
    path: "M0,0 L410,0 L390,30 L420,55 L400,90 L380,120 L350,155 L330,180 L310,210 L290,235 L270,210 L240,220 L210,200 L180,210 L150,200 L120,210 L90,200 L60,215 L30,210 L0,220 Z",
    fillColor: "#3d1a1a",
    centerX: 140,
    centerY: 100,
  },
  vigenere: {
    path: "M410,0 L680,0 L680,240 L650,230 L610,245 L580,230 L560,245 L530,235 L510,245 L490,230 L460,240 L440,225 L420,240 L400,220 L390,200 L410,175 L430,155 L450,130 L420,100 L440,70 L420,45 L440,20 L410,0 Z",
    fillColor: "#0d2e2a",
    centerX: 555,
    centerY: 110,
  },
  playfair: {
    path: "M0,220 L30,210 L60,215 L90,200 L120,210 L150,200 L180,210 L210,200 L240,220 L270,210 L290,235 L310,260 L280,270 L300,290 L280,310 L300,330 L270,345 L290,360 L260,370 L270,385 L240,395 L210,385 L180,395 L150,385 L120,395 L90,385 L60,395 L30,385 L0,390 Z",
    fillColor: "#0d1e30",
    centerX: 120,
    centerY: 310,
  },
  hill: {
    path: "M290,235 L310,210 L330,180 L350,155 L410,175 L390,200 L400,220 L420,240 L440,225 L460,240 L490,230 L510,245 L530,235 L560,245 L580,230 L610,245 L650,230 L680,240 L680,420 L0,420 L0,390 L30,385 L60,395 L90,385 L120,395 L150,385 L180,395 L210,385 L240,395 L270,385 L260,370 L290,360 L270,345 L300,330 L280,310 L300,290 L280,270 L310,260 L290,235 Z",
    fillColor: "#2a1e08",
    centerX: 490,
    centerY: 340,
  },
};

export default function FantasyMap({ isChatOpen = false }) {
  const navigate = useNavigate();
  const [hoveredTerritory, setHoveredTerritory] = useState(null);
  const containerRef = useRef(null);

  const handleTerritoryClick = (territoryId) => {
    if (isChatOpen) return;
    const routes = {
      caesar: "/cipher/caesar",
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

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black flex items-center justify-center relative"
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: isChatOpen ? "none" : "auto" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 680 420"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      >
        <title>Fantasy map tessellation — full-coverage territory layout</title>
        <desc>
          Four kingdoms that share borders and cover the entire canvas with no
          gaps
        </desc>

        <defs>
          {/* HATCH PATTERNS - exact from reference */}
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
              opacity="0.3"
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
              opacity="0.3"
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
              opacity="0.3"
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
              opacity="0.3"
            />
          </pattern>
        </defs>

        {/* IRON DOMINION - Caesar */}
        <path
          d={TERRITORIES.caesar.path}
          fill={TERRITORIES.caesar.fillColor}
          stroke="none"
          style={{
            cursor: "pointer",
            opacity: hoveredTerritory === "caesar" ? 1 : 0.9,
            filter:
              hoveredTerritory === "caesar"
                ? "brightness(1.2)"
                : "brightness(1)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => handleMouseEnter("caesar")}
          onClick={() => handleTerritoryClick("caesar")}
        />
        <path
          d={TERRITORIES.caesar.path}
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

        {/* BORDER LINES - drawn on top */}
        <g
          fill="none"
          stroke="rgba(200,190,160,0.45)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          {/* Iron ↔ Emerald */}
          <path d="M410,0 L440,20 L420,45 L440,70 L420,100 L450,130 L430,155 L410,175 L350,155 L330,180 L310,210 L290,235" />
          {/* Iron ↔ Frost */}
          <path d="M0,220 L30,210 L60,215 L90,200 L120,210 L150,200 L180,210 L210,200 L240,220 L270,210 L290,235" />
          {/* Emerald ↔ Golden */}
          <path d="M680,240 L650,230 L610,245 L580,230 L560,245 L530,235 L510,245 L490,230 L460,240 L440,225 L420,240 L400,220 L390,200 L400,220" />
          {/* Frost ↔ Golden */}
          <path d="M290,235 L310,260 L280,270 L300,290 L280,310 L300,330 L270,345 L290,360 L260,370 L270,385 L240,395" />
        </g>

        {/* Outer map border */}
        <rect
          x="0"
          y="0"
          width="680"
          height="420"
          fill="none"
          stroke="rgba(200,190,160,0.6)"
          strokeWidth="2"
        />

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
          letterSpacing="1"
        >
          IRON DOMINION
        </text>
        <text
          x="140"
          y="116"
          fontFamily="monospace"
          fontSize="9"
          fill="#c07070"
          textAnchor="middle"
          opacity="0.7"
          letterSpacing="1"
        >
          Caesar Cipher
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
          letterSpacing="1"
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
          letterSpacing="1"
        >
          Vigenère Cipher
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
          letterSpacing="1"
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
          letterSpacing="1"
        >
          Playfair Cipher
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
          letterSpacing="1"
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
          letterSpacing="1"
        >
          Hill Cipher
        </text>
      </svg>
    </div>
  );
}
