"use client"

import { useId, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useWebRTC } from "@/hooks/use-webrtc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Wifi01Icon,
  MessageMultiple01Icon,
} from "@hugeicons/core-free-icons"

export function RtcPanel() {
  const [roomId, setRoomId] = useState("main-room")
  const id = useId()
  const peerId = "peer-" + id.replace(/:/g, "").slice(0, 6)
  const [inputMsg, setInputMsg] = useState("")

  const rtc = useWebRTC(roomId, peerId)

  const handleSend = () => {
    if (inputMsg.trim()) {
      rtc.sendDataMessage(inputMsg)
      setInputMsg("")
    }
  }

  const isConnected = rtc.status === "connected"
  const isConnecting = rtc.status === "connecting"

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <HugeiconsIcon icon={Wifi01Icon} className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">WebRTC P2P Signaling Hub</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Full-Duplex WS
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Direct peer-to-peer data transport with automatic SDP & ICE candidate exchange
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isConnected
                ? "bg-emerald-500 animate-pulse"
                : isConnecting
                  ? "bg-amber-500 animate-pulse"
                  : "bg-muted-foreground/50"
            }`}
          />
          <Badge
            variant="outline"
            className={`text-xs uppercase tracking-wider ${
              isConnected
                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {rtc.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            disabled={isConnected}
            className="h-9 w-full sm:w-1/2 text-xs sm:text-sm font-mono"
          />
          {isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => rtc.disconnect()}
              className="w-full sm:flex-1 h-9 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Disconnect Session
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => rtc.connect()}
              disabled={isConnecting}
              className="w-full sm:flex-1 h-9 text-xs active:scale-98 truncate"
            >
              {isConnecting ? "Connecting..." : `Join Room (${peerId})`}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs rounded-lg bg-muted/30 px-3 py-2 border border-border/50">
                <span className="text-muted-foreground">Active Peers in Room:</span>
                <div className="flex items-center gap-1.5">
                  {rtc.peers.length === 0 ? (
                    <span className="font-mono text-muted-foreground">Listening for peers...</span>
                  ) : (
                    rtc.peers.map((p) => (
                      <Badge key={p} variant="secondary" className="font-mono text-xs">
                        {p}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Send peer data message (Press Enter)..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="h-9 text-xs sm:text-sm flex-1 min-w-0"
                />
                <Button size="sm" onClick={handleSend} className="h-9 text-xs shrink-0 active:scale-98">
                  Send P2P
                </Button>
              </div>

              <ScrollArea className="h-28 pr-2">
                {rtc.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center text-xs text-muted-foreground">
                    <HugeiconsIcon icon={MessageMultiple01Icon} className="size-5 mb-1 opacity-40" />
                    <p className="font-medium text-foreground/70">No P2P messages exchanged yet</p>
                    <p className="text-xs">Type a message above to stream across peers</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 font-mono text-xs">
                    {rtc.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md border border-border/50 bg-muted/20 px-2.5 py-2 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-primary">{m.from}: </span>
                          <span className="text-foreground/90">{m.text}</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{m.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
