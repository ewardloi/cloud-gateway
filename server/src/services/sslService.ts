import fs from "fs";
import path from "path";

export type SslCredentials = {
  key: Buffer;
  cert: Buffer;
};

export async function ensureSslCerts(
  keyPath: string,
  certPath: string,
  hostname: string = "localhost",
): Promise<SslCredentials> {
  const keyExists = fs.existsSync(keyPath);
  const certExists = fs.existsSync(certPath);

  if (keyExists && certExists) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }

  const selfsigned = await import("selfsigned");
  const generate = selfsigned.default?.generate ?? (selfsigned as any).generate;

  const attrs = [
    { name: "commonName", value: hostname },
    { name: "organizationName", value: "Cloud Gateway" },
    { name: "organizationalUnitName", value: "Auto-generated" },
  ];

  const opts = {
    keySize: 2048,
    days: 3650,
    algorithm: "sha256",
    extensions: [
      {
        name: "subjectAltName",
        altNames: [
          { type: 2, value: hostname },
          { type: 2, value: "localhost" },
          { type: 7, ip: "127.0.0.1" },
        ],
      },
    ],
  };

  const pems = generate(attrs, opts);

  const dir = path.dirname(keyPath);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(keyPath, pems.private, { mode: 0o600 });
  fs.writeFileSync(certPath, pems.cert, { mode: 0o644 });

  return {
    key: Buffer.from(pems.private),
    cert: Buffer.from(pems.cert),
  };
}
