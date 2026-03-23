import type { NetworkInterface, WifiNetwork } from "../types/network.js";

export const networkInterfaces: NetworkInterface[] = [
  {
    name: "eth0",
    type: "ethernet",
    mac: "dc:a6:32:aa:bb:cc",
    mtu: 1500,
    isUp: true,
    ipv4: {
      mode: "static",
      address: "192.168.1.1",
      prefixLength: 24,
      gateway: "",
      dns: ["1.1.1.1", "8.8.8.8"],
    },
    ipv6: { mode: "static", address: "fd00::1", prefixLength: 64 },
    speed: 1000,
    duplex: "full",
  },
  {
    name: "eth1",
    type: "ethernet",
    mac: "dc:a6:32:aa:bb:cd",
    mtu: 1500,
    isUp: true,
    ipv4: {
      mode: "dhcp",
      address: "10.0.0.5",
      prefixLength: 24,
      gateway: "10.0.0.1",
      dns: ["10.0.0.1"],
    },
    speed: 1000,
    duplex: "full",
  },
  {
    name: "wlan0",
    type: "wifi",
    mac: "dc:a6:32:aa:bb:ce",
    mtu: 1500,
    isUp: false,
    ipv4: { mode: "disabled" },
  },
];

export const wifiNetworks: WifiNetwork[] = [
  {
    ssid: "HomeNetwork",
    bssid: "aa:bb:cc:dd:ee:01",
    signal: -45,
    security: "WPA2",
    frequency: 2412,
    connected: false,
  },
  {
    ssid: "OfficeWiFi",
    bssid: "aa:bb:cc:dd:ee:02",
    signal: -62,
    security: "WPA3",
    frequency: 5180,
    connected: false,
  },
  {
    ssid: "GuestNet",
    bssid: "aa:bb:cc:dd:ee:03",
    signal: -78,
    security: "WPA2",
    frequency: 2437,
    connected: false,
  },
  {
    ssid: "IoT_Network",
    bssid: "aa:bb:cc:dd:ee:04",
    signal: -55,
    security: "WPA2",
    frequency: 2462,
    connected: false,
  },
];
