import { Stack, TextInput, Select, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { portForwardingApi } from '../../../api/index.ts';
import type { PortForwardingRule, Protocol } from '../../../types/portForwarding.ts';

type RuleFormProps = {
  rule?: PortForwardingRule;
  onSaved: () => void;
}

export function RuleForm({ rule, onSaved }: RuleFormProps) {
  const [name, setName] = useState(rule?.name ?? '');
  const [protocol, setProtocol] = useState<Protocol>(rule?.protocol ?? 'tcp');
  const [sourceIface, setSourceIface] = useState(rule?.sourceInterface ?? '');
  const [sourcePort, setSourcePort] = useState(String(rule?.sourcePort ?? ''));
  const [destIp, setDestIp] = useState(rule?.destinationIp ?? '');
  const [destPort, setDestPort] = useState(String(rule?.destinationPort ?? ''));
  const [comment, setComment] = useState(rule?.comment ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name, protocol,
        sourceInterface: sourceIface,
        sourcePort: sourcePort.includes('-') ? sourcePort : Number(sourcePort),
        destinationIp: destIp,
        destinationPort: Number(destPort),
        comment: comment || undefined,
      };
      if (rule) {
        await portForwardingApi.updateRule(rule.id, payload);
        notifications.show({ message: 'Rule updated', color: 'green' });
      } else {
        await portForwardingApi.createRule(payload);
        notifications.show({ message: 'Rule created', color: 'green' });
      }
      onSaved();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="sm">
      <TextInput label="Name" value={name} onChange={(e) => setName(e.currentTarget.value)} required />
      <Select
        label="Protocol"
        value={protocol}
        onChange={(v) => setProtocol(v as Protocol)}
        data={[{ value: 'tcp', label: 'TCP' }, { value: 'udp', label: 'UDP' }, { value: 'both', label: 'Both' }]}
      />
      <TextInput label="Source Interface" value={sourceIface} onChange={(e) => setSourceIface(e.currentTarget.value)} placeholder="eth1" />
      <TextInput label="Source Port / Range" value={sourcePort} onChange={(e) => setSourcePort(e.currentTarget.value)} placeholder="80 or 8000-8010" />
      <TextInput label="Destination IP" value={destIp} onChange={(e) => setDestIp(e.currentTarget.value)} placeholder="192.168.1.50" />
      <TextInput label="Destination Port" value={destPort} onChange={(e) => setDestPort(e.currentTarget.value)} placeholder="80" />
      <TextInput label="Comment" value={comment} onChange={(e) => setComment(e.currentTarget.value)} />
      <Group justify="flex-end" mt="sm">
        <Button onClick={handleSave} loading={saving} disabled={!name || !sourceIface || !sourcePort || !destIp || !destPort}>
          {rule ? 'Update' : 'Create'}
        </Button>
      </Group>
    </Stack>
  );
}
