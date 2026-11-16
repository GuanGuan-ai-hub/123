"use client";

import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 全站悬浮购物车:淡绿圆钮 + 红色数量徽章;挂载时从服务端同步真实数量 */
export default function CartFab() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = (n?: number) => {
      if (typeof n === "number") { setCount(n); return; }
      fetch(`${BASE}/api/shopping-cart`)
        .then(r => r.json())
        .then(d => { if (d?.state === "SUCCESS") setCount(d.count ?? 0); })
        .catch(() => {});
    };
    sync();
    const onAdd = (e: Event) => sync((e as CustomEvent).detail);
    window.addEventListener("add-to-cart", onAdd);
    return () => window.removeEventListener("add-to-cart", onAdd);
  }, []);

  return (
    <button
      aria-label="购物车 Shopping Cart"
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-brand hover:bg-brand-mid text-[#0d2c1f] hover:text-white shadow-[0_10px_30px_rgba(22,56,43,0.18)] ring-1 ring-brand/40 ring-offset-4 ring-offset-white hover:ring-brand flex items-center justify-center"
      onClick={() => alert(`购物车内有 ${count} 件商品(演示)\n${count} item(s) in cart (demo)`)}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
        <path d="M3 3h2l2.6 12.5a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.2L20.5 7H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-[22px] h-[22px] rounded-full bg-badge text-white text-[12px] flex items-center justify-center font-semibold">
          {count}
        </span>
      )}
    </button>
  );
}
