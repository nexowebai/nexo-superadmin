import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

/**
 * 🏔️ NEXO APEX ARCHITECT (V8.0)
 * 
 * The ultimate hybrid of AST-based code intelligence and premium visual UX.
 * Features:
 * - Babel-powered Abstract Syntax Tree (AST) analysis
 * - Advanced Complexity Scoring (Babel-inferred)
 * - Themed Indiglo Mermaid topologies
 * - Automated API Surface Mapping
 * - Development Navigation Maps
 */

const FEATURES_DIR = path.join(process.cwd(), "src/features");
const ROOT_README = path.join(process.cwd(), "README.md");

function read(filePath) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "";
}

function analyzeFile(filePath) {
    const code = read(filePath);
    if (!code) return null;

    try {
        const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
        const data = {
            name: path.basename(filePath),
            simpleName: path.basename(filePath).split(".")[0],
            lines: code.split("\n").length,
            exports: [],
            imports: [],
            api: [],
            jsx: 0
        };

        traverse(ast, {
            ExportNamedDeclaration(p) {
                const d = p.node.declaration;
                if (d?.declarations) d.declarations.forEach(x => data.exports.push(x.id.name));
            },
            ImportDeclaration(p) {
                data.imports.push(p.node.source.value);
            },
            CallExpression(p) {
                const callee = p.node.callee;
                const name = callee.name || (callee.property ? callee.property.name : null);
                if (["get", "post", "patch", "delete", "put"].includes(name?.toLowerCase())) {
                    const arg = p.node.arguments[0]?.value;
                    if (arg) data.api.push({ method: name.toUpperCase(), endpoint: arg });
                }
            },
            JSXElement() {
                data.jsx++;
            }
        });

        return data;
    } catch (e) {
        // Fallback for non-JS files or syntax issues
        return { name: path.basename(filePath), lines: code.split("\n").length, exports: [], imports: [], api: [], jsx: 0 };
    }
}

function score(f) {
    return Math.round(
        f.lines * 0.15 +
        f.imports.length * 2.5 +
        f.exports.length * 2 +
        f.api.length * 5 +
        f.jsx * 0.8
    );
}

function generateThemedSequence(featureName, files) {
    const page = files.find(f => f.jsx > 10) || files.find(f => f.name.includes("Page")) || files[0];
    const hook = files.find(f => f.name.startsWith("use") && f.name.includes(page?.simpleName.replace("Page", ""))) || files.find(f => f.name.startsWith("use"));
    const service = files.find(f => f.api.length > 0) || files.find(f => f.name.includes("Service"));

    let d = "```mermaid\nsequenceDiagram\nautonumber\n";
    if (page && hook && service) {
        d += `    participant P as ${page.name}\n`;
        d += `    participant H as ${hook.name}\n`;
        d += `    participant S as ${service.name}\n`;
        d += `    participant API as Supabase/External\n\n`;
        d += `    P->>H: Initialize Logic State\n`;
        d += `    H->>S: Invoke Data Fetching\n`;
        d += `    S->>API: Executes HTTP ${service.api[0]?.method || "GET"}\n`;
        d += `    API-->>S: Payload Response\n`;
        d += `    S-->>H: Hydrate React State\n`;
        d += `    H-->>P: Render Hydrated View\n`;
    } else {
        d += "    Note over UI,API: Partial architecture nodes detected\n";
    }
    d += "```";
    return d;
}

function generateThemedTopology(featureName, files) {
    let d = "```mermaid\n";
    d += "%%{init: {'theme': 'neutral', 'themeVariables': { 'fontFamily': 'Inter', 'lineColor': '#6366f1' }}}%%\n";
    d += "graph TD\n";
    d += "    classDef page fill:#4f46e5,stroke:#3730a3,stroke-width:2px,color:#fff,rx:10,ry:10;\n";
    d += "    classDef hook fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#0f172a,rx:20,ry:20;\n";
    d += "    classDef service fill:#0f172a,stroke:#000,stroke-width:2px,color:#f1f5f9,rx:5,ry:5;\n\n";

    files.forEach(f => {
        const id = f.name.replace(/\W/g, "");
        const type = f.jsx > 5 ? ":::page" : f.name.startsWith("use") ? ":::hook" : f.api.length > 0 ? ":::service" : "";
        d += `    ${id}["${f.name}"]${type}\n`;
    });

    files.forEach(f => {
        const fid = f.name.replace(/\W/g, "");
        f.imports.forEach(i => {
            const base = i.split("/").pop();
            const target = files.find(x => x.name.includes(base));
            if (target) {
                d += `    ${fid} --> ${target.name.replace(/\W/g, "")}\n`;
            }
        });
    });

    d += "```";
    return d;
}

