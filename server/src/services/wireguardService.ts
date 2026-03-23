import { wireguardProfiles, wireguardStatuses } from "../mocks/wireguard.js";
import type {
  CreateProfileRequest,
  UpdateProfileRequest,
} from "../types/wireguard.js";
import { randomUUID } from "crypto";

export function getProfiles() {
  return wireguardProfiles;
}
export function getProfile(id: string) {
  return wireguardProfiles.find((p) => p.id === id);
}
export function getStatus(id: string) {
  return wireguardStatuses.get(id);
}

export function createProfile(req: CreateProfileRequest) {
  const profile = {
    id: randomUUID(),
    name: req.name,
    isPrimary: false,
    enabled: false,
    interface: `wg${wireguardProfiles.length}`,
    privateKey: "PRIVATE_KEY_HIDDEN",
    publicKey: "GENERATED_KEY=",
    address: "10.99.0.1/24",
    config: req.config,
    peers: [],
  };
  wireguardProfiles.push(profile);
  wireguardStatuses.set(profile.id, {
    profileId: profile.id,
    connected: false,
    rxBytes: 0,
    txBytes: 0,
    peers: [],
  });
  return profile;
}

export function updateProfile(id: string, req: UpdateProfileRequest) {
  const profile = wireguardProfiles.find((p) => p.id === id);
  if (!profile) return null;
  if (req.isPrimary) {
    wireguardProfiles.forEach((p) => {
      p.isPrimary = false;
    });
  }
  Object.assign(profile, req);
  return profile;
}

export function deleteProfile(id: string): boolean {
  const profile = wireguardProfiles.find((p) => p.id === id);
  if (!profile || profile.isPrimary) return false;
  const idx = wireguardProfiles.indexOf(profile);
  wireguardProfiles.splice(idx, 1);
  wireguardStatuses.delete(id);
  return true;
}

export function toggleConnection(id: string): boolean {
  const status = wireguardStatuses.get(id);
  const profile = wireguardProfiles.find((p) => p.id === id);
  if (!status || !profile) return false;
  status.connected = !status.connected;
  if (status.connected) status.uptime = 0;
  return status.connected;
}
