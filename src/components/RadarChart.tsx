import React from 'react';

interface RadarChartProps {
  data: {
    label: string;
    value: number; // 0 to 100
  }[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 340 }) => {
  const center = size / 2;
  const radius = size * 0.38;
  const total = data.length;

  // Compute vertices for polygon
  const angleSlice = (Math.PI * 2) / (total || 1);

  const points = data.map((d, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const r = (d.value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, label: d.label, value: d.value, angle };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Circles / Polygons */}
        {levels.map((lvl, lIdx) => {
          const lvlPoints = data
            .map((_, i) => {
              const angle = angleSlice * i - Math.PI / 2;
              const r = lvl * radius;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={lIdx}
              points={lvlPoints}
              fill="none"
              stroke="#D5D2C9"
              strokeWidth="1"
              strokeDasharray={lIdx === levels.length - 1 ? 'none' : '3,3'}
            />
          );
        })}

        {/* Axes lines */}
        {data.map((_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#D5D2C9"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(15, 110, 86, 0.25)"
          stroke="#05352E"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4.5"
            fill="#FDDC42"
            stroke="#05352E"
            strokeWidth="2"
            className="transition-all duration-700"
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const labelDist = radius + 24;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);

          // Anchor adjustment typed explicitly
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          if (Math.cos(angle) < -0.3) textAnchor = 'end';

          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline="central"
              className="text-[10px] sm:text-[11px] font-medium fill-[#182A21]"
            >
              {d.label}
              <tspan className="font-mono font-bold fill-[#0F6E56]" x={x} dy="13">
                {d.value}%
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
};
