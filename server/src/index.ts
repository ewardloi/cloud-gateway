import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { ensureSslCerts } from "./services/sslService.js";
import authRouter from "./routes/auth.js";
import systemRouter from "./routes/system.js";
import networkRouter from "./routes/network.js";
import dhcpRouter from "./routes/dhcp.js";
import portForwardingRouter from "./routes/portForwarding.js";
import wireguardRouter from "./routes/wireguard.js";
import setupRouter from "./routes/setup.js";
import { cors } from "./middleware/cors.js";
import { httpsRedirect } from "./middleware/https.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HTTP_PORT = parseInt(process.env.HTTP_PORT ?? "3001");
const HTTPS_PORT = parseInt(process.env.HTTPS_PORT ?? "3443");
const STATIC_PATH = process.env.STATIC_PATH ?? "../client/dist";
const SSL_KEY_PATH = process.env.SSL_KEY_PATH ?? "./ssl/key.pem";
const SSL_CERT_PATH = process.env.SSL_CERT_PATH ?? "./ssl/cert.pem";
const HOSTNAME = process.env.HOSTNAME ?? "localhost";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(httpsRedirect(HTTPS_PORT));

app.use("/api/auth", authRouter);
app.use("/api/system", systemRouter);
app.use("/api/network", networkRouter);
app.use("/api/dhcp", dhcpRouter);
app.use("/api/port-forwarding", portForwardingRouter);
app.use("/api/wireguard", wireguardRouter);
app.use("/api/setup", setupRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const staticPath = path.resolve(__dirname, "..", STATIC_PATH);
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.get("/*path", (_req, res) =>
    res.sendFile(path.join(staticPath, "index.html")),
  );
}

app.use(notFound);
app.use(errorHandler);

const credentials = await ensureSslCerts(
  SSL_KEY_PATH,
  SSL_CERT_PATH,
  HOSTNAME,
);

https.createServer(credentials, app).listen(HTTPS_PORT);
http.createServer(app).listen(HTTP_PORT);