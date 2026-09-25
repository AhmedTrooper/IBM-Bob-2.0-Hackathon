# BuildPulse: 3-Minute Video Demonstration Script & Storyboard

**Format:** MP4 Video Demonstration  
**Total Target Runtime:** 2 minutes 45 seconds (165s — comfortably under the 3-minute hard limit)  
**Live Screencast Duration:** **100 continuous seconds** (Exceeds the mandatory 90-second minimum)  
**Narration Tone:** Clear, energetic, professional software engineer tone (natural B1 English).

---

## Storyboard & Timing Breakdown

### Section 1: The Problem (0:00 - 0:25) [25 seconds]
- **Visual:** Screen opens showing a terminal dumping a 200-line red compiler error trace (`error[E0308]: mismatched types` or `TS2339: Property does not exist`), followed by a Git log showing 8 frantic commits like `fix ci`, `try again`, `please work`.
- **Narration:**
  > *"Every software team knows this nightmare: you push a commit, CI fails with a 500-line cryptic stack trace, and your team loses hours digging through compiler logs. Developers spend up to 30% of their day debugging broken builds and waiting on slow CI loops. Existing tools are reactive and dumb—they flag errors, but they can't heal them."*

---

### Section 2: Introducing BuildPulse (0:25 - 0:40) [15 seconds]
- **Visual:** Cut to the clean Next.js BuildPulse Mission Control room (`http://localhost:3000`). Show the live status badges: Rust Axum runner, Tokio async pipeline, and IBM Bob 2.0 MCP Active.
- **Narration:**
  > *"Meet BuildPulse: an autonomous, self-healing build and test repair engine. BuildPulse couples a high-performance Rust runner with IBM Bob 2.0 via the Model Context Protocol to create an active, closed-loop remediation pipeline."*

---

### Section 3: Live Solution in Action (0:40 - 2:20) [100 continuous seconds — Core Demo]

#### Phase A: Deterministic Intercept (0:40 - 1:00) [20s]
- **Visual:** 
  1. Click **"Run Build & Test"** with Scenario A: *TypeScript API Contract Drift*.
  2. The embedded ANSI terminal instantly streams the failure output.
  3. Exit code badge turns bright red: `Exit 1 (Failing)`.
  4. The **Parsed AST Diagnostics** card immediately highlights the exact offending file and line: `src/features/auth/types.ts:18:5` with error code `TS2339`.
- **Narration:**
  > *"Watch this live. A developer updated a shared user contract, but a downstream endpoint still passes the legacy attribute. We hit Run Build. BuildPulse intercepts the non-zero exit code, parses the compiler error AST in sub-milliseconds, and isolates the exact file, line, and failure signature."*

#### Phase B: Autonomous Remediation with IBM Bob 2.0 (1:00 - 1:40) [40s]
- **Visual:**
  1. Click the glowing button: **"Autonomous Heal with Bob"**.
  2. Split-screen: Left side shows IBM Bob IDE in Agent Mode. Bob queries `/build-pulse/mcp` using `tools/call: get_build_failure_context`.
  3. On the BuildPulse Mission Control dashboard, the **Autonomous Remediation Pipeline** tracker animates:
     - `1. Diagnostic Intercept` turns green checkmark.
     - `2. Bob Triage Subagent` pulses cyan: *"Root-cause contextualized via MCP context."*
     - `3. Patch Synthesis` lights up.
  4. The **Surgical Patch Diff** viewer populates in real-time, showing the red `- organizationId` line being replaced with green `+ workspaceId: string`.
- **Narration:**
  > *"Now we dispatch IBM Bob 2.0. Through native Model Context Protocol tools, Bob queries BuildPulse for the exact failure AST without any manual copy-pasting. Bob's triage subagent analyzes repository schemas, isolates the contract drift, and synthesizes a minimal surgical patch without altering surrounding logic."*

#### Phase C: Sandboxed Green Verification (1:40 - 2:20) [40s]
- **Visual:**
  1. Pipeline stage 4: `Sandboxed Verification` turns cyan.
  2. Terminal re-executes `bun test`.
  3. Status badge switches to vibrant green: `Exit 0 (Passing)`.
  4. Top telemetry displays: **Healed in 1.42s • 0 Manual Edits Required**.
  5. Terminal displays: `ALL TESTS PASSED. Build verified green.`
- **Narration:**
  > *"Before writing any commit, Bob calls our second MCP tool: `verify_repair_patch`. BuildPulse runs a sandboxed test in Tokio. All 25 tests pass. Exit code 0 is verified green in just 1.4 seconds with zero manual developer intervention. The broken build is completely healed."*

---

### Section 4: Bobcoin Budget, Architecture & Wrap-Up (2:20 - 2:45) [25 seconds]
- **Visual:** 
  1. Pan over to Bob IDE Settings showing the Task Consumption Summary under the 40 Bobcoins limit.
  2. Quick flash of `/bob_sessions/` containing the saved high-resolution `.png` screenshots.
  3. Close on the architecture diagram showing Rust Axum $\leftrightarrow$ MCP JSON-RPC 2.0 $\leftrightarrow$ IBM Bob 2.0.
- **Narration:**
  > *"Because BuildPulse pre-triages diagnostics locally, each repair consumed minimal Bobcoins, preserving our strict hackathon budget as proven in our recorded `/bob_sessions` summaries. BuildPulse transforms IBM Bob 2.0 into an indispensable engineering partner that eliminates CI downtime and keeps teams shipping."*

---

### Section 5: Outro (2:45 - 2:50) [5 seconds]
- **Visual:** Title card: **BuildPulse • Built with IBM Bob 2.0 • Zero-Downtime Autonomous Remediation**.
- **Narration:**
  > *"BuildPulse: autonomous self-healing for the modern developer."*
