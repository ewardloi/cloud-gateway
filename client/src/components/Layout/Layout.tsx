import { Box, Group, Text, ActionIcon, Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar.tsx";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle.tsx";
import type { ThemeMode } from "../../hooks/useTheme.ts";
import classes from "./Layout.module.css";

type LayoutProps = {
  onLogout: () => void;
  themeMode: ThemeMode;
  onThemeChange: (m: ThemeMode) => void;
};

export function Layout({ onLogout, themeMode, onThemeChange }: LayoutProps) {
  const [drawerOpen, { open, close }] = useDisclosure();

  return (
    <Box className={classes.root}>
      {/* Desktop sidebar */}
      <Box className={classes.desktopSidebar}>
        <Sidebar onLogout={onLogout} />
      </Box>

      {/* Mobile drawer */}
      <Drawer
        opened={drawerOpen}
        onClose={close}
        size={220}
        withCloseButton={false}
        padding={0}
      >
        <Sidebar
          onLogout={() => {
            onLogout();
            close();
          }}
        />
      </Drawer>

      {/* Main content */}
      <Box className={classes.main}>
        <Box className={classes.header}>
          <Burger
            opened={drawerOpen}
            onClick={open}
            size="sm"
            className={classes.burger}
            aria-label="Toggle navigation"
          />
          <Text size="sm" c="dimmed" className={classes.breadcrumb} />
          <ThemeToggle mode={themeMode} onChange={onThemeChange} />
        </Box>

        <Box className={classes.content}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
