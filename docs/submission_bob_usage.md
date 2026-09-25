# IBM Bob 2.0 Usage Statement: BuildPulse

**Project Title:** BuildPulse: Autonomous Self-Healing Build & Test Repair Engine  
**Word Count:** ~410 words (Strictly under 500-word limit)

---

### Core Integration: IBM Bob 2.0 as the Autonomous Remediation Engine
Rather than using IBM Bob 2.0 as a passive autocomplete assistant, **BuildPulse** positions Bob 2.0 at the absolute core of an active, autonomous closed-loop developer workflow. We leveraged Bob’s full multi-step capabilities—**Agent Mode, native Model Context Protocol (MCP) integration, subagents, and custom rules (`AGENTS.md`)**—to diagnose compiler failures, write surgical patches, and verify builds in real time.

### How and Where IBM Bob Was Utilized

1. **Native Model Context Protocol (MCP) Connection:**
   We built a native Rust MCP server inside our Axum backend (`http://localhost:8080/build-pulse/mcp`). When configured in Bob IDE, Bob automatically connects using JSON-RPC 2.0 and discovers two custom tools:
   - `get_build_failure_context`: Fetches live compiler error ASTs, line numbers, error codes (`E0308`, `TS2339`), and stdout/stderr dumps.
   - `verify_repair_patch`: Spawns a sandboxed subprocess (`cargo check` or `bun test`) to verify if Bob's proposed patch restores the build to exit code 0.

2. **Agent Mode & Subagent Coordination:**
   Using Bob’s Agent Mode guided by our repository’s `AGENTS.md`, Bob autonomously executes a strict three-phase remediation protocol without manual prompting:
   - **Triage Phase (`@triage-agent`):** Ingests compiler diagnostic ASTs via MCP, scans full repository context, and isolates root-cause contract drift across backend and frontend layers.
   - **Patch Phase (`@patch-agent`):** Applies the minimal, surgical diff to resolve the error without refactoring surrounding logic or introducing regressions.
   - **Verification Phase:** Automatically invokes `verify_repair_patch` through MCP, checks the runner output, and iterates if any diagnostic remains.

3. **Context Mentions & Repository Understanding:**
   Bob’s deep repository understanding allowed it to trace type relationships across vertical slices—such as cross-referencing Rust DTOs in `api/src/features/` with TypeScript Zod schemas in `web/lib/schemas.ts`—instantly resolving breaking schema changes.

4. **Task Session Monitoring & Token Budget Discipline:**
   Every repair loop was tracked via Bob IDE’s Task Manager. We structured our workflows to maximize token efficiency under the hackathon's 40 Bobcoins budget, capturing detailed task session summary screenshots (`/bob_sessions/`) showing exact token consumption, tool invocations, and duration metrics.

### Summary
IBM Bob 2.0 was not just a tool used during development; **Bob is the intelligent brain of BuildPulse itself**. By connecting Bob to real-time build telemetry via MCP, we proved that Bob 2.0 can autonomously unblock developer velocity with complete safety and verified execution.
