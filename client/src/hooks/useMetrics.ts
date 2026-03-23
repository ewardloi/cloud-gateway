import { useState, useEffect, useRef, useCallback } from "react";
import type { SystemMetrics } from "../types/system.ts";
import { systemApi } from "../api/index.ts";

const HISTORY_SIZE = 60;

export function useMetrics() {
  const [latest, setLatest] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<SystemMetrics[]>([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const [tick, setTick] = useState(0);

  const reconnect = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    function closeStream() {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      if (!cancelled) setConnected(false);
    }

    async function openStream() {
      closeStream();
      try {
        // Exchange Bearer token for a short-lived, single-use stream token.
        // The token is consumed on first connection and expires in 30 s.
        const { streamToken } = await systemApi.getStreamToken();

        if (cancelled) return;

        const url = systemApi.streamUrl(streamToken);

        const es = new EventSource(url);
        esRef.current = es;

        es.onopen = () => {
          if (!cancelled) setConnected(true);
        };
        es.onerror = () => {
          if (!cancelled) {
            setConnected(false);
            // Don't auto-retry here — visibility handler will reconnect when
            // the tab becomes active again
          }
        };
        es.onmessage = (evt) => {
          if (cancelled) return;
          try {
            const data: SystemMetrics = JSON.parse(evt.data);
            setLatest(data);
            setHistory((prev) => {
              const next = [...prev, data];
              return next.length > HISTORY_SIZE
                ? next.slice(-HISTORY_SIZE)
                : next;
            });
          } catch {
            /* ignore parse errors */
          }
        };
      } catch {
        if (!cancelled) setConnected(false);
      }
    }

    // Reconnect when the tab becomes visible again
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        reconnect();
      } else {
        // Tab hidden — close the connection to free server resources
        closeStream();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    openStream();

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      closeStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  return { latest, history, connected, reconnect };
}
