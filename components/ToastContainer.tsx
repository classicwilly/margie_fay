// Removed default `React` import (JSX runtime handles it)
import { useAppState } from "@contexts/AppStateContext";
import Toast from "./Toast.js";

const ToastContainer = () => {
  const { appState, dispatch } = useAppState();
  const { toastNotifications } = appState;

  const handleDismiss = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  };
  const handleAction = (id: string) => {
    const t: any = toastNotifications.find((tt: any) => tt.id === id);
    if (!t) {
      return;
    }
    if (t.actionType) {
      try {
        dispatch({ type: t.actionType, payload: t.actionPayload });
      } catch (e) {
        // ignore
      }
    }
    dispatch({ type: "REMOVE_TOAST", payload: id });
  };

  if (toastNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 no-print">
      {toastNotifications.map((toast: any) => (
        <Toast
          key={toast.id}
          id={toast.id}
          emoji={toast.emoji}
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={handleAction}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
