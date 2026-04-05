import fs from "fs";
import path from "path";

/**
 * High-Performance Bundle Analysis Engine
 * Reports on build size and performance metrics.
 */

const GITHUB_STEP_SUMMARY = process.env.GITHUB_STEP_SUMMARY;
const DIST_DIR = path.join(process.cwd(), "dist");

function getFiles(dir, allFiles = []) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const name = path.join(dir, f);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, allFiles);
        } else {
            allFiles.push(name);
        }
    }
    return allFiles;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateBundleReport() {
    try {
        if (!fs.existsSync(DIST_DIR)) {
            console.warn("Distribution folder not found.");
            return;
        }

        const files = getFiles(DIST_DIR);
        let totalSize = 0;
        const processed = files.map(file => {
            const stats = fs.statSync(file);
            totalSize += stats.size;
            return {
                name: path.relative(DIST_DIR, file),
                size: stats.size,
                type: path.extname(file)
            };
        }).sort((a, b) => b.size - a.size).slice(0, 15);

        let markdown = `# 📦 BUNDLE PERFORMANCE INSIGHTS\n\n`;
        markdown += `> [!IMPORTANT]\n> **Production Efficiency Report**\n> Tracking institutional-grade performance and bundle weight.\n\n`;

        markdown += `### 💹 Total Compressed Volume: **${formatBytes(totalSize)}**\n\n`;

        markdown += "## 📂 Top Impact Artifacts\n\n";
        markdown += "| Efficiency Rank | File Name | Volume | Category |\n";
        markdown += "| :--- | :--- | :--- | :--- |\n";

        processed.forEach((file, idx) => {
            const icon = file.size > 500000 ? "🔴" : file.size > 200000 ? "🟡" : "🟢";
            markdown += `| ${icon} **#${idx + 1}** | \`${file.name}\` | **${formatBytes(file.size)}** | ${file.type.toUpperCase()} |\n`;
        });

        markdown += `\n\n**Performance Strategy**: Review 🔴 modules for potential code-splitting or dependency optimization.\n`;

        if (GITHUB_STEP_SUMMARY) {
            fs.writeFileSync(GITHUB_STEP_SUMMARY, markdown);
        } else {
            console.log(markdown);
        }

    } catch (error) {
        console.error("Bundle Audit Failed:", error);
    }
}

generateBundleReport();
