import { describe, it, expect } from "bun:test"
import { useThemeStore } from "../lib/theme-store"
import { setPalette, setGradient, PALETTES, GRADIENTS } from "../hooks/use-palette"

describe("Zustand Theme Store & Persistence", () => {
  it("defaults to Deep Carbon palette and Solar Flame gradient", () => {
    const state = useThemeStore.getState()
    expect(state.palette).toBe("carbon")
    expect(state.gradient).toBe("sunset")
  })

  it("exposes valid palette and gradient option lists with carbon and sunset first", () => {
    expect(PALETTES.length).toBeGreaterThanOrEqual(4)
    expect(GRADIENTS.length).toBeGreaterThanOrEqual(4)
    expect(PALETTES[0].id).toBe("carbon")
    expect(GRADIENTS[0].id).toBe("sunset")
  })

  it("updates palette and gradient state in Zustand store cleanly", () => {
    setPalette("aurora")
    expect(useThemeStore.getState().palette).toBe("aurora")

    setGradient("nebula")
    expect(useThemeStore.getState().gradient).toBe("nebula")

    // Revert back to canonical defaults (carbon + sunset)
    setPalette("carbon")
    setGradient("sunset")
    expect(useThemeStore.getState().palette).toBe("carbon")
    expect(useThemeStore.getState().gradient).toBe("sunset")
  })
})
