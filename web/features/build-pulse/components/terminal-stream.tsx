import React from "react";
import { BuildRunResult } from "../hooks/use-build-pulse";

interface TerminalStreamProps {
  runResult: BuildRunResult | null;
  isHealing: boolean;
}

export function TerminalStream({ runResult, isHealing }: TerminalStreamProps) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-neutral-800 bg-[#0d1117] text-neutral-200 overflow-hidden shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-neutral-400 font-sans font-medium text-xs">
            Runner Terminal
          </span>
        </div>
        {runResult && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400">
              {runResult.duration_ms}ms
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                runResult.exit_code === 0
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              Exit {runResult.exit_code}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 overflow-y-auto max-h-[380px] leading-relaxed space-y-2">
        {!runResult ? (
          <div className="text-neutral-500 italic py-8 text-center font-sans">
            Ready for trigger. Select a failure scenario to run the live test runner.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-neutral-400 pb-2 border-b border-neutral-800/80">
              <span className="text-cyan-400 font-bold">$</span>
              <span>{runResult.command}</span>
            </div>

            <pre className="whitespace-pre-wrap font-mono text-[11px]">
              {runResult.raw_logs.split("\n").map((line, i) => {
                const isError =
                  line.includes("error") ||
                  line.includes("FAIL") ||
                  line.includes("expected");
                const isSuccess =
                  line.includes("PASSED") ||
                  line.includes("passed") ||
                  line.includes("Finished");

                return (
                  <div
                    key={i}
                    className={`py-0.5 ${
                      isError
                        ? "text-red-400 bg-red-950/20 px-1 rounded -mx-1"
                        : isSuccess
                        ? "text-emerald-400 font-semibold"
                        : "text-neutral-300"
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </pre>

            {runResult.diagnostics.length > 0 && (
              <div className="mt-4 pt-3 border-t border-neutral-800">
                <div className="text-neutral-400 font-sans font-semibold text-[11px] mb-2 uppercase tracking-wider">
                  Parsed AST Diagnostics ({runResult.diagnostics.length})
                </div>
                {runResult.diagnostics.map((diag, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-red-950/30 border border-red-800/40 text-red-200 text-[11px] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-400">
                        {diag.error_code}
                      </span>
                      <span className="text-neutral-400">
                        {diag.file_path}:{diag.line_number}:{diag.column}
                      </span>
                    </div>
                    <div className="text-neutral-200">{diag.message}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isHealing && (
        <div className="px-4 py-2 bg-cyan-950/40 border-t border-cyan-800/50 flex items-center justify-between text-cyan-300 text-xs font-sans animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>IBM Bob 2.0 Autonomous Remediation Loop in progress...</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">MCP ACTIVE</span>
        </div>
      )}
    </div>
  );
}
