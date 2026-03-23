# Cloud Gateway

A full-stack network gateway management UI built with **React + Vite** (client) and **Node.js + Express** (server), both in TypeScript.

---

## Stack

| Layer | Technology |
|---|---|
| client | React 18, Vite, TypeScript |
| UI Library | Mantine v7, Tabler Icons |
| server | Node.js, Express, TypeScript |
| Auth | JWT (access + refresh tokens) |
| Real-time | Server-Sent Events (SSE) |

---

## Project Structure

```
cloud-gateway/
├── .env                     # Environment variables (see below)
├── package.json             # Root scripts
├── server/
│   └── src/
│       ├── index.ts         # Express server entry point
│       ├── routes/          # auth, system, network, dhcp, port-forwarding, wireguard, setup
│       ├── middleware/       # auth (JWT), errorHandler
│       ├── services/        # Business logic per domain
│       ├── mocks/           # In-memory data (replaceable with real implementations)
│       └── types/           # TypeScript types by domain
└── client/
    └── src/
        ├── main.tsx
        ├── App.tsx          # Router, auth guards, theme provider
        ├── api/             # API client + per-domain API modules
        ├── hooks/           # useAuth, useMetrics (SSE), useAsync, useTheme
        ├── components/      # Shared: Layout, Sidebar, ThemeToggle, MetricCard, etc.
        ├── pages/           # Login, SetupWizard, Dashboard, Network, DHCP, PortForwarding, WireGuard
        └── types/           # TypeScript types by domain
```

---

## Environment Variables

All variables live in the root `.env` file. The server reads them via `--env-file` (no `dotenv` dependency required).

### Auth

| Variable | Default | Description |
|---|---|---|
| `ADMIN_USERNAME` | `admin` | Login username |
| `ADMIN_PASSWORD_HASH` | SHA-256 of `"admin"` | SHA-256 hex hash of the password. Generate: `echo -n "mypassword" \| sha256sum` |
| `JWT_SECRET` | `change-me-...` | Secret for signing access tokens (min 32 chars recommended) |
| `REFRESH_SECRET` | `change-me-...` | Secret for signing refresh tokens |

### Server

| Variable | Default | Description |
|---|---|---|
| `HTTP_PORT` | `3001` | HTTP server port |
| `HTTPS_PORT` | `3443` | HTTPS server port |
| `USE_HTTPS` | `false` | Enable HTTPS + force HTTP→HTTPS redirect |
| `SSL_KEY_PATH` | `./ssl/key.pem` | Path to TLS private key |
| `SSL_CERT_PATH` | `./ssl/cert.pem` | Path to TLS certificate |

### CORS

| Variable | Default | Description |
|---|---|---|
| `CORS_MODE` | `allow-all` | `allow-all` = wildcard `*`; `auto` = allow host interfaces only |

### Network

| Variable | Default | Description |
|---|---|---|
| `DHCP_SERVER_INTERFACE` | `eth0` | Interface used as the DHCP server LAN — excluded from UI editing |
| `BLOCKED_INTERFACES` | `lo` | Comma-separated interfaces blocked from port-forwarding source |
| `HAS_WIFI` | `false` | Set `true` if a Wi-Fi adapter is present — shows Wi-Fi step in setup wizard and Wi-Fi tab in Network page |

### Setup & Static

| Variable | Default | Description |
|---|---|---|
| `SETUP_DONE` | `false` | Set `true` after setup wizard completes — skips wizard on next boot |
| `STATIC_PATH` | `../client/dist` | Path to Vite build output (used in production) |
| `HOSTNAME` | `cloud-gateway` | Displayed hostname |

---

## Getting Started

### 1. Install dependencies

```bash
# From project root
npm run install:all
# or manually:
cd server && npm install
cd ../client && npm install
```

### 2. Configure `.env`

Edit `.env` in the project root. At minimum, change:
- `ADMIN_PASSWORD_HASH` — generate with `echo -n "yourpassword" | sha256sum`
- `JWT_SECRET` and `REFRESH_SECRET` — use long random strings

### 3. Development mode

```bash
# Start both server and client dev servers
npm run dev

# Or individually:
npm run dev:server   # Express on http://localhost:3001
npm run dev:client  # Vite on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:3001`.

### 4. Production build

```bash
npm run build    # Builds client static files + compiles server TypeScript
npm start        # Starts Express, serves client from server/dist
```

---

## API Reference

All API routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <accessToken>`.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/login` | No | Login with `{ username, passwordHash }` → `{ accessToken, refreshToken }` |
| POST | `/refresh` | No | Exchange refresh token → new token pair |
| POST | `/logout` | Yes | Revoke refresh token |
| GET | `/me` | Yes | Get current user info |

