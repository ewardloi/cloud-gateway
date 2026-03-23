import {
  Paper, Group, Text, Badge, Button, Stack, Divider, ActionIcon, Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { IconShieldLock, IconStar, IconStarFilled, IconTrash, IconPlugConnected, IconPlugConnectedX } from '@tabler/icons-react';
import { wireguardApi } from '../../../api/index.ts';
import { useAsync } from '../../../hooks/useAsync.ts';
import type { WireguardProfile } from '../../../types/wireguard.ts';

function formatBytes(b: number): string {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(1)} MB`;
  if (b >= 1e3) return `${(b / 1e3).toFixed(0)} KB`;
  return `${b} B`;
}

type ProfileCardProps = {
  profile: WireguardProfile;
  onDelete: () => void;
  onUpdated: () => void;
}

export function ProfileCard({ profile, onDelete, onUpdated }: ProfileCardProps) {
  const { data: status, reload: reloadStatus } = useAsync(() => wireguardApi.getStatus(profile.id));
  const [toggling, setToggling] = useState(false);
  const [settingPrimary, setSettingPrimary] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await wireguardApi.toggleConnection(profile.id);
      notifications.show({ message: res.connected ? 'Connected' : 'Disconnected', color: res.connected ? 'green' : 'blue' });
      reloadStatus();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    } finally {
      setToggling(false);
    }
  };

  const handleSetPrimary = async () => {
    setSettingPrimary(true);
    try {
      await wireguardApi.updateProfile(profile.id, { isPrimary: true });
      notifications.show({ message: `${profile.name} set as primary`, color: 'green' });
      onUpdated();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    } finally {
      setSettingPrimary(false);
    }
  };

  const connected = status?.connected ?? false;

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <IconShieldLock size={18} color={connected ? 'var(--mantine-color-green-5)' : 'var(--mantine-color-gray-5)'} />
          <Text fw={600} size="sm">{profile.name}</Text>
          {profile.isPrimary && (
            <Tooltip label="Primary profile (protected from deletion)">
              <IconStarFilled size={14} color="var(--mantine-color-yellow-5)" />
            </Tooltip>
          )}
        </Group>
        <Group gap="xs">
          <Badge size="xs" color={connected ? 'green' : 'gray'} variant="dot">
            {connected ? 'Connected' : 'Idle'}
          </Badge>
          <Badge size="xs" variant="light">{profile.interface}</Badge>
        </Group>
      </Group>

      <Stack gap={4} mb="sm">
        <Text size="xs" c="dimmed">Address: <Text component="span" size="xs" ff="monospace">{profile.address}</Text></Text>
        {profile.listenPort && <Text size="xs" c="dimmed">Port: <Text component="span" size="xs">{profile.listenPort}</Text></Text>}
        <Text size="xs" c="dimmed">Peers: <Text component="span" size="xs">{profile.peers.length}</Text></Text>
        {status && (
          <Text size="xs" c="dimmed">
            RX: <Text component="span" size="xs">{formatBytes(status.rxBytes)}</Text>
            {' · '}
            TX: <Text component="span" size="xs">{formatBytes(status.txBytes)}</Text>
          </Text>
        )}
      </Stack>

      <Divider mb="sm" />

      <Group gap="xs">
        <Button
          size="xs"
          variant={connected ? 'light' : 'filled'}
          color={connected ? 'red' : 'green'}
          leftSection={connected ? <IconPlugConnectedX size={13} /> : <IconPlugConnected size={13} />}
          onClick={handleToggle}
          loading={toggling}
        >
          {connected ? 'Disconnect' : 'Connect'}
        </Button>

        {!profile.isPrimary && (
          <Tooltip label="Set as primary">
            <ActionIcon variant="subtle" onClick={handleSetPrimary} loading={settingPrimary}>
              <IconStar size={15} />
            </ActionIcon>
          </Tooltip>
        )}

        {!profile.isPrimary && (
          <ActionIcon variant="subtle" color="red" onClick={onDelete} ml="auto">
            <IconTrash size={15} />
          </ActionIcon>
        )}
      </Group>
    </Paper>
  );
}
