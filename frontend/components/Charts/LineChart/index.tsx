export type PontoDado = { label: string; value: number }

/**
 * Gráfico de linha/área simples em SVG (sem dependência externa). Server Component.
 */
export default function LineChart({
  data,
  height = 220,
  color = 'var(--verde-800)',
}: {
  data: PontoDado[]
  height?: number
  color?: string
}) {
  const largura = 640
  const margemInferior = 34
  const margemSuperior = 16
  const margemLateral = 12
  const areaAltura = height - margemInferior - margemSuperior
  const areaLargura = largura - margemLateral * 2
  const max = Math.max(1, ...data.map((d) => d.value))
  const passo = data.length > 1 ? areaLargura / (data.length - 1) : 0

  const pontos = data.map((d, i) => {
    const x = margemLateral + passo * i
    const y = height - margemInferior - (max > 0 ? (d.value / max) * areaAltura : 0)
    return { ...d, x, y }
  })

  const linha = pontos.map((p) => `${p.x},${p.y}`).join(' ')
  const area = `${margemLateral},${height - margemInferior} ${linha} ${largura - margemLateral},${height - margemInferior}`

  return (
    <svg viewBox={`0 0 ${largura} ${height}`} width="100%" role="img" aria-label="Gráfico de linha">
      <line
        x1={0}
        y1={height - margemInferior}
        x2={largura}
        y2={height - margemInferior}
        stroke="var(--borda)"
        strokeWidth={1}
      />
      <polygon points={area} fill={color} opacity={0.12} />
      <polyline points={linha} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {pontos.map((p, i) => (
        <g key={`${p.label}-${i}`}>
          <circle cx={p.x} cy={p.y} r={3.5} fill={color} />
          <text x={p.x} y={height - margemInferior + 16} textAnchor="middle" fontSize="11" fill="var(--texto-suave)">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
