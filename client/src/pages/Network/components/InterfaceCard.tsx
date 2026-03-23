import {
  Paper, Group, Text, Badge, Button, Modal, Select, TextInput,
  Stack, NumberInput, Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { IconEdit, IconPlugConnected } from '@tabler/icons-react';
import { networkApi } from '../../../api/index.ts';
import type { NetworkInterface, IpMode } from '../../../types/network.ts';

type InterfaceCardProps = {
  iface: NetworkInterface;
  onUpdated: () => void;
}

export function InterfaceCard({ iface, onUpdated }: InterfaceCardProps) {
  const [opened, { open, close }] = useDisclosure();
  const [mode, setMode] = useState<IpMode>(iface.ipv4.mode);
  const [address, setAddress] = useState(iface.ipv4.address ?? '');
  const [prefix, setPrefix] = useState<number | string>(iface.ipv4.prefixLength ?? 24);
  const [gateway, setGateway] = useState(iface.ipv4.gateway ?? '');
  const [dns, setDns] = useState((iface.ipv4.dns ?? []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await networkApi.updateInterface(iface.name, {
        ipv4: {
          mode,
          address: mode === 'static' ? address : undefined,
          prefixLength: mode === 'static' ? Number(prefix) : undefined,
          gateway: mode === 'static' ? gateway : undefined,
          dns: mode === 'static' ? dns.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        },
      });
      notifications.show({ message: `${iface.name} updated`, color: 'green' });
      onUpdated();
      close();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="sm">
          <Group gap="sm">
            <IconPlugConnected size={18} color="var(--mantine-color-blue-5)" />
            <Text fw={600} size="sm">{iface.name}</Text>
          </Group>
          <Group gap="xs">
            <Badge size="xs" color={iface.isUp ? 'green' : 'gray'} variant="dot">
              {iface.isUp ? 'Up' : 'Down'}
            </Badge>
            <Badge size="xs" variant="light">{iface.type}</Badge>
          </Group>
        </Group>
        <Stack gap={4}>
          <Text size="xs" c="dimmed">MAC: <Text component="span" size="xs" ff="monospace">{iface.mac}</Text></Text>
          <Text size="xs" c="dimmed">IP: <Text component="span" size="xs" fw={500}>{iface.ipv4.address ?? '—'}/{iface.ipv4.prefixLength ?? '—'}</Text></Text>
          <Text size="xs" c="dimmed">Mode: <Text component="span" size="xs">{iface.ipv4.mode}</Text></Text>
          {iface.speed && <Text size="xs" c="dimmed">Speed: {iface.speed} Mbps</Text>}
        </Stack>
        <Divider my="sm" />
        <Button size="xs" variant="light" leftSection={<IconEdit size={13} />} onClick={open}>
          Configure
        </Button>
      </Paper>

      <Modal opened={opened} onClose={close} title={`Configure ${iface.name}`} centered>
        <Stack gap="sm">
          <Select
            label="IP Mode"
            value={mode}
            onChange={(v) => setMode(v as IpMode)}
            data={[
              { value: 'static', label: 'Static' },
              { value: 'dhcp', label: 'DHCP' },
              { value: 'disabled', label: 'Disabled' },
            ]}
          />
          {mode === 'static' && (
            <>
              <TextInput label="IP Address" value={address} onChange={(e) => setAddress(e.currentTarget.value)} placeholder="192.168.1.1" />
              <NumberInput label="Prefix Length" value={prefix} onChange={setPrefix} min={1} max={32} />
              <TextInput label="Gateway" value={gateway} onChange={(e) => setGateway(e.currentTarget.value)} placeholder="192.168.1.254" />
              <TextInput label="DNS (comma-separated)" value={dns} onChange={(e) => setDns(e.currentTarget.value)} placeholder="1.1.1.1, 8.8.8.8" />
            </>
          )}
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
