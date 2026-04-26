import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

/**
 * 🏔️ NEXO COMMAND ARCHITECT (V22.0) - THE PORTABLE ASSET EDITION
 */

const ROOT = process.cwd();
const FEATURES_DIR = path.join(ROOT, "src/features");
const OUTPUT_DIR = path.join(ROOT, "docs");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.html");

const LOGO_PATH = path.join(ROOT, "src/assets/logo/nexo-full.png");
const FAVICON_PATH = path.join(ROOT, "dist/favicon.png");

// Helper to convert images to Base64 for true portability
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
        const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
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

    const features = fs.readdirSync(FEATURES_DIR).filter(f => fs.statSync(path.join(FEATURES_DIR, f)).isDirectory());
    
    const moduleData = features.map(f => {
        const base = path.join(FEATURES_DIR, f);
        const files = [];
        ["pages", "hooks", "services", "components"].forEach(sub => {
            const dir = path.join(base, sub);
            if (fs.existsSync(dir)) {
                fs.readdirSync(dir).filter(x => x.endsWith(".js") || x.endsWith(".jsx") || x.endsWith(".ts") || x.endsWith(".tsx")).forEach(file => {
                    files.push(analyzeFile(path.join(dir, file)));
                });
            }
        });

        const totalLines = files.reduce((s, x) => s + x.lines, 0);
        const refactorFiles = files.filter(f => f.priority !== "Low");
        const maintenanceScore = Math.max(0, 100 - (refactorFiles.length * 15));

        return {
            name: f.charAt(0).toUpperCase() + f.slice(1),
            totalFiles: files.length,
            totalLines,
            rating: maintenanceScore >= 90 ? "A+" : (maintenanceScore >= 70 ? "B" : "C"),
            refactorFiles,
            allFiles: files.sort((a, b) => b.lines - a.lines)
        };
    });

    const totalSystemLines = moduleData.reduce((s, m) => s + m.totalLines, 0);
    const totalRefactors = moduleData.reduce((s, m) => s + m.refactorFiles.length, 0);
    const totalFiles = moduleData.reduce((s, m) => s + m.totalFiles, 0);
    const systemHealth = Math.max(0, Math.min(100, Math.round(100 - (totalRefactors / (totalFiles || 1) * 100))));

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
        .brand img { max-width: 180px; }
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

        /* Stability Section */
        .stability-section { padding: 0 12px; margin: 20px 0; }
        .stability-card {
            padding: 20px; border-radius: var(--radius-lg);
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid rgba(255, 255, 255, 0.1); color: white;
        }
        [data-theme="dark"] .stability-card { background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%); }
        .sc-label { font-size: 9px; font-weight: 800; text-transform: uppercase; opacity: 0.6; margin-bottom: 4px; }
        .sc-value { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
        .sc-progress { height: 4px; background: rgba(255, 255, 255, 0.15); border-radius: 10px; margin-bottom: 12px; }
        .sc-bar { height: 100%; background: white; border-radius: 10px; }

        .matrix-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; transition: 0.3s; }
        .matrix-card:hover { transform: translateY(-4px); border-color: var(--primary); }
        .mc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }

        .tab-view { display: none; }
        .tab-view.active { display: block; animation: fadeInUp 0.4s ease forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
    </style>
</head>
<body data-theme="light">
    <div class="sidebar">
        <div class="brand"><img src="${LOGO_BASE64}" alt="Nexo Logo"></div>
        <div class="nav">
            <div id="nav-dashboard" class="nav-item active" onclick="showTab('dashboard')">Dashboard</div>
            <div id="nav-audit" class="nav-item" onclick="showTab('audit')">Technical Audit</div>
            <div id="nav-priority" class="nav-item" onclick="showTab('priority')">Refactor Matrix</div>
            <div id="nav-registry" class="nav-item" onclick="showTab('registry')">Node Registry</div>
        </div>
        <div class="stability-section">
            <div class="stability-card">
                <div class="sc-label">Stability</div>
                <div class="sc-value">${systemHealth}%</div>
                <div class="sc-progress"><div class="sc-bar" style="width: ${systemHealth}%"></div></div>
            </div>
        </div>
    </div>

    <header>
        <div class="h-info"><h2>Command Architect</h2><p>V22.0 Portable Assets</p></div>
        <div class="header-actions">
            <div class="theme-toggle" onclick="toggleTheme()"><svg id="theme-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg></div>
            <div style="text-align: right; line-height: 1.2;"><div style="font-weight: 800; font-size: 13px;">Architect</div><div style="font-size: 10px; color: var(--text-muted);">Production</div></div>
        </div>
    </header>

    <div class="content">
        <div id="dashboard" class="tab-view active">
            <div class="view-description"><div class="vd-text"><h4>Intelligence Dashboard</h4><p>High-level system health and logic density aggregation.</p></div></div>
            <div class="hero-stats">
                <div class="stat-box"><div class="sb-label">Logical Lines</div><div class="sb-value">${totalSystemLines.toLocaleString()}</div></div>
                <div class="stat-box"><div class="sb-label">Modules</div><div class="sb-value">${moduleData.length}</div></div>
                <div class="stat-box"><div class="sb-label">Health</div><div class="sb-value" style="color: var(--success)">${systemHealth}%</div></div>
                <div class="stat-box"><div class="sb-label">Risk Nodes</div><div class="sb-value" style="color: var(--danger)">${totalRefactors}</div></div>
            </div>
            <div class="feature-grid">
                ${moduleData.map(m => `
                    <div class="feature-card">
                        <div class="f-top"><div class="f-name">${m.name}</div><div class="f-rating" style="color: ${m.rating === 'A+' ? 'var(--success)' : (m.rating === 'B' ? 'var(--warning)' : 'var(--danger)')}">${m.rating}</div></div>
                        <div class="f-row"><span>Files</span><span style="font-weight:700">${m.totalFiles}</span></div>
                        <div class="f-row"><span>Lines</span><span style="font-weight:700">${m.totalLines}</span></div>
                        <div class="f-progress"><div class="f-bar" style="width: ${m.rating === 'A+' ? 100 : (m.rating === 'B' ? 70 : 40)}%; background: ${m.rating === 'A+' ? 'var(--success)' : (m.rating === 'B' ? 'var(--warning)' : 'var(--danger)')}"></div></div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="audit" class="tab-view">
            <div class="view-description"><div class="vd-text"><h4>Technical Audit</h4><p>Detailed maintenance grading for every node identity.</p></div></div>
            ${moduleData.map(m => `
                <div class="portal-card" style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="font-weight: 800;">${m.name} Resource Pool</h4>
                        <button class="action-btn primary" onclick='copyFeaturePaths("${m.name}", ${JSON.stringify(m.refactorFiles.map(f => f.fullPath))})'>Refactor Prompt</button>
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

        <div id="priority" class="tab-view">
            <div class="view-description"><div class="vd-text"><h4>Refactor Matrix</h4><p>Remediation queue for high-volumetric risk nodes.</p></div></div>
            <div class="feature-grid">
                ${moduleData.flatMap(m => m.refactorFiles).map(f => `
                    <div class="matrix-card">
                        <div class="mc-header"><div style="font-weight:800; display: flex; align-items: center; gap: 8px;">${FILE_ICON} ${f.name}</div><span class="badge badge-${f.priority}">${f.priority}</span></div>
                        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Violation: <strong>${f.lines} Lines</strong></div>
                        <div style="display: flex; justify-content: flex-end;">
                            <button class="action-btn primary" onclick="copySnippet('${f.fullPath}', this)">${COPY_ICON} Copy Path</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="registry" class="tab-view">
            <div class="view-description"><div class="vd-text"><h4>Node Registry</h4><p>Physical inventory of the project filesystem.</p></div></div>
            <div class="portal-card">
                <table class="portal-table">
                    ${moduleData.flatMap(m => m.allFiles).map(f => `
                        <tr>
                            <td style="display: flex; align-items: center; justify-content: space-between; gap: 12px; border: none;">
                                <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">${FILE_ICON} <span style="font-size: 12px; color: var(--text-muted); font-family: 'JetBrains Mono'; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${f.fullPath}</span></div>
                                <button class="action-btn" onclick="copySnippet('${f.fullPath}', this)">${COPY_ICON} Copy Path</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    </div>

    <script>
        function toggleTheme() {
            const body = document.body; const icon = document.getElementById('theme-icon'); const isDark = body.getAttribute('data-theme') === 'dark';
            body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            icon.innerHTML = isDark ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>' : '<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
        }
        function showTab(id) {
            document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active')); 
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            const target = document.getElementById(id);
            if (target) target.classList.add('active');
            const nav = document.getElementById('nav-' + (id === 'priority' ? 'priority' : id));
            if (nav) nav.classList.add('active');
            window.location.hash = id;
        }
        window.onload = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) showTab(hash);
        };
        function copySnippet(txt, btn) {
            navigator.clipboard.writeText(txt).then(() => {
                const original = btn.innerHTML;
                const isPrimary = btn.classList.contains('primary');
                btn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke: var(--success)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg> Copied!';
                btn.style.borderColor = 'var(--success)'; btn.style.color = 'var(--success)';
                btn.style.background = isPrimary ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)';
                setTimeout(() => { btn.innerHTML = original; btn.style.borderColor = ''; btn.style.color = ''; btn.style.background = ''; }, 1000);
            });
        }
        function copyFeaturePaths(feature, paths) {
            const prompt = "Please refactor the following " + feature + " files:\\n\\n" + paths.join('\\n');
            navigator.clipboard.writeText(prompt).then(() => {
                const btn = event.currentTarget; const original = btn.innerHTML;
                btn.innerHTML = 'Prompt Copied!'; btn.style.borderColor = 'var(--success)'; btn.style.color = 'var(--success)';
                btn.style.background = 'rgba(16, 185, 129, 0.1)';
                setTimeout(() => { btn.innerHTML = original; btn.style.borderColor = ''; btn.style.color = ''; btn.style.background = ''; }, 1000);
            });
        }
    </script>
</body>
</html>
    `;

    fs.writeFileSync(OUTPUT_FILE, html);
    console.log(`✨ Nexo Command Architect V22.0 synchronized at ${OUTPUT_FILE}`);
}
run();
