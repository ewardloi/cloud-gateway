import { Badge } from '@mantine/core';

type Status = 'online' | 'offline' | 'warning' | 'unknown';

type StatusBadgeProps = {
  status: Status;
  label?: string;
}

const colorMap: Record<Status, string> = {
  online: 'green',
  offline: 'red',
  warning: 'yellow',
  unknown: 'gray',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Badge color={colorMap[status]} variant="dot" size="sm">
      {label ?? status}
    </Badge>
  );
}
