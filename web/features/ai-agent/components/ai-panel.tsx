"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AiGenerateRequestSchema } from "@/lib/schemas"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  Copy01Icon,
  CheckmarkBadge01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons"

export function AiPanel() {
  const { aiResult, aiLoading, generateAi, setNotification } = useAppStore()
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("gemini-1.5-flash")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = AiGenerateRequestSchema.safeParse({ prompt, model })
    if (!validation.success) {
      setNotification({
        message: validation.error.issues[0]?.message || "Invalid prompt",
        type: "error",
      })
      return
    }

    await generateAi(prompt, model)
  }

  const handlePromptPreset = (sample: string) => {
    setPrompt(sample)
  }

  const copyResult = () => {
    if (aiResult) {
      navigator.clipboard.writeText(aiResult)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setNotification({ message: "AI completion copied to clipboard", type: "info" })
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:border-border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400 shrink-0">
            <HugeiconsIcon icon={SparklesIcon} className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">AI Agent & LLM Completions</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                Multi-Model
              </Badge>
            </div>
            <CardDescription className="text-xs line-clamp-1 sm:line-clamp-none">
              Direct generation via Gemini & Claude backends with low-latency streaming
            </CardDescription>
          </div>
        </div>

        <Select value={model} onValueChange={(val) => val && setModel(val)}>
          <SelectTrigger size="sm" className="h-8 w-full sm:w-44 text-xs font-medium shrink-0">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
            <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
            <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-0.5">
          <span className="text-muted-foreground text-xs">Suggestions:</span>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() =>
              handlePromptPreset(
                "Analyze microservice cluster topology and identify p99 latency risks."
              )
            }
            className="text-xs h-6.5 font-normal truncate max-w-[220px]"
          >
            Analyze cluster topology
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() =>
              handlePromptPreset(
                "Draft an optimized SQL query for high-throughput Postgres ledger records."
              )
            }
            className="text-xs h-6.5 font-normal truncate max-w-[220px]"
          >
            Draft SQL query
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <Textarea
            rows={3}
            placeholder="Enter instruction, system query, or context for the AI agent..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-sm leading-relaxed resize-none p-3"
          />

          <Button
            type="submit"
            size="sm"
            disabled={aiLoading || !prompt.trim()}
            className="w-full h-9 text-xs font-medium active:scale-98"
          >
            <HugeiconsIcon icon={PlayIcon} className="size-4 mr-1.5" />
            {aiLoading ? "Executing AI Model..." : "Generate AI Completion"}
          </Button>
        </form>

        <AnimatePresence>
          {aiResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">Completion Output</span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-mono">
                      {model}
                    </Badge>
                  </div>
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
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans text-xs bg-background/50 p-2.5 rounded-lg border border-border/40">
                  {aiResult}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
