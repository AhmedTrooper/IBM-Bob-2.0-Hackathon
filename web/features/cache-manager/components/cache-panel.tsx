"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SetCacheSchema } from "@/lib/schemas"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FlashIcon,
  Copy01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons"

export function CachePanel() {
  const { cacheResult, cacheLoading, setCache, getCache, setNotification } = useAppStore()

  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [ttl, setTtl] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSet = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedTtl = ttl ? parseInt(ttl, 10) : undefined

    const validation = SetCacheSchema.safeParse({
      key,
      value,
      ttl_seconds: parsedTtl,
    })

    if (!validation.success) {
      setNotification({
        message: validation.error.issues[0]?.message || "Invalid cache parameters",
        type: "error",
      })
      return
    }

    await setCache(key, value, parsedTtl)
  }

  const handlePreset = (presetKey: string, presetVal: string) => {
    setKey(presetKey)
    setValue(presetVal)
    setTtl("300")
  }

  const copyResult = () => {
    if (cacheResult) {
      navigator.clipboard.writeText(cacheResult)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
            <HugeiconsIcon icon={FlashIcon} className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">Redis In-Memory Cache</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Atomic K/V
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Fast low-latency memory store with optional TTL expiration
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-0.5">
          <span className="text-muted-foreground text-xs">Presets:</span>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => handlePreset("session:usr_99", '{"role":"admin"}')}
            className="font-mono text-xs h-6.5 px-2"
          >
            session:usr_99
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => handlePreset("rate_limit:ip_127", "42")}
            className="font-mono text-xs h-6.5 px-2"
          >
            rate_limit:ip_127
          </Button>
        </div>

        <form onSubmit={handleSet} className="space-y-2.5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Input
              type="text"
              placeholder="Key (e.g. session:usr_01)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="h-9 text-sm font-mono"
            />
            <Input
              type="text"
              placeholder="TTL in seconds (optional)"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              className="h-9 text-sm font-mono"
            />
          </div>

          <div className="flex flex-col min-[420px]:flex-row gap-2">
            <Input
              type="text"
              placeholder="Value string or JSON payload"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-9 flex-1 text-xs sm:text-sm font-mono"
            />
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="submit"
                size="sm"
                disabled={cacheLoading}
                className="flex-1 min-[420px]:flex-none h-9 text-xs active:scale-98"
              >
                Set Key
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => key && getCache(key)}
                disabled={cacheLoading || !key}
                className="flex-1 min-[420px]:flex-none h-9 text-xs active:scale-98"
              >
                Get Key
              </Button>
            </div>
          </div>
        </form>

        <AnimatePresence>
          {cacheResult !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Cached Result
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={copyResult}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <HugeiconsIcon
                      icon={copied ? CheckmarkBadge01Icon : Copy01Icon}
                      className={`size-3.5 ${copied ? "text-emerald-500" : ""}`}
                    />
                  </Button>
                </div>
                <div className="mt-2 font-mono text-[11px] text-foreground bg-background/60 p-2 rounded-lg border border-border/40 break-all">
                  {cacheResult}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
