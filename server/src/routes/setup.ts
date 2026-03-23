import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as networkService from "../services/networkService.js";
import * as dhcpService from "../services/dhcpService.js";
import type { WifiConnectRequest, HotspotConfig } from "../types/network.js";
import type { UpdateDhcpConfigRequest } from "../types/dhcp.js";

const router = Router();
router.use(requireAuth);

router.get("/status", (req, res) => {
  res.json({
    isSetupDone: process.env.SETUP_DONE === "true",
    hasWifi: networkService.hasWifi(),
  });
});

router.post("/wifi", (req, res) => {
  const ok = networkService.connectWifi(req.body as WifiConnectRequest);
  res.json({ success: ok });
});

router.post("/ethernet", (req, res) => {
  const { interface: iface } = req.body as { interface: string };
  if (!iface) {
    res.status(400).json({ error: "interface is required" });
    return;
  }
  res.json({ success: true, selectedInterface: iface });
});

router.post("/ipv4", (req, res) => {
  const result = dhcpService.updateDhcpConfig(
    req.body as UpdateDhcpConfigRequest,
  );
  res.json(result);
});

router.post("/hotspot", (req, res) => {
  const config = req.body as HotspotConfig;
  res.json({ success: true, config });
});

router.post("/ipv6", (req, res) => {
  const result = dhcpService.updateDhcpv6Config(req.body);
  res.json(result);
});

router.post("/wireguard", (req, res) => {
  const { config } = req.body as { config: string };
  res.json({ success: true, configLength: config?.length ?? 0 });
});

router.post("/complete", (req, res) => {
  res.json({
    success: true,
    message: "Setup complete. Restart the service to apply changes.",
  });
});

export default router;
