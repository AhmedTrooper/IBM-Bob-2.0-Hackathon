"use client"

import { useSyncExternalStore } from "react"
import { usePalette, PALETTES, GRADIENTS } from "@/hooks/use-palette"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import { PaintBoardIcon, Tick02Icon, SparklesIcon } from "@hugeicons/core-free-icons"

export function PaletteToggle() {
  const { palette, setPalette, gradient, setGradient } = usePalette()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) return null

  const currentGradient = GRADIENTS.find((g) => g.id === gradient) || GRADIENTS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8.5 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground active:scale-95"
          title="Customize Theme & Gradient Style"
        >
          <HugeiconsIcon icon={PaintBoardIcon} className="size-3.5" />
          <span className="hidden sm:inline font-mono text-[11px]">{currentGradient.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          <HugeiconsIcon icon={SparklesIcon} className="size-3 text-primary" />
          <span>Gradient Theme</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {GRADIENTS.map((g) => (
          <DropdownMenuItem
            key={g.id}
            onClick={() => setGradient(g.id)}
            className="flex items-center justify-between text-xs py-1.5 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className={`size-3 rounded-full shrink-0 ${g.dot}`} />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{g.name}</span>
                <span className="text-[10px] text-muted-foreground">{g.desc}</span>
              </div>
            </div>
            {gradient === g.id && (
              <HugeiconsIcon icon={Tick02Icon} className="size-3.5 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Background Depth
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PALETTES.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => setPalette(p.id)}
            className="flex items-center justify-between text-xs py-1.5 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className={`size-2.5 rounded-full shrink-0 ${p.dot}`} />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{p.name}</span>
              </div>
            </div>
            {palette === p.id && (
              <HugeiconsIcon icon={Tick02Icon} className="size-3.5 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
