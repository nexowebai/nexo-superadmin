import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

/**
 * 🏔️ NEXO COMMAND ARCHITECT (V23.0) - THE ELITE PROMPT EDITION
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

function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf-8");
    try {
        const ast = parse(code, { sourceType: "module", plugins: ["jsx", "typescript"] });
        const data = {
            name: path.basename(filePath),
            fullPath: filePath.replace(ROOT, "").replace(/\\/g, "/"),
            lines: code.split("\n").length,
            priority: "Low"
        };
        if (data.lines > 300) data.priority = "Critical";
        else if (data.lines > 150) data.priority = "High";
        return data;
    } catch {
        const lines = code.split("\n").length;
        return { 
            name: path.basename(filePath), 
            fullPath: filePath.replace(ROOT, "").replace(/\\/g, "/"), 
            lines, 
            priority: lines > 300 ? "Critical" : (lines > 150 ? "High" : "Low") 
        };
    }
}

function run() {
    console.log("🏔️ Nexo Command Architect: Orchestrating Elite-Grade Engineering Portal...");

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
    const totalRefactors = moduleData.reduce((s, m) => s + m.refactorFiles.length, 0);
    const totalFiles = moduleData.reduce((s, m) => s + m.totalFiles, 0);
    const systemHealth = auditReport.healthScore;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexo Command Architect | Engineering Portal</title>
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
        .brand { border-bottom: 1px solid var(--border); margin-bottom: 20px; display: flex; justify-content: center; padding: 12px 0; }
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
        <div class="h-info"><h2>Command Architect</h2><p>V23.0 Elite Pulse Engine</p></div>
        <div class="header-actions">
            <div class="theme-toggle" onclick="toggleTheme()" title="Toggle Visual Mode">
                <svg id="theme-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
                </svg>
            </div>
            <div style="text-align: right; line-height: 1.2;">
                <div style="font-weight: 800; font-size: 13px;">Lead Architect</div>
                <div style="font-size: 10px; color: var(--text-muted);">Institutional Mode</div>
            </div>
        </div>
    </header>

    <div class="content">
        <div id="dashboard" class="tab-view active">
            <div class="view-description"><div class="vd-text"><h4>Intelligence Dashboard</h4><p>High-level system health and logic density aggregation for the Nexo ecosystem.</p></div></div>
            <div class="hero-stats">
                <div class="stat-box"><div class="sb-label">Logical Lines</div><div class="sb-value">${totalSystemLines.toLocaleString()}</div></div>
                <div class="stat-box"><div class="sb-label">Modules</div><div class="sb-value">${moduleData.length}</div></div>
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
            ${moduleData.map(m => `
                <div class="portal-card" style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="font-weight: 800;">${m.name} Resource Pool</h4>
                        <button class="action-btn primary" onclick='copyFeaturePaths("${m.name}", ${JSON.stringify(m.refactorFiles.map(f => f.fullPath))}, this)'>Refactor Prompt</button>
                    </div>
                    <table class="portal-table">
                        <thead><tr><th class="col-node">Node Identity</th><th class="col-lines">Volume</th><th class="col-status">Stability</th><th class="col-action"><div style="display: flex; justify-content: flex-end;"><span class="badge" style="background: var(--primary); color: white;">Orchestration</span></div></th></tr></thead>
                        <tbody>
                            ${m.allFiles.map(f => `
                                <tr>
                                    <td class="col-node" style="font-weight: 700; display: flex; align-items: center; gap: 10px;">${FILE_ICON} ${f.name}</td>
                                    <td class="col-lines" style="font-family: 'JetBrains Mono'; opacity: 0.6;">${f.lines}</td>
                                    <td class="col-status"><span class="badge badge-${f.priority}">${f.priority}</span></td>
                                    <td class="col-action"><button class="action-btn" onclick="copySnippet('${f.fullPath}', this)">${COPY_ICON} Copy Path</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}
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
                                <button class="action-btn" style="margin-left: auto;" onclick="copySnippet('${v.file}', this)">${COPY_ICON} Copy Path</button>
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
                            <button class="action-btn primary" onclick="copySnippet('${f.fullPath}', this)">${COPY_ICON} Copy Path</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <script>
        // --- 🧊 NEXO CORE UI ENGINE ---

        function updateTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('nexo-theme', theme);
            
            const icon = document.getElementById('theme-icon');
            if (theme === 'dark') {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>';
            }
        }

        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            updateTheme(current === 'dark' ? 'light' : 'dark');
        }

        function showTab(id) {
            // Remove active classes
            document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active')); 
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            
            // Add active to target
            const target = document.getElementById(id);
            if (target) {
                target.classList.add('active');
                // Scroll to top of content
                document.querySelector('.content').scrollTop = 0;
            }
            
            const nav = document.getElementById('nav-' + id);
            if (nav) nav.classList.add('active');
            
            // Update hash without jumping
            history.replaceState(null, null, '#' + id);
        }

        // Initialize Engine
        document.addEventListener('DOMContentLoaded', () => {
            // Restore Theme
            const savedTheme = localStorage.getItem('nexo-theme') || 'light';
            updateTheme(savedTheme);

            // Restore Tab
            const hash = window.location.hash.replace('#', '');
            if (hash && document.getElementById(hash)) {
                showTab(hash);
            } else {
                showTab('dashboard');
            }
        });

        function copySnippet(txt, btn) {
            navigator.clipboard.writeText(txt).then(() => {
                const original = btn.innerHTML;
                const isPrimary = btn.classList.contains('primary');
                btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke: var(--success)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg> Copied!';
                btn.style.borderColor = 'var(--success)'; 
                btn.style.color = 'var(--success)';
                btn.style.background = isPrimary ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)';
                setTimeout(() => { 
                    btn.innerHTML = original; 
                    btn.style.borderColor = ''; 
                    btn.style.color = ''; 
                    btn.style.background = ''; 
                }, 1000);
            });
        }

        function copyFeaturePaths(feature, paths, btn) {
            const prompt = \`[INST] ELITE ARCHITECTURAL REMEDIATION TASK:
You are an expert full-stack engineer specialized in high-performance React architectures.
The following files in the **\${feature}** domain have violated the 150-line institutional density limit and require modular refactoring.

**ARCHITECTURE RULES:**
1. **Modular Splitting**: Extract complex logic into custom hooks (\`hooks/\`).
2. **Component Granularity**: Split large JSX blocks into atomic sub-components (\`components/\`).
3. **Separation of Concerns**: Pure UI should not handle API logic; delegate to \`services/\`.
4. **Governance**: Ensure NO file exceeds 150 lines post-refactor.
5. **Consistency**: Use existing design tokens, CSS variables, and Lucide icons.
6. **Error Handling**: Implement robust try/catch blocks with Sonner toasts.

**TARGET FILES:**
\${paths.join('\\n')}

Execute this refactor with production-grade efficiency and zero technical debt. [/INST]\`;

            navigator.clipboard.writeText(prompt).then(() => {
                const original = btn.innerHTML;
                btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke: var(--success)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg> Prompt Copied!';
                btn.style.borderColor = 'var(--success)'; 
                btn.style.color = 'var(--success)';
                btn.style.background = 'rgba(16, 185, 129, 0.1)';
                setTimeout(() => { 
                    btn.innerHTML = original; 
                    btn.style.borderColor = ''; 
                    btn.style.color = ''; 
                    btn.style.background = ''; 
                }, 2000);
            });
        }
    </script>
</body>
</html>
    `;

    fs.writeFileSync(OUTPUT_FILE, html);
    console.log(`✨ Nexo Command Architect V23.0 synchronized at ${OUTPUT_FILE}`);
}
run();
