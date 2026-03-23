import { Router } from "express";
import {
  validateCredentials,
  generateTokens,
  refreshTokens,
  revokeRefreshToken,
} from "../services/authService.js";
import { requireAuth } from "../middleware/auth.js";
import type { LoginRequest, RefreshRequest } from "../types/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    res.status(400).json({ error: "username and password are required" });
    return;
  }
  const valid = await validateCredentials(username, password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const tokens = generateTokens(username);
  res.json(tokens);
});

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body as RefreshRequest;
  if (!refreshToken) {
    res.status(400).json({ error: "refreshToken is required" });
    return;
  }
  const tokens = refreshTokens(refreshToken);
  if (!tokens) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
    return;
  }
  res.json(tokens);
});

router.post("/logout", requireAuth, (req, res) => {
  const { refreshToken } = req.body as RefreshRequest;
  if (refreshToken) revokeRefreshToken(refreshToken);
  res.json({ success: true });
});

router.get("/me", requireAuth, (req: any, res) => {
  res.json({ username: req.user?.sub });
});

export default router;
