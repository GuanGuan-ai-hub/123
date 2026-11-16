"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 数字滚动。SSR 直接输出目标值(无 JS 也不会显示 0),
 * 仅当元素位于首屏之下时,挂载后归零并在进入视口时递增。
 */
export default function CountUp({
  to,
  duration = 1100,
  pad = 0,
  className = "",
}: {
  to: number;
  duration?: number;
  pad?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return; // 首屏内不做动画,避免闪烁

    setValue(0);
    const io = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {String(value).padStart(pad, "0")}
    </span>
  );
}
