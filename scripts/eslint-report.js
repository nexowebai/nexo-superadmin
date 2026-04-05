import fs from "fs";
import path from "path";

/**
 * Ultimate Premium ESLint & Integrity Reporting Engine
 * 1. Categorizes by severity into multi-fidelity tables.
 * 2. Scans for institutional file-size guardrails.
 * 3. Never fails the build - only provides high-impact visual feedback in the Dashboard.
 */

const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY;
const SRC_DIR = path.join(process.cwd(), "src");

const rulesWhyItMatters = {
    "no-unused-vars": "Unused code increases bundle size and makes the codebase harder to maintain.",
    "no-console": "Console logs in production may leak sensitive information and clutter the console.",
    "react-hooks/rules-of-hooks": "Breaking hook rules causes unpredictable state and hard-to-debug lifecycle bugs.",
    "react-hooks/exhaustive-deps": "Missing dependencies lead to stale data and subtle reactivity bugs.",
    "no-undef": "Accessing undefined variables causes immediate runtime crashes.",
    "no-restricted-syntax": "Institutional restrictions (no async/await) ensure deterministic state flow.",
    "INTEGRITY_SIZE_CRITICAL": "Giant modules are hard to test, audit, and maintain; they violate architectural separation.",
    "INTEGRITY_SIZE_HIGH": "Large components are more difficult to reason about and share across teams."
};

function getFiles(dir, allFiles = []) {
    if (!fs.existsSync(dir)) return allFiles;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const name = path.join(dir, f);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, allFiles);
        } else if (f.endsWith(".js") || f.endsWith(".jsx")) {
            allFiles.push(name);
        }
    }
    return allFiles;
}

function getCategory(severity, msg) {
    const isRestricted = msg.ruleId === "no-restricted-syntax" || msg.message.includes("STRICT VIOLATION");
    
    if (isRestricted || severity === 2) {
        if (msg.message.includes("async/await") || msg.message.includes("Max 250")) {
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
        const categories = { CRITICAL: [], HIGH: [], MID: [], LOW: [] };
        let totalIssues = 0;
        let fileCount = new Set();

        // 1. Scan for File Size Integrity Guards
        const allFiles = getFiles(SRC_DIR);
        allFiles.forEach(file => {
            const content = fs.readFileSync(file, "utf8");
            const lines = content.split("\n").length;
            const relPath = path.relative(process.cwd(), file);

            if (lines > 250) {
                 categories.CRITICAL.push({
                    file: relPath,
                    line: 1,
                    rule: "INTEGRITY_SIZE_CRITICAL",
                    message: `STRICT VIOLATION: ${relPath} has ${lines} lines (Max 250). Refactor into smaller modules!`,
                    why: rulesWhyItMatters.INTEGRITY_SIZE_CRITICAL,
                    icon: "🔴",
                    category: "CRITICAL"
                 });
                 totalIssues++;
                 fileCount.add(relPath);
            } else if (lines > 150) {
                categories.HIGH.push({
                    file: relPath,
                    line: 1,
                    rule: "INTEGRITY_SIZE_HIGH",
                    message: `SOFT WARNING: ${relPath} is getting large (${lines} lines). Consider refactoring soon.`,
                    why: rulesWhyItMatters.INTEGRITY_SIZE_HIGH,
                    icon: "🛑",
                    category: "HIGH"
                 });
                 totalIssues++;
                 fileCount.add(relPath);
            }
        });

        // 2. Parse ESLint JSON Results
        if (fs.existsSync("eslint-results.json")) {
            const results = JSON.parse(fs.readFileSync("eslint-results.json", "utf8"));
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
        }

        // Dashboard Header
        const healthScore = totalIssues === 0 ? 100 : Math.max(0, 100 - (categories.CRITICAL.length * 15) - (totalIssues * 1));
        const statusIcon = healthScore > 90 ? "🟢" : healthScore > 70 ? "🟡" : "🔴";

        let markdown = `# 🛡️ NEXO PREMIUM COMPLIANCE DASHBOARD\n\n`;
        markdown += `### 💹 System Health: ${statusIcon} **${healthScore.toFixed(1)}%**  |  🎯 Observational Findings: **${totalIssues}**  |  📂 Monitored Files: **${fileCount.size}**\n\n`;

        if (totalIssues === 0) {
            markdown += `### ✅ Clean Build: Architectural Standards Fully Met.\nYour code adheres to all institutional guardrails. No refactoring required.\n`;
        } else {
            const tableGenerator = (title, items) => {
                if (items.length === 0) return "";
                let table = `## ${items[0].icon} ${title} FINDINGS\n\n`;
                table += "| Severity | Location | Technical Observation | Institutional Rationale |\n";
                table += "| :--- | :--- | :--- | :--- |\n";
                items.forEach(item => {
                    const ruleLink = item.rule ? `[\`${item.rule}\`](https://eslint.org/docs/rules/${item.rule})` : "Policy";
                    table += `| **${item.category}** | \`${item.file}:${item.line}\` | **${item.message.replace(/\|/g, "\\|")}**<br/>${ruleLink} | ${item.why} |\n`;
                });
                return table + "\n\n";
            };

            markdown += tableGenerator("CRITICAL ARCHITECTURE", categories.CRITICAL);
            markdown += tableGenerator("HIGH PRIORITY", categories.HIGH);
            markdown += tableGenerator("MEDIUM ADVISORY", categories.MID);
            markdown += tableGenerator("LOW IMPACT", categories.LOW);

            markdown += `\n\n> [!TIP]\n> **Action Plan**: Focus on resolving 🔴 CRITICAL and 🛑 HIGH issues. The CI now acts as a **Non-Blocking Guidance Engine**—enabling delivery while tracking technical debt.\n`;
        }

        if (GITHUB_STEP_SUMMARY) {
            fs.writeFileSync(GITHUB_STEP_SUMMARY, markdown);
        } else {
            console.log(markdown);
        }

    } catch (error) {
        console.error("Compliance Report Generation Failed:", error);
    }
}

generateReport();