### System — `/api/system`

| Method | Path | Description |
|---|---|---|
| GET | `/info` | Get system info (hostname, version, setup status, wifi) |
| GET | `/metrics` | Latest system metrics snapshot |
| GET | `/metrics/history?count=N` | Rolling window of N metrics snapshots |
| GET | `/metrics/stream` | SSE stream — pushes metrics every second |

### Network — `/api/network`

| Method | Path | Description |
|---|---|---|
| GET | `/interfaces` | List all network interfaces |
| GET | `/interfaces/:name` | Get single interface |
| PUT | `/interfaces/:name` | Update interface IP config |
| GET | `/wifi` | List Wi-Fi networks (requires `HAS_WIFI=true`) |
| POST | `/wifi/connect` | Connect to Wi-Fi `{ ssid, password? }` |
| POST | `/wifi/disconnect` | Disconnect Wi-Fi |

### DHCP — `/api/dhcp`

| Method | Path | Description |
|---|---|---|
| GET | `/config` | Get DHCPv4 config |
| PUT | `/config` | Update DHCPv4 config |
| GET | `/leases` | Get active leases |
| POST | `/reservations` | Create static reservation |
| DELETE | `/reservations/:id` | Delete reservation |
| GET | `/v6/config` | Get DHCPv6 config |
| PUT | `/v6/config` | Update DHCPv6 config |

### Port Forwarding — `/api/port-forwarding`

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all rules |
| POST | `/` | Create rule |
| PUT | `/:id` | Update rule |
| DELETE | `/:id` | Delete rule |

### WireGuard — `/api/wireguard`

| Method | Path | Description |
|---|---|---|
| GET | `/` | List all profiles |
| GET | `/:id` | Get profile |
| GET | `/:id/status` | Get connection status |
| POST | `/` | Create profile `{ name, config }` |
| PUT | `/:id` | Update profile |
| DELETE | `/:id` | Delete profile (primary is protected) |
| POST | `/:id/toggle` | Connect / disconnect |

### Setup Wizard — `/api/setup`

| Method | Path | Description |
|---|---|---|
| GET | `/status` | Get setup completion status |
| POST | `/wifi` | Connect to Wi-Fi during setup |
| POST | `/ethernet` | Select DHCP server interface |
| POST | `/ipv4` | Configure DHCP range |
| POST | `/hotspot` | Configure hotspot (if Wi-Fi present) |
| POST | `/ipv6` | Configure DHCPv6 |
| POST | `/wireguard` | Save WireGuard config |
| POST | `/complete` | Mark setup as done |

---

## HTTPS with Self-Signed Certificate

```bash
mkdir ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem \
  -days 365 -nodes -subj '/CN=cloud-gateway'
```

Then set in `.env`:
```
USE_HTTPS=true
SSL_KEY_PATH=./ssl/key.pem
SSL_CERT_PATH=./ssl/cert.pem
```

---

## Replacing Mocks with Real Implementations

The `server/src/mocks/` directory contains in-memory data stores. To use real system data:

1. Replace `mocks/system.ts` with calls to `/proc/stat`, `/proc/meminfo`, `/proc/net/dev`
2. Replace `mocks/network.ts` with `nmcli` command execution via `child_process`
3. Replace `mocks/dhcp.ts` with reads/writes to your DHCP server config (e.g. `dnsmasq.conf`)
4. Replace `mocks/wireguard.ts` with `wg show` / `wg-quick` command execution

Services in `server/src/services/` are the integration boundary — mock the data there or swap the import.

---

## Features

- **Auth** — SHA-256 password hashing on the client, JWT access + refresh tokens, auto-retry on 401
- **Setup Wizard** — Linear stepper (Wi-Fi optional), Ethernet selection, IPv4/Hotspot config, DHCPv6 + NPTv6, WireGuard import
- **Dashboard** — Live CPU/RAM/temperature metrics via SSE, sparkline history charts, per-interface RX/TX speed
- **Network** — Interface management (Static/DHCP/Disabled), Wi-Fi scan + connect
- **DHCP** — Lease table, static reservations, DHCPv6 with NPTv6 toggle
- **Port Forwarding** — CRUD rules with enable/disable toggle, blocked interface enforcement
- **WireGuard** — Profile management, connect/disconnect, primary profile protection, config editor + file upload
- **Theme** — Light / Dark / Auto (system) with 3-way segmented toggle
- **Responsive** — Mobile drawer, desktop sidebar, `dvh` height units
- **Notifications** — Mantine toast notifications, bottom-right corner
