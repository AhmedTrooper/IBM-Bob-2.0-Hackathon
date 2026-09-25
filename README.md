# Hackathon Core - Real-Time Distributed Application Platform

A high-performance full-stack platform built for event-driven workflows, object storage, and real-time collaboration.

---

## System Architecture & Features

### Backend Engine (`api/`)
- **Runtime & Web Framework**: Tokio multi-threaded asynchronous runtime paired with Axum 0.8.
- **Relational Storage**: PostgreSQL powered by SQLx connection pooling and automatic schema initialization.
- **Cache & Event Streaming**: Redis 7 multiplexed connection manager with key-value caching and Redis Stream event workers.
- **Distributed Pub/Sub**: NATS JetStream messaging for decoupled microservice communication.
- **Cloud Object Storage**: AWS S3 integration with MinIO support, automated bucket provisioning, and secure presigned URL generation.
- **Real-Time Signaling**: Full-duplex WebSocket hub for WebRTC peer signaling and live data transfer.
- **Authentication & Security**: Production-grade JWT access token issuance (15-min exp) and bcrypt hashing.
- **AI Agent Integration**: Streaming and structured completion endpoints for autonomous tasks.
- **Dedicated Servers Subsystem**: Decoupled HTTP/WebSocket server runners and background worker daemons.
- **BuildPulse Autonomic Repair Engine**: Closed-loop compiler diagnostic parser and sandboxed process runner.
- **Model Context Protocol (MCP) Server**: JSON-RPC 2.0 endpoints (`/build-pulse/mcp`) exposing build failure context and verification runners directly to IBM Bob 2.0 in Agent Mode.
- **Production Observability**: Leveled logging with `tracing-subscriber`, request ID propagation (`x-request-id`), timeouts, and compression.
- **Global Error Handling**: Centralized `AppError` type converting subsystem failures into structured JSON responses without crashing or leaking secrets.
- **Modular Vertical Slices**: Self-contained feature folders (`features/build_pulse/`, `features/items/`, `features/storage/`, `features/rtc/`, `features/auth/`, `features/ai/`) scalable to 1,000+ files and 10,000 features.

### Frontend Dashboard (`web/`)
- **Modern Interface**: Next.js 16 (App Router) with React 19 and Tailwind CSS v4.
- **Responsive Viewports**: Fluid layout, typography, and mobile menubar navigation supporting viewports from 300px mobile screens up to 8K displays.
- **Mobile Navigation Drawer**: Dedicated mobile menubar (`components/mobile-nav.tsx`) with animated overlay, quick links, workspace view toggles, and live telemetry controls.
- **Theme & Palette Engine**: Multi-palette system with Zustand persistence (`lib/theme-store.ts`, `hooks/use-palette.ts`) defaulting to Deep Carbon background and Solar Flame gradient across dark and light modes.
- **Feature-Sliced Design (FSD)**: Domain-driven feature slices (`features/items-crud/`, `features/auth/`, `features/ai-agent/`, `features/object-storage/`, etc.) keeping `app/page.tsx` thin and decoupled.
- **Styling & Components**: Radix UI primitives, shadcn component system (Card, Badge, Input, Textarea, Tabs, ScrollArea, Tooltip, Avatar, Dialog), and `@hugeicons/react` iconography.
- **State Management**: Zustand store (`useAppStore`) managing live service connectivity, records, streams, demo telemetry data, and notifications.
- **Data Validation**: Zod schemas for input validation and API contract guarantees.
- **Motion Animations**: Fluid micro-interactions, spring transitions, and status pulses powered by `motion`.
- **Fault-Tolerant UI**: Custom `ApiError` handling and React `ErrorBoundary` preventing blank-screen crashes.
- **Strictly Bun Runtime**: Fast dependency installation, test runner, dev server, and production builds.

### Infrastructure (`docker-compose.yml`)
- Containerized PostgreSQL 16, Redis 7, NATS with JetStream, and MinIO object storage with health checks and persistent storage volumes.

---

## Directory Layout

