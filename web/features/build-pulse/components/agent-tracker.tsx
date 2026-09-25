import React from "react";
import { AgentStage } from "../hooks/use-build-pulse";

interface AgentTrackerProps {
  stage: AgentStage;
  elapsedMs: number;
}

export function AgentTracker({ stage, elapsedMs }: AgentTrackerProps) {
  const steps = [
    {
      id: "error_intercepted",
      title: "1. Diagnostic Intercept",
      desc: "AST parsed, failure signature isolated",
    },
    {
      id: "triage",
      title: "2. Bob Triage Subagent",
      desc: "Root-cause contextualized via MCP context",
    },
    {
      id: "patch_synthesizing",
      title: "3. Patch Synthesis",
      desc: "Minimal surgical diff generated",
    },
    {
      id: "sandboxed_verify",
      title: "4. Sandboxed Verification",
      desc: "Runner re-tests patch to verify Exit 0",
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (stage === "idle") return "pending";
    if (stage === "verified_green") return "completed";

    const stageOrder = [
      "error_intercepted",
      "triage",
      "patch_synthesizing",
      "sandboxed_verify",
      "verified_green",
    ];
    const currentIndex = stageOrder.indexOf(stage);
    const stepIndex = stageOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d1117] p-5 shadow-2xl flex flex-col justify-between font-sans">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">
              Autonomous Remediation Pipeline
            </h3>
            <p className="text-xs text-neutral-400">
              Closed-loop orchestration powered by IBM Bob 2.0
            </p>
          </div>
          {stage === "verified_green" && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-in fade-in duration-300">
              Healed in {(elapsedMs / 1000).toFixed(2)}s
            </span>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 ${
                  status === "active"
                    ? "border-cyan-500/60 bg-cyan-950/20 shadow-md shadow-cyan-950/50"
                    : status === "completed"
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-neutral-800/80 bg-neutral-900/30 opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {status === "completed" ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      ✓
                    </div>
                  ) : status === "active" ? (
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 text-xs font-bold animate-pulse">
                      ●
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-neutral-700 bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs">
                      ○
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-xs font-semibold ${
                      status === "active"
                        ? "text-cyan-300"
                        : status === "completed"
                        ? "text-emerald-300"
                        : "text-neutral-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
        <span>Protocol: MCP JSON-RPC 2.0</span>
        <span>Manual Edits: 0</span>
      </div>
    </div>
  );
}
