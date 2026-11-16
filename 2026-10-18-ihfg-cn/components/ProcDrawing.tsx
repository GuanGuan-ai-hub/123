/**
 * 程序化生成的"平面线稿"缩略图。
 * 同一 seed 永远输出同一张图,用来替代尚无实拍照片的空间图片位。
 */
type Props = { seed: string; className?: string; variant?: "plan" | "section"; weight?: number };

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function ProcDrawing({ seed, className = "", variant = "plan", weight = 1 }: Props) {
  const rnd = makeRng(hashStr(seed));
  const W = 320;
  const H = 210;
  const m = 18;

  // 房间分割
  const cols = 2 + Math.floor(rnd() * 2);
  const rows = 2 + Math.floor(rnd() * 2);
  const colGaps = Array.from({ length: cols - 1 }, () => 0.32 + rnd() * 0.36).sort();
  const rowGaps = Array.from({ length: rows - 1 }, () => 0.34 + rnd() * 0.32).sort();

  const xs = [m, ...colGaps.map(g => m + (W - 2 * m) * g), W - m];
  const ys = [m, ...rowGaps.map(g => m + (H - 2 * m) * g), H - m];

  const cells: { x: number; y: number; w: number; h: number; key: string }[] = [];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      cells.push({ x: xs[i], y: ys[j], w: xs[i + 1] - xs[i], h: ys[j + 1] - ys[j], key: `${i}-${j}` });
    }
  }

  // 门弧
  const doors = cells
    .filter(() => rnd() > 0.55)
    .slice(0, 3)
    .map((c, i) => {
      const r = Math.min(c.w, c.h) * (0.35 + rnd() * 0.25);
      const atLeft = i % 2 === 0;
      const x = atLeft ? c.x : c.x + c.w;
      const y = c.y + c.h * (0.3 + rnd() * 0.4);
      const sweep = atLeft ? 1 : 0;
      return { d: `M ${x.toFixed(1)} ${y.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 ${sweep} ${(atLeft ? x + r : x - r).toFixed(1)} ${y.toFixed(1)}` };
    });

  // 斜线填充的房间
  const hatchCell = cells[Math.floor(rnd() * cells.length)];
  const hatches = Array.from({ length: 9 }, (_, i) => {
    const off = i * 9;
    return {
      x1: hatchCell.x + off,
      y1: hatchCell.y + hatchCell.h,
      x2: hatchCell.x + off + hatchCell.h,
      y2: hatchCell.y,
    };
  });

  // 边缘刻度
  const ticks = Array.from({ length: Math.floor((W - 2 * m) / 16) }, (_, i) => m + i * 16);

  const nodes = Array.from({ length: 2 }, () => ({
    x: m + rnd() * (W - 2 * m),
    y: m + rnd() * (H - 2 * m),
  }));

  // 二级分隔:把两间房再切小,增加图纸密度
  const subCells = cells
    .filter(() => rnd() > 0.55)
    .slice(0, 2)
    .map(c => {
      const vertical = c.w > c.h;
      const t = 0.35 + rnd() * 0.3;
      return vertical
        ? { x1: c.x + c.w * t, y1: c.y, x2: c.x + c.w * t, y2: c.y + c.h }
        : { x1: c.x, y1: c.y + c.h * t, x2: c.x + c.w, y2: c.y + c.h * t };
    });

  // 家具/设备小块
  const fixtures = Array.from({ length: 5 }, () => {
    const c = cells[Math.floor(rnd() * cells.length)];
    const w = 8 + rnd() * 16;
    const h = 6 + rnd() * 12;
    return { x: c.x + 6 + rnd() * Math.max(4, c.w - w - 12), y: c.y + 6 + rnd() * Math.max(4, c.h - h - 12), w, h };
  });

  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" strokeWidth={0.9 * weight} opacity="0.55">
        <rect x={m} y={m} width={W - 2 * m} height={H - 2 * m} />
        {xs.slice(1, -1).map(x => (
          <line key={`vx${x}`} x1={x} y1={m} x2={x} y2={H - m} opacity="0.75" />
        ))}
        {ys.slice(1, -1).map(y => (
          <line key={`hy${y}`} x1={m} y1={y} x2={W - m} y2={y} opacity="0.75" />
        ))}
      </g>

      {variant === "section" && (
        <g stroke="currentColor" strokeWidth={0.7 * weight} opacity="0.3">
          {Array.from({ length: 6 }, (_, i) => (
            <line key={i} x1={m} y1={m + i * 26} x2={W - m} y2={m + i * 26} strokeDasharray="2 6" />
          ))}
        </g>
      )}

      <g stroke="currentColor" strokeWidth={0.6 * weight} opacity="0.35">
        {hatches.map((h, i) => <line key={i} x1={h.x1} y1={h.y1} x2={h.x2} y2={h.y2} />)}
      </g>

      {/* 二级墙线与家具块 */}
      <g stroke="currentColor" strokeWidth={0.7 * weight} opacity="0.45">
        {subCells.map((s, i) => (
          <line key={`sub${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeDasharray="6 4" />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth={0.8 * weight} opacity="0.5">
        {fixtures.map((f, i) => (
          <rect key={`fx${i}`} x={f.x} y={f.y} width={f.w} height={f.h} rx="1" />
        ))}
      </g>

      {/* 底部尺寸标注 */}
      <g stroke="currentColor" strokeWidth={0.6 * weight} opacity="0.4">
        <line x1={m} y1={H - m + 8} x2={W - m} y2={H - m + 8} />
        <line x1={m} y1={H - m + 4} x2={m} y2={H - m + 12} />
        <line x1={W - m} y1={H - m + 4} x2={W - m} y2={H - m + 12} />
      </g>

      <g className="draw-arc" stroke="currentColor" strokeWidth={0.8 * weight} opacity="0.6">
        {doors.map((d, i) => <path key={i} d={d.d} strokeDasharray="3 4" />)}
      </g>

      <g stroke="currentColor" strokeWidth={0.8 * weight} opacity="0.45">
        {ticks.map(t => (
          <line key={t} x1={t} y1={m - 5} x2={t} y2={m - 1} />
        ))}
      </g>

      <g stroke="currentColor" strokeWidth={1 * weight} opacity="0.8" className="draw-node">
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="9" strokeDasharray="2 3" />
            <line x1={n.x - 12} y1={n.y} x2={n.x + 12} y2={n.y} />
            <line x1={n.x} y1={n.y - 12} x2={n.x} y2={n.y + 12} />
          </g>
        ))}
      </g>
    </svg>
  );
}
