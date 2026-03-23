import {
  generateMetrics
} from "../mocks/system.js";
import type { SystemMetrics } from "../types/system.js";

export function getLatestMetrics(): SystemMetrics | null {
  return generateMetrics();
}
