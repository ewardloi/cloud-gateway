import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as pfService from "../services/portForwardingService.js";
import type {
  CreatePortForwardingRuleRequest,
  UpdatePortForwardingRuleRequest,
} from "../types/portForwarding.js";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(pfService.getRules());
});

router.get("/:id", (req, res) => {
  const rule = pfService.getRule(req.params.id);
  if (!rule) {
    res.status(404).json({ error: "Rule not found" });
    return;
  }
  res.json(rule);
});

router.post("/", (req, res) => {
  const rule = pfService.createRule(
    req.body as CreatePortForwardingRuleRequest,
  );
  if (!rule) {
    res.status(403).json({ error: "Source interface is blocked" });
    return;
  }
  res.status(201).json(rule);
});

router.put("/:id", (req, res) => {
  const rule = pfService.updateRule(
    req.params.id,
    req.body as UpdatePortForwardingRuleRequest,
  );
  if (!rule) {
    res.status(404).json({ error: "Rule not found or interface blocked" });
    return;
  }
  res.json(rule);
});

router.delete("/:id", (req, res) => {
  const ok = pfService.deleteRule(req.params.id);
  if (!ok) {
    res.status(404).json({ error: "Rule not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
