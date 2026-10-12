import { useTranslation } from "react-i18next";
import { FiArrowDown, FiArrowUp, FiEdit2, FiTrash2 } from "react-icons/fi";

const btn = "grid place-items-center h-8 w-8 rounded-lg transition disabled:opacity-25 disabled:pointer-events-none";

export function MoveButtons({ onUp, onDown, first, last }) {
  const { t } = useTranslation("admin");
  return (
    <div className="flex">
      <button type="button" title={t("common.move_up")} onClick={onUp} disabled={first} className={`${btn} text-brand-950/50 hover:bg-brand-50 hover:text-brand-800`}>
        <FiArrowUp size={15} />
      </button>
      <button type="button" title={t("common.move_down")} onClick={onDown} disabled={last} className={`${btn} text-brand-950/50 hover:bg-brand-50 hover:text-brand-800`}>
        <FiArrowDown size={15} />
      </button>
    </div>
  );
}

export function EditDelete({ onEdit, onDelete }) {
  const { t } = useTranslation("admin");
  return (
    <div className="flex">
      <button type="button" title={t("common.edit")} onClick={onEdit} className={`${btn} text-brand-700 hover:bg-brand-50`}>
        <FiEdit2 size={15} />
      </button>
      <button type="button" title={t("common.delete")} onClick={onDelete} className={`${btn} text-red-500 hover:bg-red-50`}>
        <FiTrash2 size={15} />
      </button>
    </div>
  );
}

// Hansı dillərdə tərcümə var — kiçik AZ/EN/RU nişanları
export function LangDots({ item, field = "name" }) {
  return (
    <span className="inline-flex gap-1">
      {["az", "en", "ru"].map((l) => (
        <span
          key={l}
          className={`rounded px-1 text-[9px] font-bold uppercase ${item[`${field}_${l}`] ? "bg-brand-100 text-brand-700" : "bg-amber-100 text-amber-700"}`}
        >
          {l}
        </span>
      ))}
    </span>
  );
}