```text
├── Makefile                   # Developer and container lifecycle targets
├── docker-compose.yml         # PostgreSQL, Redis, NATS, and MinIO definitions
├── .env.example               # Secure environment variables configuration
├── .gitignore                 # Root wildcard patterns for build artifacts and secrets
├── CLAUDE.md                  # Development guidelines, pre-commit pipelines, and standards
├── README.md                  # System overview and operational guide
├── api/                       # Axum Rust Backend (Vertical Slice Architecture)
│   ├── Dockerfile
│   ├── Cargo.toml
│   └── src/
│       ├── core/              # Config, global AppError, AppState, security, telemetry
│       ├── infra/             # SQLx PostgreSQL, Redis, NATS, AWS S3 drivers
│       ├── servers/           # HTTP server and background worker daemon runners
│       ├── features/          # Self-contained feature slices (handlers, DTOs, routes)
│       │   ├── build_pulse/   # MCP server, compiler AST diagnostics, subprocess runner
│       │   ├── health/
│       │   ├── auth/
│       │   ├── ai/
│       │   ├── items/
│       │   ├── cache/
│       │   ├── streams/
│       │   ├── nats_pubsub/
│       │   ├── storage/
│       │   └── rtc/
│       ├── lib.rs             # Router assembly and middleware stack
│       └── main.rs            # Multi-subsystem initialization and graceful shutdown
└── web/                       # Next.js Frontend (Feature-Sliced Design)
    ├── Dockerfile
    ├── package.json
    ├── app/                   # Next.js App Router (Landing page and /dashboard)
    ├── features/              # Feature modules (UI, hooks, actions)
    │   ├── build-pulse/       # Mission control, terminal ANSI viewer, diff inspector
    │   ├── service-status/
    │   ├── auth/
    │   ├── ai-agent/
    │   ├── items-crud/
    │   ├── cache-manager/
    │   ├── stream-events/
    │   ├── nats-pubsub/
    │   ├── object-storage/
    │   └── realtime-signaling/
    ├── hooks/                 # Reusable hooks (useWebRTC)
    ├── lib/                   # Schemas (Zod), Store (Zustand), ApiError
    ├── components/            # UI components and ErrorBoundary
    └── test/                  # Automated Bun test suites
```

---

## Quickstart

### Prerequisites
- [Rust](https://www.rust-lang.org/) (latest stable)
- [Bun](https://bun.sh/) (strictly Bun runtime)
- [Docker](https://www.docker.com/) & Docker Compose
- GNU Make

### Setup & Run

1. **Initialize Environment**:
   ```bash
   make setup
   ```
   Creates the local `.env` configuration file from `.env.example`.

2. **Start Infrastructure Services**:
   ```bash
   make docker-up
   ```
   Spins up PostgreSQL, Redis, NATS, and MinIO in the background.

3. **Launch Backend API**:
   ```bash
   make dev-api
   ```
   The backend starts at `http://localhost:8080`.

4. **Launch Frontend Dashboard**:
   ```bash
   make dev-web
   ```
   The web dashboard starts at `http://localhost:3000`.

---

## Commands Reference

| Command | Description |
| :--- | :--- |
| `make help` | View available commands |
| `make setup` | Initialize local `.env` configuration |
| `make docker-up` | Start all infrastructure containers in the background |
| `make docker-down` | Stop all running infrastructure containers |
| `make docker-logs` | Stream logs from infrastructure containers |
| `make docker-erase` | Remove containers, networks, volumes, and orphans (retains images) |
| `make destroy` | Erase containers/volumes and kill processes on dev-api (8080) and dev-web (3000) |
| `make dev-api` | Run backend API server |
| `make dev-web` | Run frontend web application with Bun |
| `make dev` | Start infrastructure and display dev instructions |
| `make test-rust` | Run backend Rust test suite |
| `make test-web` | Run frontend TypeScript test suite with Bun |
| `make test` | Run both Rust and TypeScript tests |
| `make fmt-rust` | Format Rust codebase (`cargo fmt`) |
| `make check-rust` | Run sequential Rust checks (`test` -> `fmt` -> `clippy` -> `check`) |
| `make check-web` | Run TypeScript quality pipeline (`test` -> `build` -> `lint`) |
| `make check` | Run complete verification across backend and frontend |
| `make build` | Compile release binaries and production web bundle |
| `make clean` | Remove compiler and build artifacts |

---

## Service Endpoints & Ports

| Service | Port | Local Address / Connection String |
| :--- | :--- | :--- |
| **API Server (Axum)** | `8080` | `http://localhost:8080` |
| **Web Dashboard (Next.js)** | `3000` | `http://localhost:3000` |
| **PostgreSQL Database** | `5432` | `postgres://postgres:postgres@localhost:5432/buildpulse` |
| **Redis Server** | `6379` | `redis://localhost:6379` |
| **NATS JetStream** | `4222` | `nats://localhost:4222` (Monitor: `http://localhost:8222`) |
| **MinIO (S3 API)** | `9000` | `http://localhost:9000` |
| **MinIO Console** | `9001` | `http://localhost:9001` (User: `minioadmin`, Pass: `minioadmin`) |

---

## Verification & Quality

Before any changes are committed, all code must pass the verification pipelines:
- Every feature or bug fix must include automated tests.
- All tests must pass prior to quality checks.
- Rust checks must pass `cargo test`, `cargo fmt --check`, `cargo clippy -- -D warnings`, and `cargo check`.
- Frontend checks must pass `bun test`, `bun run build`, and `bun run lint`.
- See [CLAUDE.md](./CLAUDE.md) for full development policies and commit standards.
