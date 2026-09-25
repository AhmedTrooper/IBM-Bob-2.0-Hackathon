use super::dto::Diagnostic;
use regex::Regex;

pub struct DiagnosticParser;

impl DiagnosticParser {
    pub fn parse_rust_errors(raw_logs: &str) -> Vec<Diagnostic> {
        let mut diagnostics = Vec::new();
        let pattern = r"error(?:\[(?P<code>E\d+)\])?: (?P<msg>[^\n]+)\n\s+-->\s+(?P<file>[^:]+):(?P<line>\d+):(?P<col>\d+)";
        if let Ok(re) = Regex::new(pattern) {
            for cap in re.captures_iter(raw_logs) {
                diagnostics.push(Diagnostic {
                    error_code: cap
                        .name("code")
                        .map(|m| m.as_str().to_string())
                        .unwrap_or_else(|| "COMPILER_ERR".to_string()),
                    message: cap["msg"].trim().to_string(),
                    file_path: cap["file"].trim().to_string(),
                    line_number: cap["line"].parse().unwrap_or(0),
                    column: cap["col"].parse().unwrap_or(0),
                    snippet: None,
                });
            }
        }
        diagnostics
    }

    pub fn parse_typescript_errors(raw_logs: &str) -> Vec<Diagnostic> {
        let mut diagnostics = Vec::new();

        let pattern_tsc = r"(?P<file>[^:\n]+):(?P<line>\d+):(?P<col>\d+)\s+-\s+error\s+(?P<code>TS\d+):\s+(?P<msg>[^\n]+)";
        if let Ok(re) = Regex::new(pattern_tsc) {
            for cap in re.captures_iter(raw_logs) {
                diagnostics.push(Diagnostic {
                    error_code: cap["code"].to_string(),
                    message: cap["msg"].trim().to_string(),
                    file_path: cap["file"].trim().to_string(),
                    line_number: cap["line"].parse().unwrap_or(0),
                    column: cap["col"].parse().unwrap_or(0),
                    snippet: None,
                });
            }
        }

        if diagnostics.is_empty() {
            let pattern_bun =
                r"error: (?P<msg>[^\n]+)\n\s+at\s+(?P<file>[^:\n]+):(?P<line>\d+):(?P<col>\d+)";
            if let Ok(re) = Regex::new(pattern_bun) {
                for cap in re.captures_iter(raw_logs) {
                    diagnostics.push(Diagnostic {
                        error_code: "TS_ERR".to_string(),
                        message: cap["msg"].trim().to_string(),
                        file_path: cap["file"].trim().to_string(),
                        line_number: cap["line"].parse().unwrap_or(0),
                        column: cap["col"].parse().unwrap_or(0),
                        snippet: None,
                    });
                }
            }
        }

        diagnostics
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_rust_error_log() {
        let sample_log = r#"
   Compiling hackathon v0.1.0 (/home/ahmedtrooper/Coding/Hackathon/IBM-Bob-2.0-Hackathon/api)
error[E0308]: mismatched types
  --> src/features/auth/handlers.rs:42:15
   |
42 |     let token: String = 12345;
   |                ------   ^^^^^ expected `String`, found integer
        "#;

        let diagnostics = DiagnosticParser::parse_rust_errors(sample_log);
        assert_eq!(diagnostics.len(), 1);
        assert_eq!(diagnostics[0].error_code, "E0308");
        assert_eq!(diagnostics[0].file_path, "src/features/auth/handlers.rs");
        assert_eq!(diagnostics[0].line_number, 42);
        assert_eq!(diagnostics[0].column, 15);
        assert_eq!(diagnostics[0].message, "mismatched types");
    }

    #[test]
    fn test_parse_typescript_tsc_error_log() {
        let sample_log = r#"
src/features/auth/types.ts:18:5 - error TS2339: Property 'workspaceId' does not exist on type 'SessionUser'.
18     user.workspaceId;
            ~~~~~~~~~~~
        "#;

        let diagnostics = DiagnosticParser::parse_typescript_errors(sample_log);
        assert_eq!(diagnostics.len(), 1);
        assert_eq!(diagnostics[0].error_code, "TS2339");
        assert_eq!(diagnostics[0].file_path, "src/features/auth/types.ts");
        assert_eq!(diagnostics[0].line_number, 18);
        assert_eq!(diagnostics[0].column, 5);
        assert!(diagnostics[0].message.contains("workspaceId"));
    }
}
