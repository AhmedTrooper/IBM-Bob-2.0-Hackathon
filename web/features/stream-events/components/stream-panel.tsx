"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PublishStreamSchema } from "@/lib/schemas"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FlashIcon,
  Pulse01Icon,
} from "@hugeicons/core-free-icons"

export function StreamPanel() {
  const { streamEvents, publishStream, setNotification } = useAppStore()

  const [eventType, setEventType] = useState("USER_SIGNUP")
  const [payload, setPayload] = useState('{"tier":"pro","region":"eu-central-1"}')

  const handlePublish = async () => {
    const validation = PublishStreamSchema.safeParse({
      event_type: eventType,
      payload,
    })

    if (!validation.success) {
      setNotification({
        message: validation.error.issues[0]?.message || "Invalid stream payload",
        type: "error",
      })
      return
    }

    await publishStream(eventType, payload)
  }

  const setTemplate = (type: string, data: string) => {
    setEventType(type)
    setPayload(data)
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
              <CardTitle className="text-sm">Redis Streams (XADD)</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Log Pipeline
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Append-only message streams for distributed worker consumer groups
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-0.5">
          <span className="text-muted-foreground text-xs">Templates:</span>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setTemplate("USER_SIGNUP", '{"tier":"pro","region":"eu-west"}')}
            className="font-mono text-xs h-6.5 px-2"
          >
            USER_SIGNUP
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setTemplate("ORDER_SETTLED", '{"order_id":"ord_102","amount":89.50}')}
            className="font-mono text-xs h-6.5 px-2"
          >
            ORDER_SETTLED
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <Input
                type="text"
                placeholder="Event Type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="h-9 w-28 sm:w-1/3 text-xs sm:text-sm font-mono shrink-0"
              />
              <Input
                type="text"
                placeholder="JSON payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="h-9 flex-1 text-xs sm:text-sm font-mono"
              />
            </div>
            <Button size="sm" onClick={handlePublish} className="h-9 text-xs shrink-0 active:scale-98 w-full sm:w-auto">
              Publish Event
            </Button>
          </div>
        </div>

        <ScrollArea className="h-36 pr-2">
          {streamEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
              <HugeiconsIcon icon={Pulse01Icon} className="size-6 mb-1 opacity-40" />
              <p className="font-medium text-foreground/70 text-sm">No stream events published yet</p>
              <p className="text-xs">Publish an event or load demo data to view the stream log</p>
            </div>
          ) : (
            <div className="space-y-1.5 font-mono text-xs">
              <AnimatePresence initial={false}>
                {streamEvents.map((evt) => (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Badge variant="outline" className="border-red-500/30 text-rose-700 dark:text-rose-400 font-mono text-xs px-2 py-0.5">
                        {evt.eventType}
                      </Badge>
                      <span className="text-foreground/80 truncate">{evt.payload}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-xs">
                      <span>{evt.time}</span>
                      <span className="opacity-60">#{evt.id.slice(-6)}</span>
                    </div>
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
