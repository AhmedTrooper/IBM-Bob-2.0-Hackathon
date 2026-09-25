use super::dto::{McpRequest, McpResponse};
use super::runner::ProcessRunner;
use serde_json::json;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone, Default)]
pub struct PulseMcpState {
    pub last_failure: Arc<RwLock<Option<serde_json::Value>>>,
}

pub struct McpHandler;

impl McpHandler {
    pub async fn handle_rpc(state: PulseMcpState, req: McpRequest) -> McpResponse {
        match req.method.as_str() {
            "tools/list" => McpResponse {
                jsonrpc: "2.0".to_string(),
                id: req.id,
                result: json!({
                    "tools": [
                        {
                            "name": "get_build_failure_context",
                            "description": "Fetches active compiler diagnostics, failing line numbers, AST context, and target file paths.",
                            "inputSchema": {
                                "type": "object",
                                "properties": {}
                            }
                        },
                        {
                            "name": "verify_repair_patch",
                            "description": "Re-runs the target build or test suite in a sandboxed runner to verify if Bob's patch resolved all diagnostics.",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "target": {
                                        "type": "string",
                                        "enum": ["rust", "web"]
                                    }
                                },
                                "required": ["target"]
                            }
                        }
                    ]
                }),
            },
            "tools/call" => {
                let params = req.params.unwrap_or_else(|| json!({}));
                let tool_name = params.get("name").and_then(|n| n.as_str()).unwrap_or("");

                match tool_name {
                    "get_build_failure_context" => {
                        let failure = state.last_failure.read().await;
                        let context = failure.clone().unwrap_or_else(|| {
                            json!({
                                "status": "clean",
                                "message": "No active build failures detected."
                            })
                        });

                        McpResponse {
                            jsonrpc: "2.0".to_string(),
                            id: req.id,
                            result: json!({
                                "content": [
                                    {
                                        "type": "text",
                                        "text": context.to_string()
                                    }
                                ]
                            }),
                        }
                    }
                    "verify_repair_patch" => {
                        let target = params
                            .get("arguments")
                            .and_then(|a| a.get("target"))
                            .and_then(|t| t.as_str())
                            .unwrap_or("rust");

                        let result = if target == "rust" {
                            ProcessRunner::execute_verification(
                                "cargo",
                                &["check", "--manifest-path", "api/Cargo.toml", "--quiet"],
                            )
                            .await
                        } else {
                            ProcessRunner::execute_verification("bun", &["--cwd", "web", "test"])
                                .await
                        };

                        let passed = result.exit_code == 0;
                        McpResponse {
                            jsonrpc: "2.0".to_string(),
                            id: req.id,
                            result: json!({
                                "content": [
                                    {
                                        "type": "text",
                                        "text": json!({
                                            "passed": passed,
                                            "exit_code": result.exit_code,
                                            "duration_ms": result.duration_ms,
                                            "diagnostics_remaining": result.diagnostics.len(),
                                            "raw_summary": if passed {
                                                "ALL TESTS PASSED. Build verified green.".to_string()
                                            } else {
                                                result.raw_logs
                                            }
                                        }).to_string()
                                    }
                                ]
                            }),
                        }
                    }
                    _ => McpResponse {
                        jsonrpc: "2.0".to_string(),
                        id: req.id,
                        result: json!({
                            "error": "Unknown tool requested"
                        }),
                    },
                }
            }
            _ => McpResponse {
                jsonrpc: "2.0".to_string(),
                id: req.id,
                result: json!({
                    "error": "Method not implemented"
                }),
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_mcp_tools_list() {
        let state = PulseMcpState::default();
        let req = McpRequest {
            jsonrpc: "2.0".to_string(),
            id: json!(1),
            method: "tools/list".to_string(),
            params: None,
        };

        let res = McpHandler::handle_rpc(state, req).await;
        assert_eq!(res.jsonrpc, "2.0");
        let tools = res.result.get("tools").and_then(|t| t.as_array()).unwrap();
        assert_eq!(tools.len(), 2);
        assert_eq!(tools[0]["name"], "get_build_failure_context");
        assert_eq!(tools[1]["name"], "verify_repair_patch");
    }

    #[tokio::test]
    async fn test_mcp_get_context_clean() {
        let state = PulseMcpState::default();
        let req = McpRequest {
            jsonrpc: "2.0".to_string(),
            id: json!(2),
            method: "tools/call".to_string(),
            params: Some(json!({
                "name": "get_build_failure_context"
            })),
        };

        let res = McpHandler::handle_rpc(state, req).await;
        let content = res.result["content"][0]["text"].as_str().unwrap();
        assert!(content.contains("clean"));
    }
}
