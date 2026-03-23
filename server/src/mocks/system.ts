import type { SystemMetrics, MetricsWindow } from "../types/system.js";

let prevRxBytes = [1024 * 1024 * 50, 1024 * 1024 * 10, 0];
let prevTxBytes = [1024 * 1024 * 20, 1024 * 1024 * 5, 0];

export function generateMetrics(): SystemMetrics {
  const now = Date.now();
  const rxDeltas = prevRxBytes.map((_, i) =>
    Math.floor(Math.random() * 500000 + 50000),
  );
  const txDeltas = prevTxBytes.map((_, i) =>
    Math.floor(Math.random() * 200000 + 10000),
  );

  const newRx = prevRxBytes.map((prev, i) => prev + rxDeltas[i]);
  const newTx = prevTxBytes.map((prev, i) => prev + txDeltas[i]);

  const metrics: SystemMetrics = {
    cpu: {
      usage: Math.min(
        100,
        Math.max(5, 30 + Math.sin(now / 10000) * 20 + Math.random() * 10),
      ),
      cores: 4,
      model: "ARM Cortex-A72",
      temperature: 45 + Math.random() * 15,
    },
    memory: {
      total: 4 * 1024 * 1024 * 1024,
      used: Math.floor((1.2 + Math.random() * 0.5) * 1024 * 1024 * 1024),
      free: 0,
      usagePercent: 0,
    },
    interfaces: [
      {
        name: "eth0",
        rxBytes: newRx[0],
        txBytes: newTx[0],
        rxSpeed: rxDeltas[0],
        txSpeed: txDeltas[0],
      },
      {
        name: "eth1",
        rxBytes: newRx[1],
        txBytes: newTx[1],
        rxSpeed: rxDeltas[1],
        txSpeed: txDeltas[1],
      },
      {
        name: "wlan0",
        rxBytes: newRx[2],
        txBytes: newTx[2],
        rxSpeed: rxDeltas[2],
        txSpeed: txDeltas[2],
      },
    ],
    uptime: Math.floor(now / 1000) - 86400,
    timestamp: now,
  };

  metrics.memory.free = metrics.memory.total - metrics.memory.used;
  metrics.memory.usagePercent =
    (metrics.memory.used / metrics.memory.total) * 100;

  prevRxBytes = newRx;
  prevTxBytes = newTx;

  return metrics;
}
