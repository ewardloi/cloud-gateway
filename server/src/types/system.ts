export type CpuInfo = {
  usage: number;
  cores: number;
  model: string;
  temperature: number;
};

export type MemoryInfo = {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
};

export type NetworkInterfaceStats = {
  name: string;
  rxBytes: number;
  txBytes: number;
  rxSpeed: number;
  txSpeed: number;
};

export type SystemMetrics = {
  cpu: CpuInfo;
  memory: MemoryInfo;
  interfaces: NetworkInterfaceStats[];
  uptime: number;
  timestamp: number;
};

export type MetricsWindow = {
  data: SystemMetrics[];
  maxSize: number;
};
