pub mod diagnostics;
pub mod dto;
pub mod handlers;
pub mod mcp;
pub mod runner;

use axum::{
    Router,
    routing::{get, post},
};
use handlers::{BuildPulseState, get_pulse_status, handle_mcp_rpc, trigger_build};

pub fn router() -> Router {
    let state = BuildPulseState::default();

    Router::new()
        .route("/build-pulse/trigger", post(trigger_build))
        .route("/build-pulse/mcp", post(handle_mcp_rpc))
        .route("/build-pulse/status", get(get_pulse_status))
        .with_state(state)
}
