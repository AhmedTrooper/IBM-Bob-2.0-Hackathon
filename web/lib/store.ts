import { create } from "zustand"
import { Item, ReadinessResponse, LoginResponse, AiGenerateResponse } from "./schemas"
import { apiFetch } from "./error"

interface AppStore {
  health: ReadinessResponse | null
  healthLoading: boolean
  checkHealth: () => Promise<void>

  token: string | null
  currentUser: string | null
  authLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void

  aiResult: string | null
  aiLoading: boolean
  generateAi: (prompt: string, model?: string, temperature?: number) => Promise<string | null>

  items: Item[]
  itemsLoading: boolean
  fetchItems: () => Promise<void>
  createItem: (title: string, content?: string, tags?: string[]) => Promise<boolean>
  deleteItem: (id: string) => Promise<boolean>

  cacheResult: string | null
  cacheLoading: boolean
  setCache: (key: string, value: string, ttl?: number) => Promise<boolean>
  getCache: (key: string) => Promise<string | null>

  streamEvents: Array<{ id: string; eventType: string; payload: string; time: string }>
  publishStream: (eventType: string, payload: string, stream?: string) => Promise<boolean>

  natsMessages: Array<{ subject: string; message: string; time: string }>
  publishNats: (subject: string, message: string) => Promise<boolean>

  files: string[]
  filesLoading: boolean
  fetchFiles: () => Promise<void>
  deleteFile: (key: string) => Promise<boolean>

  notification: { message: string; type: "success" | "error" | "info" } | null
  setNotification: (notif: { message: string; type: "success" | "error" | "info" } | null) => void

  loadDemoData: () => void
  clearData: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  health: null,
  healthLoading: false,
  checkHealth: async () => {
    set({ healthLoading: true })
    const { data } = await apiFetch<ReadinessResponse>("/health/ready")
    set({ health: data, healthLoading: false })
  },

  token: null,
  currentUser: null,
  authLoading: false,
  login: async (username: string, password: string) => {
    set({ authLoading: true })
    const { data, error } = await apiFetch<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
    set({ authLoading: false })
    if (error || !data) {
      set({
        notification: {
          message: error?.message || "Authentication failed",
          type: "error",
        },
      })
      return false
    }
    set({
      token: data.token,
      currentUser: data.user_id,
      notification: {
        message: `Authenticated as ${data.user_id}`,
        type: "success",
      },
    })
    return true
  },
  logout: () => {
    set({
      token: null,
      currentUser: null,
      notification: { message: "Signed out successfully", type: "info" },
    })
  },

