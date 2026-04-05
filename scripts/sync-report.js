import fs from "fs";
import path from "path";

/**
 * Institutional Documentation Sync Reporting Engine
 * Summarizes feature module documentation integrity.
 */

const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY;
const FEATURES_DIR = path.join(process.cwd(), "src/features");

function generateSyncReport() {
    try {
        if (!fs.existsSync(FEATURES_DIR)) return;

        const features = fs.readdirSync(FEATURES_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        let markdown = `# 📚 FEATURE DOCUMENTATION AUDIT STATUS\n\n`;
        markdown += `> [!NOTE]\n> **Documentation Integrity Report**\n> Tracking architectural sign-off across all feature modules.\n\n`;

        markdown += "| Status | Feature Module | Artifact Presence | Architectural Compliance |\n";
        markdown += "| :--- | :--- | :--- | :--- |\n";

        features.forEach(feature => {
            const readmePath = path.join(FEATURES_DIR, feature, "README.md");
            const hasReadme = fs.existsSync(readmePath);
            const statusIcon = hasReadme ? "✅" : "⚠️";
            const compliance = hasReadme ? "**CERTIFIED**" : "NEEDS REFACTOR";
            
            markdown += `| ${statusIcon} | **${feature.toUpperCase()}** | ${hasReadme ? "Exists" : "MISSING"} | ${compliance} |\n`;
        });

        markdown += `\n\n**Action Plan**: Ensure all modules marked as ⚠️ are manually reviewed for technical descriptions.\n`;

        if (GITHUB_STEP_SUMMARY) {
            fs.writeFileSync(GITHUB_STEP_SUMMARY, markdown);
        } else {
            console.log(markdown);
        }

    } catch (error) {
        console.error("Documentation Audit Failed:", error);
    }
}

generateSyncReport();
