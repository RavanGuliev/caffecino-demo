import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Modal from "./Modal";
import { Button } from "./ui";

// Toast bildirişləri və təsdiq pəncərəsi (window.confirm əvəzinə)
const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const { t } = useTranslation("admin");
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [busy, setBusy] = useState(false);
  const idRef = useRef(0);

  const toast = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((ts) => [...ts, { id, message, type }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3500);
  }, []);

  // confirm({ message, onConfirm }) — onConfirm async ola bilər
  const confirm = useCallback((opts) => setConfirmState(opts), []);

  const runConfirm = async () => {
    setBusy(true);
    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}

      <Modal
        open={!!confirmState}
        size="sm"
        title={t("common.confirm_title")}
        onClose={() => !busy && setConfirmState(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmState(null)} disabled={busy}>{t("common.cancel")}</Button>
            <Button variant="danger" onClick={runConfirm} loading={busy}>{t("common.delete")}</Button>
          </>
        }
      >
        <div className="flex gap-4">
          <span className="grid place-items-center h-11 w-11 rounded-full bg-red-50 text-red-600 shrink-0">
            <FiAlertTriangle size={20} />
          </span>
          <p className="text-sm text-brand-950/75 pt-2.5">{confirmState?.message}</p>
        </div>
      </Modal>

      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[80] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((x) => (
          <div
            key={x.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold shadow-soft animate-pop-in ${
              x.type === "error" ? "bg-red-600 text-white" : "bg-brand-900 text-white"
            }`}
          >
            {x.type === "error" ? <FiXCircle /> : <FiCheckCircle className="text-brand-300" />}
            {x.message}
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);