  aiResult: null,
  aiLoading: false,
  generateAi: async (prompt: string, model?: string, temperature?: number) => {
    set({ aiLoading: true, aiResult: null })
    const { data, error } = await apiFetch<AiGenerateResponse>("/api/v1/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, model, temperature }),
    })
    set({ aiLoading: false })
    if (error || !data) {
      set({
        notification: {
          message: error?.message || "AI generation failed",
          type: "error",
        },
      })
      return null
    }
    set({
      aiResult: data.text,
      notification: {
        message: `Generated with ${data.model} (${data.execution_time_ms}ms)`,
        type: "success",
      },
    })
    return data.text
  },

  items: [],
  itemsLoading: false,
  fetchItems: async () => {
    set({ itemsLoading: true })
    const { data } = await apiFetch<Item[]>("/api/v1/items")
    set({ items: data || [], itemsLoading: false })
  },
  createItem: async (title, content, tags) => {
    const { error } = await apiFetch<Item>("/api/v1/items", {
      method: "POST",
      body: JSON.stringify({ title, content, tags: tags || [] }),
    })
    if (!error) {
      await get().fetchItems()
      set({ notification: { message: "Item created successfully", type: "success" } })
      return true
    }
    set({ notification: { message: error.message, type: "error" } })
    return false
  },
  deleteItem: async (id) => {
    const { error } = await apiFetch(`/api/v1/items/${id}`, { method: "DELETE" })
    if (!error) {
      set({ items: get().items.filter((item) => item.id !== id) })
      set({ notification: { message: "Item deleted", type: "success" } })
      return true
    }
    set({ notification: { message: error.message, type: "error" } })
    return false
  },

  cacheResult: null,
  cacheLoading: false,
  setCache: async (key, value, ttl) => {
    set({ cacheLoading: true })
    const { error } = await apiFetch("/api/v1/cache", {
      method: "POST",
      body: JSON.stringify({ key, value, ttl_seconds: ttl }),
    })
    set({ cacheLoading: false })
    if (!error) {
      set({ notification: { message: `Cache key '${key}' saved`, type: "success" } })
      return true
    }
    set({ notification: { message: error.message, type: "error" } })
    return false
  },
  getCache: async (key) => {
    set({ cacheLoading: true })
    const { data, error } = await apiFetch<{ key: string; value: string | null }>(
      `/api/v1/cache/${encodeURIComponent(key)}`
    )
    set({ cacheLoading: false })
    if (!error && data) {
      set({ cacheResult: data.value })
      return data.value
    }
    set({ cacheResult: null })
    return null
  },

  streamEvents: [],
  publishStream: async (eventType, payload, stream) => {
    const { data, error } = await apiFetch<{ stream: string; event_id: string }>(
      "/api/v1/streams/publish",
      {
        method: "POST",
        body: JSON.stringify({ event_type: eventType, payload, stream }),
      }
    )
    if (!error && data) {
      set({
        streamEvents: [
          {
            id: data.event_id,
            eventType,
            payload,
            time: new Date().toLocaleTimeString(),
          },
          ...get().streamEvents,
        ],
        notification: { message: `Stream event published (${data.event_id})`, type: "success" },
      })
      return true
    }
    return false
  },

  natsMessages: [],
  publishNats: async (subject, message) => {
    const { error } = await apiFetch("/api/v1/nats/publish", {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    })
    if (!error) {
      set({
        natsMessages: [
          { subject, message, time: new Date().toLocaleTimeString() },
          ...get().natsMessages,
        ],
        notification: { message: `Published to NATS subject: ${subject}`, type: "success" },
      })
      return true
    }
    return false
  },

  files: [],
  filesLoading: false,
  fetchFiles: async () => {
    set({ filesLoading: true })
    const { data } = await apiFetch<string[]>("/api/v1/storage/list")
    set({ files: data || [], filesLoading: false })
  },
  deleteFile: async (key) => {
    const { error } = await apiFetch(`/api/v1/storage/${encodeURIComponent(key)}`, {
      method: "DELETE",
    })
    if (!error) {
      set({ files: get().files.filter((f) => f !== key) })
      set({ notification: { message: `Deleted ${key}`, type: "success" } })
      return true
    }
    return false
  },

  notification: null,
  setNotification: (notif) => set({ notification: notif }),

  loadDemoData: () => {
    set({
      health: {
        status: "ready",
        services: {
          postgres: "connected",
          redis: "connected",
          nats: "connected",
          s3: "connected",
        },
        uptime_seconds: 4120,
      },
      items: [
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          title: "Distributed Raft Consensus Engine",
          content: "High-performance cluster node state synchronization via Tokio async runtime",
          tags: ["rust", "consensus", "tokio"],
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
          title: "Real-time Telemetry Ingestion Pipeline",
          content: "Zero-copy streaming pipeline backed by Redis Streams and NATS JetStream broker",
          tags: ["nats", "redis", "streaming"],
          created_at: new Date(Date.now() - 1800000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "7f8e9d0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
          title: "Full-Duplex WebRTC Data Channel Relay",
          content: "Ultra-low latency peer-to-peer data transport with automatic fallback signaling",
          tags: ["webrtc", "websocket", "p2p"],
          created_at: new Date(Date.now() - 900000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      streamEvents: [
        {
          id: "1726714020100-0",
          eventType: "USER_SIGNUP",
          payload: '{"tier":"enterprise","region":"us-east-1"}',
          time: new Date(Date.now() - 120000).toLocaleTimeString(),
        },
        {
          id: "1726714045200-0",
          eventType: "ORDER_PROCESSED",
          payload: '{"order_id":"ord_9901","status":"settled","amount":249.00}',
          time: new Date(Date.now() - 60000).toLocaleTimeString(),
        },
        {
          id: "1726714070300-0",
          eventType: "AI_TOKEN_BUDGET",
          payload: '{"model":"gemini-1.5-flash","tokens":342,"duration_ms":184}',
          time: new Date().toLocaleTimeString(),
        },
      ],
      natsMessages: [
        {
          subject: "events.hackathon",
          message: "Broadcast stream active across 4 cluster worker nodes",
          time: new Date(Date.now() - 150000).toLocaleTimeString(),
        },
        {
          subject: "telemetry.system",
          message: "p99 latency 1.2ms; memory pressure nominal",
          time: new Date(Date.now() - 30000).toLocaleTimeString(),
        },
      ],
      files: [
        "backups/cluster-snapshot-2026.sql.gz",
        "models/ai-classifier-v3.bin",
        "datasets/benchmarks-q3.parquet",
      ],
      cacheResult: "production-ready-node-ok",
      aiResult:
        "Architecture verified: All microservices (PostgreSQL, Redis, NATS, MinIO S3) are operational with zero detected bottlenecks.",
      notification: { message: "Demo telemetry dataset loaded", type: "success" },
    })
  },
  clearData: () => {
    set({
      items: [],
      streamEvents: [],
      natsMessages: [],
      files: [],
      cacheResult: null,
      aiResult: null,
      notification: { message: "Dashboard data cleared", type: "info" },
    })
  },
}))
