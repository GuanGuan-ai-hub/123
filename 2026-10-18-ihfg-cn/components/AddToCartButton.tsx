"use client";

import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 加购按钮:真调 POST /api/shopping-cart/add(对齐原站 AJAX 行为:Processing → Added) */
export default function AddToCartButton({ fileId, code }: { fileId: string; code: string }) {
  const [state, setState] = useState<"idle" | "processing" | "added">("idle");

  const add = async () => {
    if (state !== "idle") return;
    setState("processing");
    try {
      const fd = new FormData();
      fd.append("fileId", fileId);
      fd.append("code", code);
      const res = await fetch(`${BASE}/api/shopping-cart/add`, { method: "POST", body: fd });
      const text = await res.text();
      setState("added");
      const count = Number(text);
      if (!isNaN(count)) window.dispatchEvent(new CustomEvent("add-to-cart", { detail: count }));
    } catch {
      setState("idle");
    }
  };

  return (
    <button className="btn-brand btn-tech" onClick={add} disabled={state !== "idle"}>
      {state === "idle" && <>加入购物车<span className="en ml-2 text-[#0d2c1f]">Add to Cart</span></>}
      {state === "processing" && <>处理中<span className="en ml-1 text-[#0d2c1f]">Processing</span>…</>}
      {state === "added" && <>已加入<span className="en ml-1 text-[#0d2c1f]">Added</span> ✓</>}
    </button>
  );
}
