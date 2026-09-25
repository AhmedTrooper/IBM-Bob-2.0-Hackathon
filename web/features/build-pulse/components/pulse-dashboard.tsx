"use client";

import React from "react";
import { useBuildPulse, ScenarioType } from "../hooks/use-build-pulse";
import { TerminalStream } from "./terminal-stream";
import { AgentTracker } from "./agent-tracker";
import { CodeDiffViewer } from "./code-diff-viewer";

export function PulseDashboard() {
  const {
    activeScenario,
    setActiveScenario,
    runResult,
    isHealing,
    agentStage,
    patchDiff,
    elapsedRepairMs,
    triggerBuild,
    dispatchBobHeal,
    reset,
  } = useBuildPulse();

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sc = e.target.value as ScenarioType;
    setActiveScenario(sc);
    reset();
  };

  const isFailed = runResult && runResult.exit_code !== 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-neutral-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              BuildPulse
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              IBM Bob 2.0 Engine
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700">
              MCP v2.0
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Autonomic closed-loop build triage, AST diagnostics extraction, and self-healing verification
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={activeScenario}
            onChange={handleScenarioChange}
            aria-label="Select Failure Scenario"
            className="px-3 py-2 rounded-xl text-xs bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="ts_contract_drift">
              Scenario A: TS API Contract Drift (TS2339)
            </option>
            <option value="rust_mismatch">
              Scenario B: Rust Status Code Regression (E0308)
            </option>
          </select>

          <button
            onClick={() => triggerBuild()}
            disabled={isHealing}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all cursor-pointer disabled:opacity-50"
          >
            Run Build & Test
          </button>

          <button
            onClick={dispatchBobHeal}
            disabled={!isFailed || isHealing}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isFailed && !isHealing
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:opacity-95 animate-pulse"
                : "bg-neutral-800/60 text-neutral-500 border border-neutral-800 cursor-not-allowed"
            }`}
          >
            <span>Autonomous Heal with Bob</span>
            {isFailed && !isHealing && <span>→</span>}
          </button>

          {runResult && (
            <button
              onClick={reset}
              className="px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
          <div className="text-[11px] font-medium text-neutral-400">Exit Status</div>
          <div className="text-lg font-bold mt-1">
            {!runResult ? (
              <span className="text-neutral-500">Idle</span>
            ) : runResult.exit_code === 0 ? (
              <span className="text-emerald-400">Exit 0 (Passing)</span>
            ) : (
              <span className="text-red-400">Exit {runResult.exit_code} (Failing)</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
          <div className="text-[11px] font-medium text-neutral-400">AST Diagnostics</div>
          <div className="text-lg font-bold mt-1">
            {!runResult ? (
              <span className="text-neutral-500">0</span>
            ) : runResult.diagnostics.length > 0 ? (
              <span className="text-amber-400">{runResult.diagnostics.length} Active</span>
            ) : (
              <span className="text-emerald-400">0 Clean</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
          <div className="text-[11px] font-medium text-neutral-400">Healing Duration</div>
          <div className="text-lg font-bold mt-1">
            {elapsedRepairMs > 0 ? (
              <span className="text-cyan-400">{(elapsedRepairMs / 1000).toFixed(2)}s</span>
            ) : isHealing ? (
              <span className="text-cyan-400 animate-pulse">Running...</span>
            ) : (
              <span className="text-neutral-500">--</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
          <div className="text-[11px] font-medium text-neutral-400">Protocol State</div>
          <div className="text-lg font-bold mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-neutral-200 text-sm">MCP Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-full">
          <TerminalStream runResult={runResult} isHealing={isHealing} />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <AgentTracker stage={agentStage} elapsedMs={elapsedRepairMs} />
          <CodeDiffViewer
            diff={patchDiff}
            fileHint={
              activeScenario === "ts_contract_drift"
                ? "src/features/auth/types.ts"
                : "src/features/auth/handlers.rs"
            }
          />
        </div>
      </div>
    </div>
  );
}
