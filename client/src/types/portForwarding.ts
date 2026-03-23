export type Protocol = 'tcp' | 'udp' | 'both';

export type PortForwardingRule = {
  id: string;
  name: string;
  enabled: boolean;
  protocol: Protocol;
  sourceInterface: string;
  sourcePort: number | string;
  destinationIp: string;
  destinationPort: number;
  comment?: string;
}

export type CreatePortForwardingRuleRequest = {
  name: string;
  protocol: Protocol;
  sourceInterface: string;
  sourcePort: number | string;
  destinationIp: string;
  destinationPort: number;
  comment?: string;
}

export type UpdatePortForwardingRuleRequest = Partial<CreatePortForwardingRuleRequest> & {
  enabled?: boolean;
}

