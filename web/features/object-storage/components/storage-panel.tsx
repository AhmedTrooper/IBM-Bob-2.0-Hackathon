"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CloudIcon,
  Upload01Icon,
  Link01Icon,
  Delete02Icon,
  Copy01Icon,
  CheckmarkBadge01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

export function StoragePanel() {
  const { files, filesLoading, fetchFiles, deleteFile, setNotification } = useAppStore()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [presignedUrl, setPresignedUrl] = useState<{ key: string; url: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    try {
      const res = await fetch(`${apiBase}/api/v1/storage/upload`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setNotification({ message: `Uploaded '${selectedFile.name}' to S3`, type: "success" })
        setSelectedFile(null)
        await fetchFiles()
      } else {
        setNotification({ message: "Upload failed", type: "error" })
      }
    } catch {
      setNotification({ message: "Upload network error", type: "error" })
    } finally {
      setUploading(false)
    }
  }

  const handleGetPresignedUrl = async (key: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    try {
      const res = await fetch(`${apiBase}/api/v1/storage/url/${encodeURIComponent(key)}`)
      if (res.ok) {
        const data = await res.json()
        setPresignedUrl({ key, url: data.url })
      }
    } catch {
      setNotification({ message: "Failed to generate presigned URL", type: "error" })
    }
  }

  const copyPresignedUrl = () => {
    if (presignedUrl) {
      navigator.clipboard.writeText(presignedUrl.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setNotification({ message: "Presigned URL copied to clipboard", type: "info" })
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <HugeiconsIcon icon={CloudIcon} className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">AWS S3 / MinIO Object Storage</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Presigned S3
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Multipart binary asset bucket with time-limited presigned download URLs
            </CardDescription>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchFiles()}
          disabled={filesLoading}
          className="h-7 text-xs gap-1 hover:border-primary/40 active:scale-95"
        >
          <motion.div
            animate={{ rotate: filesLoading ? 360 : 0 }}
            transition={{ repeat: filesLoading ? Infinity : 0, duration: 1, ease: "linear" }}
          >
            <HugeiconsIcon icon={RefreshIcon} className="size-3" />
          </motion.div>
          {filesLoading ? "Loading..." : "Sync"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <form onSubmit={handleUpload} className="flex flex-col min-[380px]:flex-row gap-2">
          <Input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="flex-1 h-8 text-xs cursor-pointer"
          />
          <Button
            type="submit"
            size="sm"
            disabled={uploading || !selectedFile}
            className="h-8 text-xs shrink-0 active:scale-98 w-full min-[380px]:w-auto"
          >
            <HugeiconsIcon icon={Upload01Icon} className="size-3.5 mr-1" />
            {uploading ? "Uploading..." : "Upload S3"}
          </Button>
        </form>

        <AnimatePresence>
          {presignedUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <HugeiconsIcon icon={Link01Icon} className="size-3.5" />
                    <span>Presigned Download Token ({presignedUrl.key}):</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={copyPresignedUrl}
                    className="text-primary hover:bg-primary/10"
                  >
                    <HugeiconsIcon
                      icon={copied ? CheckmarkBadge01Icon : Copy01Icon}
                      className="size-3.5"
                    />
                  </Button>
                </div>
                <a
                  href={presignedUrl.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 block break-all font-mono text-xs text-muted-foreground underline hover:text-foreground"
                >
                  {presignedUrl.url}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ScrollArea className="h-32 pr-2">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
              <HugeiconsIcon icon={CloudIcon} className="size-6 mb-1 opacity-40" />
              <p className="font-medium text-foreground/70 text-sm">No objects stored in bucket</p>
              <p className="text-xs">Upload a file above or click &apos;Load Demo Data&apos;</p>
            </div>
          ) : (
            <div className="space-y-1.5 font-mono text-xs">
              <AnimatePresence initial={false}>
                {files.map((file) => (
                  <motion.div
                    key={file}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs"
                  >
                    <span className="truncate max-w-[220px] text-foreground/90">{file}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleGetPresignedUrl(file)}
                        className="h-6.5 text-xs px-2.5 font-normal"
                      >
                        Presign URL
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => deleteFile(file)}
                        className="h-6.5 w-6.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                      </Button>
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
