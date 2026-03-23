import {
  SimpleGrid,
  Stack,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Table,
  ScrollArea,
} from "@mantine/core";
import {
  IconClock,
  IconCpu,
  IconDatabase,
  IconThermometer,
  IconTimeline,
  IconWifi,
} from "@tabler/icons-react";
import { useMetrics } from "../../hooks/useMetrics.ts";
import { MetricCard } from "../../components/MetricCard/MetricCard.tsx";
import { SparkLine } from "./components/SparkLine.tsx";
import { NetworkSpeedCard } from "./components/NetworkSpeedCard.tsx";

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
  return `${bytes} B`;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function Dashboard() {
  const { latest, history, connected } = useMetrics();

  const cpuHistory = history.map((m) => m.cpu.usage);
  const memHistory = history.map((m) => m.memory.usagePercent);
  const tempHistory = history.map((m) => m.cpu.temperature);

  return (
    <Stack gap="lg" className="fade-in">
      <Group justify="space-between" align="center">
        <div>
          <Title order={3}>Dashboard</Title>
          <Text size="sm" c="dimmed">
            System overview
          </Text>
        </div>
        <Badge color={connected ? "green" : "red"} variant="dot">
          {connected ? "Live" : "Disconnected"}
        </Badge>
      </Group>

      {/* System metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <MetricCard
          label="CPU Usage"
          value={latest ? `${latest.cpu.usage.toFixed(1)}%` : "—"}
          sub={latest?.cpu.model}
          percent={latest?.cpu.usage}
          color="blue"
          icon={<IconCpu size={16} />}
        >
          <SparkLine
            data={cpuHistory}
            color="var(--mantine-color-blue-5)"
            height={80}
          />
        </MetricCard>
        <MetricCard
          label="Memory"
          value={latest ? `${latest.memory.usagePercent.toFixed(1)}%` : "—"}
          sub={
            latest
              ? `${formatBytes(latest.memory.used)} / ${formatBytes(latest.memory.total)}`
              : undefined
          }
          percent={latest?.memory.usagePercent}
          color="violet"
          icon={<IconDatabase size={16} />}
        >
          <SparkLine
            data={memHistory}
            color="var(--mantine-color-violet-5)"
            height={80}
          />
        </MetricCard>
        <MetricCard
          label="Temperature"
          value={latest ? `${latest.cpu.temperature.toFixed(1)}°C` : "—"}
          sub={
            latest
              ? latest.cpu.temperature > 70
                ? "High — check cooling"
                : "Normal range"
              : undefined
          }
          percent={
            latest
              ? Math.min(100, (latest.cpu.temperature / 90) * 100)
              : undefined
          }
          color={latest && latest.cpu.temperature > 70 ? "red" : "orange"}
          icon={<IconThermometer size={16} />}
        >
          <SparkLine
            data={tempHistory}
            color="var(--mantine-color-orange-5)"
            height={80}
          />
        </MetricCard>
        <MetricCard
          label="Uptime"
          value={latest ? formatUptime(Date.now() / 1000 - latest.uptime) : "—"}
          sub="Since last reboot"
          icon={<IconClock size={16} />}
        />
      </SimpleGrid>

      <Paper withBorder radius="md" p="md">
        <Text size="sm" fw={600} mb="md">
          Network Interfaces
        </Text>
        {latest?.interfaces && latest.interfaces.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {latest.interfaces.map((iface) => (
              <NetworkSpeedCard
                key={iface.name}
                iface={iface}
                history={history}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Text c="dimmed" size="sm">
            No interface data
          </Text>
        )}
      </Paper>
    </Stack>
  );
}
