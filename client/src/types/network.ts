export type InterfaceType = 'ethernet' | 'wifi' | 'loopback' | 'bridge' | 'vlan';
export type IpMode = 'static' | 'dhcp' | 'disabled';

export type IpConfig = {
  mode: IpMode;
  address?: string;
  prefixLength?: number;
  gateway?: string;
  dns?: string[];
}

export type NetworkInterface = {
  name: string;
  type: InterfaceType;
  mac: string;
  mtu: number;
  isUp: boolean;
  ipv4: IpConfig;
  ipv6?: IpConfig;
  speed?: number;
  duplex?: 'full' | 'half';
}

export type WifiNetwork = {
  ssid: string;
  bssid: string;
  signal: number;
  security: string;
  frequency: number;
  connected: boolean;
}

export type HotspotConfig = {
  ssid: string;
  password: string;
  channel: number;
  band: '2.4GHz' | '5GHz';
}
