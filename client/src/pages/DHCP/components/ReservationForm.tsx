import { Stack, TextInput, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { dhcpApi } from '../../../api/index.ts';

type ReservationFormProps = {
  onSaved: () => void;
}

export function ReservationForm({ onSaved }: ReservationFormProps) {
  const [mac, setMac] = useState('');
  const [ip, setIp] = useState('');
  const [hostname, setHostname] = useState('');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!mac || !ip) return;
    setSaving(true);
    try {
      await dhcpApi.createReservation({ mac, ip, hostname: hostname || undefined, comment: comment || undefined });
      notifications.show({ message: 'Reservation created', color: 'green' });
      onSaved();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="sm">
      <TextInput label="MAC Address" value={mac} onChange={(e) => setMac(e.currentTarget.value)} placeholder="aa:bb:cc:dd:ee:ff" required />
      <TextInput label="IP Address" value={ip} onChange={(e) => setIp(e.currentTarget.value)} placeholder="192.168.1.50" required />
      <TextInput label="Hostname" value={hostname} onChange={(e) => setHostname(e.currentTarget.value)} placeholder="my-device" />
      <TextInput label="Comment" value={comment} onChange={(e) => setComment(e.currentTarget.value)} placeholder="Optional note" />
      <Group justify="flex-end" mt="sm">
        <Button onClick={handleSave} loading={saving} disabled={!mac || !ip}>Add Reservation</Button>
      </Group>
    </Stack>
  );
}
