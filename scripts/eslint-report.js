import fs from "fs";
import path from "path";

/**
 * Ultimate Premium ESLint Reporting Engine
 * Categorized by severity into multiple high-fidelity tables.
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
    "no-restricted-syntax": "Institutional restrictions ensure deterministic state flow."
};

function getCategory(severity, msg) {
    const isRestricted = msg.ruleId === "no-restricted-syntax" || msg.message.includes("STRICT VIOLATION");
    
    if (isRestricted || severity === 2) {
        if (msg.message.includes("async/await") || msg.message.includes("Max 150")) {
            return "CRITICAL";
        }
        return "HIGH";
    }
    
    if (msg.ruleId?.includes("hooks") || msg.ruleId?.includes("undef") || msg.ruleId?.includes("props")) {
        return "MID";
    }
    
    return "LOW";
}

function getSeverityIcon(category) {
    switch (category) {
        case "CRITICAL": return "🔴";
        case "HIGH": return "🛑";
        case "MID": return "🔶";
        case "LOW": return "🟡";
        default: return "⚪";
    }
}

function getWhyItMatters(ruleId) {
     for (const key in rulesWhyItMatters) {
        if (ruleId?.includes(key)) return rulesWhyItMatters[key];
     }
     return "Maintaining consistent coding standards ensures long-term codebase health.";
}

async function generateReport() {
    try {
        if (!fs.existsSync("eslint-results.json")) return;

        const results = JSON.parse(fs.readFileSync("eslint-results.json", "utf8"));
        
        const categories = {
            CRITICAL: [],
            HIGH: [],
            MID: [],
            LOW: []
        };

        let totalIssues = 0;
        let fileCount = new Set();

        results.forEach(result => {
            if (result.messages.length === 0) return;
            const filePath = path.relative(process.cwd(), result.filePath);
            fileCount.add(filePath);

            result.messages.forEach(msg => {
                totalIssues++;
                const category = getCategory(msg.severity, msg);
                categories[category].push({
                    file: filePath,
                    line: msg.line,
                    rule: msg.ruleId,
                    message: msg.message,
                    why: getWhyItMatters(msg.ruleId),
                    icon: getSeverityIcon(category),
                    category
                });
            });
        });

        // Calculate Header Stats
        const criticalCount = categories.CRITICAL.length;
        const warningCount = categories.HIGH.length + categories.MID.length + categories.LOW.length;
        const healthScore = totalIssues === 0 ? 100 : Math.max(0, 100 - (criticalCount * 12) - (warningCount * 1.5));
        const statusIcon = healthScore > 90 ? "🟢" : healthScore > 70 ? "🟡" : "🔴";

        // Dashboard Header
        let markdown = `# 🛡️ NEXO PREMIUM COMPLIANCE DASHBOARD\n\n`;
        markdown += `### 💹 System Health: ${statusIcon} **${healthScore.toFixed(1)}%**  |  🎯 Issues: **${totalIssues}**  |  📂 Affected Files: **${fileCount.size}**\n\n`;

        if (totalIssues === 0) {
            markdown += `### ✅ Clean Build: Architectural Standards Fully Met.\nYour code adheres to all institutional guardrails. No refactoring required.\n`;
        } else {
            const tableGenerator = (title, items) => {
                if (items.length === 0) return "";
                let tableHeader = `## ${items[0].icon} ${title} FINDINGS\n\n`;
                tableHeader += "| Severity | Location | Technical Violation | Institutional Rationale |\n";
                tableHeader += "| :--- | :--- | :--- | :--- |\n";
                
                items.forEach(item => {
                    const ruleLink = item.rule ? `[\`${item.rule}\`](https://eslint.org/docs/rules/${item.rule})` : "Policy";
                    tableHeader += `| **${item.category}** | \`${item.file}:${item.line}\` | **${item.message.replace(/\|/g, "\\|")}**<br/>${ruleLink} | ${item.why} |\n`;
                });
                return tableHeader + "\n\n";
            };

            markdown += tableGenerator("CRITICAL ARCHITECTURE", categories.CRITICAL);
            markdown += tableGenerator("HIGH PRIORITY", categories.HIGH);
            markdown += tableGenerator("MEDIUM ADVISORY", categories.MID);
            markdown += tableGenerator("LOW IMPACT", categories.LOW);

            markdown += `\n\n> [!TIP]\n> **Action Plan**: Focus on resolving 🔴 CRITICAL and 🛑 HIGH issues prior to merge. Run \`npm run lint:fix\` for automated compliance.\n`;
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
