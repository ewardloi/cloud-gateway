import { Stack, TextInput, Textarea, Button, Group, Tabs, Text, FileButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { IconUpload } from '@tabler/icons-react';
import { wireguardApi } from '../../../api/index.ts';
import classes from './ProfileForm.module.css';

type ProfileFormProps = {
  onSaved: () => void;
}

export function ProfileForm({ onSaved }: ProfileFormProps) {
  const [name, setName] = useState('');
  const [config, setConfig] = useState('');
  const [saving, setSaving] = useState(false);

  const handleFile = (file: File | null) => {
    if (!file) return;
    file.text().then((text) => {
      setConfig(text);
      if (!name) setName(file.name.replace(/\.conf$/, ''));
    });
  };

  const handleSave = async () => {
    if (!name || !config) return;
    setSaving(true);
    try {
      await wireguardApi.createProfile(name, config);
      notifications.show({ message: 'Profile created', color: 'green' });
      onSaved();
    } catch (e: any) {
      notifications.show({ message: e.message, color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="sm">
      <TextInput
        label="Profile Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Home VPN"
        required
      />

      <Tabs defaultValue="editor">
        <Tabs.List>
          <Tabs.Tab value="editor">Config Editor</Tabs.Tab>
          <Tabs.Tab value="upload">Upload File</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="editor" pt="sm">
          <Text size="xs" c="dimmed" mb="xs">Paste your wg-quick configuration:</Text>
          <Textarea
            value={config}
            onChange={(e) => setConfig(e.currentTarget.value)}
            placeholder={`[Interface]\nPrivateKey = ...\nAddress = 10.0.0.1/24\nListenPort = 51820\n\n[Peer]\nPublicKey = ...\nAllowedIPs = 0.0.0.0/0`}
            minRows={12}
            autosize
            className={classes.configEditor}
            ff="monospace"
          />
        </Tabs.Panel>

        <Tabs.Panel value="upload" pt="sm">
          <Stack align="center" gap="md" py="xl">
            <Text size="sm" c="dimmed">Upload a .conf file</Text>
            <FileButton onChange={handleFile} accept=".conf">
              {(props) => (
                <Button {...props} leftSection={<IconUpload size={15} />} variant="light">
                  Choose .conf file
                </Button>
              )}
            </FileButton>
            {config && (
              <Text size="xs" c="green">
                Config loaded ({config.length} chars)
              </Text>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="sm">
        <Button onClick={handleSave} loading={saving} disabled={!name || !config}>
          Create Profile
        </Button>
      </Group>
    </Stack>
  );
}
