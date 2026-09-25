import { describe, it, expect, beforeEach } from "bun:test";
import { useBuildPulse } from "../features/build-pulse/hooks/use-build-pulse";

describe("BuildPulse State Management & Autonomous Healing", () => {
  beforeEach(() => {
    useBuildPulse.getState().reset();
  });

  it("initializes with clean idle state", () => {
    const state = useBuildPulse.getState();
    expect(state.runResult).toBeNull();
    expect(state.isHealing).toBe(false);
    expect(state.agentStage).toBe("idle");
    expect(state.patchDiff).toBeNull();
    expect(state.activeScenario).toBe("ts_contract_drift");
  });

  it("triggers scenario failure and isolates diagnostics", async () => {
    await useBuildPulse.getState().triggerBuild("ts_contract_drift");
    const state = useBuildPulse.getState();

    expect(state.runResult).not.toBeNull();
    expect(state.runResult?.exit_code).toBe(1);
    expect(state.agentStage).toBe("error_intercepted");
    expect(state.runResult?.diagnostics.length).toBeGreaterThan(0);
    expect(state.runResult?.diagnostics[0].error_code).toBe("TS2339");
  });

  it("handles scenario switching cleanly", async () => {
    useBuildPulse.getState().setActiveScenario("rust_mismatch");
    expect(useBuildPulse.getState().activeScenario).toBe("rust_mismatch");

    await useBuildPulse.getState().triggerBuild();
    const state = useBuildPulse.getState();

    expect(state.runResult?.diagnostics[0].error_code).toBe("E0308");
  });

  it("executes autonomous heal cycle to green verification", async () => {
    await useBuildPulse.getState().triggerBuild("ts_contract_drift");
    await useBuildPulse.getState().dispatchBobHeal();
    const state = useBuildPulse.getState();

    expect(state.agentStage).toBe("verified_green");
    expect(state.runResult?.exit_code).toBe(0);
    expect(state.runResult?.status).toBe("verified");
    expect(state.patchDiff).not.toBeNull();
    expect(state.patchDiff).toContain("workspaceId");
    expect(state.elapsedRepairMs).toBeGreaterThan(0);
  });
});
