import {
  Stack, Title, Text, Group, Button, Paper, Table, Badge,
  Switch, ActionIcon, Modal, TextInput, Select, Alert, Loader,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { IconPlus, IconTrash, IconEdit, IconRefresh } from '@tabler/icons-react';
import { useAsync } from '../../hooks/useAsync.ts';
import { portForwardingApi } from '../../api/index.ts';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal.tsx';
import { RuleForm } from './components/RuleForm.tsx';
import type { PortForwardingRule } from '../../types/portForwarding.ts';

export default function PortForwarding() {
  const { data: rules, isLoading, error, reload } = useAsync(() => portForwardingApi.getRules());
  const [addOpen, { open: openAdd, close: closeAdd }] = useDisclosure();
  const [editRule, setEditRule] = useState<PortForwardingRule | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async (rule: PortForwardingRule) => {
    try {
      await portForwardingApi.updateRule(rule.id, { enabled: !rule.enabled });
      reload();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await portForwardingApi.deleteRule(deleteId);
      notifications.show({ message: 'Rule deleted', color: 'green' });
      reload();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <Stack gap="lg" className="fade-in">
      <Group justify="space-between">
        <div>
          <Title order={3}>Port Forwarding</Title>
          <Text size="sm" c="dimmed">NAT rules between interfaces</Text>
        </div>
        <Group>
          <Button leftSection={<IconRefresh size={15} />} variant="default" size="sm" onClick={reload}>Refresh</Button>
          <Button leftSection={<IconPlus size={15} />} size="sm" onClick={openAdd}>Add Rule</Button>
        </Group>
      </Group>

      {isLoading && <Loader size="sm" />}
      {error && <Alert color="red">{error}</Alert>}

      {rules && (
        <Paper withBorder radius="md">
          <Table.ScrollContainer minWidth={700}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Enabled</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Protocol</Table.Th>
                  <Table.Th>Source</Table.Th>
                  <Table.Th>Destination</Table.Th>
                  <Table.Th>Comment</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rules.map((rule) => (
                  <Table.Tr key={rule.id} opacity={rule.enabled ? 1 : 0.5}>
                    <Table.Td>
                      <Switch checked={rule.enabled} onChange={() => handleToggle(rule)} size="sm" />
                    </Table.Td>
                    <Table.Td><Text size="sm" fw={500}>{rule.name}</Text></Table.Td>
                    <Table.Td>
                      <Badge size="xs" variant="light" tt="uppercase">{rule.protocol}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" ff="monospace">{rule.sourceInterface}:{rule.sourcePort}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" ff="monospace">{rule.destinationIp}:{rule.destinationPort}</Text>
                    </Table.Td>
                    <Table.Td><Text size="sm" c="dimmed">{rule.comment ?? '—'}</Text></Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon variant="subtle" onClick={() => setEditRule(rule)}><IconEdit size={15} /></ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => setDeleteId(rule.id)}><IconTrash size={15} /></ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      )}

      <Modal opened={addOpen} onClose={closeAdd} title="Add Port Forwarding Rule" centered size="md">
        <RuleForm onSaved={() => { reload(); closeAdd(); }} />
      </Modal>

      <Modal opened={!!editRule} onClose={() => setEditRule(null)} title="Edit Rule" centered size="md">
        {editRule && (
          <RuleForm rule={editRule} onSaved={() => { reload(); setEditRule(null); }} />
        )}
      </Modal>

      <ConfirmModal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Rule"
        message="This port forwarding rule will be removed."
        loading={deleting}
      />
    </Stack>
  );
}
