import { Router, Request, Response } from "express";
import { randomBytes } from "crypto";
import { requireAuth } from "../middleware/auth.js";
import { getLatestMetrics } from "../services/systemService.js";

const router = Router();

const streamTokens = new Map<string, { username: string; expiresAt: number }>();
const STREAM_TOKEN_TTL_MS = 30_000;

function pruneStreamTokens() {
  const now = Date.now();
  for (const [token, data] of streamTokens) {
    if (data.expiresAt < now) streamTokens.delete(token);
  }
}

router.get("/metrics/stream", (req: Request, res: Response) => {
  const token = req.query.token as string | undefined;
  if (!token) {
    res.status(401).json({ error: "stream token required" });
    return;
  }

  const data = streamTokens.get(token);
  if (!data || data.expiresAt < Date.now()) {
    streamTokens.delete(token ?? "");
    res.status(401).json({ error: "invalid or expired stream token" });
    return;
  }

  streamTokens.delete(token);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const send = () => {
    const metrics = getLatestMetrics();
    if (metrics) res.write(`data: ${JSON.stringify(metrics)}\n\n`);
  };

  send();
  const interval = setInterval(send, 1000);
  req.on("close", () => clearInterval(interval));
});

router.use(requireAuth);

router.get("/metrics", (req, res) => {
  const latest = getLatestMetrics();
  if (!latest) {
    res.status(503).json({ error: "No metrics available yet" });
    return;
  }
  res.json(latest);
});

router.post("/metrics/stream-token", (req: any, res) => {
  pruneStreamTokens();
  const token = randomBytes(24).toString("hex");
  streamTokens.set(token, {
    username: req.user?.sub ?? "unknown",
    expiresAt: Date.now() + STREAM_TOKEN_TTL_MS,
  });
  res.json({ streamToken: token });
});

router.get("/info", (_req, res) => {
  res.json({
    hasWifi: process.env.HAS_WIFI === "true",
    version: "1.0.0",
    hostname: process.env.HOSTNAME ?? "gateway",
  });
});

router.get("/setup-status", (_req, res) => {
  res.json({
    isSetupDone: process.env.SETUP_DONE === "true",
  });
});

export default router;
