export type WireguardPeer = {
  publicKey: string;
  allowedIps: string[];
  endpoint?: string;
  lastHandshake?: number;
  rxBytes: number;
  txBytes: number;
}

export type WireguardProfile = {
  id: string;
  name: string;
  isPrimary: boolean;
  enabled: boolean;
  interface: string;
  privateKey: string;
  publicKey: string;
  address: string;
  listenPort?: number;
  dns?: string[];
  peers: WireguardPeer[];
  config?: string;
}

export type WireguardStatus = {
  profileId: string;
  connected: boolean;
  uptime?: number;
  rxBytes: number;
  txBytes: number;
  peers: WireguardPeer[];
}
