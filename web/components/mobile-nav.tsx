"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Menu01Icon,
  Cancel01Icon,
  DatabaseIcon,
  CpuIcon,
  Activity01Icon,
  DashboardSquare01Icon,
  Home01Icon,
  Sun01Icon,
  Moon02Icon,
  SparklesIcon,
  Delete02Icon,
  RadioIcon,
  PaintBoardIcon,
  Tick02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePalette, PALETTES, GRADIENTS, type Palette, type GradientTheme } from "@/hooks/use-palette"

export interface MobileNavProps {
  currentRoute?: "home" | "dashboard"
  activeTab?: string
  onSelectTab?: (tab: string) => void
  onLoadDemoData?: () => void
  onClearData?: () => void
  isHealthy?: boolean
}

export function MobileNav({
  currentRoute = "home",
  activeTab,
  onSelectTab,
  onLoadDemoData,
  onClearData,
  isHealthy = true,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const { palette, setPalette, gradient, setGradient } = usePalette()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  const landingNavLinks = [
    {
      label: "Subsystems",
      href: "/#subsystems",
      icon: DatabaseIcon,
      desc: "PostgreSQL, Redis, NATS, S3",
    },
    {
      label: "Architecture & Metrics",
      href: "/#metrics",
      icon: CpuIcon,
      desc: "p99 < 1.2ms, 100% Typed Rust",
    },
    {
      label: "Live Telemetry",
      href: "/#telemetry",
      icon: Activity01Icon,
      desc: "Event streams, health & trace monitors",
    },
    {
      label: "Operations Dashboard",
      href: "/dashboard",
      icon: DashboardSquare01Icon,
      desc: "Interactive multi-service control plane",
      isHighlighted: true,
    },
  ]

  const dashboardTabs = [
    { id: "all", label: "All Systems", icon: CpuIcon },
    { id: "data", label: "Data & Storage", icon: DatabaseIcon },
    { id: "realtime", label: "Streams & PubSub", icon: RadioIcon },
    { id: "ai", label: "AI & Auth", icon: SparklesIcon },
  ]

  return (
    <div className="lg:hidden">
      {/* Mobile Hamburger Trigger Button */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        className={`size-8 text-foreground transition-colors shrink-0 ${
          isOpen ? "bg-accent border-primary/50 text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <HugeiconsIcon
          icon={isOpen ? Cancel01Icon : Menu01Icon}
          className="size-4 transition-transform duration-200"
        />
      </Button>

      {/* Mobile Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeMenu}
              className="fixed inset-0 top-[49px] sm:top-[57px] z-40 bg-background/70 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Slide Down Overlay Sheet */}
            <motion.nav
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-2 top-[53px] sm:top-[61px] z-50 max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain rounded-2xl border border-border/80 bg-popover/98 p-3.5 sm:p-4.5 text-popover-foreground shadow-2xl backdrop-blur-2xl focus:outline-none"
            >
              {/* Header Status & Identity */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      isHealthy ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" : "bg-amber-500"
                    }`}
                  />
                  <span className="text-xs font-semibold tracking-tight text-foreground truncate">
                    Hackathon Core v1.0.0
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0"
                >
                  {isHealthy ? "Operational" : "Degraded"}
                </Badge>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1">
                  Navigation
                </span>

                {currentRoute === "dashboard" ? (
                  <>
                    <Link
                      href="/"
                      onClick={closeMenu}
                      className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5 text-xs transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-background border border-border/60 text-muted-foreground shrink-0">
                          <HugeiconsIcon icon={Home01Icon} className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate">Return to Home</div>
                          <div className="text-[10px] text-muted-foreground truncate">Landing overview & metrics</div>
                        </div>
                      </div>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 text-muted-foreground shrink-0 ml-1.5" />
                    </Link>

                    {/* Dashboard Workspace Views */}
                    {onSelectTab && (
                      <div className="pt-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1 block mb-1.5">
                          Switch Workspace View
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {dashboardTabs.map((tab) => {
                            const TabIcon = tab.icon
                            const isSelected = activeTab === tab.id
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  onSelectTab(tab.id)
                                  closeMenu()
                                }}
                                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition-all ${
                                  isSelected
                                    ? "border-primary/50 bg-primary/10 text-primary font-medium shadow-xs"
                                    : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                              >
                                <HugeiconsIcon icon={TabIcon} className="size-3.5 shrink-0" />
                                <span className="truncate">{tab.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quick Simulation Actions */}
                    {(onLoadDemoData || onClearData) && (
                      <div className="pt-2 flex items-center gap-2">
                        {onLoadDemoData && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onLoadDemoData()
                              closeMenu()
                            }}
                            className="flex-1 h-8 text-xs font-medium bg-gradient-to-r from-blue-500/15 via-cyan-500/10 to-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 gap-1.5"
                          >
                            <HugeiconsIcon icon={SparklesIcon} className="size-3.5 shrink-0" />
                            <span className="truncate">Demo Data</span>
                          </Button>
                        )}
                        {onClearData && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              onClearData()
                              closeMenu()
                            }}
                            className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1.5"
                          >
                            <HugeiconsIcon icon={Delete02Icon} className="size-3.5 shrink-0" />
                            <span>Reset</span>
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {landingNavLinks.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs transition-colors active:scale-[0.99] ${
                            item.isHighlighted
                              ? "border-primary/40 bg-theme-gradient text-white shadow-md font-medium"
                              : "border-border/50 bg-muted/30 text-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`flex size-7 items-center justify-center rounded-lg border shrink-0 ${
                                item.isHighlighted
                                  ? "border-white/30 bg-black/20 text-white"
                                  : "border-border/60 bg-background text-muted-foreground"
                              }`}
                            >
                              <HugeiconsIcon icon={Icon} className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <div
                                className={`font-medium truncate ${
                                  item.isHighlighted ? "text-white" : "text-foreground"
                                }`}
                              >
                                {item.label}
                              </div>
                              <div
                                className={`text-[10px] truncate ${
                                  item.isHighlighted ? "text-white/80" : "text-muted-foreground"
                                }`}
                              >
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            className={`size-3.5 shrink-0 ml-1.5 ${
                              item.isHighlighted ? "text-white" : "text-muted-foreground"
                            }`}
                          />
                        </Link>
                      )
                    })}
                  </>
                )}
              </div>

              {/* Theme & Palette Customizer */}
              {mounted && (
                <div className="mt-3.5 pt-3 border-t border-border/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1">
                      Theme Mode
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant={resolvedTheme === "light" ? "default" : "outline"}
                        size="xs"
                        onClick={() => setTheme("light")}
                        className="h-7 text-xs gap-1 px-2.5"
                      >
                        <HugeiconsIcon icon={Sun01Icon} className="size-3" />
                        <span>Light</span>
                      </Button>
                      <Button
                        type="button"
                        variant={resolvedTheme === "dark" ? "default" : "outline"}
                        size="xs"
                        onClick={() => setTheme("dark")}
                        className="h-7 text-xs gap-1 px-2.5"
                      >
                        <HugeiconsIcon icon={Moon02Icon} className="size-3" />
                        <span>Dark</span>
                      </Button>
                    </div>
                  </div>

                  {/* Gradient Style Quick Switcher */}
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1 mb-1.5">
                      <HugeiconsIcon icon={SparklesIcon} className="size-3 text-primary" />
                      <span>Gradient Style</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {GRADIENTS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGradient(g.id as GradientTheme)}
                          className={`flex items-center justify-between rounded-lg border px-2 py-1.5 text-xs text-left transition-all ${
                            gradient === g.id
                              ? "border-primary/50 bg-primary/10 text-primary font-medium"
                              : "border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`size-2.5 rounded-full shrink-0 ${g.dot}`} />
                            <span className="truncate text-[11px]">{g.name.split(" ")[0]}</span>
                          </div>
                          {gradient === g.id && (
                            <HugeiconsIcon icon={Tick02Icon} className="size-3 shrink-0 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Depth Quick Switcher */}
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1 mb-1.5">
                      <HugeiconsIcon icon={PaintBoardIcon} className="size-3 text-muted-foreground" />
                      <span>Background Depth</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PALETTES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPalette(p.id as Palette)}
                          className={`flex items-center justify-between rounded-lg border px-2 py-1.5 text-xs text-left transition-all ${
                            palette === p.id
                              ? "border-primary/50 bg-primary/10 text-primary font-medium"
                              : "border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`size-2.5 rounded-full shrink-0 ${p.dot}`} />
                            <span className="truncate text-[11px]">{p.name.split(" ")[0]}</span>
                          </div>
                          {palette === p.id && (
                            <HugeiconsIcon icon={Tick02Icon} className="size-3 shrink-0 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Footer Specs */}
              <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>p99 &lt; 1.2ms latency</span>
                <span>Rust + Next.js</span>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
