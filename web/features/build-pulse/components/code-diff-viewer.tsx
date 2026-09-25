import React from "react";

interface CodeDiffViewerProps {
  diff: string | null;
  fileHint?: string;
}

export function CodeDiffViewer({ diff, fileHint }: CodeDiffViewerProps) {
  if (!diff) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-[#0d1117] p-5 shadow-2xl flex flex-col items-center justify-center min-h-[160px] text-neutral-500 text-xs font-mono">
        <span>No active patch diff. Dispatch heal to inspect surgical repair.</span>
      </div>
    );
  }

  const lines = diff.split("\n");

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d1117] text-neutral-200 overflow-hidden shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">Δ</span>
          <span className="text-neutral-300 font-sans font-medium text-xs">
            Surgical Patch Diff
          </span>
        </div>
        {fileHint && (
          <span className="text-[11px] text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded">
            {fileHint}
          </span>
        )}
      </div>

      <div className="p-3 bg-[#0b0e14] max-h-[180px] overflow-y-auto">
        <pre className="text-[11px] leading-relaxed">
          {lines.map((line, idx) => {
            const isAdd = line.startsWith("+") && !line.startsWith("+++");
            const isDel = line.startsWith("-") && !line.startsWith("---");
            const isHeader = line.startsWith("@@") || line.startsWith("---") || line.startsWith("+++");

            return (
              <div
                key={idx}
                className={`py-0.5 px-2 rounded -mx-1 ${
                  isAdd
                    ? "bg-emerald-950/40 text-emerald-300 font-medium"
                    : isDel
                    ? "bg-red-950/40 text-red-300 line-through opacity-80"
                    : isHeader
                    ? "text-neutral-500 font-bold"
                    : "text-neutral-300"
                }`}
              >
                {line}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
