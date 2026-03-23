export type CpuInfo = {
  usage: number;
  cores: number;
  model: string;
  temperature: number;
}

export type MemoryInfo = {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
}

export type NetworkInterfaceStats = {
  name: string;
  rxBytes: number;
  txBytes: number;
  rxSpeed: number;
  txSpeed: number;
}

export type SystemMetrics = {
  cpu: CpuInfo;
  memory: MemoryInfo;
  interfaces: NetworkInterfaceStats[];
  uptime: number;
  timestamp: number;
}

export type SystemInfo = {
  isSetupDone: boolean;
  hasWifi: boolean;
  version: string;
  hostname: string;
}
