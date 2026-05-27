import { motion } from 'framer-motion'

export default function MapRegion({ 
  algoId, 
  algo, 
  position, 
  isHovered, 
  onHover, 
  onLeave, 
  onClick 
}) {
  return (
    <g
      className="cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <motion.path
        d={getRegionPath(algoId, position)}
        fill={`${algo.color}20`}
        stroke={algo.color}
        strokeWidth={isHovered ? "1.5" : "0.8"}
        filter={isHovered ? "url(#glow)" : "none"}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{
          transformOrigin: `${position.x + position.width/2}% ${position.y + position.height/2}%`,
        }}
      />
      
      {isHovered && (
        <motion.path
          d={getRegionPath(algoId, position)}
          fill="none"
          stroke={algo.accentColor}
          strokeWidth="0.5"
          strokeDasharray="2,2"
          animate={{ 
            strokeDashoffset: [0, -20],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ 
            strokeDashoffset: 0,
          }}
        />
      )}
      
      <text
        x={position.x + position.width / 2}
        y={position.y + position.height / 2 - 3}
        textAnchor="middle"
        fill={isHovered ? algo.accentColor : algo.color}
        fontSize={isHovered ? "3.5" : "2.8"}
        fontFamily="Cinzel, serif"
        fontWeight="600"
        className="pointer-events-none"
        style={{ transition: 'all 0.3s ease' }}
      >
        {algo.name}
      </text>
      
      {isHovered && (
        <text
          x={position.x + position.width / 2}
          y={position.y + position.height / 2 + 2}
          textAnchor="middle"
          fill={algo.color}
          fontSize="1.8"
          fontFamily="Inter, sans-serif"
          opacity="0.8"
          className="pointer-events-none"
        >
          {algo.realm}
        </text>
      )}
    </g>
  )
}

function getRegionPath(algoId, pos) {
  const { x, y, width, height } = pos
  const cx = x + width / 2
  const cy = y + height / 2
  
  switch (algoId) {
    case 'caesar':
      return `
        M ${x + 5} ${y + 5}
        L ${x + width - 8} ${y + 3}
        L ${x + width - 3} ${y + height - 5}
        L ${x + 8} ${y + height - 3}
        Q ${x + width/2} ${y + height + 5} ${x + 5} ${y + 5}
        Z
      `
    case 'vigenere':
      return `
        M ${x + 3} ${y + 8}
        Q ${x + width/2} ${y - 2} ${x + width - 3} ${y + 8}
        L ${x + width - 5} ${y + height - 5}
        Q ${x + width/2} ${y + height + 3} ${x + 5} ${y + height - 5}
        Z
      `
    case 'playfair':
      return `
        M ${x} ${y + 5}
        L ${x + width} ${y + 8}
        L ${x + width - 5} ${y + height}
        L ${x + 5} ${y + height - 3}
        Z
      `
    case 'hill':
      return `
        M ${x + 8} ${y}
        L ${x + width - 5} ${y + 3}
        L ${x + width} ${y + height - 8}
        L ${x + width - 8} ${y + height}
        L ${x + 5} ${y + height - 5}
        Z
      `
    default:
      return `M ${x} ${y} h ${width} v ${height} h ${-width} Z`
  }
}