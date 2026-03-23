import {
  Stack,
  Title,
  Text,
  Tabs,
  Group,
  Button,
  Paper,
  Table,
  Badge,
  TextInput,
  Modal,
  Alert,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react";
import { useAsync } from "../../hooks/useAsync.ts";
import { dhcpApi } from "../../api/index.ts";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal.tsx";
import { Dhcpv4Panel } from "./components/Dhcpv4Panel.tsx";
import { Dhcpv6Panel } from "./components/Dhcpv6Panel.tsx";
import { ReservationForm } from "./components/ReservationForm.tsx";

function formatExpiry(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

export default function DHCP() {
  const { data: config, reload: reloadConfig } = useAsync(() =>
    dhcpApi.getConfig(),
  );
  const {
    data: leases,
    isLoading,
    reload: reloadLeases,
  } = useAsync(() => dhcpApi.getLeases());
  const [addOpen, { open: openAdd, close: closeAdd }] = useDisclosure();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const reload = () => {
    reloadConfig();
    reloadLeases();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dhcpApi.deleteReservation(deleteId);
      notifications.show({ message: "Reservation deleted", color: "green" });
      reload();
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <Stack gap="lg" className="fade-in">
      <Group justify="space-between">
        <div>
          <Title order={3}>DHCP</Title>
          <Text size="sm" c="dimmed">
            Leases, reservations and IPv6
          </Text>
        </div>
        <Button
          leftSection={<IconRefresh size={15} />}
          variant="default"
          size="sm"
          onClick={reload}
        >
          Refresh
        </Button>
      </Group>

      <Tabs defaultValue="leases">
        <Tabs.List>
          <Tabs.Tab value="leases">Leases</Tabs.Tab>
          <Tabs.Tab value="reservations">Reservations</Tabs.Tab>
          <Tabs.Tab value="ipv4">DHCPv4 Config</Tabs.Tab>
          <Tabs.Tab value="ipv6">DHCPv6 Config</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="leases" pt="md">
          <Paper withBorder radius="md">
            <Table.ScrollContainer minWidth={600}>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>IP</Table.Th>
                    <Table.Th>MAC</Table.Th>
                    <Table.Th>Hostname</Table.Th>
                    <Table.Th>Expires</Table.Th>
                    <Table.Th>Type</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {leases?.map((lease) => (
                    <Table.Tr key={lease.mac}>
                      <Table.Td>
                        <Text size="sm" ff="monospace">
                          {lease.ip}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" ff="monospace">
                          {lease.mac}
                        </Text>
                      </Table.Td>
                      <Table.Td>{lease.hostname ?? "—"}</Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatExpiry(lease.expiresAt)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          size="xs"
                          color={lease.isReservation ? "blue" : "gray"}
                          variant="light"
                        >
                          {lease.isReservation ? "Reserved" : "Dynamic"}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="reservations" pt="md">
          <Stack gap="md">
            <Group justify="flex-end">
              <Button
                leftSection={<IconPlus size={15} />}
                size="sm"
                onClick={openAdd}
              >
                Add Reservation
              </Button>
            </Group>
            <Paper withBorder radius="md">
              <Table.ScrollContainer minWidth={500}>
                <Table highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>MAC</Table.Th>
                      <Table.Th>IP</Table.Th>
                      <Table.Th>Hostname</Table.Th>
                      <Table.Th>Comment</Table.Th>
                      <Table.Th />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {config?.reservations.map((r) => (
                      <Table.Tr key={r.id}>
                        <Table.Td>
                          <Text size="sm" ff="monospace">
                            {r.mac}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" ff="monospace">
                            {r.ip}
                          </Text>
                        </Table.Td>
                        <Table.Td>{r.hostname ?? "—"}</Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {r.comment ?? "—"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Button
                            size="xs"
                            color="red"
                            variant="subtle"
                            leftSection={<IconTrash size={13} />}
                            onClick={() => setDeleteId(r.id)}
                          >
                            Delete
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="ipv4" pt="md">
          <Dhcpv4Panel />
        </Tabs.Panel>

        <Tabs.Panel value="ipv6" pt="md">
          <Dhcpv6Panel />
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={addOpen}
        onClose={closeAdd}
        title="Add DHCP Reservation"
        centered
      >
        <ReservationForm
          onSaved={() => {
            reload();
            closeAdd();
          }}
        />
      </Modal>

      <ConfirmModal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Reservation"
        message="This will remove the static IP reservation. The device may get a different IP on next lease."
        loading={deleting}
      />
    </Stack>
  );
}
