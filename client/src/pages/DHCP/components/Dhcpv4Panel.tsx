import {
  Stack,
  TextInput,
  Button,
  Group,
  Paper,
  Text,
  Loader,
  Alert,
  SimpleGrid,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useAsync } from "../../../hooks/useAsync.ts";
import { dhcpApi } from "../../../api/index.ts";

export function Dhcpv4Panel() {
  const { data, isLoading, error, reload } = useAsync(() =>
    dhcpApi.getConfig(),
  );
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [gateway, setGateway] = useState("");
  const [dns, setDns] = useState("");
  const [leaseTime, setLeaseTime] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setRangeStart(data.rangeStart);
      setRangeEnd(data.rangeEnd);
      setGateway(data.gateway);
      setDns(data.dns.join(", "));
      setLeaseTime(String(data.leaseTime));
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await dhcpApi.updateConfig({
        rangeStart,
        rangeEnd,
        gateway,
        dns: dns
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        leaseTime: Number(leaseTime) || 86400,
      });
      notifications.show({ message: "DHCPv4 config saved", color: "green" });
      reload();
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loader size="sm" />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={600}>
            DHCPv4 Configuration
          </Text>
          {data && (
            <Text size="xs" c="dimmed">
              Interface:{" "}
              <Text component="span" size="xs" fw={500} ff="monospace">
                {data.interface}
              </Text>
            </Text>
          )}
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
          <TextInput
            label="DHCP Subnet"
            value={rangeStart}
            required
            onChange={(e) => setRangeStart(e.currentTarget.value)}
            placeholder="192.168.1.0/24"
            ff="monospace"
          />

          <TextInput
            label="DNS 1"
            value={dns}
            required
            onChange={(e) => setDns(e.currentTarget.value)}
            placeholder="1.1.1.1"
            ff="monospace"
          />

          <TextInput
            label="DNS 2 (optional)"
            value={dns}
            onChange={(e) => setDns(e.currentTarget.value)}
            placeholder="1.1.1.1"
            ff="monospace"
          />
        </SimpleGrid>

        <TextInput
          label="Lease Time (seconds)"
          value={leaseTime}
          onChange={(e) => setLeaseTime(e.currentTarget.value)}
          placeholder="86400"
          w={200}
        />

        <Group justify="flex-end" mt="sm">
          <Button onClick={handleSave} loading={saving}>
            Save DHCPv4
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
