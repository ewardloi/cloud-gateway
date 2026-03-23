import { Paper, Text, RingProgress, Group, Stack } from '@mantine/core';
import classes from './MetricCard.module.css';

type MetricCardProps = {
  label: string;
  value: string;
  sub?: string;
  percent?: number;
  color?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function MetricCard({ label, value, sub, percent, color = 'blue', icon, children }: MetricCardProps) {
  return (
    <Paper className={classes.card} withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" c="dimmed" fw={500} tt="uppercase" style={{ letterSpacing: '0.05em' }}>
            {label}
          </Text>
          <Text size="xl" fw={700} className={classes.value}>
            {value}
          </Text>
          {sub && (
            <Text size="xs" c="dimmed" truncate>
              {sub}
            </Text>
          )}
        </Stack>
        {percent !== undefined ? (
          <RingProgress
            size={64}
            thickness={6}
            roundCaps
            sections={[{ value: percent, color }]}
            label={icon ? <div className={classes.icon}>{icon}</div> : undefined}
          />
        ) : icon ? (
          <div className={classes.iconWrap}>{icon}</div>
        ) : null}
      </Group>
      {children}
    </Paper>
  );
}
