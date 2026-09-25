use axum::{
    body::{Body, to_bytes},
    http::{Request, StatusCode},
};
use hackathon::features::build_pulse;
use serde_json::json;
use tower::ServiceExt;

#[tokio::test]
async fn test_mcp_tools_list_endpoint() {
    let app = build_pulse::router();

    let payload = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/list",
        "params": {}
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/build-pulse/mcp")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let bytes = to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body: serde_json::Value = serde_json::from_slice(&bytes).unwrap();

    assert_eq!(body["jsonrpc"], "2.0");
    assert_eq!(body["id"], 1);

    let tools = body["result"]["tools"]
        .as_array()
        .expect("tools list array");
    assert_eq!(tools.len(), 2);

    let tool_names: Vec<&str> = tools.iter().map(|t| t["name"].as_str().unwrap()).collect();
    assert!(tool_names.contains(&"get_build_failure_context"));
    assert!(tool_names.contains(&"verify_repair_patch"));
}

#[tokio::test]
async fn test_mcp_get_build_failure_context_clean() {
    let app = build_pulse::router();

    let payload = json!({
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/call",
        "params": {
            "name": "get_build_failure_context"
        }
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/build-pulse/mcp")
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let bytes = to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body: serde_json::Value = serde_json::from_slice(&bytes).unwrap();

    let content_text = body["result"]["content"][0]["text"]
        .as_str()
        .expect("text content");
    assert!(content_text.contains("clean"));
}

#[tokio::test]
async fn test_pulse_status_endpoint() {
    let app = build_pulse::router();

    let response = app
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/build-pulse/status")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let bytes = to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let body: serde_json::Value = serde_json::from_slice(&bytes).unwrap();

    assert_eq!(body["status"], "idle_clean");
}
