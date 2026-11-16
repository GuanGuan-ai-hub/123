/**
 * 参数化线稿:同心弧 + 径向刻度 + 流线,纯 SVG 线条构成,仅作装饰。
 * 半径、角度、刻度数量均由参数生成,便于微调。
 */
type Props = { className?: string; seed?: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

function point(cx: number, cy: number, r: number, deg: number) {
  return { x: cx + r * Math.cos(rad(deg)), y: cy + r * Math.sin(rad(deg)) };
}

export default function ParametricArt({ className = "", seed = 0 }: Props) {
  const cx = 320;
  const cy = 420;

  const arcCount = 16;
  const arcs = Array.from({ length: arcCount }, (_, i) => {
    const r = 118 + i * 24;
    const a0 = -166 + (i % 3) * 2;
    const a1 = -14 - (i % 4) * 2;
    const p0 = point(cx, cy, r, a0);
    const p1 = point(cx, cy, r, a1);
    return {
      d: `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 0 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`,
      dashed: i % 4 === 1,
      strong: i % 5 === 0,
    };
  });

  const tickCount = 46;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const deg = -172 + (i * 164) / (tickCount - 1);
    const inner = point(cx, cy, 128, deg);
    const outer = point(cx, cy, 128 + (i % 6 === 0 ? 15 : 7), deg);
    return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, strong: i % 6 === 0 };
  });

  const spokes = [-150, -120, -90, -60, -30].map(deg => {
    const p = point(cx, cy, 470, deg);
    return { x: p.x, y: p.y };
  });

  const nodes = [0, 3, 7, 11].map(i => {
    const deg = -160 + i * 12 + seed;
    return point(cx, cy, 150 + i * 26, deg);
  });

  return (
    <svg
      className={className}
      viewBox="0 0 640 420"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <g stroke="currentColor" strokeWidth="0.75">
        {arcs.map((a, i) => (
          <path
            key={i}
            d={a.d}
            strokeDasharray={a.dashed ? "2 6" : undefined}
            opacity={a.strong ? 0.9 : a.dashed ? 0.5 : 0.68}
          />
        ))}
      </g>

      <g stroke="currentColor" strokeWidth="0.75">
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} opacity={t.strong ? 0.85 : 0.45} />
        ))}
      </g>

      {/* 径向基准线 */}
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.35">
        {spokes.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} strokeDasharray={i % 2 ? "3 7" : undefined} />
        ))}
      </g>

      {/* 流动曲线:两条参数化贝塞尔 */}
      <path
        d={`M 40 ${332 + seed} C 180 ${250 + seed}, 300 ${368 - seed}, 420 ${300 + seed} S 590 ${232 + seed}, 620 ${290 + seed}`}
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.55"
      />
      <path
        d={`M 30 ${366 + seed} C 190 ${300 + seed}, 320 ${404 - seed}, 450 ${338 + seed} S 600 ${286 + seed}, 630 ${336 + seed}`}
        stroke="currentColor"
        strokeWidth="0.7"
        strokeDasharray="1 5"
        opacity="0.5"
      />

      {/* 节点十字标记 */}
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.75">
        {nodes.map((p, i) => (
          <g key={i}>
            <line x1={p.x - 5} y1={p.y} x2={p.x + 5} y2={p.y} />
            <line x1={p.x} y1={p.y - 5} x2={p.x} y2={p.y + 5} />
            <circle cx={p.x} cy={p.y} r="2.2" fill="none" />
          </g>
        ))}
      </g>

      {/* 竖直轴线 */}
      <line x1={cx} y1={cy - 392} x2={cx} y2={cy - 120} stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 8" opacity="0.4" />
    </svg>
  );
}
