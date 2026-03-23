import { dhcpConfig, dhcpLeases, dhcpv6Config } from "../mocks/dhcp.js";
import type {
  CreateReservationRequest,
  UpdateDhcpConfigRequest,
} from "../types/dhcp.js";
import { randomUUID } from "crypto";

export function getDhcpConfig() {
  return dhcpConfig;
}

export function getDhcpLeases() {
  return dhcpLeases;
}

export function getDhcpv6Config() {
  return dhcpv6Config;
}

export function updateDhcpConfig(req: UpdateDhcpConfigRequest) {
  if (req.rangeStart) dhcpConfig.rangeStart = req.rangeStart;
  if (req.rangeEnd) dhcpConfig.rangeEnd = req.rangeEnd;
  if (req.dns) dhcpConfig.dns = req.dns;
  if (req.leaseTime) dhcpConfig.leaseTime = req.leaseTime;
  if (req.gateway) dhcpConfig.gateway = req.gateway;
  return dhcpConfig;
}

export function createReservation(req: CreateReservationRequest) {
  const existing = dhcpConfig.reservations.find(
    (r) => r.mac === req.mac || r.ip === req.ip,
  );
  if (existing) return null;
  const reservation = { id: randomUUID(), ...req };
  dhcpConfig.reservations.push(reservation);
  return reservation;
}

export function deleteReservation(id: string): boolean {
  const idx = dhcpConfig.reservations.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  dhcpConfig.reservations.splice(idx, 1);
  return true;
}

export function updateDhcpv6Config(updates: Partial<typeof dhcpv6Config>) {
  Object.assign(dhcpv6Config, updates);
  return dhcpv6Config;
}
