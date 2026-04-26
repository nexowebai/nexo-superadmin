import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

/**
 * 🏔️ NEXO COMMAND ARCHITECT (V24.0) - THE MASTER ORCHESTRATOR
 * 
 * Consolidates all specialized workflows into a single high-performance engine.
 * - Global Governance Audit (nexo-audit.cjs)
 * - Automated Changelog Engine (auto-changelog.js)
 * - Intelligence Dashboard Portal (docs/index.html)
 * - Global Feature Inventory (README.md)
 * - Feature-Specific Documentation (src/features/* /README.md)
 * - AST-level dependency mapping and API surface inference
 */

const ROOT = process.cwd();
const FEATURES_DIR = path.join(ROOT, "src/features");
const OUTPUT_DIR = path.join(ROOT, "docs");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.html");

const LOGO_PATH = path.join(ROOT, "src/assets/logo/nexo-full.png");
const FAVICON_PATH = path.join(ROOT, "dist/favicon.png");

function getBase64(filePath) {
    if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        return `data:image/png;base64,${buffer.toString("base64")}`;
    }
    return "";
}

const LOGO_BASE64 = getBase64(LOGO_PATH);
const FAVICON_BASE64 = getBase64(FAVICON_PATH);

const FILE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; flex-shrink: 0;"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`;
const COPY_ICON = `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function calculateScore(f) {
    return Math.round(
        f.lines * 0.15 +
        (f.dependencies?.length || 0) * 2.5 +
        (f.exports?.length || 0) * 2 +
        (f.api?.length || 0) * 5 +
        (f.jsx || 0) * 0.8
    );
}

function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf-8");
    const deps = [];
    const api = [];
    const exports = [];
    let jsxCount = 0;

    try {
        const ast = parse(code, { sourceType: "module", plugins: ["jsx", "typescript"] });
        traverse(ast, {
            ImportDeclaration({ node }) {
                const source = node.source.value;
                if (source.startsWith(".") || source.startsWith("@")) deps.push(source);
            },
            ExportNamedDeclaration({ node }) {
                if (node.declaration?.declarations) {
                    node.declaration.declarations.forEach(d => exports.push(d.id.name));
                } else if (node.declaration?.id) {
                    exports.push(node.declaration.id.name);
                }
            },
            ExportDefaultDeclaration({ node }) {
                exports.push("default");
            },
            CallExpression({ node }) {
                const callee = node.callee;
                const name = callee.name || (callee.property ? callee.property.name : null);
                if (["get", "post", "patch", "delete", "put"].includes(name?.toLowerCase())) {
                    const arg = node.arguments[0]?.value;
                    if (arg && typeof arg === "string") api.push({ method: name.toUpperCase(), endpoint: arg });
                }
                if (node.callee.name === "require" && node.arguments[0]?.type === "StringLiteral") {
                    deps.push(node.arguments[0].value);
                }
            },
            JSXElement() {
                jsxCount++;
            }
        });

        const data = {
            name: path.basename(filePath),
            simpleName: path.basename(filePath).split(".")[0],
            fullPath: filePath.replace(ROOT, "").replace(/\\/g, "/"),
            lines: code.split("\n").length,
            dependencies: deps,
            api,
            exports,
            jsx: jsxCount
        };
        data.score = calculateScore(data);
        data.priority = data.score > 150 ? "Critical" : (data.score > 80 ? "High" : "Low");
        return data;
    } catch {
        const lines = code.split("\n").length;
        const data = { 
            name: path.basename(filePath), 
            simpleName: path.basename(filePath).split(".")[0],
            fullPath: filePath.replace(ROOT, "").replace(/\\/g, "/"), 
            lines, 
            dependencies: [],
            api: [],
            exports: [],
            jsx: 0
        };
        data.score = calculateScore(data);
        data.priority = data.score > 150 ? "Critical" : (data.score > 80 ? "High" : "Low");
        return data;
    }
}

function run() {
    console.log("🏔️ Nexo Master Architect: Orchestrating Full System Workflow...");

    // --- 🛡️ WORKFLOW ORCHESTRATION ---
    try {
        console.log("🛡️ Running Global Governance Audit...");
        execSync("node scripts/nexo-audit.cjs", { stdio: "inherit" });
        console.log("📝 Running Automated Changelog Engine...");
        execSync("node scripts/auto-changelog.js", { stdio: "inherit" });
    } catch (e) {
        console.warn("⚠️ Some pre-flight workflows failed. Proceeding with Pulse generation...");
    }

    if (!fs.existsSync(FEATURES_DIR)) {
        console.error("❌ src/features directory not found.");
        return;
    }

    const auditReportPath = path.join(ROOT, "docs/audit-report.json");
    let auditReport = { healthScore: 100, violations: [], totalFiles: 0 };
    if (fs.existsSync(auditReportPath)) {
        auditReport = JSON.parse(fs.readFileSync(auditReportPath, "utf-8"));
    }

    const features = fs.readdirSync(FEATURES_DIR).filter(f => fs.statSync(path.join(FEATURES_DIR, f)).isDirectory());

    const moduleData = features.map(f => {
        const base = path.join(FEATURES_DIR, f);
        const files = [];
        ["pages", "hooks", "services", "components"].forEach(sub => {
            const dir = path.join(base, sub);
            if (fs.existsSync(dir)) {
                const subFiles = fs.readdirSync(dir, { recursive: true })
                    .filter(x => typeof x === 'string' && (x.endsWith(".js") || x.endsWith(".jsx") || x.endsWith(".ts") || x.endsWith(".tsx")));

                subFiles.forEach(file => {
                    files.push(analyzeFile(path.join(dir, file)));
                });
            }
        });

        const totalLines = files.reduce((s, x) => s + x.lines, 0);
        const featureViolations = auditReport.violations.filter(v => v.file.includes(`src/features/${f}`));
        const refactorFiles = files.filter(f => f.priority !== "Low");
        const maintenanceScore = Math.max(0, 100 - (refactorFiles.length * 15) - (featureViolations.length * 5));

        return {
            name: f.charAt(0).toUpperCase() + f.slice(1),
            totalFiles: files.length,
            totalLines,
            rating: maintenanceScore >= 90 ? "A+" : (maintenanceScore >= 70 ? "B" : "C"),
            refactorFiles,
            allFiles: files.sort((a, b) => b.lines - a.lines),
            violations: featureViolations
        };
    });

    const totalSystemLines = moduleData.reduce((s, m) => s + m.totalLines, 0);
    const systemHealth = auditReport.healthScore;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexo Master Architect | System Portal</title>
    <link rel="icon" type="image/png" href="${FAVICON_BASE64}">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-glow: rgba(99, 102, 241, 0.1);
            --bg: #f8fafc;
            --sidebar: #ffffff;
            --surface: #ffffff;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --border-active: #cbd5e1;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --radius-lg: 16px;
            --radius-md: 10px;
            --radius-sm: 6px;
        }

        [data-theme="dark"] {
            --primary: #818cf8;
            --primary-glow: rgba(129, 140, 248, 0.15);
            --bg: #0f172a;
            --sidebar: #1e293b;
            --surface: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border: #334155;
            --border-active: #475569;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: var(--bg); color: var(--text-main); font-family: 'Outfit', sans-serif;
            display: flex; height: 100vh; overflow: hidden; transition: background 0.3s ease;
        }

        /* Sidebar */
        .sidebar {
            width: 260px; height: 100vh; background: var(--sidebar); border-right: 1px solid var(--border);
            display: flex; flex-direction: column; position: fixed; left: 0; top: 0; z-index: 100;
        }
        .brand { border-bottom: 1px solid var(--border); margin-bottom: 20px; display: flex; justify-content: center; }
        .brand img { max-width: 150px; }
        [data-theme="dark"] .brand img { filter: invert(1) brightness(2); }

        .nav { padding: 0 12px; flex: 1; }
        .nav-item {
            padding: 10px 16px; border-radius: var(--radius-md); color: var(--text-muted); font-size: 14px; font-weight: 600;
            margin-bottom: 4px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.2s;
        }
        .nav-item:hover { background: var(--primary-glow); color: var(--primary); }
        .nav-item.active { background: var(--primary); color: white; }

        /* Header */
        header {
            position: fixed; top: 0; left: 260px; right: 0; height: 70px; background: var(--sidebar);
            border-bottom: 1px solid var(--border); padding: 0 32px; display: flex; justify-content: space-between; align-items: center; z-index: 90;
        }
        .h-info h2 { font-size: 18px; font-weight: 800; }
        .h-info p { font-size: 12px; color: var(--text-muted); }

        .header-actions { display: flex; align-items: center; gap: 20px; }
        .theme-toggle {
            width: 38px; height: 38px; border-radius: 10px; border: 1px solid var(--border);
            display: grid; place-items: center; cursor: pointer; color: var(--text-muted); transition: 0.2s;
        }
        .theme-toggle:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-glow); }

        /* Content Area */
        .content { margin-left: 260px; margin-top: 70px; flex: 1; padding: 32px; overflow-y: auto; height: calc(100vh - 70px); }

        .view-description {
            background: var(--primary-glow); border: 1px solid var(--primary); padding: 16px 20px; border-radius: var(--radius-md);
            margin-bottom: 24px; display: flex; gap: 12px; align-items: center;
        }
        .vd-text h4 { font-size: 14px; font-weight: 800; color: var(--primary); }
        .vd-text p { font-size: 12px; opacity: 0.8; }

        .hero-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
        .stat-box { background: var(--surface); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border); }
        .sb-label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
        .sb-value { font-size: 24px; font-weight: 800; }

        .feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .feature-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; transition: 0.3s; }
        .feature-card:hover { border-color: var(--primary); box-shadow: var(--shadow-sm); }

        .f-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .f-name { font-size: 16px; font-weight: 800; }
        .f-rating { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; font-weight: 800; border: 2px solid var(--border); }

        .f-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: var(--text-muted); }
        .f-progress { height: 6px; background: var(--border); border-radius: 10px; margin: 12px 0; overflow: hidden; }
        .f-bar { height: 100%; transition: width 1s; }

        /* Tables */
        .portal-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; }
        .portal-table { width: 100%; border-collapse: collapse; }
        .portal-table th { padding: 12px; font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); }
        .portal-table tr { border-bottom: 1px solid var(--border); }
        .portal-table td { padding: 12px; font-size: 13px; vertical-align: middle; }
        
        .col-node { text-align: left; width: 40%; }
        .col-lines { text-align: left; width: 15%; }
        .col-status { text-align: left; width: 20%; }
        .col-action { text-align: right; width: 25%; }

        .badge {
            padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
            display: inline-flex; align-items: center; gap: 4px; border: 1px solid transparent;
        }
        .badge-Critical { background: rgba(239, 68, 68, 0.08); color: var(--danger); border-color: rgba(239, 68, 68, 0.15); }
        .badge-High { background: rgba(245, 158, 11, 0.08); color: var(--warning); border-color: rgba(245, 158, 11, 0.15); }
        .badge-Low { background: rgba(16, 185, 129, 0.08); color: var(--success); border-color: rgba(16, 185, 129, 0.15); }

        .action-btn { 
            background: var(--bg); border: 1px solid var(--border); padding: 6px 12px; border-radius: 8px; 
            font-size: 11px; font-weight: 700; color: var(--text-muted); cursor: pointer; transition: 0.2s;
            display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
        }
        .action-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-glow); }
        .action-btn.primary { background: var(--primary); color: white; border: none; }
        .action-btn.primary:hover { background: #4f46e5; }

        .matrix-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; transition: 0.3s; }
        .matrix-card:hover { transform: translateY(-4px); border-color: var(--primary); }
        .mc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }

        .tab-view { display: none; }
        .tab-view.active { display: block; animation: fadeInUp 0.4s ease forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

        .stability-section { padding: 20px 12px; margin-top: auto; border-top: 1px solid var(--border); }
        .stability-card { background: var(--bg); padding: 16px; border-radius: 12px; border: 1px solid var(--border); }
        .sc-label { font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
        .sc-value { font-size: 20px; font-weight: 900; color: var(--primary); }
        .sc-progress { height: 6px; background: var(--border); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .sc-bar { height: 100%; background: var(--primary); border-radius: 10px; }

        .violation-card { 
            padding: 12px; border-radius: 10px; border: 1px solid var(--border); margin-bottom: 10px;
            display: flex; align-items: flex-start; gap: 12px; background: var(--bg);
        }
        .violation-icon { flex-shrink: 0; margin-top: 2px; }
        .violation-info h5 { font-size: 13px; font-weight: 800; margin-bottom: 2px; }
        .violation-info p { font-size: 11px; color: var(--text-muted); }
    </style>
    <script>
        (function() {
            const savedTheme = localStorage.getItem('nexo-theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
        })();
    </script>
</head>
<body data-theme="light">
    <div class="sidebar">
        <div class="brand"><img src="${LOGO_BASE64}" alt="Nexo Logo"></div>
        <div class="nav">
            <div id="nav-dashboard" class="nav-item active" onclick="showTab('dashboard')">Dashboard Index</div>
            <div id="nav-audit" class="nav-item" onclick="showTab('audit')">Resource Audit</div>
            <div id="nav-violations" class="nav-item" onclick="showTab('violations')">Governance Issues</div>
            <div id="nav-priority" class="nav-item" onclick="showTab('priority')">Refactor Matrix</div>
        </div>
        <div class="stability-section">
            <div class="stability-card">
                <div class="sc-label">System Integrity</div>
                <div class="sc-value">${systemHealth}%</div>
                <div class="sc-progress"><div class="sc-bar" style="width: ${systemHealth}%"></div></div>
            </div>
        </div>
    </div>

    <header>
        <div class="h-info"><h2>Command Architect</h2><p>V24.0 Master Workflow Engine</p></div>
        <div class="header-actions">
            <div class="theme-toggle" onclick="toggleTheme()" title="Toggle Visual Mode">
                <svg id="theme-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
                </svg>
            </div>
            <div style="text-align: right; line-height: 1.2;">
                <div style="font-weight: 800; font-size: 13px;">Master Architect</div>
                <div style="font-size: 10px; color: var(--text-muted);">Institutional Mode</div>
            </div>
        </div>
    </header>

    <div class="content">
        <div id="dashboard" class="tab-view active">
            <div class="view-description">
                <div class="vd-text">
                    <h4>Intelligence Dashboard</h4>
                    <p>High-level system health and logic density aggregation. Complexity is calculated via AST analysis of Lines, Imports, Exports, API calls, and JSX density.</p>
                </div>
            </div>
            <div class="hero-stats">
                <div class="stat-box"><div class="sb-label">Logical Lines</div><div class="sb-value">${totalSystemLines.toLocaleString()}</div></div>
                <div class="stat-box"><div class="sb-label">Complexity Equation</div><div class="sb-value" style="font-size: 11px; opacity: 0.6; line-height: 1.4;">(Lines × 0.15) + (Deps × 2.5) + (Exp × 2) + (API × 5) + (JSX × 0.8)</div></div>
                <div class="stat-box"><div class="sb-label">Audit Score</div><div class="sb-value" style="color: var(--primary)">${systemHealth}%</div></div>
                <div class="stat-box"><div class="sb-label">Violations</div><div class="sb-value" style="color: var(--danger)">${auditReport.violationsCount}</div></div>
            </div>
            <div class="feature-grid">
                ${moduleData.map(m => `
                    <div class="feature-card">
                        <div class="f-top"><div class="f-name">${m.name}</div><div class="f-rating" style="color: ${m.rating === 'A+' ? 'var(--success)' : (m.rating === 'B' ? 'var(--warning)' : 'var(--danger)')}">${m.rating}</div></div>
                        <div class="f-row"><span>Files</span><span style="font-weight:700">${m.totalFiles}</span></div>
                        <div class="f-row"><span>Violations</span><span style="font-weight:700; color: ${m.violations.length > 0 ? 'var(--danger)' : 'var(--success)'}">${m.violations.length}</span></div>
                        <div class="f-progress"><div class="f-bar" style="width: ${m.rating === 'A+' ? 100 : (m.rating === 'B' ? 70 : 40)}%; background: ${m.rating === 'A+' ? 'var(--success)' : (m.rating === 'B' ? 'var(--warning)' : 'var(--danger)')}"></div></div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="audit" class="tab-view">
            <div class="view-description"><div class="vd-text"><h4>Resource Audit</h4><p>Detailed maintenance grading for every node identity across the platform.</p></div></div>
            ${moduleData.map(m => {
                const pathsJson = JSON.stringify(m.refactorFiles.map(f => f.fullPath)).replace(/"/g, '&quot;');
                return `
                <div class="portal-card" style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="font-weight: 800;">${m.name} Resource Pool</h4>
                        <button class="action-btn primary" onclick="window.copyFeaturePaths('${m.name}', ${pathsJson}, this)">Refactor Prompt</button>
                    </div>
                    <table class="portal-table">
                        <thead><tr><th class="col-node">Node Identity</th><th class="col-lines">Volume</th><th class="col-status">Stability</th><th class="col-action"><div style="display: flex; justify-content: flex-end;"><span class="badge" style="background: var(--primary); color: white;">Orchestration</span></div></th></tr></thead>
                        <tbody>
                            ${m.allFiles.map(f => `
                                <tr>
                                    <td class="col-node" style="font-weight: 700; display: flex; align-items: center; gap: 10px;">${FILE_ICON} ${f.name}</td>
                                    <td class="col-lines" style="font-family: 'JetBrains Mono'; opacity: 0.6;">${f.lines}</td>
                                    <td class="col-status"><span class="badge badge-${f.priority}">${f.priority}</span></td>
                                    <td class="col-action"><button class="action-btn" onclick="window.copySnippet('${f.fullPath}', this)">${COPY_ICON} Copy Path</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`;
            }).join('')}
        </div>

        <div id="violations" class="tab-view">
            <div class="view-description"><div class="vd-text"><h4>Governance Monitor</h4><p>Architectural violations detected by the automated Nexo Audit engine.</p></div></div>
            <div class="portal-card">
                ${auditReport.violations.length === 0 ? `
                    <div style="text-align: center; padding: 60px;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <h3 style="margin-top: 24px; font-weight: 800;">System 100% Compliant</h3>
                        <p style="color: var(--text-muted); font-size: 14px;">Institutional governance rules are fully satisfied.</p>
                    </div>
                ` : `
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${auditReport.violations.map(v => `
                            <div class="violation-card">
                                <div class="violation-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${v.severity === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)'}" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                                <div class="violation-info">
                                    <h5 style="text-transform: uppercase; font-size: 10px; color: ${v.severity === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)'}; margin-bottom: 4px; letter-spacing: 1px;">${v.severity} ${v.type}</h5>
                                    <h5 style="font-size: 14px; margin-bottom: 4px;">${v.file}</h5>
                                    <p>${v.message}</p>
                                </div>
                                <button class="action-btn" style="margin-left: auto;" onclick="window.copySnippet('${v.file}', this)">${COPY_ICON} Copy Path</button>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>

        <div id="priority" class="tab-view">
            <div class="view-description"><div class="vd-text"><h4>Refactor Matrix</h4><p>Prioritized remediation queue for high-volumetric risk nodes.</p></div></div>
            <div class="feature-grid">
                ${moduleData.flatMap(m => m.refactorFiles).map(f => `
                    <div class="matrix-card">
                        <div class="mc-header"><div style="font-weight:800; display: flex; align-items: center; gap: 8px;">${FILE_ICON} ${f.name}</div><span class="badge badge-${f.priority}">${f.priority}</span></div>
                        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Current Volume: <strong>${f.lines} Lines</strong></div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button class="action-btn primary" onclick="window.copySnippet('${f.fullPath}', this)">${COPY_ICON} Copy Path</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <script>
        // --- 🧊 NEXO MASTER UI ENGINE (V24.0) ---

        window.updateTheme = function(theme) {
            const root = document.documentElement;
            root.setAttribute('data-theme', theme);
            localStorage.setItem('nexo-theme', theme);
            
            const icon = document.getElementById('theme-icon');
            if (icon) {
                if (theme === 'dark') {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
                } else {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>';
                }
            }
        };

        window.toggleTheme = function() {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            window.updateTheme(current === 'dark' ? 'light' : 'dark');
        };

        window.showTab = function(id) {
            // Deactivate all
            document.querySelectorAll('.tab-view').forEach(v => v.style.display = 'none'); 
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            
            // Activate target
            const target = document.getElementById(id);
            if (target) {
                target.style.display = 'block';
                const contentArea = document.querySelector('.content');
                if (contentArea) contentArea.scrollTop = 0;
            }
            
            const nav = document.getElementById('nav-' + id);
            if (nav) nav.classList.add('active');
            
            // Sync URL hash
            if (window.location.hash !== '#' + id) {
                history.replaceState(null, null, '#' + id);
            }
        };

        // Initialize on DOM Ready
        document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('nexo-theme') || 'light';
            window.updateTheme(savedTheme);

            const hash = window.location.hash.replace('#', '');
            if (hash && document.getElementById(hash)) {
                window.showTab(hash);
            } else {
                window.showTab('dashboard');
            }
        });

        window.copySnippet = function(txt, btn) {
            navigator.clipboard.writeText(txt).then(() => {
                const original = btn.innerHTML;
                btn.innerHTML = 'Copied!';
                setTimeout(() => { btn.innerHTML = original; }, 1000);
            }).catch(() => {
                alert('Clipboard access denied. Please copy manually: ' + txt);
            });
        };

        window.copyFeaturePaths = function(feature, paths, btn) {
            const prompt = "Refactor request for " + feature + ": " + paths.join(', ');
            navigator.clipboard.writeText(prompt).then(() => {
                const original = btn.innerHTML;
                btn.innerHTML = 'Prompt Copied!';
                setTimeout(() => { btn.innerHTML = original; }, 2000);
            });
        };
    </script>
</body>
</html>
`;

    fs.writeFileSync(OUTPUT_FILE, html);
    console.log(`✨ Nexo Master Architect synchronized main portal.`);

    // --- 📝 README.md LIVE SYNC ---
    const readmePath = path.join(ROOT, "README.md");
    if (fs.existsSync(readmePath)) {
        let readmeContent = fs.readFileSync(readmePath, "utf-8");
        const startMarker = "<!-- FEATURE_INVENTORY_START -->";
        const endMarker = "<!-- FEATURE_INVENTORY_END -->";
        const startIndex = readmeContent.indexOf(startMarker);
        const endIndex = readmeContent.indexOf(endMarker);
        
        if (startIndex !== -1 && endIndex !== -1) {
            const inventoryTable = [
                "| Status | Feature Module | Complexity | Density | Specification |",
                "| :--- | :--- | :--- | :--- | :--- |",
                ...moduleData.map(m => {
                    const status = m.rating === "A+" ? "Optimal" : (m.rating === "B" ? "High" : "Critical");
                    const color = m.rating === "A+" ? "brightgreen" : (m.rating === "B" ? "orange" : "red");
                    const liveUrl = `https://nexowebai.github.io/nexo-superadmin/src/features/${m.name.toLowerCase()}/README.md`;
                    return `| ![${status}](https://img.shields.io/badge/-${status}-${color}) | **${m.name.toUpperCase()}** | ${m.totalLines} LoC | ${m.totalFiles} Nodes | [View Specs](${liveUrl}) |`;
                })
            ].join("\n");
            
            const newContent = readmeContent.slice(0, startIndex + startMarker.length) + "\n\n" + inventoryTable + "\n\n" + readmeContent.slice(endIndex);
            fs.writeFileSync(readmePath, newContent);
            console.log("📝 README.md synchronized with LIVE links.");
        }
    }

    // --- 🧬 FEATURE-SPECIFIC DOCS SYNC ---
    moduleData.forEach(m => syncFeatureReadme(m));
}

