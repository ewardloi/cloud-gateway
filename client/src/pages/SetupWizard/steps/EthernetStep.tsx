import { Stack, Text, Select, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useAsync } from "../../../hooks/useAsync.ts";
import { networkApi, setupApi } from "../../../api/index.ts";

type EthernetStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function EthernetStep({ onNext, onBack }: EthernetStepProps) {
  const { data: interfaces } = useAsync(() => networkApi.getInterfaces());

  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const opts =
    interfaces
      ?.filter((i) => i.type === "ethernet")
      .map((i) => ({ value: i.name, label: `${i.name} (${i.mac})` })) ?? [];

  const handleNext = async () => {
    if (!selected) return;

    setSaving(true);

    try {
      await setupApi.setEthernet(selected);

      onNext();
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="sm">
      <Text size="sm">
        Select the Ethernet interface to use as the DHCP server:
      </Text>
      <Select
        label="Interface"
        data={opts}
        value={selected}
        onChange={setSelected}
        placeholder="Select interface"
      />
      <Group justify="flex-end" mt="sm">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} loading={saving} disabled={!selected}>
          Next
        </Button>
      </Group>
    </Stack>
  );
}
