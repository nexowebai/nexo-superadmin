import fs from "fs";
import path from "path";

/**
 * Ultimate Premium ESLint Reporting Engine
 * Layout: Standard High-End Dashboard
 * Constraints: Default Expanded, Same-Row Iconography
 */

const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY;

const rulesWhyItMatters = {
    "no-unused-vars": "Unused code increases bundle size and makes the codebase harder to maintain.",
    "no-console": "Console logs in production may leak sensitive information and clutter the console.",
    "react-hooks/rules-of-hooks": "Breaking hook rules causes unpredictable state and hard-to-debug lifecycle bugs.",
    "react-hooks/exhaustive-deps": "Missing dependencies lead to stale data and subtle reactivity bugs.",
    "react/prop-types": "Without prop-types, components are prone to runtime errors from invalid data.",
    "react-refresh/only-export-components": "Exporting non-components breaks Fast Refresh, slowing development.",
    "no-undef": "Accessing undefined variables causes immediate runtime crashes.",
    "no-extra-semi": "Redundant semicolons add noise without functional benefit.",
    "react/jsx-key": "Missing keys in lists cause performance issues and UI state loss.",
    "max-lines": "Giant files are hard to test and maintain; they violate Single Responsibility.",
    "eqeqeq": "Loose equality (==) leads to coercion bugs; strict equality (===) is safer.",
    "no-constant-condition": "Constant conditions often signify unfinished code or logic errors.",
    "no-debugger": "Debugger statements stop execution in the browser; strictly for dev.",
    "prefer-const": "Using const makes it clear which variables are immutable.",
    "no-var": "var is scoping-poisonous; using let/const prevents hoisting bugs.",
    "no-restricted-syntax": "Institutional restrictions (no async/await) ensure deterministic state flow."
};

const getSeverityStatus = (severity, msg) => {
    const isRestricted = msg.ruleId === "no-restricted-syntax" || msg.message.includes("STRICT VIOLATION");
    
    if (severity === 2) {
        if (isRestricted) return "🔴 **CRITICAL ARCHITECTURE VIOLATION**";
        const highRules = ["hooks", "undef", "no-debugger", "react/jsx-key"];
        if (highRules.some(r => msg.ruleId?.includes(r))) return "🔴 **HIGH SEVERITY ERROR**";
        return "🔶 **MEDIUM PRIORITY ERROR**";
    }
    if (severity === 1) {
        if (isRestricted) return "🛑 **POLICY VIOLATION (WARN)**";
        if (msg.ruleId?.includes("hooks") || msg.ruleId?.includes("undef")) return "🔶 **PRIORITY WARNING**";
        return "🟡 **ADVISORY WARNING**";
    }
    return "⚪ **LOW PRIORITY**";
};

const getWhyItMatters = (ruleId) => {
     for (const key in rulesWhyItMatters) {
        if (ruleId?.includes(key)) return rulesWhyItMatters[key];
     }
     return "Maintaining consistent coding standards ensures long-term codebase health.";
};

async function generateReport() {
    try {
        if (!fs.existsSync("eslint-results.json")) return;

        const results = JSON.parse(fs.readFileSync("eslint-results.json", "utf8"));
        
        let totalIssues = 0;
        let criticalCount = 0;
        let warningCount = 0;
        let fileCount = 0;

        results.forEach(r => {
            if (r.messages.length > 0) {
                fileCount++;
                r.messages.forEach(m => {
                    totalIssues++;
                    if (m.severity === 2 || m.message.includes("STRICT VIOLATION")) criticalCount++;
                    else warningCount++;
                });
            }
        });

        // Dashboard Header
        let markdown = `# 🛡️ NEXO CODE QUALITY GUARD\n\n`;
        
        const healthScore = totalIssues === 0 ? 100 : Math.max(0, 100 - (criticalCount * 10) - (warningCount * 2));
        const statusIcon = healthScore > 90 ? "🟢" : healthScore > 70 ? "🟡" : "🔴";

        markdown += `### 💹 System Health: ${statusIcon} **${healthScore}%**  |  🎯 Issues: **${totalIssues}**  |  📂 Files: **${fileCount}**\n\n`;

        if (totalIssues > 0) {
            markdown += `## 📑 Audit Findings\n\n`;
            markdown += "| Status | Location | Technical Issue | Architectural Context |\n";
            markdown += "| :--- | :--- | :--- | :--- |\n";

            results.forEach(result => {
                if (result.messages.length === 0) return;
                const filePath = path.relative(process.cwd(), result.filePath);
                
                result.messages.forEach(msg => {
                    const sev = getSeverityStatus(msg.severity, msg);
                    const why = getWhyItMatters(msg.ruleId);
                    const ruleLink = msg.ruleId ? `[\`${msg.ruleId}\`](https://eslint.org/docs/rules/${msg.ruleId})` : "General";
                    
                    markdown += `| ${sev} | \`${filePath}:${msg.line}\` | **${msg.message.replace(/\|/g, "\\|")}**<br/>${ruleLink} | ${why} |\n`;
                });
            });

            markdown += `\n\n> [!TIP]\n> **Action Plan**: Prioritize 🔴 Critical items first. Run \`npm run lint:fix\` for automated corrections.\n`;
        } else {
            markdown += `### ✅ Clean Build: Architectural Standards Fully Met.\nYour code adheres to all institutional guardrails. No refactoring required.\n`;
        }

        if (GITHUB_STEP_SUMMARY) {
            fs.writeFileSync(GITHUB_STEP_SUMMARY, markdown);
        } else {
            console.log(markdown);
        }

    } catch (error) {
        console.error("Report Generation Failed:", error);
    }
}

generateReport();
