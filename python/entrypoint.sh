#!/bin/sh
# entrypoint.sh — shape network then launch Flask

# ---- network shaping ----
# limit egress bandwidth to 150Mbps, 32KB burst, 100ms latency
if command -v tc >/dev/null 2>&1; then
    tc qdisc add dev eth0 root tbf rate 150mbit burst 32kb latency 100ms || true
fi

# ---- now exec the real server ----
exec "$@"
