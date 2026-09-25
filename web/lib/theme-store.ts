import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type Palette = "carbon" | "aurora" | "graphite" | "obsidian"
export type GradientTheme = "sunset" | "nebula" | "violet" | "aurora"

export interface PaletteOption {
  id: Palette
  name: string
  dot: string
  desc: string
}

export interface GradientOption {
  id: GradientTheme
  name: string
  dot: string
  desc: string
}

export const PALETTES: PaletteOption[] = [
  {
    id: "carbon",
    name: "Deep Carbon (Default)",
    dot: "bg-slate-950 border border-orange-500/50",
    desc: "Clean dark carbon #0a0d12",
  },
  {
    id: "aurora",
    name: "Aurora Slate",
    dot: "bg-slate-900 border border-emerald-400/40",
    desc: "Cosmic dark slate #080c14",
  },
  {
    id: "graphite",
    name: "GitHub Graphite",
    dot: "bg-slate-800 border border-slate-600",
    desc: "GitHub dark dimmed #0d1117",
  },
  {
    id: "obsidian",
    name: "OLED Pitch Black",
    dot: "bg-black border border-white/20",
    desc: "Pure pitch black #000000",
  },
]

export const GRADIENTS: GradientOption[] = [
  {
    id: "sunset",
    name: "Solar Flame (Default)",
    dot: "bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500",
    desc: "Amber → Orange → Rose",
  },
  {
    id: "nebula",
    name: "Cosmic Nebula",
    dot: "bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400",
    desc: "Cyan → Indigo → Fuchsia",
  },
  {
    id: "violet",
    name: "Electric Violet",
    dot: "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500",
    desc: "Indigo → Purple → Pink",
  },
  {
    id: "aurora",
    name: "Emerald Aurora",
    dot: "bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400",
    desc: "Blue → Teal → Emerald",
  },
]

export function applyDOMTheme(palette?: Palette, gradient?: GradientTheme) {
  if (typeof document === "undefined") return
  if (palette) {
    document.documentElement.setAttribute("data-palette", palette)
  }
  if (gradient) {
    document.documentElement.setAttribute("data-gradient", gradient)
  }
}

export interface ThemeStoreState {
  palette: Palette
  gradient: GradientTheme
  setPalette: (palette: Palette) => void
  setGradient: (gradient: GradientTheme) => void
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      palette: "carbon",
      gradient: "sunset",
      setPalette: (palette: Palette) => {
        applyDOMTheme(palette, undefined)
        set({ palette })
      },
      setGradient: (gradient: GradientTheme) => {
        applyDOMTheme(undefined, gradient)
        set({ gradient })
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return {
          getItem: (key: string) => {
            const value = localStorage.getItem(key)
            if (value) return value

            // Migration from legacy keys if available
            const oldPalette = localStorage.getItem("theme-palette") as Palette | null
            const oldGradient = localStorage.getItem("theme-gradient") as GradientTheme | null
            if (oldPalette || oldGradient) {
              const validPalette = oldPalette && PALETTES.some((p) => p.id === oldPalette) ? oldPalette : "carbon"
              const validGradient = oldGradient && GRADIENTS.some((g) => g.id === oldGradient) ? oldGradient : "sunset"
              return JSON.stringify({
                state: { palette: validPalette, gradient: validGradient },
                version: 0,
              })
            }
            return null
          },
          setItem: (key: string, value: string) => {
            localStorage.setItem(key, value)
          },
          removeItem: (key: string) => {
            localStorage.removeItem(key)
          },
        }
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyDOMTheme(state.palette, state.gradient)
        }
      },
    }
  )
)

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "theme-storage" && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue)
        const state = parsed.state || parsed
        if (state.palette || state.gradient) {
          const validPalette = PALETTES.some((p) => p.id === state.palette) ? state.palette : "carbon"
          const validGradient = GRADIENTS.some((g) => g.id === state.gradient) ? state.gradient : "sunset"
          useThemeStore.setState({ palette: validPalette, gradient: validGradient })
          applyDOMTheme(validPalette, validGradient)
        }
      } catch {
        // Ignore parse error
      }
    }
  })
}
