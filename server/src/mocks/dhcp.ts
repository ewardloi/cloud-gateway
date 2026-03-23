import type { DhcpConfig, DhcpLease, Dhcpv6Config } from "../types/dhcp.js";

export const dhcpConfig: DhcpConfig = {
  interface: "eth0",
  rangeStart: "192.168.1.100",
  rangeEnd: "192.168.1.200",
  subnetMask: "255.255.255.0",
  gateway: "192.168.1.1",
  dns: ["1.1.1.1", "8.8.8.8"],
  leaseTime: 86400,
  reservations: [
    {
      id: "1",
      mac: "aa:bb:cc:11:22:33",
      ip: "192.168.1.10",
      hostname: "printer",
      comment: "Office printer",
    },
    {
      id: "2",
      mac: "aa:bb:cc:44:55:66",
      ip: "192.168.1.11",
      hostname: "nas-server",
      comment: "NAS storage",
    },
    {
      id: "3",
      mac: "aa:bb:cc:77:88:99",
      ip: "192.168.1.12",
      hostname: "pi-hole",
    },
  ],
};

export const dhcpLeases: DhcpLease[] = [
  {
    mac: "aa:bb:cc:11:22:33",
    ip: "192.168.1.10",
    hostname: "printer",
    expiresAt: Date.now() / 1000 + 86400,
    isReservation: true,
  },
  {
    mac: "aa:bb:cc:44:55:66",
    ip: "192.168.1.11",
    hostname: "nas-server",
    expiresAt: Date.now() / 1000 + 86400,
    isReservation: true,
  },
  {
    mac: "de:ad:be:ef:00:01",
    ip: "192.168.1.101",
    hostname: "laptop-john",
    expiresAt: Date.now() / 1000 + 3600,
    isReservation: false,
  },
  {
    mac: "de:ad:be:ef:00:02",
    ip: "192.168.1.102",
    hostname: "phone-mary",
    expiresAt: Date.now() / 1000 + 7200,
    isReservation: false,
  },
  {
    mac: "de:ad:be:ef:00:03",
    ip: "192.168.1.103",
    expiresAt: Date.now() / 1000 + 1800,
    isReservation: false,
  },
];

export const dhcpv6Config: Dhcpv6Config = {
  interface: "eth0",
  guaPrefix: "2001:db8::/48",
  ulaPrefix: "fd00::/48",
  useNptv6: true,
  nptv6InternalPrefix: "fd00::/48",
  nptv6ExternalPrefix: "2001:db8::/48",
  dns: ["2606:4700:4700::1111", "2001:4860:4860::8888"],
  leaseTime: 86400,
};
