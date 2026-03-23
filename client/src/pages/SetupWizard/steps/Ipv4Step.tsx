import { Stack, Text, TextInput, Button, Group, Switch } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { setupApi } from "../../../api/index.ts";

type Ipv4StepProps = {
  onNext: () => void;
  onBack: () => void;
};

export function Ipv4Step({ onNext, onBack }: Ipv4StepProps) {
  const [dhcp, setDhcp] = useState("192.168.1.0/24");
  const [dns1, setDns1] = useState("1.1.1.1");
  const [dns2, setDns2] = useState("8.8.8.8");

  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    setSaving(true);

    try {
      await setupApi.setIpv4({
        dhcp,
        dns: [dns1, dns2],
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
      <>
        <Text size="sm">Configure IPv4 DHCP range and DNS:</Text>
        <TextInput
          label="DHCP Subnet"
          value={dhcp}
          required
          onChange={(e) => setDhcp(e.currentTarget.value)}
        />
        <TextInput
          label="DNS 1"
          value={dns1}
          required
          onChange={(e) => setDns1(e.currentTarget.value)}
        />
        <TextInput
          label="DNS 2 (optional)"
          value={dns2}
          onChange={(e) => setDns2(e.currentTarget.value)}
        />
      </>
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
