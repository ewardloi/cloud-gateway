export type DhcpReservation = {
  id: string;
  mac: string;
  ip: string;
  hostname?: string;
  comment?: string;
};

export type DhcpConfig = {
  interface: string;
  rangeStart: string;
  rangeEnd: string;
  subnetMask: string;
  gateway: string;
  dns: string[];
  leaseTime: number;
  reservations: DhcpReservation[];
};

export type DhcpLease = {
  mac: string;
  ip: string;
  hostname?: string;
  expiresAt: number;
  isReservation: boolean;
};

export type Dhcpv6Config = {
  interface: string;
  guaPrefix?: string;
  ulaPrefix?: string;
  useNptv6: boolean;
  nptv6InternalPrefix?: string;
  nptv6ExternalPrefix?: string;
  dns: string[];
  leaseTime: number;
};

export type Dhcpv6Reservation = {
  id: string;
  duid: string;
  ip: string;
  hostname?: string;
};

export type CreateReservationRequest = {
  mac: string;
  ip: string;
  hostname?: string;
  comment?: string;
};

export type UpdateDhcpConfigRequest = {
  rangeStart?: string;
  rangeEnd?: string;
  gateway?: string;
  dns?: string[];
  leaseTime?: number;
};
