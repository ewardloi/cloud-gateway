import { networkInterfaces, wifiNetworks } from "../mocks/network.js";
import type {
  NetworkInterface,
  UpdateInterfaceRequest,
  WifiConnectRequest,
} from "../types/network.js";

const DHCP_SERVER_INTERFACE = process.env.DHCP_SERVER_INTERFACE ?? "eth0";
const BLOCKED_INTERFACES = (process.env.BLOCKED_INTERFACES ?? "")
  .split(",")
  .filter(Boolean);

export function getInterfaces(): NetworkInterface[] {
  return networkInterfaces.filter((i) => !BLOCKED_INTERFACES.includes(i.name));
}

export function getInterface(name: string): NetworkInterface | undefined {
  return networkInterfaces.find((i) => i.name === name);
}

export function isDhcpServerInterface(name: string): boolean {
  return name === DHCP_SERVER_INTERFACE;
}

export function updateInterface(
  name: string,
  req: UpdateInterfaceRequest,
): NetworkInterface | null {
  const iface = networkInterfaces.find((i) => i.name === name);
  if (!iface) return null;
  if (req.ipv4) iface.ipv4 = { ...iface.ipv4, ...req.ipv4 };
  if (req.ipv6) iface.ipv6 = { ...iface.ipv6, ...req.ipv6 };
  if (req.mtu) iface.mtu = req.mtu;
  return iface;
}

export function getWifiNetworks() {
  return wifiNetworks;
}

export function connectWifi(req: WifiConnectRequest): boolean {
  const network = wifiNetworks.find((n) => n.ssid === req.ssid);
  if (!network) return false;
  wifiNetworks.forEach((n) => (n.connected = false));
  network.connected = true;
  const wlan = networkInterfaces.find((i) => i.type === "wifi");
  if (wlan) {
    wlan.isUp = true;
    wlan.ipv4 = {
      mode: "dhcp",
      address: "192.168.0.100",
      prefixLength: 24,
      gateway: "192.168.0.1",
    };
  }
  return true;
}

export function disconnectWifi(): void {
  wifiNetworks.forEach((n) => (n.connected = false));
  const wlan = networkInterfaces.find((i) => i.type === "wifi");
  if (wlan) {
    wlan.isUp = false;
    wlan.ipv4 = { mode: "disabled" };
  }
}

export function hasWifi(): boolean {
  return process.env.HAS_WIFI === "true";
}
