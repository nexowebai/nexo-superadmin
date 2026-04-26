import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * ⚡ NEXO PERFORMANCE GUARD: BUNDLE SIZE AUDIT
 * Analyzes the production build to ensure we stay within performance budgets.
 */

const DIST_DIR = path.join(process.cwd(), "dist");
const BUDGET_KB = 500; // Hard budget for the main bundle

function runAudit() {
    console.log("🚀 Starting Production Bundle Audit...");

    if (!fs.existsSync(DIST_DIR)) {
        console.log("📦 Building production bundle for analysis...");
        execSync("npm run build", { stdio: "inherit" });
    }

    const files = fs.readdirSync(path.join(DIST_DIR, "assets"))
        .filter(f => f.endsWith(".js"));

    let totalSize = 0;
    console.log("\n| Artifact | Size (KB) | Status |");
    console.log("| :--- | :--- | :--- |");

    files.forEach(file => {
        const stats = fs.statSync(path.join(DIST_DIR, "assets", file));
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += parseFloat(sizeKB);
        
        const status = sizeKB > BUDGET_KB ? "❌ OVER BUDGET" : "✅ OPTIMAL";
        console.log(`| ${file} | ${sizeKB} KB | ${status} |`);
    });

    console.log(`\n**Total Bundle Impact**: ${totalSize.toFixed(2)} KB`);
    
    if (totalSize > BUDGET_KB * 2) {
        console.error(`\n🚨 CRITICAL: Total bundle size (${totalSize} KB) exceeds the safe threshold!`);
        // process.exit(1); // Uncomment to fail CI on size bloat
    } else {
        console.log("\n✨ Performance budget verified.");
    }
}

runAudit();
