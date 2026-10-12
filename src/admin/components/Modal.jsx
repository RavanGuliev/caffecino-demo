import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export default function Modal({ open, title, onClose, children, footer, size = "md" }) {
  const { t } = useTranslation("admin");
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;
  const widths = { sm: "sm:max-w-md", md: "sm:max-w-xl", lg: "sm:max-w-3xl" };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-brand-950/50 backdrop-blur-sm sm:p-4 animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full ${widths[size]} max-h-[94vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-cream shadow-2xl animate-slide-up sm:animate-pop-in`}>
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-sand">
          <h2 className="font-display text-lg font-bold text-brand-950">{title}</h2>
          <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-full hover:bg-sand text-brand-900" aria-label={t("common.close")}>
            <IoClose size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-4 border-t border-sand">{footer}</div>}
      </div>
    </div>
  );
}
