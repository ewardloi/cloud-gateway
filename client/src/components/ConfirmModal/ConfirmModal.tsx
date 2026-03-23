import { Modal, Text, Group, Button } from '@mantine/core';

type ConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmModal({
  opened, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?',
  confirmLabel = 'Delete', loading,
}: ConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size="sm" centered>
      <Text size="sm" c="dimmed" mb="lg">{message}</Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button color="red" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </Group>
    </Modal>
  );
}
