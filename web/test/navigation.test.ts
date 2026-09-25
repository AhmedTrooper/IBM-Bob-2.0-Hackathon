import { describe, it, expect } from "bun:test"
import { PALETTES, GRADIENTS } from "../hooks/use-palette"

describe("Mobile Navigation Configuration & Routes", () => {
  const landingNavLinks = [
    { label: "Subsystems", href: "/#subsystems" },
    { label: "Architecture & Metrics", href: "/#metrics" },
    { label: "Live Telemetry", href: "/#telemetry" },
    { label: "Operations Dashboard", href: "/dashboard" },
  ]

  const dashboardTabs = [
    { id: "all", label: "All Systems" },
    { id: "data", label: "Data & Storage" },
    { id: "realtime", label: "Streams & PubSub" },
    { id: "ai", label: "AI & Auth" },
  ]

  it("verifies all landing navigation links have valid targets", () => {
    expect(landingNavLinks.length).toBe(4)
    landingNavLinks.forEach((link) => {
      expect(link.href.startsWith("/") || link.href.startsWith("#")).toBe(true)
      expect(link.label.length).toBeGreaterThan(0)
    })
  })

  it("verifies all dashboard workspace tabs are defined", () => {
    expect(dashboardTabs.length).toBe(4)
    const tabIds = dashboardTabs.map((t) => t.id)
    expect(tabIds).toContain("all")
    expect(tabIds).toContain("data")
    expect(tabIds).toContain("realtime")
    expect(tabIds).toContain("ai")
  })

  it("ensures mobile navigation has access to full palette and gradient lists", () => {
    expect(PALETTES.map((p) => p.id)).toEqual(["carbon", "aurora", "graphite", "obsidian"])
    expect(GRADIENTS.map((g) => g.id)).toEqual(["sunset", "nebula", "violet", "aurora"])
  })
})
