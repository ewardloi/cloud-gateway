#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root (using sudo)"
  exit 1
fi

echo "Updating package lists"
apt update

echo "Installing packages: network-manager, nftables, kea-dhcp4-server, kea-dhcp6-server, wireguard, apparmor-utils"
apt install -y network-manager nftables kea-dhcp4-server kea-dhcp6-server wireguard apparmor-utils resolvconf

cat <<EOF > /etc/resolvconf/resolv.conf.d/head
nameserver 1.1.1.1
nameserver 1.0.0.1
EOF

resolvconf -u

echo "Configuring autostart (enabling everything except wireguard)"
systemctl enable NetworkManager
systemctl enable nftables
systemctl enable kea-dhcp4-server
systemctl enable kea-dhcp6-server

echo "Disabling AppArmor for kea-dhcp6-server"
if [ -f /etc/apparmor.d/usr.sbin.kea-dhcp6 ]; then
    ln -sf /etc/apparmor.d/usr.sbin.kea-dhcp6 /etc/apparmor.d/disable/
    apparmor_parser -R /etc/apparmor.d/usr.sbin.kea-dhcp6
    echo "AppArmor for kea-dhcp6 has been disabled"
else
    echo "AppArmor profile for kea-dhcp6 not found, skipping"
fi

echo "Modifying systemd service for kea-dhcp6-server"

mkdir -p /etc/systemd/system/kea-dhcp6-server.service.d/

cat <<EOF > /etc/systemd/system/kea-dhcp6-server.service.d/override.conf
[Service]
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_NET_RAW
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_NET_RAW
EOF

systemctl daemon-reload

echo "Creating the script /etc/kea/kea-dhcp6-pd-route.sh"
mkdir -p /etc/kea
cat << 'EOF' > /etc/kea/kea-dhcp6-pd-route.sh
#!/bin/bash

if [ "$LEASES6_AT0_TYPE" != "IA_PD" ]; then
    exit 0
fi

PREFIX_NET="${LEASES6_AT0_ADDRESS}/${LEASES6_AT0_PREFIX_LEN}"
GATEWAY="${QUERY6_REMOTE_ADDR}"
INTERFACE="${QUERY6_IFACE_NAME}"

case "$QUERY6_TYPE" in
    "REQUEST" | "RENEW" | "REBIND")
        /sbin/ip -6 route replace "$PREFIX_NET" via "$GATEWAY" dev "$INTERFACE"
        ;;
    "RELEASE" | "DECLINE")
        /sbin/ip -6 route del "$PREFIX_NET" via "$GATEWAY" dev "$INTERFACE"
        ;;
esac
EOF

chmod +x /etc/kea/kea-dhcp6-pd-route.sh
echo "Script created and made executable"

echo "Configuring sysctl parameters"
cat <<EOF > /etc/sysctl.d/99-router.conf
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
net.ipv4.conf.default.rp_filter = 0
net.ipv4.conf.*.rp_filter = 0
-net.ipv4.conf.all.rp_filter
EOF

sysctl --system

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

apt install -y nodejs

npm run install:all
npm run build

mkdir -p /etc/cloud-gateway
cp -r client /etc/cloud-gateway/
cp -r server /etc/cloud-gateway/
cp .env /etc/cloud-gateway/
cp package.json /etc/cloud-gateway/

cat <<EOF >/etc/systemd/system/cloud-gateway.service
[Unit]
Description=Cloud Gateway Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/etc/cloud-gateway
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable cloud-gateway.service
systemctl start cloud-gateway.service
