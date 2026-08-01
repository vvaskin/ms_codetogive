import {
  formatCurrency,
  monthlyGiving,
  programmeShares,
} from "@/lib/portal/mock-data";

// Vertical bar chart of monthly giving (single series → brand hue, no legend).
function GivingBarChart() {
  const width = 340;
  const height = 180;
  const padX = 8;
  const padTop = 18;
  const baseline = height - 26;
  const max = Math.max(...monthlyGiving.map((m) => m.amount));
  const slot = (width - padX * 2) / monthlyGiving.length;
  const barW = Math.min(30, slot * 0.58);

  return (
    <svg
      className="impact-chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Your giving over the last seven months"
    >
      {/* baseline */}
      <line
        x1={padX}
        y1={baseline}
        x2={width - padX}
        y2={baseline}
        className="chart-axis"
      />
      {monthlyGiving.map((m, i) => {
        const h = ((m.amount / max) * (baseline - padTop)) || 0;
        const x = padX + slot * i + (slot - barW) / 2;
        const y = baseline - h;
        const isMax = m.amount === max;
        return (
          <g key={m.month} className="chart-bar-group">
            <title>{`${m.month}: ${formatCurrency(m.amount)}`}</title>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={4}
              className={`chart-bar ${isMax ? "is-peak" : ""}`}
            />
            {isMax && (
              <text x={x + barW / 2} y={y - 6} className="chart-bar-value">
                {formatCurrency(m.amount)}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={baseline + 15}
              className="chart-axis-label"
            >
              {m.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Donut of giving split by programme (categorical, direct-labeled legend).
function ProgrammeDonut() {
  const size = 160;
  const r = 62;
  const stroke = 26;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  // Precompute each segment's start offset so nothing mutates during render.
  const segments = programmeShares.map((p, i) => {
    const start = programmeShares
      .slice(0, i)
      .reduce((sum, prev) => sum + (prev.share / 100) * circ, 0);
    return { ...p, len: (p.share / 100) * circ, start };
  });

  return (
    <div className="impact-donut">
      <svg
        className="impact-donut-svg"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Share of your giving by programme"
      >
        <circle cx={c} cy={c} r={r} className="donut-track" strokeWidth={stroke} />
        {segments.map((p) => (
          <circle
            key={p.name}
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={p.color}
            strokeWidth={stroke}
            strokeDasharray={`${p.len} ${circ - p.len}`}
            strokeDashoffset={-p.start}
            transform={`rotate(-90 ${c} ${c})`}
            className="donut-seg"
          >
            <title>{`${p.name}: ${p.share}%`}</title>
          </circle>
        ))}
        <text x={c} y={c - 2} className="donut-center-value">
          {programmeShares.length}
        </text>
        <text x={c} y={c + 16} className="donut-center-label">
          programmes
        </text>
      </svg>
      <ul className="impact-donut-legend">
        {programmeShares.map((p) => (
          <li key={p.name}>
            <span className="legend-dot" style={{ background: p.color }} />
            <span className="legend-name">{p.name}</span>
            <span className="legend-share">{p.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ImpactCharts() {
  return (
    <div className="impact-charts">
      <figure className="impact-chart">
        <figcaption>
          <h3>Your giving</h3>
          <span>Last 7 months</span>
        </figcaption>
        <GivingBarChart />
      </figure>
      <figure className="impact-chart">
        <figcaption>
          <h3>By programme</h3>
          <span>Share of your gifts</span>
        </figcaption>
        <ProgrammeDonut />
      </figure>
    </div>
  );
}
