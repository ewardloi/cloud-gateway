import type { WireguardProfile, WireguardStatus } from "../types/wireguard.js";

export const wireguardProfiles: WireguardProfile[] = [
  {
    id: "1",
    name: "Home VPN",
    isPrimary: true,
    enabled: true,
    interface: "wg0",
    privateKey: "PRIVATE_KEY_HIDDEN",
    publicKey: "abc123def456ghi789jkl012mno345pqr678stu901=",
    address: "10.10.0.1/24",
    listenPort: 51820,
    dns: ["1.1.1.1"],
    config: `[Interface]
PrivateKey = PRIVATE_KEY_HIDDEN
Address = 10.10.0.1/24
ListenPort = 51820
DNS = 1.1.1.1

[Peer]
PublicKey = peer1publickey=
AllowedIPs = 10.10.0.2/32
`,
    peers: [
      {
        publicKey: "peer1publickey=",
        allowedIps: ["10.10.0.2/32"],
        endpoint: "203.0.113.1:51820",
        lastHandshake: Date.now() / 1000 - 120,
        rxBytes: 1024 * 1024 * 50,
        txBytes: 1024 * 1024 * 10,
      },
      {
        publicKey: "peer2publickey=",
        allowedIps: ["10.10.0.3/32"],
        lastHandshake: Date.now() / 1000 - 3600,
        rxBytes: 1024 * 512,
        txBytes: 1024 * 128,
      },
    ],
  },
  {
    id: "2",
    name: "Office Tunnel",
    isPrimary: false,
    enabled: false,
    interface: "wg1",
    privateKey: "PRIVATE_KEY_HIDDEN",
    publicKey: "xyz987wvu654tsr321qpo098nml765kji432hgf=",
    address: "10.20.0.1/24",
    listenPort: 51821,
    config: `[Interface]
PrivateKey = PRIVATE_KEY_HIDDEN
Address = 10.20.0.1/24
ListenPort = 51821
`,
    peers: [],
  },
];

export const wireguardStatuses: Map<string, WireguardStatus> = new Map([
  [
    "1",
    {
      profileId: "1",
      connected: true,
      uptime: 3600 * 24 * 3,
      rxBytes: 1024 * 1024 * 100,
      txBytes: 1024 * 1024 * 20,
      peers: wireguardProfiles[0].peers,
    },
  ],
  [
    "2",
    { profileId: "2", connected: false, rxBytes: 0, txBytes: 0, peers: [] },
  ],
]);
