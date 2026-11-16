"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 滚动进入视口时淡入上移。
 * 注意:SSR 输出始终可见(避免无 JS / 水合失败时白屏),
 * 只有挂载后判断位于首屏之下才临时隐藏并交给 IntersectionObserver。
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 首屏内的元素不做隐藏,避免加载瞬间闪一下
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    setPending(true);
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPending(false);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${pending ? "is-pending" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
