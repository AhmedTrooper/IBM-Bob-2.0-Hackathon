"use client"

import {
  useThemeStore,
  PALETTES,
  GRADIENTS,
  type Palette,
  type GradientTheme,
  type PaletteOption,
  type GradientOption,
} from "@/lib/theme-store"

export { PALETTES, GRADIENTS, useThemeStore }
export type { Palette, GradientTheme, PaletteOption, GradientOption }

export function setPalette(palette: Palette) {
  useThemeStore.getState().setPalette(palette)
}

export function setGradient(gradient: GradientTheme) {
  useThemeStore.getState().setGradient(gradient)
}

export function usePalette() {
  const palette = useThemeStore((s) => s.palette)
  const setPaletteStore = useThemeStore((s) => s.setPalette)
  const gradient = useThemeStore((s) => s.gradient)
  const setGradientStore = useThemeStore((s) => s.setGradient)

  return {
    palette,
    setPalette: setPaletteStore,
    gradient,
    setGradient: setGradientStore,
  }
}
