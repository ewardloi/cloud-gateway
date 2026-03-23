import { Stack, Paper, Group, Text, Badge, Button, PasswordInput, Modal, Loader, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { IconWifi, IconWifiOff } from '@tabler/icons-react';
import { useAsync } from '../../../hooks/useAsync.ts';
import { networkApi } from '../../../api/index.ts';
import type { WifiNetwork } from '../../../types/network.ts';

function signalColor(signal: number): string {
  if (signal >= -55) return 'green';
  if (signal >= -70) return 'yellow';
  return 'red';
}

export function WifiPanel() {
  const { data: networks, isLoading, error, reload } = useAsync(() => networkApi.getWifiNetworks("wlan0"));
  const [selected, setSelected] = useState<WifiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [opened, { open, close }] = useDisclosure();

  const handleConnect = (net: WifiNetwork) => {
    setSelected(net);
    setPassword('');
    open();
  };

  const handleConfirmConnect = async () => {
    if (!selected) return;
    setConnecting(true);
    try {
      await networkApi.connectWifi(selected.ssid, password || undefined);
      notifications.show({ message: `Connected to ${selected.ssid}`, color: 'green' });
      reload();
      close();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await networkApi.disconnectWifi();
      notifications.show({ message: 'Disconnected', color: 'blue' });
      reload();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    }
  };

  if (isLoading) return <Loader size="sm" />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <>
      <Stack gap="sm">
        {networks?.map((net) => (
          <Paper key={net.bssid} withBorder radius="md" p="sm">
            <Group justify="space-between">
              <Group gap="sm">
                <IconWifi size={18} color={`var(--mantine-color-${signalColor(net.signal)}-5)`} />
                <div>
                  <Text size="sm" fw={500}>{net.ssid}</Text>
                  <Text size="xs" c="dimmed">{net.security} · {net.frequency >= 5000 ? '5 GHz' : '2.4 GHz'} · {net.signal} dBm</Text>
                </div>
              </Group>
              {net.connected ? (
                <Group gap="xs">
                  <Badge color="green" variant="dot" size="sm">Connected</Badge>
                  <Button size="xs" color="red" variant="light" leftSection={<IconWifiOff size={13} />} onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </Group>
              ) : (
                <Button size="xs" variant="light" onClick={() => handleConnect(net)}>Connect</Button>
              )}
            </Group>
          </Paper>
        ))}
      </Stack>

      <Modal opened={opened} onClose={close} title={`Connect to ${selected?.ssid}`} centered size="sm">
        <Stack>
          {selected?.security !== 'Open' && (
            <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} placeholder="Wi-Fi password" />
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button onClick={handleConfirmConnect} loading={connecting}>Connect</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
