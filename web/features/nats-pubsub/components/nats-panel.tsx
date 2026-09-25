"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NatsPublishSchema } from "@/lib/schemas"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  RadioIcon,
  Pulse01Icon,
} from "@hugeicons/core-free-icons"

export function NatsPanel() {
  const { natsMessages, publishNats, setNotification } = useAppStore()

  const [subject, setSubject] = useState("events.hackathon")
  const [message, setMessage] = useState("Engine broadcast active")

  const handleBroadcast = async () => {
    const validation = NatsPublishSchema.safeParse({ subject, message })
    if (!validation.success) {
      setNotification({
        message: validation.error.issues[0]?.message || "Invalid NATS parameters",
        type: "error",
      })
      return
    }

    await publishNats(subject, message)
  }

  const setTopic = (subj: string, msg: string) => {
    setSubject(subj)
    setMessage(msg)
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
            <HugeiconsIcon icon={RadioIcon} className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">NATS JetStream Pub/Sub</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                At-Least-Once
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Ultra-high-throughput async message broker with persistent consumer streams
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-0.5">
          <span className="text-muted-foreground text-xs">Topics:</span>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setTopic("telemetry.system", "CPU load: 24%, Memory: 41%")}
            className="font-mono text-xs h-6.5 px-2"
          >
            telemetry.system
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setTopic("cluster.ping", "Node 3 status OK")}
            className="font-mono text-xs h-6.5 px-2"
          >
            cluster.ping
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Input
              type="text"
              placeholder="Subject (e.g. events.orders)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 w-28 sm:w-1/3 text-xs sm:text-sm font-mono shrink-0"
            />
            <Input
              type="text"
              placeholder="Message payload"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-9 flex-1 text-xs sm:text-sm font-mono"
            />
          </div>
          <Button size="sm" onClick={handleBroadcast} className="h-9 text-xs shrink-0 active:scale-98 w-full sm:w-auto">
            Broadcast
          </Button>
        </div>

        <ScrollArea className="h-32 pr-2">
          {natsMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
              <HugeiconsIcon icon={Pulse01Icon} className="size-6 mb-1 opacity-40" />
              <p className="font-medium text-foreground/70 text-sm">No NATS messages published yet</p>
              <p className="text-xs">Broadcast a message above or load demo data to view topic history</p>
            </div>
          ) : (
            <div className="space-y-1.5 font-mono text-xs">
              <AnimatePresence initial={false}>
                {natsMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-xs px-2 py-0.5">
                        {msg.subject}
                      </Badge>
                      <span className="text-foreground/80 truncate">{msg.message}</span>
                    </div>
                    <span className="text-muted-foreground text-xs shrink-0">{msg.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
