import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as wgService from "../services/wireguardService.js";
import type {
  CreateProfileRequest,
  UpdateProfileRequest,
} from "../types/wireguard.js";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(wgService.getProfiles());
});

router.get("/:id", (req, res) => {
  const p = wgService.getProfile(req.params.id);
  if (!p) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(p);
});

router.get("/:id/status", (req, res) => {
  const s = wgService.getStatus(req.params.id);
  if (!s) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(s);
});

router.post("/", (req, res) => {
  res
    .status(201)
    .json(wgService.createProfile(req.body as CreateProfileRequest));
});

router.put("/:id", (req, res) => {
  const p = wgService.updateProfile(
    req.params.id,
    req.body as UpdateProfileRequest,
  );
  if (!p) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(p);
});

router.delete("/:id", (req, res) => {
  const ok = wgService.deleteProfile(req.params.id);
  if (!ok) {
    res
      .status(403)
      .json({ error: "Cannot delete primary profile or not found" });
    return;
  }
  res.json({ success: true });
});

router.post("/:id/toggle", (req, res) => {
  const connected = wgService.toggleConnection(req.params.id);
  res.json({ connected });
});

export default router;
