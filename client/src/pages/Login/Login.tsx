import {
  Center,
  Paper,
  Stack,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Alert,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconAlertCircle, IconServer } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth.ts";
import classes from "./Login.module.css";

export default function Login() {
  const { login, isLoading, error } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password);

    if (success) navigate("/dashboard");
  };

  return (
    <Center className={classes.root}>
      <Paper className={classes.card} withBorder radius="lg" p="xl" shadow="md">
        <Stack gap="lg">
          <Stack gap="xs" align="center">
            <IconServer
              size={40}
              stroke={1.5}
              color="var(--mantine-color-blue-6)"
            />
            <Title order={2} ta="center">
              Cloud Gateway
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Sign in to manage your network
            </Text>
          </Stack>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
                autoComplete="username"
              />
              <PasswordInput
                label="Password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                autoComplete="current-password"
              />
              <Button type="submit" loading={isLoading} fullWidth mt="sm">
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}
