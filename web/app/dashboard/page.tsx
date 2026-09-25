"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { useTheme } from "next-themes"
import { ErrorBoundary } from "@/components/error-boundary"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaletteToggle } from "@/components/palette-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { ServiceMonitor } from "@/features/service-status/service-monitor"
import { AuthPanel } from "@/features/auth/components/auth-panel"
import { AiPanel } from "@/features/ai-agent/components/ai-panel"
import { ItemsPanel } from "@/features/items-crud/components/items-panel"
import { CachePanel } from "@/features/cache-manager/components/cache-panel"
import { StreamPanel } from "@/features/stream-events/components/stream-panel"
import { NatsPanel } from "@/features/nats-pubsub/components/nats-panel"
import { StoragePanel } from "@/features/object-storage/components/storage-panel"
import { RtcPanel } from "@/features/realtime-signaling/components/rtc-panel"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Sun01Icon,
  Moon02Icon,
  SparklesIcon,
  FlashIcon,
  DatabaseIcon,
  RadioIcon,
  CheckmarkBadge01Icon,
  Cancel01Icon,
  Delete02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardView />
    </ErrorBoundary>
  )
}

function DashboardView() {
  const { notification, setNotification, loadDemoData, clearData, health } = useAppStore()
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification, setNotification])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const isHealthy = health?.status === "ready"

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 overflow-x-hidden">
      {/* Ambient Gradient Mesh Spotlight */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full blur-[120px] opacity-60 transition-all duration-500"
          style={{
            background: "radial-gradient(ellipse at center, var(--gradient-from), var(--gradient-via), transparent 70%)",
          }}
        />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium shadow-xl backdrop-blur-md border ${
              notification.type === "error"
                ? "border-destructive/30 bg-destructive/90 text-destructive-foreground"
                : notification.type === "success"
                  ? "border-emerald-500/30 bg-emerald-600/90 text-white"
                  : "border-border bg-card/95 text-foreground"
            }`}
          >
            <HugeiconsIcon
              icon={
                notification.type === "error"
                  ? Cancel01Icon
                  : notification.type === "success"
                    ? CheckmarkBadge01Icon
                    : FlashIcon
              }
              className="size-4 shrink-0"
            />
            <span>{notification.message}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setNotification(null)}
              className="ml-2 size-5 p-0 text-current opacity-70 hover:opacity-100 hover:bg-transparent"
            >
              ✕
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global App Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] 4xl:max-w-[2500px] items-center justify-between px-2.5 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mr-0.5 sm:mr-1 border-r border-border/60 pr-1.5 sm:pr-3 shrink-0"
              title="Return to Home"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              <span className="font-medium hidden md:inline">Home</span>
            </Link>

            <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-theme-gradient text-white font-bold shadow-md shrink-0">
              <HugeiconsIcon icon={FlashIcon} className="size-4.5 sm:size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-foreground truncate max-w-[100px] min-[360px]:max-w-[150px] sm:max-w-none">
                  Hackathon Core
                </h1>
                <Badge variant="outline" className="hidden min-[480px]:inline-flex text-[10px] sm:text-xs font-mono px-1.5 py-0.5 border-primary/30 text-primary shrink-0">
                  PROD-READY
                </Badge>
              </div>
              <p className="hidden min-[640px]:block text-xs text-muted-foreground truncate">
                Distributed Real-Time Cloud Infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2 border-r border-border/60 pr-3 mr-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  isHealthy ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" : "bg-amber-500"
                }`}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {isHealthy ? "Cluster Operational" : "Probing Nodes..."}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadDemoData}
              title="Load demo telemetry data"
              className="hidden min-[480px]:inline-flex h-8 sm:h-8.5 px-2 sm:px-2.5 gap-1 sm:gap-1.5 text-xs font-medium bg-gradient-to-r from-blue-500/15 via-cyan-500/10 to-emerald-500/15 hover:from-blue-500/25 hover:via-cyan-500/20 hover:to-emerald-500/25 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 active:scale-95 transition-all shadow-xs shrink-0"
            >
              <HugeiconsIcon icon={SparklesIcon} className="size-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span className="hidden md:inline">Load Demo Data</span>
              <span className="hidden min-[380px]:inline md:hidden">Demo</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={clearData}
              title="Reset dashboard data"
              className="hidden min-[420px]:inline-flex size-8 text-muted-foreground hover:text-destructive shrink-0"
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
            </Button>

            <PaletteToggle />

            {mounted && (
              <Button
                variant="outline"
                size="icon-xs"
                onClick={toggleTheme}
                title="Toggle Theme (or press 'D')"
                className="size-8 text-muted-foreground hover:text-foreground shrink-0"
              >
                <HugeiconsIcon
                  icon={resolvedTheme === "dark" ? Sun01Icon : Moon02Icon}
                  className="size-3.5 sm:size-4"
                />
              </Button>
            )}

            <MobileNav
              currentRoute="dashboard"
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onLoadDemoData={loadDemoData}
              onClearData={clearData}
              isHealthy={isHealthy}
            />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] 4xl:max-w-[2500px] px-2.5 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Service Monitor Bar */}
        <section>
          <ServiceMonitor />
        </section>

        {/* View Tabs Filter */}
        <div className="flex flex-col min-[640px]:flex-row min-[640px]:items-center justify-between border-b border-border/60 pb-2.5 sm:pb-3 gap-2">
          <div className="w-full min-[640px]:w-auto overflow-x-auto pb-1 min-[640px]:pb-0 scrollbar-none">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="inline-flex min-w-max h-8.5 sm:h-9 bg-muted/60 p-1">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2.5 sm:px-3.5">
                  All Systems
                </TabsTrigger>
                <TabsTrigger value="data" className="text-xs sm:text-sm px-2.5 sm:px-3.5">
                  <HugeiconsIcon icon={DatabaseIcon} className="size-3.5 mr-1 sm:mr-1.5" />
                  Data & Storage
                </TabsTrigger>
                <TabsTrigger value="realtime" className="text-xs sm:text-sm px-2.5 sm:px-3.5">
                  <HugeiconsIcon icon={RadioIcon} className="size-3.5 mr-1 sm:mr-1.5" />
                  Streams & PubSub
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs sm:text-sm px-2.5 sm:px-3.5">
                  <HugeiconsIcon icon={SparklesIcon} className="size-3.5 mr-1 sm:mr-1.5" />
                  AI & Auth
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <span className="hidden sm:inline text-xs text-muted-foreground font-mono shrink-0">
            Press <Badge variant="outline" className="font-mono text-xs px-1.5 py-0 mx-0.5">D</Badge> for theme
          </span>
        </div>

        {/* Dynamic Panels Workspace */}
        <AnimatePresence mode="wait">
          {activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12"
            >
              <div className="space-y-4 sm:space-y-6 lg:col-span-6 3xl:col-span-4">
                <AuthPanel />
                <ItemsPanel />
                <CachePanel />
              </div>
              <div className="space-y-4 sm:space-y-6 lg:col-span-6 3xl:col-span-4">
                <AiPanel />
                <StreamPanel />
                <NatsPanel />
              </div>
              <div className="space-y-4 sm:space-y-6 lg:col-span-12 3xl:col-span-4">
                <StoragePanel />
                <RtcPanel />
              </div>
            </motion.div>
          )}

          {activeTab === "data" && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12"
            >
              <div className="space-y-4 sm:space-y-6 lg:col-span-6">
                <ItemsPanel />
                <CachePanel />
              </div>
              <div className="space-y-4 sm:space-y-6 lg:col-span-6">
                <StoragePanel />
              </div>
            </motion.div>
          )}

          {activeTab === "realtime" && (
            <motion.div
              key="realtime"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12"
            >
              <div className="space-y-4 sm:space-y-6 lg:col-span-6">
                <StreamPanel />
                <NatsPanel />
              </div>
              <div className="space-y-4 sm:space-y-6 lg:col-span-6">
                <RtcPanel />
              </div>
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12"
            >
              <div className="space-y-4 sm:space-y-6 lg:col-span-6">
                <AiPanel />
              </div>
              <div className="space-y-4 sm:space-y-6 lg:col-span-6">
                <AuthPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] px-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span className="text-[11px] sm:text-xs">Production High-Performance Architecture • Rust Axum + Next.js</span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs">
            <span>PostgreSQL</span>
            <span>•</span>
            <span>Redis</span>
            <span>•</span>
            <span>NATS</span>
            <span>•</span>
            <span>MinIO</span>
            <span>•</span>
            <span>WebRTC</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
