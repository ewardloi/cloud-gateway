import { portForwardingRules } from "../mocks/portForwarding.js";
import type {
  CreatePortForwardingRuleRequest,
  UpdatePortForwardingRuleRequest,
} from "../types/portForwarding.js";
import { randomUUID } from "crypto";

const BLOCKED_INTERFACES = (process.env.BLOCKED_INTERFACES ?? "")
  .split(",")
  .filter(Boolean);

export function getRules() {
  return portForwardingRules;
}

export function getRule(id: string) {
  return portForwardingRules.find((r) => r.id === id);
}

export function isInterfaceBlocked(name: string): boolean {
  return BLOCKED_INTERFACES.includes(name);
}

export function createRule(req: CreatePortForwardingRuleRequest) {
  if (isInterfaceBlocked(req.sourceInterface)) return null;
  const rule = { id: randomUUID(), enabled: true, ...req };
  portForwardingRules.push(rule);
  return rule;
}

export function updateRule(id: string, req: UpdatePortForwardingRuleRequest) {
  const rule = portForwardingRules.find((r) => r.id === id);
  if (!rule) return null;
  if (req.sourceInterface && isInterfaceBlocked(req.sourceInterface))
    return null;
  Object.assign(rule, req);
  return rule;
}

export function deleteRule(id: string): boolean {
  const idx = portForwardingRules.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  portForwardingRules.splice(idx, 1);
  return true;
}
