use super::dto::{BuildRunResult, McpRequest, TriggerBuildRequest};
use super::mcp::{McpHandler, PulseMcpState};
use super::runner::ProcessRunner;
use axum::{
    extract::State,
    response::{IntoResponse, Json},
};
use serde_json::json;

#[derive(Clone, Default)]
pub struct BuildPulseState {
    pub mcp_state: PulseMcpState,
}

pub async fn handle_mcp_rpc(
    State(state): State<BuildPulseState>,
    Json(payload): Json<McpRequest>,
) -> impl IntoResponse {
    let res = McpHandler::handle_rpc(state.mcp_state, payload).await;
    Json(res)
}

pub async fn trigger_build(
    State(state): State<BuildPulseState>,
    Json(payload): Json<TriggerBuildRequest>,
) -> Json<BuildRunResult> {
    let result = match payload.scenario.as_str() {
        "ts_contract_drift" => {
            ProcessRunner::execute_verification("bun", &["--cwd", "web", "test"]).await
        }
        _ => {
            ProcessRunner::execute_verification(
                "cargo",
                &["check", "--manifest-path", "api/Cargo.toml", "--quiet"],
            )
            .await
        }
    };

    if result.exit_code != 0 {
        let mut failure_lock = state.mcp_state.last_failure.write().await;
        *failure_lock = Some(json!({
            "command": result.command,
            "exit_code": result.exit_code,
            "diagnostics": result.diagnostics,
            "raw_logs": result.raw_logs,
            "duration_ms": result.duration_ms
        }));
    }

    Json(result)
}

pub async fn get_pulse_status(State(state): State<BuildPulseState>) -> Json<serde_json::Value> {
    let failure_lock = state.mcp_state.last_failure.read().await;
    let status = failure_lock.clone().unwrap_or_else(|| {
        json!({
            "status": "idle_clean",
            "message": "System operational. No active build failure."
        })
    });
    Json(status)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_pulse_status_clean_default() {
        let state = BuildPulseState::default();
        let status = get_pulse_status(State(state)).await;
        let json_val = serde_json::to_value(&status.0).unwrap();
        assert_eq!(json_val["status"], "idle_clean");
    }
}
