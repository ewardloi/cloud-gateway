import {
  Stack, Title, Text, SimpleGrid, Paper, Group, Badge, Button,
  Modal, Select, TextInput, NumberInput, Loader, Alert, Tabs,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { IconRefresh, IconEdit, IconWifi, IconNetwork } from '@tabler/icons-react';
import { useAsync } from '../../hooks/useAsync.ts';
import { networkApi } from '../../api/index.ts';
import type { NetworkInterface, IpMode } from '../../types/network.ts';
import { InterfaceCard } from './components/InterfaceCard.tsx';
import { WifiPanel } from './components/WifiPanel.tsx';

export default function Network() {
  const { data: interfaces, isLoading, error, reload } = useAsync(() => networkApi.getInterfaces());

  return (
    <Stack gap="lg" className="fade-in">
      <Group justify="space-between">
        <div>
          <Title order={3}>Network</Title>
          <Text size="sm" c="dimmed">Manage interfaces and Wi-Fi</Text>
        </div>
        <Button leftSection={<IconRefresh size={15} />} variant="default" size="sm" onClick={reload}>
          Refresh
        </Button>
      </Group>

      <Tabs defaultValue="interfaces">
        <Tabs.List>
          <Tabs.Tab value="interfaces" leftSection={<IconNetwork size={15} />}>Interfaces</Tabs.Tab>
          <Tabs.Tab value="wifi" leftSection={<IconWifi size={15} />}>Wi-Fi</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="interfaces" pt="md">
          {isLoading && <Loader size="sm" />}
          {error && <Alert color="red">{error}</Alert>}
          {interfaces && (
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {interfaces.map((iface) => (
                <InterfaceCard key={iface.name} iface={iface} onUpdated={reload} />
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="wifi" pt="md">
          <WifiPanel />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
