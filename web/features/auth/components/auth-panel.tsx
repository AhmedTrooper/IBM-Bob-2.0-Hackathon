"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { LoginRequestSchema } from "@/lib/schemas"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShieldCheckIcon,
  Key01Icon,
  Copy01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons"

export function AuthPanel() {
  const { token, currentUser, authLoading, login, logout, setNotification } = useAppStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = LoginRequestSchema.safeParse({ username, password })
    if (!validation.success) {
      setNotification({
        message: validation.error.issues[0]?.message || "Invalid credentials",
        type: "error",
      })
      return
    }

    const success = await login(username, password)
    if (success) {
      setPassword("")
    }
  }

  const fillDemoCredentials = () => {
    setUsername("admin")
    setPassword("password123")
  }

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setNotification({ message: "JWT token copied to clipboard", type: "info" })
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={ShieldCheckIcon} className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm">JWT Security & Authentication</CardTitle>
            <CardDescription className="text-xs">
              Cryptographic Bearer tokens with strict 15-minute expiration
            </CardDescription>
          </div>
        </div>
        {token ? (
          <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Authenticated
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Guest
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <AnimatePresence mode="wait">
          {token ? (
            <motion.div
              key="authenticated"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">Authenticated Subject</span>
                  <Badge variant="secondary" className="font-mono text-xs font-semibold">
                    {currentUser}
                  </Badge>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-background/60 p-2.5 border border-border/50">
                  <div className="truncate font-mono text-xs text-muted-foreground">
                    <span className="text-foreground/80 font-semibold">Bearer</span> {token}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={copyToken}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <HugeiconsIcon
                      icon={copied ? CheckmarkBadge01Icon : Copy01Icon}
                      className={`size-3.5 ${copied ? "text-emerald-500" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full text-xs hover:border-destructive/40 hover:text-destructive active:scale-98"
              >
                Terminate Session
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="unauthenticated"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-9 text-sm"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={authLoading}
                  className="flex-1 h-9 text-sm font-medium active:scale-98"
                >
                  <HugeiconsIcon icon={Key01Icon} className="size-4 mr-1.5" />
                  {authLoading ? "Issuing Token..." : "Sign In & Issue JWT"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  className="h-9 text-xs text-muted-foreground hover:text-foreground"
                >
                  Fill Demo
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
