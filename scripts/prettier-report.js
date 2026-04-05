import fs from "fs";
import path from "path";

/**
 * Premium Prettier Aesthetic Audit Engine
 * Summarizes files formatted during the automation phase.
 */

const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY;
const OUTPUT_FILE = "prettier-output.txt";

function generatePrettierReport() {
    try {
        if (!fs.existsSync(OUTPUT_FILE)) {
             console.warn("Prettier scan data not found.");
             return;
        }

        const rawOutput = fs.readFileSync(OUTPUT_FILE, "utf8");
        const formattedFiles = rawOutput
            .split("\n")
            .map(line => line.trim())
            .filter(line => line && !line.includes("formatted") && !line.includes("prettier"));

        let markdown = `# ✨ PRETTIER AESTHETIC AUDIT\n\n`;
        markdown += `> [!TIP]\n> **Stylistic Compliance Active**\n> Institutional-grade visual standards enforced across the codebase.\n\n`;

        if (formattedFiles.length > 0) {
            markdown += `### 📂 Formatted Artifacts: **${formattedFiles.length}**\n\n`;
            markdown += "| Impact Status | File Corrected | Context |\n";
            markdown += "| :--- | :--- | :--- |\n";

            formattedFiles.forEach(file => {
                const ext = path.extname(file).toUpperCase();
                markdown += `| ✅ FIXED | \`${file}\` | Automated ${ext} alignment |\n`;
            });

            markdown += `\n\n**Outcome**: The files listed above were out of stylistic alignment and have been corrected to match the project's visual identity.\n`;
        } else {
            markdown += `### ✅ 100% Aesthetic Alignment\nNo stylistic deviations were found. All files are perfectly formatted.\n`;
        }

        if (GITHUB_STEP_SUMMARY) {
            fs.writeFileSync(GITHUB_STEP_SUMMARY, markdown);
        } else {
            console.log(markdown);
        }

    } catch (error) {
        console.error("Aesthetic Audit Failed:", error);
    }
}

generatePrettierReport();
