import { Paper, Text, Group, Stack, Badge } from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import type { NetworkInterfaceStats, SystemMetrics } from '../../../types/system.ts';
import { SparkLine } from './SparkLine.tsx';

type NetworkSpeedCardProps = {
  iface: NetworkInterfaceStats;
  history: SystemMetrics[];
}

function formatSpeed(bps: number): string {
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(1)} MB/s`;
  if (bps >= 1e3) return `${(bps / 1e3).toFixed(0)} KB/s`;
  return `${bps} B/s`;
}

export function NetworkSpeedCard({ iface, history }: NetworkSpeedCardProps) {
  const rxHistory = history.map((m) =>
    m.interfaces.find((i) => i.name === iface.name)?.rxSpeed ?? 0,
  );

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm">
        <Text size="sm" fw={600}>{iface.name}</Text>
        <Badge variant="light" size="xs" color="teal">active</Badge>
      </Group>
      <SparkLine data={rxHistory} color="var(--mantine-color-teal-5)" height={120} />
      <Stack gap={4} mt="sm">
        <Group gap="xs">
          <IconArrowDown size={13} color="var(--mantine-color-teal-5)" />
          <Text size="xs" c="dimmed">RX</Text>
          <Text size="xs" fw={500} ml="auto">{formatSpeed(iface.rxSpeed)}</Text>
        </Group>
        <Group gap="xs">
          <IconArrowUp size={13} color="var(--mantine-color-orange-5)" />
          <Text size="xs" c="dimmed">TX</Text>
          <Text size="xs" fw={500} ml="auto">{formatSpeed(iface.txSpeed)}</Text>
        </Group>
      </Stack>
    </Paper>
  );
}
