import { useEffect } from "react";

const BRAND = "Caffècino";

// Səhifə başlığı və meta description (axtarış motorları və paylaşma üçün)
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${BRAND}` : `${BRAND} — The Art of Coffee`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    }
  }, [title, description]);
}
