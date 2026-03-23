import { NavLink, Stack, Text, Divider, Box } from "@mantine/core";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconNetwork,
  IconServer,
  IconArrowsLeftRight,
  IconShieldLock,
  IconLogout,
} from "@tabler/icons-react";
import classes from "./Sidebar.module.css";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <IconLayoutDashboard size={18} />,
  },
  { path: "/network", label: "Network", icon: <IconNetwork size={18} /> },
  { path: "/dhcp", label: "DHCP", icon: <IconServer size={18} /> },
  {
    path: "/port-forwarding",
    label: "Port Forwarding",
    icon: <IconArrowsLeftRight size={18} />,
  },
  {
    path: "/wireguard",
    label: "WireGuard",
    icon: <IconShieldLock size={18} />,
  },
];

type SidebarProps = {
  onLogout: () => void;
};

export function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();

  return (
    <nav className={classes.sidebar}>
      <Box className={classes.logo}>
        <Text fw={800} size="lg" style={{ letterSpacing: "-0.02em" }}>
          Cloud{" "}
          <Text component="span" c="blue" inherit>
            Gateway
          </Text>
        </Text>
      </Box>

      <Divider />

      <Stack gap={2} p="sm" style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            component={RouterNavLink}
            to={item.path}
            label={item.label}
            leftSection={item.icon}
            active={location.pathname.startsWith(item.path)}
            className={classes.navItem}
          />
        ))}
      </Stack>

      <Divider />

      <Box p="sm">
        <NavLink
          label="Logout"
          leftSection={<IconLogout size={18} />}
          onClick={onLogout}
          className={classes.navItem}
          color="red"
        />
      </Box>
    </nav>
  );
}
