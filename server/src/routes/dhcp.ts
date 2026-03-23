import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as dhcpService from "../services/dhcpService.js";
import type {
  CreateReservationRequest,
  UpdateDhcpConfigRequest,
} from "../types/dhcp.js";

const router = Router();
router.use(requireAuth);

router.get("/config", (req, res) => {
  res.json(dhcpService.getDhcpConfig());
});

router.put("/config", (req, res) => {
  res.json(dhcpService.updateDhcpConfig(req.body as UpdateDhcpConfigRequest));
});

router.get("/leases", (req, res) => {
  res.json(dhcpService.getDhcpLeases());
});

router.post("/reservations", (req, res) => {
  const result = dhcpService.createReservation(
    req.body as CreateReservationRequest,
  );
  if (!result) {
    res.status(409).json({ error: "MAC or IP already reserved" });
    return;
  }
  res.status(201).json(result);
});

router.delete("/reservations/:id", (req, res) => {
  const ok = dhcpService.deleteReservation(req.params.id);
  if (!ok) {
    res.status(404).json({ error: "Reservation not found" });
    return;
  }
  res.json({ success: true });
});

router.get("/v6/config", (req, res) => {
  res.json(dhcpService.getDhcpv6Config());
});

router.put("/v6/config", (req, res) => {
  res.json(dhcpService.updateDhcpv6Config(req.body));
});

export default router;
