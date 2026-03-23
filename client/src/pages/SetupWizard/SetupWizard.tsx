import { useState } from "react";
import { Stack, Title, Text, Paper, Stepper, Center } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { IconCheck } from "@tabler/icons-react";
import { setupApi, systemApi } from "../../api/index.ts";
import { EthernetStep } from "./steps/EthernetStep.tsx";
import { Ipv4Step } from "./steps/Ipv4Step.tsx";
import { Ipv6Step } from "./steps/Ipv6Step.tsx";
import { WireguardStep } from "./steps/WireguardStep.tsx";
import classes from "./SetupWizard.module.css";

type SetupWizardProps = {};

const steps = [
  {
    label: "Ethernet",
    description: "Connect to an ethernet network",
    Component: EthernetStep,
  },
  {
    label: "DHCPv4",
    description: "Configure IPv4 settings",
    Component: Ipv4Step,
  },
  {
    label: "DHCPv6",
    description: "Configure IPv6 settings",
    Component: Ipv6Step,
  },
  {
    label: "WireGuard",
    description: "Configure WireGuard VPN",
    Component: WireguardStep,
  },
];

export default function SetupWizard({}: SetupWizardProps) {
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const [completing, setCompleting] = useState(false);

  const next = () => setActive((a) => Math.min(a + 1, steps.length));
  const prev = () => setActive((a) => Math.max(a - 1, 0));

  const handleComplete = async () => {
    setCompleting(true);

    try {
      await setupApi.complete();

      notifications.show({
        message: "Setup complete! Redirecting…",
        color: "green",
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e: any) {
      notifications.show({ message: e.message, color: "red" });

      setCompleting(false);
    }
  };

  return (
    <Center className={classes.root}>
      <Paper withBorder radius="lg" p="xl" className={classes.card}>
        <Stack gap="xl">
          <div>
            <Title order={3}>Initial Setup</Title>
            <Text size="sm" c="dimmed">
              Configure your Cloud Gateway
            </Text>
          </div>

          <Stepper
            active={active}
            onStepClick={setActive}
            size="sm"
            allowNextStepsSelect={false}
          >
            {steps.map((s) => (
              <Stepper.Step
                key={s.label}
                label={s.label}
                description={s.description}
              >
                <Paper withBorder radius="md" p="md" mt="md">
                  <s.Component
                    onNext={next}
                    onBack={prev}
                    onComplete={handleComplete}
                    completing={completing}
                  />
                </Paper>
              </Stepper.Step>
            ))}
            <Stepper.Completed>
              <Stack align="center" py="xl" gap="sm">
                <IconCheck size={48} color="var(--mantine-color-green-5)" />
                <Title order={4}>All done!</Title>
                <Text c="dimmed" size="sm">
                  Your gateway is being configured…
                </Text>
              </Stack>
            </Stepper.Completed>
          </Stepper>
        </Stack>
      </Paper>
    </Center>
  );
}
