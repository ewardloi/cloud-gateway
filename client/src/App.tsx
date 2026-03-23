import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";

import { useTheme, type ThemeMode } from "./hooks/useTheme.ts";
import { systemApi } from "./api/index.ts";
import { getAccessToken } from "./api/client.ts";
import { Layout } from "./components/Layout/Layout.tsx";
import { PageLoader } from "./components/Layout/PageLoader.tsx";
import { useAsync } from "./hooks/useAsync.ts";

const Login = lazy(() => import("./pages/Login/Login.tsx"));
const SetupWizard = lazy(() => import("./pages/SetupWizard/SetupWizard.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard.tsx"));
const Network = lazy(() => import("./pages/Network/Network.tsx"));
const DHCP = lazy(() => import("./pages/DHCP/DHCP.tsx"));
const PortFwd = lazy(() => import("./pages/PortForwarding/PortForwarding.tsx"));
const WireGuard = lazy(() => import("./pages/WireGuard/WireGuard.tsx"));

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!getAccessToken()) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function RequireSetup({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const { data, isLoading } = useAsync(() => systemApi.getSetupStatus());

  if (isLoading) return <PageLoader />;

  if (!data?.isSetupDone) return <Navigate to="/setup" replace />;

  if (data?.isSetupDone && location.pathname.startsWith("/setup"))
    return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

type AppRoutesProps = {
  themeMode: ThemeMode;
  onThemeChange: (m: ThemeMode) => void;
};

function AppRoutes({ themeMode, onThemeChange }: AppRoutesProps) {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        }
      />

      <Route
        path="/setup"
        element={
          <RequireAuth>
            <RequireSetup>
              <Suspense fallback={<PageLoader />}>
                <SetupWizard />
              </Suspense>
            </RequireSetup>
          </RequireAuth>
        }
      />

      <Route
        element={
          <RequireAuth>
            <RequireSetup>
              <Layout
                onLogout={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  window.location.href = "/login";
                }}
                themeMode={themeMode}
                onThemeChange={onThemeChange}
              />
            </RequireSetup>
          </RequireAuth>
        }
      >
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/network"
          element={
            <Suspense fallback={<PageLoader />}>
              <Network />
            </Suspense>
          }
        />
        <Route
          path="/dhcp"
          element={
            <Suspense fallback={<PageLoader />}>
              <DHCP />
            </Suspense>
          }
        />
        <Route
          path="/port-forwarding"
          element={
            <Suspense fallback={<PageLoader />}>
              <PortFwd />
            </Suspense>
          }
        />
        <Route
          path="/wireguard"
          element={
            <Suspense fallback={<PageLoader />}>
              <WireGuard />
            </Suspense>
          }
        />
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const { colorScheme, mode, setMode } = useTheme();

  return (
    <MantineProvider
      forceColorScheme={colorScheme}
      theme={{
        primaryColor: "blue",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        fontFamilyMonospace:
          "JetBrains Mono, Fira Code, Cascadia Code, monospace",
        components: {
          Paper: { defaultProps: { radius: "md" } },
          Button: { defaultProps: { radius: "md" } },
          TextInput: { defaultProps: { radius: "md" } },
          Select: { defaultProps: { radius: "md" } },
          Modal: { defaultProps: { radius: "lg", centered: true } },
        },
      }}
    >
      <Notifications position="bottom-right" zIndex={9999} />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes themeMode={mode} onThemeChange={setMode} />
        </Suspense>
      </BrowserRouter>
    </MantineProvider>
  );
}
