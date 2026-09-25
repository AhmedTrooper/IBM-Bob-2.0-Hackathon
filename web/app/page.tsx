"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PaletteToggle } from "@/components/palette-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FlashIcon,
  ArrowRight01Icon,
  Sun01Icon,
  Moon02Icon,
  DatabaseIcon,
  RadioIcon,
  CloudIcon,
  Wifi01Icon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckmarkBadge01Icon,
  Pulse01Icon,
} from "@hugeicons/core-free-icons"

export default function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const subsystems = [
    {
      title: "Rust Axum & Tokio Core",
      category: "Compute & Runtime",
      desc: "Multi-threaded asynchronous runtime delivering sub-millisecond p99 request routing with zero-panic reliability.",
      icon: FlashIcon,
      accent: "text-amber-500 dark:text-amber-400",
      gradient: "from-amber-500/20 via-amber-500/10 to-orange-500/5",
      borderGlow: "hover:border-amber-500/40",
      badge: "Axum 0.8",
    },
    {
      title: "PostgreSQL with SQLx",
      category: "Relational Storage",
      desc: "Robust relational persistence with asynchronous connection pooling, schema migrations, and strongly-typed queries.",
      icon: DatabaseIcon,
      accent: "text-blue-500 dark:text-blue-400",
      gradient: "from-blue-500/20 via-blue-500/10 to-cyan-500/5",
      borderGlow: "hover:border-blue-500/40",
      badge: "SQLx Pool",
    },
    {
      title: "Redis Cache & Streams",
      category: "In-Memory & Telemetry",
      desc: "Atomic key-value caching paired with append-only Redis Streams for distributed background worker consumer groups.",
      icon: Pulse01Icon,
      accent: "text-red-500 dark:text-red-400",
      gradient: "from-red-500/20 via-red-500/10 to-rose-500/5",
      borderGlow: "hover:border-red-500/40",
      badge: "Redis 7",
    },
    {
      title: "NATS JetStream Broker",
      category: "Distributed Pub/Sub",
      desc: "High-throughput asynchronous message broker enabling resilient inter-service event broadcasts and consumer streams.",
      icon: RadioIcon,
      accent: "text-emerald-500 dark:text-emerald-400",
      gradient: "from-emerald-500/20 via-emerald-500/10 to-teal-500/5",
      borderGlow: "hover:border-emerald-500/40",
      badge: "JetStream",
    },
    {
      title: "AWS S3 & MinIO Storage",
      category: "Object Storage",
      desc: "Cloud object storage bucket architecture with secure multipart uploads and time-limited presigned download URLs.",
      icon: CloudIcon,
      accent: "text-sky-500 dark:text-sky-400",
      gradient: "from-sky-500/20 via-sky-500/10 to-blue-500/5",
      borderGlow: "hover:border-sky-500/40",
      badge: "Presigned S3",
    },
    {
      title: "WebRTC Signaling Hub",
      category: "Real-Time P2P",
      desc: "Full-duplex WebSocket hub managing peer discovery, automatic SDP offers/answers, and live data channel exchange.",
      icon: Wifi01Icon,
      accent: "text-indigo-500 dark:text-indigo-400",
      gradient: "from-indigo-500/20 via-indigo-500/10 to-violet-500/5",
      borderGlow: "hover:border-indigo-500/40",
      badge: "WebSocket WS",
    },
    {
      title: "Multi-Model AI Agent",
      category: "Autonomous Intelligence",
      desc: "Unified AI completion studio integrating Google Gemini 1.5 and Anthropic Claude 3.5 with token execution telemetry.",
      icon: SparklesIcon,
      accent: "text-purple-500 dark:text-purple-400",
      gradient: "from-purple-500/20 via-purple-500/10 to-pink-500/5",
      borderGlow: "hover:border-purple-500/40",
      badge: "Multi-Model",
    },
    {
      title: "JWT Security & RBAC",
      category: "Authentication",
      desc: "Cryptographic Bearer token issuance with short-lived 15-minute expirations, bcrypt password hashing, and role checks.",
      icon: ShieldCheckIcon,
      accent: "text-emerald-500 dark:text-emerald-400",
      gradient: "from-emerald-500/20 via-emerald-500/10 to-green-500/5",
      borderGlow: "hover:border-emerald-500/40",
      badge: "HS256 Auth",
    },
  ]

  const metrics = [
    { value: "< 1.2ms", label: "p99 Internal Latency" },
    { value: "4 Subsystems", label: "PostgreSQL, Redis, NATS, S3" },
    { value: "100% Typed", label: "Rust + TypeScript + Zod" },
    { value: "Zero Crash", label: "AppError Global Boundaries" },
  ]

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] 4xl:max-w-[2500px] items-center justify-between px-2.5 sm:px-6 py-2.5 sm:py-3.5">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-theme-gradient text-white font-bold shadow-md shrink-0">
              <HugeiconsIcon icon={FlashIcon} className="size-4.5 sm:size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground truncate max-w-[110px] min-[360px]:max-w-[160px] sm:max-w-none">
                  Hackathon Core
                </span>
                <Badge variant="outline" className="hidden min-[480px]:inline-flex text-[10px] sm:text-xs font-mono px-1.5 py-0.5 border-primary/30 text-primary shrink-0">
                  v1.0.0
                </Badge>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#subsystems" className="hover:text-foreground transition-colors">
              Subsystems
            </a>
            <a href="#metrics" className="hover:text-foreground transition-colors">
              Architecture
            </a>
            <a href="#telemetry" className="hover:text-foreground transition-colors">
              Telemetry
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <PaletteToggle />
            {mounted && (
              <Button
                variant="outline"
                size="icon-sm"
                onClick={toggleTheme}
                title="Toggle Theme"
                className="size-8 text-muted-foreground hover:text-foreground shrink-0"
              >
                <HugeiconsIcon
                  icon={resolvedTheme === "dark" ? Sun01Icon : Moon02Icon}
                  className="size-3.5 sm:size-4"
                />
              </Button>
            )}

            <Button asChild size="sm" className="hidden min-[420px]:inline-flex h-8 sm:h-9 px-2.5 sm:px-4 text-xs font-medium gap-1 sm:gap-1.5 active:scale-95 shadow-xs shrink-0">
              <Link href="/dashboard">
                <span className="hidden min-[480px]:inline">Dashboard</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Link>
            </Button>

            <MobileNav currentRoute="home" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 lg:pt-24 pb-8 sm:pb-16 lg:pb-20 border-b border-border/60">
        {/* Ambient Gradient Mesh Spotlight */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 h-[min(50vh,700px)] w-[min(95vw,1400px)] rounded-full blur-[100px] opacity-60 transition-all duration-500"
            style={{
              background: "radial-gradient(ellipse at center, var(--gradient-from), var(--gradient-via), transparent 70%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] px-3 sm:px-6 text-center space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-border/80 bg-muted/40 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] min-[360px]:text-xs text-muted-foreground backdrop-blur-md shadow-xs"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50 shrink-0" />
            <span className="font-medium text-foreground">Distributed Cloud Stack</span>
            <span className="text-border">•</span>
            <span>Tokio + Axum + Next.js</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mx-auto max-w-5xl text-2xl min-[360px]:text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-bold tracking-tight text-foreground leading-[1.15]"
          >
            High-Performance Real-Time{" "}
            <span className="text-theme-gradient drop-shadow-xs font-extrabold">
              Platform Architecture
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mx-auto max-w-2xl 2xl:max-w-4xl text-xs min-[360px]:text-sm sm:text-lg 2xl:text-xl text-muted-foreground leading-relaxed px-1 sm:px-2"
          >
            A production-ready full-stack engine built for sub-millisecond event streaming,
            relational persistence, distributed NATS pub/sub, object storage, and autonomous AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center justify-center gap-2.5 sm:gap-3.5 pt-2 sm:pt-3 w-full max-w-xs min-[380px]:max-w-none mx-auto"
          >
            <Button asChild size="default" className="h-9 sm:h-10.5 px-4 sm:px-6 text-xs sm:text-sm font-medium gap-2 active:scale-95 bg-theme-gradient hover:brightness-110 text-white shadow-lg border-0 transition-all">
              <Link href="/dashboard">
                <span>Launch Live Dashboard</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="default" className="h-9 sm:h-10.5 px-4 sm:px-5 text-xs sm:text-sm font-medium bg-card/60 backdrop-blur-sm border-border/80 hover:bg-muted/80">
              <a href="#subsystems">Explore Subsystems</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Metrics Ticker */}
      <section id="metrics" className="relative border-b border-border/60 bg-gradient-to-b from-muted/30 via-muted/10 to-transparent py-6 sm:py-9">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] px-3 sm:px-6">
          <div className="grid grid-cols-1 min-[320px]:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative rounded-xl border border-border/70 bg-gradient-to-b from-card/90 via-card/60 to-card/40 p-3 sm:p-4.5 text-center backdrop-blur-md overflow-hidden group hover:border-border transition-colors shadow-xs"
              >
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="font-heading text-lg min-[360px]:text-xl sm:text-2xl 2xl:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                  {m.value}
                </div>
                <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Subsystems Section */}
      <section id="subsystems" className="py-10 sm:py-16 lg:py-20 border-b border-border/60">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] px-3 sm:px-6 space-y-6 sm:space-y-10">
          <div className="text-center space-y-2 max-w-2xl 2xl:max-w-3xl mx-auto px-2">
            <Badge variant="outline" className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-primary border-primary/30">
              Modular Vertical Slices
            </Badge>
            <h2 className="text-xl min-[360px]:text-2xl sm:text-3xl 2xl:text-4xl font-bold tracking-tight text-foreground">
              Eight Unified Cloud Subsystems
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-base text-muted-foreground">
              Every subsystem operates as an isolated, self-contained vertical slice with dedicated
              routes, DTO contracts, and zero-panic error handling.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subsystems.map((sub, i) => (
              <motion.div
                key={sub.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className="group"
              >
                <Card className={`h-full transition-all duration-300 relative overflow-hidden bg-gradient-to-b from-card via-card/95 to-card/80 border-border/80 ${sub.borderGlow} hover:shadow-xl hover:shadow-primary/5`}>
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${sub.gradient} ${sub.accent} border border-border/50 shadow-inner`}>
                        <HugeiconsIcon icon={sub.icon} className="size-5" />
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs bg-muted/60">
                        {sub.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base pt-2.5 font-semibold text-foreground">{sub.title}</CardTitle>
                    <div className="text-xs font-medium text-muted-foreground/80">
                      {sub.category}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                      {sub.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Telemetry Showcase */}
      <section id="telemetry" className="relative py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-muted/20 via-transparent to-muted/20 overflow-hidden">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] px-3 sm:px-6">
          <div className="relative rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card/95 to-card/85 p-4 sm:p-6 lg:p-8 2xl:p-10 shadow-2xl overflow-hidden">
            {/* Ambient Corner Glow */}
            <div
              className="pointer-events-none absolute -top-32 -right-32 size-80 rounded-full blur-3xl opacity-30 transition-all duration-500"
              style={{
                background: "radial-gradient(circle at center, var(--gradient-from), var(--gradient-via), transparent 70%)",
              }}
            />

            <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-12 items-center">
              <div className="space-y-3 sm:space-y-4 lg:col-span-6">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold text-theme-gradient">
                    Live Cluster Ready
                  </span>
                </div>
                <h3 className="text-xl min-[360px]:text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Monitor & Control Everything From One Workspace
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The dashboard provides real-time state synchronization for all databases, message queues,
                  file buckets, and WebSocket channels with one-click demo data seeding.
                </p>
                <div className="pt-2">
                  <Button asChild size="default" className="h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium gap-2 bg-theme-gradient hover:brightness-110 text-white shadow-lg border-0 transition-all">
                    <Link href="/dashboard">
                      <span>Open Operations Dashboard</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative lg:col-span-6 rounded-xl border border-border/80 bg-gradient-to-b from-card/90 to-card/50 p-3 sm:p-4 font-mono text-[11px] sm:text-xs space-y-2 shadow-inner overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-theme-gradient" />
                <div className="flex items-center justify-between pb-2 border-b border-border/50 text-muted-foreground gap-2">
                  <span className="text-foreground font-semibold truncate">cluster.telemetry.stream</span>
                  <span className="text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5 shrink-0 text-[10px] sm:text-xs">
                    <span className="size-2 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse" />
                    HEALTHY
                  </span>
                </div>
                <div className="space-y-1.5 text-muted-foreground leading-relaxed break-all sm:break-normal">
                  <div><span className="text-blue-600 dark:text-blue-400 font-semibold">[postgres]</span> connection_pool: 10/10 active • latency: 0.4ms</div>
                  <div><span className="text-red-600 dark:text-red-400 font-semibold">[redis]</span> memory: 28MB • streams: active • xread: synced</div>
                  <div><span className="text-emerald-600 dark:text-emerald-400 font-semibold">[nats]</span> jetstream cluster operational • peers: 4</div>
                  <div><span className="text-amber-600 dark:text-amber-400 font-semibold">[s3]</span> minio object storage bucket verified</div>
                  <div><span className="text-indigo-600 dark:text-indigo-400 font-semibold">[webrtc]</span> ws://localhost:8080/ws/rtc signaling hub ok</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 sm:py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] px-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] sm:text-xs">Production High-Performance Architecture • Rust Axum & Next.js</span>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>•</span>
            <a href="#subsystems" className="hover:text-foreground transition-colors">
              Subsystems
            </a>
            <span>•</span>
            <a href="#metrics" className="hover:text-foreground transition-colors">
              Metrics
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
