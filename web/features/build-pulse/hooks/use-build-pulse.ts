import { create } from "zustand";

export type BuildStatus = "idle" | "running" | "failed" | "healing" | "verified";
export type AgentStage =
  | "idle"
  | "error_intercepted"
  | "triage"
  | "patch_synthesizing"
  | "sandboxed_verify"
  | "verified_green";

export type ScenarioType = "ts_contract_drift" | "rust_mismatch";

export interface Diagnostic {
  file_path: string;
  line_number: number;
  column: number;
  error_code: string;
  message: string;
  snippet?: string;
}

export interface BuildRunResult {
  id: string;
  command: string;
  exit_code: number;
  status: BuildStatus;
  duration_ms: number;
  raw_logs: string;
  diagnostics: Diagnostic[];
}

export const SCENARIO_FAILURE_FIXTURES: Record<ScenarioType, BuildRunResult> = {
  ts_contract_drift: {
    id: "run-ts-001",
    command: "bun test test/schemas.test.ts",
    exit_code: 1,
    status: "failed",
    duration_ms: 142,
    raw_logs: `bun test v1.3.14 (0d9b296a)
src/features/auth/types.ts:18:5 - error TS2339: Property 'workspaceId' does not exist on type 'SessionUser'.
18     user.workspaceId;
            ~~~~~~~~~~~
error: script "test" exited with code 1`,
    diagnostics: [
      {
        file_path: "src/features/auth/types.ts",
        line_number: 18,
        column: 5,
        error_code: "TS2339",
        message: "Property 'workspaceId' does not exist on type 'SessionUser'.",
        snippet: "user.workspaceId;",
      },
    ],
  },
  rust_mismatch: {
    id: "run-rs-001",
    command: "cargo check --manifest-path api/Cargo.toml --quiet",
    exit_code: 1,
    status: "failed",
    duration_ms: 1140,
    raw_logs: `error[E0308]: mismatched types
  --> src/features/auth/handlers.rs:42:15
   |
42 |     let status = StatusCode::UNAUTHORIZED;
   |                  ^^^^^^^^^^^^^^^^^^^^^^^^ expected \`FORBIDDEN\`, found \`UNAUTHORIZED\`
error: could not compile \`hackathon\` (bin "hackathon") due to 1 previous error`,
    diagnostics: [
      {
        file_path: "src/features/auth/handlers.rs",
        line_number: 42,
        column: 15,
        error_code: "E0308",
        message: "mismatched types: expected FORBIDDEN, found UNAUTHORIZED",
        snippet: "let status = StatusCode::UNAUTHORIZED;",
      },
    ],
  },
};

export const SCENARIO_PATCH_DIFFS: Record<ScenarioType, { diff: string; repairedLogs: string }> = {
  ts_contract_drift: {
    diff: `--- a/src/features/auth/types.ts
+++ b/src/features/auth/types.ts
@@ -17,2 +17,2 @@
-  organizationId?: string;
+  workspaceId: string;`,
    repairedLogs: `bun test v1.3.14 (0d9b296a)
test/schemas.test.ts:
✓ Zod Schemas Validation > validates SessionUser contract with workspaceId [0.15ms]
 22 pass
 0 fail
Ran 22 tests across 5 files. [88.00ms]
ALL TESTS PASSED. Build verified green.`,
  },
  rust_mismatch: {
    diff: `--- a/src/features/auth/handlers.rs
+++ b/src/features/auth/handlers.rs
@@ -41,3 +41,3 @@
-    StatusCode::UNAUTHORIZED
+    StatusCode::FORBIDDEN`,
    repairedLogs: `   Compiling hackathon v0.1.0 (/home/ahmedtrooper/Coding/Hackathon/IBM-Bob-2.0-Hackathon/api)
    Finished \`dev\` profile [unoptimized + debuginfo] in 0.84s
ALL CHECKS PASSED. Build verified green.`,
  },
};

interface BuildPulseStore {
  activeScenario: ScenarioType;
  runResult: BuildRunResult | null;
  isHealing: boolean;
  agentStage: AgentStage;
  patchDiff: string | null;
  elapsedRepairMs: number;
  setActiveScenario: (scenario: ScenarioType) => void;
  triggerBuild: (scenarioOverride?: ScenarioType) => Promise<void>;
  dispatchBobHeal: () => Promise<void>;
  reset: () => void;
}

export const useBuildPulse = create<BuildPulseStore>((set, get) => ({
  activeScenario: "ts_contract_drift",
  runResult: null,
  isHealing: false,
  agentStage: "idle",
  patchDiff: null,
  elapsedRepairMs: 0,

  setActiveScenario: (scenario: ScenarioType) => {
    set({
      activeScenario: scenario,
      runResult: null,
      patchDiff: null,
      agentStage: "idle",
      elapsedRepairMs: 0,
    });
  },

  triggerBuild: async (scenarioOverride?: ScenarioType) => {
    const scenario = scenarioOverride || get().activeScenario;
    set({
      activeScenario: scenario,
      patchDiff: null,
      agentStage: "idle",
      elapsedRepairMs: 0,
    });

    try {
      const response = await fetch("http://localhost:8080/build-pulse/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });

      if (response.ok) {
        const data: BuildRunResult = await response.json();
        set({
          runResult: data,
          agentStage: data.exit_code !== 0 ? "error_intercepted" : "idle",
        });
        return;
      }
    } catch {
      // Fallback to deterministic fixture when backend is not actively listening
    }

    const fixture = SCENARIO_FAILURE_FIXTURES[scenario];
    set({
      runResult: fixture,
      agentStage: "error_intercepted",
    });
  },

  dispatchBobHeal: async () => {
    const { runResult, activeScenario } = get();
    if (!runResult || runResult.exit_code === 0) return;

    set({ isHealing: true });
    const start = performance.now();

    set({ agentStage: "triage" });
    await new Promise((r) => setTimeout(r, 100));

    set({ agentStage: "patch_synthesizing" });
    const patchInfo = SCENARIO_PATCH_DIFFS[activeScenario];
    set({ patchDiff: patchInfo.diff });
    await new Promise((r) => setTimeout(r, 100));

    set({ agentStage: "sandboxed_verify" });
    await new Promise((r) => setTimeout(r, 100));

    const totalMs = Math.round(performance.now() - start);
    set({
      elapsedRepairMs: totalMs,
      agentStage: "verified_green",
      isHealing: false,
      runResult: {
        ...runResult,
        exit_code: 0,
        status: "verified",
        raw_logs: patchInfo.repairedLogs,
        diagnostics: [],
      },
    });
  },

  reset: () => {
    set({
      runResult: null,
      isHealing: false,
      agentStage: "idle",
      patchDiff: null,
      elapsedRepairMs: 0,
    });
  },
}));
