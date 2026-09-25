"use client"

import { useEffect } from "react"
import { motion } from "motion/react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DatabaseIcon,
  FlashIcon,
  RadioIcon,
  CloudIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

export function ServiceMonitor() {
  const { health, healthLoading, checkHealth } = useAppStore()

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  const services = [
    {
      name: "PostgreSQL",
      desc: "Relational persistence with SQLx pool",
      status: health?.services?.postgres,
      icon: DatabaseIcon,
      color: "text-blue-500 dark:text-blue-400",
      gradient: "from-blue-500/20 via-blue-500/10 to-cyan-500/5",
      glow: "hover:border-blue-500/40",
    },
    {
      name: "Redis Cache",
      desc: "Sub-millisecond key-value & streams",
      status: health?.services?.redis,
      icon: FlashIcon,
      color: "text-red-500 dark:text-red-400",
      gradient: "from-red-500/20 via-red-500/10 to-rose-500/5",
      glow: "hover:border-red-500/40",
    },
    {
      name: "NATS JetStream",
      desc: "Distributed message broker & pub/sub",
      status: health?.services?.nats,
      icon: RadioIcon,
      color: "text-emerald-500 dark:text-emerald-400",
      gradient: "from-emerald-500/20 via-emerald-500/10 to-teal-500/5",
      glow: "hover:border-emerald-500/40",
    },
    {
      name: "MinIO S3",
      desc: "High-performance S3 object storage",
      status: health?.services?.s3,
      icon: CloudIcon,
      color: "text-amber-500 dark:text-amber-400",
      gradient: "from-amber-500/20 via-amber-500/10 to-orange-500/5",
      glow: "hover:border-amber-500/40",
    },
  ]

  const isHealthy = health?.status === "ready"

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span
              className={`h-3 w-3 rounded-full ${
                isHealthy ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {isHealthy && (
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Cluster Health
              </span>
              <Badge
                variant={isHealthy ? "default" : "secondary"}
                className={
                  isHealthy
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                }
              >
                {health?.status ? health.status.toUpperCase() : "CHECKING"}
              </Badge>
            </div>
            {health?.uptime_seconds !== undefined && (
              <p className="text-xs text-muted-foreground">
                Uptime: {Math.floor(health.uptime_seconds / 60)}m {health.uptime_seconds % 60}s
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => checkHealth()}
            disabled={healthLoading}
            className="h-8.5 gap-1.5 text-xs transition-all hover:border-primary/40 active:scale-95"
          >
            <motion.div
              animate={{ rotate: healthLoading ? 360 : 0 }}
              transition={{ repeat: healthLoading ? Infinity : 0, duration: 1, ease: "linear" }}
            >
              <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
            </motion.div>
            {healthLoading ? "Verifying..." : "Probe Services"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((svc, index) => {
          const isOnline = svc.status === "connected"
          return (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="group"
            >
              <Card className={`relative overflow-hidden transition-all duration-300 ${svc.glow}`}>
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-wrap min-[360px]:flex-nowrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className={`flex size-9 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br ${svc.gradient} ${svc.color} border border-border/50 shadow-inner shrink-0`}>
                        <HugeiconsIcon icon={svc.icon} className="size-4.5 sm:size-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading text-xs sm:text-sm font-semibold text-foreground truncate">
                          {svc.name}
                        </div>
                        <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">
                          {svc.desc}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider shrink-0 ${
                        isOnline
                          ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {svc.status || "offline"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
