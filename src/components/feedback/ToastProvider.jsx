/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext({
  showToast: () => undefined,
  dismiss: () => undefined,
});
let nextToastId = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);
  const showToast = useCallback(
    ({ message, tone = "info", duration = 3500 }) => {
      const id = nextToastId++;
      setToasts((current) => [...current, { id, message, tone }]);
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );
  const value = useMemo(() => ({ showToast, dismiss }), [dismiss, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed z-50 grid w-full max-w-sm gap-2 px-4 -translate-x-1/2 bottom-20 left-1/2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={`flex items-center justify-between gap-4 px-4 py-3 text-white rounded-lg shadow-lg ${
              toast.tone === "error" ? "bg-red-600" : "bg-gray-900"
            }`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="알림 닫기"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
