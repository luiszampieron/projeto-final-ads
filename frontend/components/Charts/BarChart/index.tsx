export type BarraDado = { label: string; value: number; color?: string }

/**
 * Gráfico de barras simples em SVG (sem dependência externa). Server Component:
 * não há interatividade, então pode ser renderizado inteiramente no servidor.
 */
export default function BarChart({
  data,
  height = 220,
  color = 'var(--verde-700)',
  showValues = true,
  formatValue = (v: number) => String(v),
}: {
  data: BarraDado[]
  height?: number
  color?: string
  showValues?: boolean
  formatValue?: (v: number) => string
}) {
  const largura = 640
  const margemInferior = 34
  const margemSuperior = showValues ? 24 : 12
  const areaAltura = height - margemInferior - margemSuperior
  const max = Math.max(1, ...data.map((d) => d.value))
  const passo = largura / Math.max(data.length, 1)
  const larguraBarra = passo * 0.56

  return (
    <svg viewBox={`0 0 ${largura} ${height}`} width="100%" role="img" aria-label="Gráfico de barras">
      <line
        x1={0}
        y1={height - margemInferior}
        x2={largura}
        y2={height - margemInferior}
        stroke="var(--borda)"
        strokeWidth={1}
      />
      {data.map((d, i) => {
        const alturaBarra = max > 0 ? (d.value / max) * areaAltura : 0
        const x = i * passo + (passo - larguraBarra) / 2
        const y = height - margemInferior - alturaBarra
        return (
          <g key={`${d.label}-${i}`}>
            <rect
              x={x}
              y={y}
              width={larguraBarra}
              height={Math.max(alturaBarra, d.value > 0 ? 2 : 0)}
              rx={6}
              fill={d.color ?? color}
            />
            {showValues && d.value > 0 && (
              <text x={x + larguraBarra / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="var(--texto-suave)">
                {formatValue(d.value)}
              </text>
            )}
            <text
              x={x + larguraBarra / 2}
              y={height - margemInferior + 16}
              textAnchor="middle"
              fontSize="11"
              fill="var(--texto-suave)"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