function syncFeatureReadme(m) {
    const featurePath = path.join(FEATURES_DIR, m.name.toLowerCase());
    const readmePath = path.join(featurePath, "README.md");
    if (!fs.existsSync(readmePath)) return;

    const status = m.rating === "A+" ? "Optimal" : (m.rating === "B" ? "High" : "Critical");
    const color = m.rating === "A+" ? "brightgreen" : (m.rating === "B" ? "orange" : "red");

    const auditTable = [
        "| Entity | Score | Complexity | LoC | Status |",
        "| :--- | :--- | :--- | :--- | :--- |",
        ...m.allFiles.map(f => {
            const score = Math.max(0, 100 - Math.floor(f.lines / 2));
            const statusIcon = f.priority === "Low" ? "✅ STABLE" : (f.priority === "High" ? "⚠️ REFACTOR" : "🚨 CRITICAL");
            return `| \`${f.name}\` | ${score} | ${f.priority} | ${f.lines} | ${statusIcon} |`;
        })
    ].join("\n");

    const topology = generateThemedTopology(m.allFiles);
    const sequence = generateThemedSequence(m.allFiles);
    const apiSurface = m.allFiles.flatMap(f => f.api.map(a => ({ ...a, source: f.name })));

    let content = [
        `# Feature Intelligence: ${m.name.toUpperCase()}`,
        "",
        `![Audit](https://img.shields.io/badge/Architecture-Institutional-6366f1)`,
        `![Complexity](https://img.shields.io/badge/Complexity_Score-${status}-${color})`,
        `![AST](https://img.shields.io/badge/Scanner-Babel_AST-blue)`,
        "",
        "## 🏛️ Architectural Topology",
        "### 1. Thematic Dependency Graph",
        "Babel-parsed internal mapping of module relationships.",
        "",
        topology,
        "",
        "### 2. Execution Sequence",
        "Runtime orchestration between View, Logic, and Infrastructure layers.",
        "",
        sequence,
        "",
        "---",
        "",
        "## 📡 API Surface (Inferred)",
        "Automated mapping of external connectivity within this module.",
        "",
        "| Method | Endpoint | Source Provider |",
        "| :--- | :--- | :--- |",
        (apiSurface.map(a => `| ${a.method} | \`${a.endpoint}\` | ${a.source} |`).join("\n") || "| - | - | - |"),
        "",
        "---",
        "",
        "## 📂 Engineering Audit",
        auditTable,
        "",
        "---",
        `*Generated by Nexo Master Architect V24.0 | Institutional Standard*`
    ].join("\n");

    fs.writeFileSync(readmePath, content);
    console.log(`🧬 Feature Doc synchronized: ${m.name}`);
}

function generateThemedTopology(files) {
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
        f.dependencies.forEach(i => {
            const base = i.split("/").pop().split(".")[0];
            const target = files.find(x => x.simpleName === base);
            if (target) d += `    ${fid} --> ${target.name.replace(/\W/g, "")}\n`;
        });
    });

    d += "```";
    return d;
}

function generateThemedSequence(files) {
    const page = files.find(f => f.jsx > 10) || files.find(f => f.name.includes("Page")) || files[0];
    const hook = files.find(f => f.name.startsWith("use") && f.name.includes(page?.simpleName.replace("Page", ""))) || files.find(f => f.name.startsWith("use"));
    const service = files.find(f => f.api.length > 0) || files.find(f => f.name.includes("Service"));

    let d = "```mermaid\nsequenceDiagram\nautonumber\n";
    if (page && hook && service) {
        d += `    participant P as ${page.name}\n`;
        d += `    participant H as ${hook.name}\n`;
        d += `    participant S as ${service.name}\n`;
        d += `    participant API as External/API\n\n`;
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

run();
