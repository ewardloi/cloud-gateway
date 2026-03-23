import {
  Stack, Title, Text, Group, Button, SimpleGrid, Paper, Badge,
  ActionIcon, Modal, Loader, Alert, Switch,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { IconPlus, IconRefresh, IconTrash, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useAsync } from '../../hooks/useAsync.ts';
import { wireguardApi } from '../../api/index.ts';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal.tsx';
import { ProfileCard } from './components/ProfileCard.tsx';
import { ProfileForm } from './components/ProfileForm.tsx';

export default function WireGuard() {
  const { data: profiles, isLoading, error, reload } = useAsync(() => wireguardApi.getProfiles());
  const [addOpen, { open: openAdd, close: closeAdd }] = useDisclosure();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await wireguardApi.deleteProfile(deleteId);
      notifications.show({ message: 'Profile deleted', color: 'green' });
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
          <Title order={3}>WireGuard</Title>
          <Text size="sm" c="dimmed">VPN profiles and connections</Text>
        </div>
        <Group>
          <Button leftSection={<IconRefresh size={15} />} variant="default" size="sm" onClick={reload}>Refresh</Button>
          <Button leftSection={<IconPlus size={15} />} size="sm" onClick={openAdd}>Add Profile</Button>
        </Group>
      </Group>

      {isLoading && <Loader size="sm" />}
      {error && <Alert color="red">{error}</Alert>}

      {profiles && (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onDelete={() => setDeleteId(profile.id)}
              onUpdated={reload}
            />
          ))}
        </SimpleGrid>
      )}

      <Modal opened={addOpen} onClose={closeAdd} title="Add WireGuard Profile" centered size="lg">
        <ProfileForm onSaved={() => { reload(); closeAdd(); }} />
      </Modal>

      <ConfirmModal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Profile"
        message="This WireGuard profile will be permanently deleted."
        loading={deleting}
      />
    </Stack>
  );
}