function run() {
    console.log("🏔️ Nexo Apex: Initializing AST-Based Engineering Audit...");

    if (!fs.existsSync(FEATURES_DIR)) return;

    const features = fs.readdirSync(FEATURES_DIR).filter(f =>
        fs.statSync(path.join(FEATURES_DIR, f)).isDirectory()
    );

    const globalStats = [];

    features.forEach(feature => {
        const base = path.join(FEATURES_DIR, feature);
        const filePaths = [
            ...getFiles(path.join(base, "pages")),
            ...getFiles(path.join(base, "hooks")),
            ...getFiles(path.join(base, "services")),
            ...getFiles(path.join(base, "components"))
        ];

        const files = filePaths.map(analyzeFile).filter(Boolean);
        files.forEach(f => f.score = score(f));

        const totalLoC = files.reduce((s, f) => s + f.lines, 0);
        const hotspots = files.filter(f => f.score > 80).sort((a, b) => b.score - a.score);
        const apiSurface = files.flatMap(f => f.api.map(a => ({ ...a, source: f.name })));

        const sequence = generateThemedSequence(feature, files);
        const topology = generateThemedTopology(feature, files);

        const content = `# Feature Intelligence: ${feature.toUpperCase()}

![Audit](https://img.shields.io/badge/Architecture-Institutional-6366f1)
![Complexity](https://img.shields.io/badge/Complexity_Score-${totalLoC > 500 ? "High" : "Optimal"}-${totalLoC > 500 ? "orange" : "brightgreen"})
![AST](https://img.shields.io/badge/Scanner-Babel_AST-blue)

## 🏛️ Architectural Topology

### 1. Thematic Dependency Graph
Babel-parsed internal mapping of module relationships.

${topology}

### 2. Execution Sequence
Runtime orchestration between View, Logic, and Infrastructure layers.

${sequence}

---

## 📡 API Surface (Inferred)
Automated mapping of external connectivity within this module.

| Method | Endpoint | Source Provider |
| :--- | :--- | :--- |
${apiSurface.map(a => `| ${a.method} | \`${a.endpoint}\` | ${a.source} |`).join("\n") || "| - | - | - |"}

---

## 🛠️ Development Navigation
| Objective | Target Layer | Target File |
| :--- | :--- | :--- |
| **Change UI Layout** | Presentation (Pages) | \`${files.find(f => f.jsx > 10)?.name || "FeaturePage.jsx"}\` |
| **Update Business Logic** | Logic (Hooks) | \`${files.find(f => f.name.startsWith("use"))?.name || "useHook.js"}\` |
| **Modify Data Provider** | Infrastructure (Services) | \`${files.find(f => f.api.length > 0)?.name || "featureService.js"}\` |

---

## 📂 Engineering Audit
| Entity | Score | Complexity | LoC | Status |
| :--- | :--- | :--- | :--- | :--- |
${files.map(f => `| \`${f.name}\` | ${f.score} | ${f.score > 80 ? "High" : "Low"} | ${f.lines} | ${f.lines > 150 ? "⚠️ REFACTOR" : "✅ STABLE"} |`).join("\n")}

---
*Generated by Nexo Apex Architect V8.0 | Institutional Standard*
`;

        fs.writeFileSync(path.join(base, "README.md"), content);
        globalStats.push({ name: feature, lines: totalLoC, files: files.length, score: Math.round(totalLoC / files.length) });
    });

    if (fs.existsSync(ROOT_README)) {
        let root = fs.readFileSync(ROOT_README, "utf-8");
        const table = `
| Status | Feature Module | Complexity | Density | Specification |
| :--- | :--- | :--- | :--- | :--- |
${globalStats.map(s => `| ${s.score > 50 ? "![High](https://img.shields.io/badge/-High-orange)" : "![Optimal](https://img.shields.io/badge/-Optimal-brightgreen)"} | **${s.name.toUpperCase()}** | ${s.lines} LoC | ${s.files} Nodes | [View Specs](./src/features/${s.name}/README.md) |`).join("\n")}
`;

        root = root.replace(
            /<!-- FEATURE_INVENTORY_START -->[\s\S]*<!-- FEATURE_INVENTORY_END -->/,
            `<!-- FEATURE_INVENTORY_START -->\n${table}\n<!-- FEATURE_INVENTORY_END -->`
        );
        fs.writeFileSync(ROOT_README, root);
    }

    console.log("✨ Nexo Apex: Architecture synchronized with AST-level precision.");
}

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith(".js") || f.endsWith(".jsx"))
        .map(f => path.join(dir, f));
}

run();