use super::diagnostics::DiagnosticParser;
use super::dto::{BuildRunResult, BuildStatus};
use std::time::Instant;
use tokio::process::Command;
use uuid::Uuid;

pub struct ProcessRunner;

impl ProcessRunner {
    pub async fn execute_verification(command: &str, args: &[&str]) -> BuildRunResult {
        let start = Instant::now();
        let run_id = Uuid::new_v4().to_string();

        let output = Command::new(command).args(args).output().await;
        let duration_ms = start.elapsed().as_millis() as u64;

        match output {
            Ok(out) => {
                let stdout = String::from_utf8_lossy(&out.stdout).to_string();
                let stderr = String::from_utf8_lossy(&out.stderr).to_string();
                let combined = format!("{}\n{}", stdout, stderr);
                let exit_code = out.status.code().unwrap_or(-1);

                let diagnostics = if exit_code != 0 {
                    if command.contains("cargo") {
                        DiagnosticParser::parse_rust_errors(&combined)
                    } else {
                        DiagnosticParser::parse_typescript_errors(&combined)
                    }
                } else {
                    Vec::new()
                };

                let status = if exit_code == 0 {
                    BuildStatus::Verified
                } else {
                    BuildStatus::Failed
                };

                BuildRunResult {
                    id: run_id,
                    command: format!("{} {}", command, args.join(" ")),
                    exit_code,
                    status,
                    duration_ms,
                    raw_logs: combined,
                    diagnostics,
                }
            }
            Err(e) => BuildRunResult {
                id: run_id,
                command: format!("{} {}", command, args.join(" ")),
                exit_code: -1,
                status: BuildStatus::Failed,
                duration_ms,
                raw_logs: format!("Failed to spawn runner process: {}", e),
                diagnostics: Vec::new(),
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_process_runner_successful_execution() {
        let result = ProcessRunner::execute_verification("cargo", &["--version"]).await;
        assert_eq!(result.exit_code, 0);
        assert_eq!(result.status, BuildStatus::Verified);
        assert!(result.raw_logs.contains("cargo"));
        assert!(result.diagnostics.is_empty());
    }
}
