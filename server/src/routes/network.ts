import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as networkService from "../services/networkService.js";
import type {
  UpdateInterfaceRequest,
  WifiConnectRequest,
} from "../types/network.js";

const router = Router();
router.use(requireAuth);

router.get("/interfaces", (req, res) => {
  res.json(networkService.getInterfaces());
});

router.get("/interfaces/:name", (req, res) => {
  const iface = networkService.getInterface(req.params.name);
  if (!iface) {
    res.status(404).json({ error: "Interface not found" });
    return;
  }
  res.json(iface);
});

router.put("/interfaces/:name", (req, res) => {
  if (networkService.isDhcpServerInterface(req.params.name)) {
    res.status(403).json({ error: "Cannot modify DHCP server interface" });
    return;
  }
  const updated = networkService.updateInterface(
    req.params.name,
    req.body as UpdateInterfaceRequest,
  );
  if (!updated) {
    res.status(404).json({ error: "Interface not found" });
    return;
  }
  res.json(updated);
});

router.get("/wifi", (req, res) => {
  if (!networkService.hasWifi()) {
    res.status(404).json({ error: "No WiFi adapter" });
    return;
  }
  res.json(networkService.getWifiNetworks());
});

router.post("/wifi/connect", (req, res) => {
  if (!networkService.hasWifi()) {
    res.status(404).json({ error: "No WiFi adapter" });
    return;
  }
  const ok = networkService.connectWifi(req.body as WifiConnectRequest);
  if (!ok) {
    res.status(404).json({ error: "Network not found" });
    return;
  }
  res.json({ success: true });
});

router.post("/wifi/disconnect", (req, res) => {
  networkService.disconnectWifi();
  res.json({ success: true });
});

export default router;
