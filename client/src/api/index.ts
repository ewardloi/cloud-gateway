import { get, post, put, del } from "./client.ts";
import type { SystemInfo, SystemMetrics } from "../types/system.ts";
import type { NetworkInterface, WifiNetwork } from "../types/network.ts";
import type {
  DhcpConfig,
  DhcpLease,
  DhcpReservation,
  Dhcpv6Config,
} from "../types/dhcp.ts";
import type {
  PortForwardingRule,
  CreatePortForwardingRuleRequest,
} from "../types/portForwarding.ts";
import type { WireguardProfile, WireguardStatus } from "../types/wireguard.ts";

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    post<{ accessToken: string; refreshToken: string }>("/auth/login", {
      username,
      password,
    }),
  logout: (refreshToken: string) => post("/auth/logout", { refreshToken }),
  me: () => get<{ username: string }>("/auth/me"),
};

// System
export const systemApi = {
  getInfo: () => get<SystemInfo>("/system/info"),
  getSetupStatus: () => get<SystemInfo>("/system/setup-status"),
  getMetrics: () => get<SystemMetrics>("/system/metrics"),
  getStreamToken: () =>
    post<{ streamToken: string }>("/system/metrics/stream-token"),
  streamUrl: (token: string) =>
    `/api/system/metrics/stream?token=${encodeURIComponent(token)}`,
};

// Network
export const networkApi = {
  getInterfaces: () => get<NetworkInterface[]>("/network/interfaces"),
  getInterface: (name: string) =>
    get<NetworkInterface>(`/network/interfaces/${name}`),
  updateInterface: (name: string, data: Partial<NetworkInterface>) =>
    put<NetworkInterface>(`/network/interfaces/${name}`, data),
  getWifiNetworks: (name: string) =>
    get<WifiNetwork[]>(`/network/wifi?interface=${name}`),
  connectWifi: (ssid: string, password?: string) =>
    post<{ success: boolean }>("/network/wifi/connect", { ssid, password }),
  disconnectWifi: () => post<{ success: boolean }>("/network/wifi/disconnect"),
};

// DHCP
export const dhcpApi = {
  getConfig: () => get<DhcpConfig>("/dhcp/config"),
  updateConfig: (data: Partial<DhcpConfig>) =>
    put<DhcpConfig>("/dhcp/config", data),
  getLeases: () => get<DhcpLease[]>("/dhcp/leases"),
  createReservation: (data: Omit<DhcpReservation, "id">) =>
    post<DhcpReservation>("/dhcp/reservations", data),
  deleteReservation: (id: string) =>
    del<{ success: boolean }>(`/dhcp/reservations/${id}`),
  getV6Config: () => get<Dhcpv6Config>("/dhcp/v6/config"),
  updateV6Config: (data: Partial<Dhcpv6Config>) =>
    put<Dhcpv6Config>("/dhcp/v6/config", data),
};

// Port Forwarding
export const portForwardingApi = {
  getRules: () => get<PortForwardingRule[]>("/port-forwarding"),
  createRule: (data: CreatePortForwardingRuleRequest) =>
    post<PortForwardingRule>("/port-forwarding", data),
  updateRule: (id: string, data: Partial<PortForwardingRule>) =>
    put<PortForwardingRule>(`/port-forwarding/${id}`, data),
  deleteRule: (id: string) =>
    del<{ success: boolean }>(`/port-forwarding/${id}`),
};

// WireGuard
export const wireguardApi = {
  getProfiles: () => get<WireguardProfile[]>("/wireguard"),
  getProfile: (id: string) => get<WireguardProfile>(`/wireguard/${id}`),
  getStatus: (id: string) => get<WireguardStatus>(`/wireguard/${id}/status`),
  createProfile: (name: string, config: string) =>
    post<WireguardProfile>("/wireguard", { name, config }),
  updateProfile: (id: string, data: Partial<WireguardProfile>) =>
    put<WireguardProfile>(`/wireguard/${id}`, data),
  deleteProfile: (id: string) => del<{ success: boolean }>(`/wireguard/${id}`),
  toggleConnection: (id: string) =>
    post<{ connected: boolean }>(`/wireguard/${id}/toggle`),
};

// Setup
export const setupApi = {
  getStatus: () =>
    get<{ isSetupDone: boolean; hasWifi: boolean }>("/setup/status"),
  connectWifi: (ssid: string, password?: string) =>
    post("/setup/wifi", { ssid, password }),
  setEthernet: (iface: string) => post("/setup/ethernet", { interface: iface }),
  setIpv4: (data: object) => post("/setup/ipv4", data),
  setHotspot: (data: object) => post("/setup/hotspot", data),
  setIpv6: (data: object) => post("/setup/ipv6", data),
  setWireguard: (config: string) => post("/setup/wireguard", { config }),
  complete: () => post("/setup/complete"),
};
