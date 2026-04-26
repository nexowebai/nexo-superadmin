import fs from "fs";
import path from "path";

/**
 * 🛰️ NEXO ENGINEERING DOCS ENGINE (V4.0)
 * 
 * Generates enterprise-grade technical documentation.
 * Focuses on high-fidelity visual diagrams, quantitative metrics, 
 * and professional architectural mapping.
 */

const FEATURES_DIR = path.join(process.cwd(), "src/features");
const ROOT_README = path.join(process.cwd(), "README.md");

function countLines(filePath) {
    if (!fs.existsSync(filePath)) return 0;
    const content = fs.readFileSync(filePath, "utf-8");
    return content.split("\n").length;
}

function analyzeFolder(featurePath, subDir) {
    const dirPath = path.join(featurePath, subDir);
    if (!fs.existsSync(dirPath)) return [];
    
    return fs.readdirSync(dirPath)
        .filter(f => f.endsWith(".js") || f.endsWith(".jsx"))
        .map(f => {
            const lines = countLines(path.join(dirPath, f));
            return {
                name: f.split(".")[0],
                lines: lines,
                status: lines > 150 ? "Refactor" : "Stable"
            };
        });
}

function generateSequenceDiagram(featureName, structure) {
    let diagram = "```mermaid\nsequenceDiagram\n";
    diagram += "    participant UI as Page Component\n";
    diagram += "    participant Hook as Headless Hook\n";
    diagram += "    participant Service as Service Layer\n";
    diagram += "    participant API as External API\n\n";
    
    diagram += "    UI->>Hook: Invokes interaction handler\n";
    diagram += "    Hook->>Hook: Manages local state / validation\n";
    diagram += "    Hook->>Service: Requests data orchestration\n";
    diagram += "    Service->>API: Executes HTTP request\n";
    diagram += "    API-->>Service: Returns raw data response\n";
    diagram += "    Service-->>Hook: Returns normalized DTO\n";
    diagram += "    Hook-->>UI: Updates view state\n";
    diagram += "```";
    return diagram;
}

function generateFlowDiagram(featureName, structure) {
    let diagram = "```mermaid\ngraph LR\n";
    diagram += `    subgraph ${featureName.toUpperCase()}_MODULE\n`;
    diagram += "        direction TB\n";
    
    if (structure.pages.length > 0) {
        diagram += `        PAGES[View Layer] --> HOOKS[Logic Layer]\n`;
    }

    if (structure.hooks.length > 0) {
        diagram += `        HOOKS --> SERVICES[Connectivity Layer]\n`;
    }

    if (structure.services.length > 0) {
        diagram += `        SERVICES --> API_CORE[API Client]\n`;
    }

    diagram += "    end\n```";
    return diagram;
}

function syncDocs() {
    console.log("🛰️ Nexo Engineering: Documenting System Topology...");

    if (!fs.existsSync(FEATURES_DIR)) return;

    const features = fs.readdirSync(FEATURES_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    let featureStats = [];

    features.forEach(feature => {
        const featurePath = path.join(FEATURES_DIR, feature);
        const structure = {
            pages: analyzeFolder(featurePath, "pages"),
            hooks: analyzeFolder(featurePath, "hooks"),
            services: analyzeFolder(featurePath, "services"),
            components: analyzeFolder(featurePath, "components")
        };

        const totalLines = [...structure.pages, ...structure.hooks, ...structure.services, ...structure.components]
            .reduce((sum, f) => sum + f.lines, 0);
        
        const hasLargeFiles = [...structure.pages, ...structure.hooks, ...structure.services, ...structure.components]
            .some(f => f.status === "Refactor");

        featureStats.push({
            name: feature,
            lines: totalLines,
            compliance: hasLargeFiles ? "NON-COMPLIANT" : "STABLE"
        });

        const sequence = generateSequenceDiagram(feature, structure);
        const flow = generateFlowDiagram(feature, structure);
        const readmePath = path.join(featurePath, "README.md");

        const content = `# Feature Specification: ${feature.toUpperCase()}

![Stability](https://img.shields.io/badge/Architecture-${hasLargeFiles ? "Refactor_Required" : "Certified"}-${hasLargeFiles ? "red" : "blue"})
![Coverage](https://img.shields.io/badge/Complexity-${totalLines > 500 ? "High" : "Optimal"}-${totalLines > 500 ? "orange" : "brightgreen"})
![Standard](https://img.shields.io/badge/Pattern-Clean_Architecture-lightgrey)

## Technical Architecture

### Component Interaction Flow
This sequence diagram illustrates the lifecycle of a user interaction within this module.

${sequence}

### Data Dependency Graph
High-level overview of the module's internal layering and dependency direction.

${flow}

## Implementation Details

### View Layer (Pages)
| Entry Point | Lines of Code | Technical Status |
| :--- | :--- | :--- |
${structure.pages.map(p => `| ${p.name} | ${p.lines} | ${p.status} |`).join("\n") || "| - | - | - |"}

### Logic Layer (Hooks)
| Controller Hook | Lines of Code | Technical Status |
| :--- | :--- | :--- |
${structure.hooks.map(h => `| ${h.name} | ${h.lines} | ${h.status} |`).join("\n") || "| - | - | - |"}

### Infrastructure Layer (Services)
| Service Provider | Lines of Code | Technical Status |
| :--- | :--- | :--- |
${structure.services.map(s => `| ${s.name} | ${s.lines} | ${s.status} |`).join("\n") || "| - | - | - |"}

## Engineering Guidelines
- **Logic Encapsulation**: 100% of state orchestration must be contained within the Logic Layer hooks.
- **Service Parity**: All external communication must pass through the Service Provider to ensure API abstraction.
- **File Integrity**: Files exceeding the 150-line threshold are automatically flagged as "Refactor Required".

---
*Generated by Nexo-Doc-Engine v4.0 | Engineering Excellence Standard*
`;

        fs.writeFileSync(readmePath, content);
    });

    // Update Root README
    if (fs.existsSync(ROOT_README)) {
        let rootReadme = fs.readFileSync(ROOT_README, "utf-8");
        const tableHeader = "| Status | Feature Module | Complexity | Lifecycle | Architecture |\n| :--- | :--- | :--- | :--- | :--- |\n";
        const tableBody = featureStats.map(f => {
            const statusBadge = f.compliance === "STABLE" 
                ? "![Stable](https://img.shields.io/badge/-Stable-brightgreen)" 
                : "![Refactor](https://img.shields.io/badge/-Refactor-red)";
            return `| ${statusBadge} | **${f.name.toUpperCase()}** | ${f.lines} LoC | [View Details](./src/features/${f.name}/README.md) | Certified |`;
        }).join("\n");

        const newTable = tableHeader + tableBody;
        
        rootReadme = rootReadme.replace(
            /<!-- FEATURE_INVENTORY_START -->[\s\S]*<!-- FEATURE_INVENTORY_END -->/,
            `<!-- FEATURE_INVENTORY_START -->\n${newTable}\n<!-- FEATURE_INVENTORY_END -->`
        );
        
        fs.writeFileSync(ROOT_README, rootReadme);
    }

    console.log("✨ Engineering Documentation Finalized.");
}

syncDocs();
