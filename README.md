# 📊 grafana-prometheus-loki

A full-stack observability setup using **Node.js (Express)**, **Prometheus**, **Loki**, and **Grafana** — all running in **separate Docker containers**, connected via port mapping and Docker networking.

---

## 🧱 Project Structure

.
├── docker-compose.yml
├── index.js # Express app with Prometheus + Loki integration
├── util.js # Simulates heavy tasks
├── prometheus-config.yml # Prometheus scrape config
├── package.json
├── package-lock.json
└── README.md

---

## 🚀 What This Project Does

✅ Builds a containerized Express.js app  
✅ Tracks API metrics using Prometheus  
✅ Sends structured logs to Loki via Winston  
✅ Visualizes everything in Grafana dashboards  

---

## 🛠 Components & Architecture

| Component   | Purpose                          | Port      | Container |
|-------------|----------------------------------|-----------|-----------|
| Express App | Main Node.js server              | `8000`    | `gpl`     |
| Prometheus  | Metrics scraping & monitoring    | `9090`    | `prometheus` |
| Loki        | Centralized log aggregation      | `3100`    | `loki`    |
| Grafana     | Dashboard UI for logs + metrics  | `3000`    | `grafana` |

Each service runs in **its own container**, and they communicate via **Docker’s internal network**. Through **port mapping**, services are exposed on `localhost`.

---

## 🔧 How It Works

### 🟩 Express App (`index.js`)
- Exposes:
  - `/` → basic response
  - `/slow` → simulates heavy task + logs
  - `/metrics` → exposes Prometheus metrics
- Uses:
  - `prom-client` to expose metrics
  - `winston-loki` to send logs to Loki

### 📉 Prometheus
- Scrapes metrics from `http://gpl:8000/metrics` (inside container)
- Configuration defined in `prometheus-config.yml`

### 📜 Loki
- Accepts logs from the Node.js app via Winston
- Runs on port `3100`

### 📊 Grafana
- Configured to visualize:
  - Logs from Loki
  - Metrics from Prometheus
- Runs on `http://localhost:3000` (login: `admin / admin`)

---

## ⚙️ How to Run the Stack

```bash
docker-compose up -d
Then open in browser:

App: http://localhost:8000/

Prometheus: http://localhost:9090

Grafana: http://localhost:3000

Default login: admin / admin

🧪 Explore Logs and Metrics in Grafana
📈 Metrics
Go to Grafana → Explore

Select Prometheus as data source

Try query:


http_express_req_res_time
🪵 Logs
Go to Explore

Select Loki

Run:


{app="gpl-app"}
📦 Tech Stack
Node.js (Express)

Docker

Prometheus

Loki

Grafana

Winston Logger

prom-client

💡 Highlights
🔌 Logs and metrics are fully decoupled

📦 All services containerized

📈 Easily extendable to include alerts, dashboards, and more

📸 Demo
You can include a screen recording or screenshots here showing:

Logs appearing in Grafana

Metrics from Express app

Working /slow and /metrics endpoints
