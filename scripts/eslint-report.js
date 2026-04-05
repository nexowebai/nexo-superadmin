import fs from "fs";
import path from "path";

/**
 * Premium ESLint Report Generator for GitHub Action Step Summaries
 * Focuses on Executive UX, Institutional Integrity, and Actionable Intelligence.
 */

const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY;

const rulesWhyItMatters = {
    "no-unused-vars": "Unused code increases bundle size and makes the codebase harder to maintain and reason about.",
    "no-console": "Console logs in production may leak sensitive information and clutter the browser console.",
    "react-hooks/rules-of-hooks": "Breaking hook rules causes unpredictable state and lifecycle bugs that are extremely hard to debug.",
    "react-hooks/exhaustive-deps": "Missing dependencies in hooks lead to stale data and subtle reactivity bugs.",
    "react/prop-types": "Without prop-types or TypeScript, components are prone to runtime errors from missing or invalid data.",
    "react-refresh/only-export-components": "Exporting non-components from a component file breaks Fast Refresh, slowing down development.",
    "no-undef": "Accessing undefined variables causes immediate runtime crashes.",
    "no-extra-semi": "Redundant semicolons add noise to the code without any functional benefit.",
    "react/jsx-key": "Missing keys in lists cause React to re-render more than necessary, leading to performance issues and UI state loss.",
    "max-lines": "Giant files are hard to test, review, and maintain. They usually indicate a violation of the Single Responsibility Principle.",
    "eqeqeq": "Using loose equality (==) leads to unexpected type coercion bugs. Strict equality (===) is safer.",
    "no-constant-condition": "Constant conditions (like `if (true)`) often signify unfinished code or logic errors.",
    "no-debugger": "The debugger statement stops execution in the browser, which is strictly for development only.",
    "prefer-const": "Using const by default makes it clear which variables travel and which are immutable.",
    "no-var": "var is scoping-poisonous; using let/const ensures block-scoping and prevents hoisting bugs.",
    "no-restricted-syntax": "Institutional restrictions (like banning async/await) ensure deterministic state flow across the Super-Admin panel."
};

const getSeverityLabel = (severity, msg) => {
    const isRestricted = msg.ruleId === "no-restricted-syntax" || msg.message.includes("STRICT VIOLATION");
    
    if (severity === 2) {
        if (isRestricted) return "🔴 CRITICAL FAILURE";
        const highRules = ["hooks", "undef", "no-debugger", "react/jsx-key"];
        if (highRules.some(r => msg.ruleId?.includes(r))) return "🔴 HIGH SEVERITY";
        return "🔶 MEDIUM PRIORITY";
    }
    if (severity === 1) {
        if (isRestricted) return "🔴 ARCHITECTURAL VIOLATION (WARN)";
        if (msg.ruleId?.includes("hooks") || msg.ruleId?.includes("undef")) return "🔶 PRIORITY FIX (WARN)";
        return "🟡 ADVISORY";
    }
    return "⚪ LOW";
};

const getWhyItMatters = (ruleId) => {
     for (const key in rulesWhyItMatters) {
        if (ruleId?.includes(key)) return rulesWhyItMatters[key];
     }
     return "Maintaining consistent coding standards ensures long-term codebase health.";
};

async function generateReport() {
    try {
        if (!fs.existsSync("eslint-results.json")) {
            console.error("Results file not found.");
            return;
        }

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

        // 🏆 Executive Dashboard
        let markdown = `# 🛡️ CODE QUALITY INSPECTOR EXECUTIVE SUMMARY\n\n`;
        
        const healthScore = totalIssues === 0 ? 100 : Math.max(0, 100 - (criticalCount * 10) - (warningCount * 2));
        const statusEmoji = healthScore > 90 ? "🟢 EXCELLENT" : healthScore > 70 ? "🟡 STABLE" : "🔴 DEGRADED";

        markdown += `> [!NOTE]\n> **System Integrity Report**\n> Current architectural health: **${healthScore}%** (${statusEmoji})\n\n`;

        markdown += "| Metric | Status |\n";
        markdown += "| :--- | :--- |\n";
        markdown += `| **Total Issues Found** | ${totalIssues} |\n`;
        markdown += `| **Critical Violations** | ${criticalCount} |\n`;
        markdown += `| **Affected Files** | ${fileCount} |\n`;
        markdown += `| **Review Status** | ${totalIssues === 0 ? "✅ APPROVED" : "⚠️ NEEDS REFACTOR"} |\n\n`;

        if (totalIssues > 0) {
            markdown += `## 📋 Detailed Audit Findings\n\n`;
            
            results.forEach(result => {
                if (result.messages.length === 0) return;

                const filePath = path.relative(process.cwd(), result.filePath);
                markdown += `### 📄 \`${filePath}\`\n`;
                markdown += `<details>\n<summary>View ${result.messages.length} issue(s) for this file</summary>\n\n`;
                
                markdown += "| Severity | Line | Issue Description | Why it Matters |\n";
                markdown += "| :--- | :--- | :--- | :--- |\n";
                
                result.messages.forEach(msg => {
                    const sev = getSeverityLabel(msg.severity, msg);
                    const why = getWhyItMatters(msg.ruleId);
                    const ruleLabel = msg.ruleId ? `[\`${msg.ruleId}\`](https://eslint.org/docs/rules/${msg.ruleId})` : "General";
                    
                    markdown += "| " + sev + " | `" + msg.line + "` | **" + msg.message.replace(/\|/g, "\\|") + "**<br/>" + ruleLabel + " | " + why + " |\n";
                });
                
                markdown += "\n</details>\n\n";
            });

            markdown += `## 🚀 Next Steps\n`;
            markdown += `1. **Review Violations**: Prioritize rules marked as \`🔴 CRITICAL\` or \`ARCHITECTURAL VIOLATION\`.\n`;
            markdown += `2. **Auto-Fix**: Run \`npm run lint:fix\` to automatically resolve style-related issues.\n`;
            markdown += `3. **Refactor**: Fragment large files (>150 lines) into smaller, reusable UI components.\n`;
        } else {
            markdown += `## ✅ Perfect Architectural Compliance\n`;
            markdown += `No issues detected. Your code meets all institutional standards for the NEXO Super-Admin platform.\n`;
        }

        if (GITHUB_STEP_SUMMARY) {
            fs.writeFileSync(GITHUB_STEP_SUMMARY, markdown);
        } else {
            console.log(markdown);
        }

    } catch (error) {
        console.error("Audit failure:", error);
    }
}

generateReport();
