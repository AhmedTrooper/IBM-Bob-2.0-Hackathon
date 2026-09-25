"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateItemSchema } from "@/lib/schemas"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DatabaseIcon,
  Delete02Icon,
  RefreshIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

export function ItemsPanel() {
  const { items, itemsLoading, fetchItems, createItem, deleteItem, setNotification } =
    useAppStore()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const validation = CreateItemSchema.safeParse({
      title,
      content,
      tags: parsedTags,
    })

    if (!validation.success) {
      setNotification({
        message: validation.error.issues[0]?.message || "Invalid input",
        type: "error",
      })
      return
    }

    const success = await createItem(title, content, parsedTags)
    if (success) {
      setTitle("")
      setContent("")
      setTags("")
    }
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      (item.content && item.content.toLowerCase().includes(q)) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
    )
  })

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400">
            <HugeiconsIcon icon={DatabaseIcon} className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">PostgreSQL Relational CRUD</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                SQLx Pool
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Strongly-typed SQL transactions with async connection pooling
            </CardDescription>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchItems()}
          disabled={itemsLoading}
          className="h-7 text-xs gap-1 hover:border-primary/40 active:scale-95"
        >
          <motion.div
            animate={{ rotate: itemsLoading ? 360 : 0 }}
            transition={{ repeat: itemsLoading ? Infinity : 0, duration: 1, ease: "linear" }}
          >
            <HugeiconsIcon icon={RefreshIcon} className="size-3" />
          </motion.div>
          {itemsLoading ? "Loading..." : "Sync"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <form onSubmit={handleSubmit} className="space-y-2.5 rounded-xl border border-border/70 bg-muted/20 p-3.5">
          <Input
            type="text"
            placeholder="Record Title (e.g. Distributed Consensus Engine)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 text-sm bg-background/80"
          />
          <Input
            type="text"
            placeholder="Description or JSON payload..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-9 text-sm bg-background/80"
          />
          <div className="flex flex-col min-[380px]:flex-row gap-2">
            <Input
              type="text"
              placeholder="Tags (comma-separated: rust, tokio, cluster)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="h-9 flex-1 bg-background/80 font-mono text-xs"
            />
            <Button type="submit" size="sm" className="h-9 text-xs w-full min-[380px]:w-auto shrink-0 font-medium active:scale-98">
              Save Record
            </Button>
          </div>
        </form>

        {items.length > 0 && (
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-2.5 size-4 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Filter records by title, content, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm bg-background/50"
            />
          </div>
        )}

        <ScrollArea className="h-44 pr-2">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
              <HugeiconsIcon icon={DatabaseIcon} className="size-7 mb-1.5 opacity-40" />
              <p className="font-medium text-foreground/70 text-sm">
                {items.length === 0 ? "No records in database" : "No matching records"}
              </p>
              <p className="text-xs">
                {items.length === 0
                  ? "Create a new record above or click 'Sync' to load data"
                  : "Try modifying your search filter"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-start justify-between rounded-xl border border-border/70 bg-card/80 p-3 text-sm transition-all hover:border-border hover:bg-muted/30"
                  >
                    <div className="space-y-1 pr-2">
                      <span className="font-semibold text-foreground">{item.title}</span>
                      {item.content && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.content}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="h-5 px-2 text-xs font-mono font-normal"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => deleteItem(item.id)}
                      className="opacity-60 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive active:scale-90"
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                    </Button>
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
