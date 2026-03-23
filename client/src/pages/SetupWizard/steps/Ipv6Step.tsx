import { Stack, Text, TextInput, Button, Group, Switch } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { setupApi } from "../../../api/index.ts";

type Ipv6StepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function Ipv6Step({ onNext, onBack }: Ipv6StepProps) {
  const [gua, setGua] = useState("");
  const [ula, setUla] = useState("");
  const [useNptv6, setUseNptv6] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    setSaving(true);

    try {
      await setupApi.setIpv6({
        guaPrefix: gua || undefined,
        ulaPrefix: ula || undefined,
        useNptv6,
      });

      onNext();
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="sm">
      <Text size="sm">Configure DHCPv6 prefixes (optional):</Text>
      <TextInput
        label="GUA Prefix"
        value={gua}
        onChange={(e) => setGua(e.currentTarget.value)}
        placeholder="2001:db8::/48"
        ff="monospace"
      />
      <Switch
        label="Enable NPTv6 (Network Prefix Translation)"
        checked={useNptv6}
        onChange={(e) => setUseNptv6(e.currentTarget.checked)}
      />
      {useNptv6 && (
        <TextInput
          label="ULA Prefix"
          value={ula}
          onChange={(e) => setUla(e.currentTarget.value)}
          placeholder="fd00::/48"
          ff="monospace"
        />
      )}
      <Group justify="flex-end" mt="sm">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} loading={saving}>
          Next
        </Button>
      </Group>
    </Stack>
  );
}
