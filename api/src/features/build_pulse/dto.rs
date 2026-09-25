use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum BuildStatus {
    Idle,
    Running,
    Failed,
    Healing,
    Verified,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Diagnostic {
    pub file_path: String,
    pub line_number: usize,
    pub column: usize,
    pub error_code: String,
    pub message: String,
    pub snippet: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BuildRunResult {
    pub id: String,
    pub command: String,
    pub exit_code: i32,
    pub status: BuildStatus,
    pub duration_ms: u64,
    pub raw_logs: String,
    pub diagnostics: Vec<Diagnostic>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TriggerBuildRequest {
    pub scenario: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpRequest {
    pub jsonrpc: String,
    pub id: serde_json::Value,
    pub method: String,
    pub params: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpResponse {
    pub jsonrpc: String,
    pub id: serde_json::Value,
    pub result: serde_json::Value,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_build_status_serialization() {
        let status = BuildStatus::Verified;
        let serialized = serde_json::to_string(&status).expect("serialization failed");
        assert_eq!(serialized, "\"verified\"");

        let deserialized: BuildStatus =
            serde_json::from_str("\"failed\"").expect("deserialization failed");
        assert_eq!(deserialized, BuildStatus::Failed);
    }

    #[test]
    fn test_diagnostic_serialization() {
        let diag = Diagnostic {
            file_path: "src/main.rs".to_string(),
            line_number: 42,
            column: 15,
            error_code: "E0308".to_string(),
            message: "mismatched types".to_string(),
            snippet: Some("let x: u32 = \"test\";".to_string()),
        };
        let json = serde_json::to_string(&diag).expect("serialization failed");
        assert!(json.contains("E0308"));
        assert!(json.contains("mismatched types"));

        let roundtrip: Diagnostic = serde_json::from_str(&json).expect("deserialization failed");
        assert_eq!(roundtrip.error_code, "E0308");
        assert_eq!(roundtrip.line_number, 42);
    }

    #[test]
    fn test_mcp_request_deserialization() {
        let payload = r#"{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list",
            "params": {}
        }"#;

        let req: McpRequest = serde_json::from_str(payload).expect("parsing failed");
        assert_eq!(req.jsonrpc, "2.0");
        assert_eq!(req.method, "tools/list");
    }
}
