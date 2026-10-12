import { useEffect, useState } from "react";

// "08:00 – 23:00" kimi iş saatlarından Bakı vaxtı ilə açıq/bağlı vəziyyətini hesablayır.
// Format tanınmasa null qaytarır (onda yalnız saatlar göstərilir).
function compute(hours) {
  const m = String(hours || "").match(/(\d{1,2})[:.](\d{2})\D+(\d{1,2})[:.](\d{2})/);
  if (!m) return null;
  const open = +m[1] * 60 + +m[2];
  let close = +m[3] * 60 + +m[4];
  const now = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Baku", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .format(new Date())
    .split(":")
    .map(Number);
  const cur = now[0] * 60 + now[1];
  if (close === 0) close = 24 * 60; // "08:00 – 00:00"
  const isOpen = close > open ? cur >= open && cur < close : cur >= open || cur < close; // gecəyarısından keçən saatlar
  return { isOpen, opensAt: `${m[1].padStart(2, "0")}:${m[2]}` };
}

export default function useOpenStatus(hours) {
  const [status, setStatus] = useState(() => compute(hours));
  useEffect(() => {
    setStatus(compute(hours));
    const id = setInterval(() => setStatus(compute(hours)), 60_000);
    return () => clearInterval(id);
  }, [hours]);
  return status;
}
