import { useCallback, useEffect, useState } from "react";
import { useFeedback } from "./components/Feedback";

// Sadə siyahı yükləyici: fetcher dəyişəndə (filtr) yenidən yüklənir
export default function useList(fetcher) {
  const { toast } = useFeedback();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetcher());
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [fetcher, toast]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, setItems, loading, reload };
}

// Siyahıda elementi yuxarı/aşağı sürüşdürür, yeni id sırasını qaytarır
export function moveItem(list, index, dir) {
  const next = [...list];
  const target = index + dir;
  if (target < 0 || target >= next.length) return null;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
