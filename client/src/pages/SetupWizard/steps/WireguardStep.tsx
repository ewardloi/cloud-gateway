import {
  Stack,
  Text,
  Textarea,
  Button,
  Group,
  Tabs,
  FileButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IconUpload } from "@tabler/icons-react";
import { setupApi } from "../../../api/index.ts";

type WireguardStepProps = {
  onBack: () => void;
  onComplete: () => void;
  completing: boolean;
};

export function WireguardStep({
  onBack,
  onComplete,
  completing,
}: WireguardStepProps) {
  const [config, setConfig] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFile = (file: File | null) => {
    if (!file) return;
    file.text().then(setConfig);
  };

  const handleApply = async () => {
    if (!config) {
      onComplete();
      return;
    }

    setSaving(true);

    try {
      await setupApi.setWireguard(config);

      onComplete();
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="sm">
      <Text size="sm">Configure a WireGuard VPN profile:</Text>

      <Tabs defaultValue="editor">
        <Tabs.List>
          <Tabs.Tab value="editor">Config Editor</Tabs.Tab>
          <Tabs.Tab value="upload">Upload .conf</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="editor" pt="sm">
          <Textarea
            value={config}
            required
            onChange={(e) => setConfig(e.currentTarget.value)}
            placeholder={`[Interface]\nPrivateKey = ...\nAddress = 10.0.0.1/24\nListenPort = 51820\n\n[Peer]\nPublicKey = ...\nAllowedIPs = 0.0.0.0/0`}
            minRows={10}
            autosize
            ff="monospace"
            styles={{ input: { fontSize: "13px" } }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="upload" pt="sm">
          <Stack align="center" gap="md" py="xl">
            <Text size="sm" c="dimmed">
              Upload a WireGuard .conf file
            </Text>
            <FileButton onChange={handleFile} accept=".conf">
              {(props) => (
                <Button
                  {...props}
                  leftSection={<IconUpload size={15} />}
                  variant="light"
                >
                  Choose file
                </Button>
              )}
            </FileButton>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="sm">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleApply}
          loading={saving || completing}
          disabled={!config}
        >
          Apply
        </Button>
      </Group>
    </Stack>
  );
}
