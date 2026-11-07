import { useEffect } from "react";

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;
    const timeoutId = window.setTimeout(onDismiss, 2600);
    return () => window.clearTimeout(timeoutId);
  }, [message, onDismiss]);

  if (!message) return null;
  return <div className="favorite-toast" role="status" aria-live="polite">{message}</div>;
}
