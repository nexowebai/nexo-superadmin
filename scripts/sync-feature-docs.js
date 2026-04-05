import fs from "fs";
import path from "path";

/**
 * Sync Feature Documentation script
 * Ensures every feature in src/features/ has a base README for architectural compliance.
 */

const FEATURES_DIR = path.join(process.cwd(), "src/features");

function syncDocs() {
    console.log("🚀 Starting Feature Documentation Sync...");

    if (!fs.existsSync(FEATURES_DIR)) {
        console.warn("⚠️  Directory src/features/ not found. Skipping sync.");
        return;
    }

    const features = fs.readdirSync(FEATURES_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    let updatedCount = 0;

    features.forEach(feature => {
        const featurePath = path.join(FEATURES_DIR, feature);
        const readmePath = path.join(featurePath, "README.md");
        const docsPath = path.join(featurePath, "docs");

        // Basic check for README.md existence
        if (!fs.existsSync(readmePath)) {
            const defaultContent = `# ${feature.toUpperCase()}\n\nThis feature follows the Nexo-Admin 5-folder architecture.\n\n## 📝 Overview\n[TBD: Description for ${feature}]\n\n## 📋 Features\n- [ ] List features here\n\n## ⚙️ Documentation\nFor detailed documentation, see the \`docs/\` directory.\n`;
            
            try {
                fs.writeFileSync(readmePath, defaultContent);
                console.log(`✅ Created missing README.md for feature: ${feature}`);
                updatedCount++;
            } catch (err) {
                console.error(`❌ Error creating README.md for ${feature}: ${err.message}`);
            }
        }
    });

    console.log(`✨ Sync Complete! Updated ${updatedCount} features.`);
}

syncDocs();
