import {
  Stack,
  TextInput,
  Switch,
  Button,
  Group,
  Paper,
  Text,
  Loader,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useAsync } from "../../../hooks/useAsync.ts";
import { dhcpApi } from "../../../api/index.ts";

export function Dhcpv6Panel() {
  const { data, isLoading, error, reload } = useAsync(() =>
    dhcpApi.getV6Config(),
  );
  const [gua, setGua] = useState("");
  const [ula, setUla] = useState("");
  const [useNptv6, setUseNptv6] = useState(false);
  const [nptInternal, setNptInternal] = useState("");
  const [nptExternal, setNptExternal] = useState("");
  const [dns, setDns] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setGua(data.guaPrefix ?? "");
      setUla(data.ulaPrefix ?? "");
      setUseNptv6(data.useNptv6);
      setNptInternal(data.nptv6InternalPrefix ?? "");
      setNptExternal(data.nptv6ExternalPrefix ?? "");
      setDns(data.dns.join(", "));
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await dhcpApi.updateV6Config({
        guaPrefix: gua || undefined,
        ulaPrefix: ula || undefined,
        useNptv6,
        nptv6InternalPrefix: useNptv6 ? nptInternal : undefined,
        nptv6ExternalPrefix: useNptv6 ? nptExternal : undefined,
        dns: dns
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      notifications.show({ message: "DHCPv6 config saved", color: "green" });
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
        <Text size="sm" fw={600}>
          DHCPv6 Configuration
        </Text>
        <TextInput
          label="GUA Prefix"
          value={gua}
          onChange={(e) => setGua(e.currentTarget.value)}
          placeholder="2001:db8::/48"
          ff="monospace"
        />
        <Switch
          label="Enable NPTv6"
          checked={useNptv6}
          onChange={(e) => setUseNptv6(e.currentTarget.checked)}
        />
        {useNptv6 && (
          <TextInput
            label="ULA Prefix"
            required
            value={ula}
            onChange={(e) => setUla(e.currentTarget.value)}
            placeholder="fd00::/48"
            ff="monospace"
          />
        )}
        <Group justify="flex-end" mt="sm">
          <Button onClick={handleSave} loading={saving}>
            Save DHCPv6
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
