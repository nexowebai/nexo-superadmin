import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

/**
 * 🏢 NEXO COMMAND (V10.0) - THE INSTITUTIONAL EDITION
 * 
 * A professional, high-fidelity engineering dashboard.
 * - Fixed Layout (Sidebar & Header)
 * - Simple, Non-Technical Language
 * - Refactor Hub with Copy Shortcuts
 * - Authentic Nexo Branding
 */

const ROOT = process.cwd();
const FEATURES_DIR = path.join(ROOT, "src/features");
const ASSETS_DIR = path.join(ROOT, "src/assets");
const OUTPUT_DIR = path.join(ROOT, "docs");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.html");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf-8");
    try {
        const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
        const data = {
            name: path.basename(filePath),
            fullPath: filePath.replace(ROOT, ""),
            lines: code.split("\n").length,
            exports: 0,
            handlers: 0,
            status: "Clean"
        };

        traverse(ast, {
            ExportNamedDeclaration: () => { data.exports++; },
            CallExpression(p) {
                const name = p.node.callee.name || (p.node.callee.property ? p.node.callee.property.name : "");
                if (name.startsWith("handle") || name.startsWith("on")) data.handlers++;
            }
        });
        
        data.status = data.lines > 150 ? "Needs Refactor" : "Stable";
        return data;
    } catch {
        const lines = code.split("\n").length;
        return { 
            name: path.basename(filePath), 
            fullPath: filePath.replace(ROOT, ""), 
            lines, 
            exports: 0, 
            handlers: 0, 
            status: lines > 150 ? "Needs Refactor" : "Stable" 
        };
    }
}

function run() {
    console.log("🏢 Nexo Command: Building Professional Engineering Suite...");

    const features = fs.readdirSync(FEATURES_DIR).filter(f => fs.statSync(path.join(FEATURES_DIR, f)).isDirectory());
    
    const moduleData = features.map(f => {
        const base = path.join(FEATURES_DIR, f);
        const files = [];
        ["pages", "hooks", "services", "components"].forEach(sub => {
            const dir = path.join(base, sub);
            if (fs.existsSync(dir)) {
                fs.readdirSync(dir).filter(x => x.endsWith(".js") || x.endsWith(".jsx")).forEach(file => {
                    files.push(analyzeFile(path.join(dir, file)));
                });
            }
        });

        const totalLines = files.reduce((s, x) => s + x.lines, 0);
        const refactorFiles = files.filter(f => f.status === "Needs Refactor");

        return {
            name: f.charAt(0).toUpperCase() + f.slice(1),
            totalFiles: files.length,
            totalLines,
            cleanliness: Math.round(((files.length - refactorFiles.length) / files.length) * 100) || 100,
            refactorFiles,
            allFiles: files.sort((a, b) => b.lines - a.lines)
        };
    });

    const totalSystemLines = moduleData.reduce((s, m) => s + m.totalLines, 0);
    const systemStability = Math.round(moduleData.reduce((s, m) => s + m.cleanliness, 0) / moduleData.length);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexo Command | Engineering Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-page: #f8fafc;
            --sidebar: #ffffff;
            --header: rgba(255, 255, 255, 0.8);
            --text-primary: #0f172a;
            --text-secondary: #64748b;
            --primary: #6366f1;
            --primary-light: #e0e7ff;
            --border: #e2e8f0;
            --card: #ffffff;
            --danger: #ef4444;
            --success: #10b981;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: var(--bg-page); 
            color: var(--text-primary); 
            font-family: 'Outfit', sans-serif;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        /* Sidebar - Fixed */
        .sidebar {
            width: 260px;
            height: 100vh;
            background: var(--sidebar);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
        }

        .logo-area { 
            padding: 30px; 
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .logo-img { height: 32px; width: auto; }
        .logo-text { font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: var(--primary); }

        .nav { padding: 20px 15px; flex: 1; }
        .nav-item {
            padding: 12px 15px;
            border-radius: 10px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .nav-item:hover { background: var(--bg-page); color: var(--text-primary); }
        .nav-item.active { background: var(--primary-light); color: var(--primary); }

        /* Header - Fixed */
        header {
            position: fixed;
            top: 0;
            left: 260px;
            right: 0;
            height: 80px;
            background: var(--header);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
            padding: 0 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 90;
        }

        .header-title h1 { font-size: 20px; font-weight: 700; }
        .header-meta { font-size: 13px; color: var(--text-secondary); }

        /* Content Area - Scrollable */
        .content {
            margin-left: 260px;
            margin-top: 80px;
            flex: 1;
            padding: 40px;
            overflow-y: auto;
            height: calc(100vh - 80px);
        }

        .stats-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: var(--card);
            padding: 24px;
            border-radius: 16px;
            border: 1px solid var(--border);
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .stat-label { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; font-weight: 500; }
        .stat-value { font-size: 28px; font-weight: 800; }

        .section-title { font-size: 18px; font-weight: 700; margin-bottom: 24px; color: var(--text-primary); }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 24px;
        }

        .module-card {
            background: var(--card);
            border-radius: 16px;
            border: 1px solid var(--border);
            padding: 24px;
            transition: border-color 0.2s;
        }
        .module-card:hover { border-color: var(--primary); }

        .module-header { display: flex; justify-content: space-between; margin-bottom: 16px; }
        .module-name { font-size: 18px; font-weight: 700; }
        .status-pill { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }

        .data-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: var(--text-secondary); }
        .data-value { color: var(--text-primary); font-weight: 600; }

        .progress { width: 100%; height: 6px; background: #f1f5f9; border-radius: 10px; margin: 15px 0; }
        .progress-bar { height: 100%; border-radius: 10px; transition: width 1s; }

        /* File List Table */
        .file-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .file-table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .copy-btn { 
            padding: 4px 8px; font-size: 10px; background: #f1f5f9; border-radius: 4px; 
            cursor: pointer; color: var(--text-secondary); border: none; font-weight: 600;
        }
        .copy-btn:hover { background: var(--primary-light); color: var(--primary); }

        .tab-content { display: none; }
        .tab-content.active { display: block; }

        /* Refactor Modal */
        .alert-box {
            background: #fff1f2;
            border: 1px solid #fda4af;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .alert-icon { font-size: 24px; }
        .alert-text { font-size: 14px; color: #9f1239; font-weight: 500; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="logo-area">
            <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layers.svg" class="logo-img" style="filter: invert(41%) sepia(85%) saturate(1469%) hue-rotate(215deg) brightness(101%) contrast(97%);">
            <div class="logo-text">NEXO COMMAND</div>
        </div>
        <div class="nav">
            <div class="nav-item active" onclick="showTab('dashboard')">🏠 Dashboard</div>
            <div class="nav-item" onclick="showTab('features')">📁 Feature Audit</div>
            <div class="nav-item" onclick="showTab('refactor')">🛠️ Refactor Center</div>
            <div class="nav-item" onclick="showTab('files')">📄 System Files</div>
        </div>
        <div style="padding: 20px; border-top: 1px solid var(--border);">
            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 5px;">System Cleanliness</div>
            <div style="font-size: 18px; font-weight: 800;">${systemStability}%</div>
        </div>
    </div>

    <header>
        <div class="header-title">
            <h1>Engineering Pulse</h1>
            <div class="header-meta">Internal Codebase Metrics • V10.0 Professional</div>
        </div>
        <div style="display: flex; gap: 10px;">
            <div style="text-align: right;">
                <div style="font-weight: 700; font-size: 14px;">Nexo Admin</div>
                <div style="font-size: 11px; color: var(--text-secondary);">Last Sync: ${new Date().toLocaleTimeString()}</div>
            </div>
        </div>
    </header>

    <div class="content">
        <div id="dashboard" class="tab-content active">
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-label">Total Codebase Lines</div>
                    <div class="stat-value">${totalSystemLines.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">System Modules</div>
                    <div class="stat-value">${moduleData.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Cleanliness Score</div>
                    <div class="stat-value" style="color: var(--success)">${systemStability}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Refactor Pending</div>
                    <div class="stat-value" style="color: var(--danger)">${moduleData.reduce((s, m) => s + m.refactorFiles.length, 0)}</div>
                </div>
            </div>

            <h2 class="section-title">System Modules</h2>
            <div class="grid">
                ${moduleData.map(m => `
                    <div class="module-card">
                        <div class="module-header">
                            <div class="module-name">${m.name}</div>
                            <div class="status-pill" style="background: ${m.cleanliness > 80 ? '#dcfce7' : '#fee2e2'}; color: ${m.cleanliness > 80 ? '#166534' : '#991b1b'};">
                                ${m.cleanliness}% Clean
                            </div>
                        </div>
                        <div class="data-row"><span>Total Files</span><span class="data-value">${m.totalFiles}</span></div>
                        <div class="data-row"><span>Total Lines</span><span class="data-value">${m.totalLines}</span></div>
                        <div class="progress"><div class="progress-bar" style="width: ${m.cleanliness}%; background: ${m.cleanliness > 80 ? 'var(--success)' : 'var(--danger)'};"></div></div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 10px;">
                            ${m.refactorFiles.length > 0 ? `<span style="color: var(--danger)">⚠️ ${m.refactorFiles.length} files need refactoring</span>` : '✅ Architecture is healthy'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="features" class="tab-content">
            <h2 class="section-title">Feature Level Deep-Dive</h2>
            ${moduleData.map(m => `
                <div style="background: white; padding: 30px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 30px;">
                    <h3 style="margin-bottom: 20px;">${m.name} Module</h3>
                    <table class="file-table">
                        <thead>
                            <tr style="text-align: left; font-size: 12px; color: var(--text-secondary);">
                                <th style="padding-bottom: 10px;">File Name</th>
                                <th style="padding-bottom: 10px;">Lines</th>
                                <th style="padding-bottom: 10px;">Status</th>
                                <th style="padding-bottom: 10px; text-align: right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${m.allFiles.map(f => `
                                <tr>
                                    <td style="font-weight: 500;">${f.name}</td>
                                    <td style="font-family: 'JetBrains Mono'; color: var(--text-secondary);">${f.lines}</td>
                                    <td>
                                        <span style="color: ${f.lines > 150 ? 'var(--danger)' : 'var(--success)'}; font-weight: 700; font-size: 11px;">
                                            ${f.lines > 150 ? 'REFACTOR' : 'STABLE'}
                                        </span>
                                    </td>
                                    <td style="text-align: right;">
                                        <button class="copy-btn" onclick="copyText('${f.fullPath}')">Copy Path</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}
        </div>

        <div id="refactor" class="tab-content">
            <div class="alert-box">
                <div class="alert-icon">🚀</div>
                <div class="alert-text">
                    <strong>Refactor Center:</strong> Below are the files that exceed the 150-line institutional limit. 
                    Copy their paths and ask your AI assistant to "Split this component into smaller functional fragments".
                </div>
            </div>

            <div class="grid">
                ${moduleData.flatMap(m => m.refactorFiles).map(f => `
                    <div class="module-card" style="border-left: 4px solid var(--danger);">
                        <div style="font-weight: 700; margin-bottom: 8px;">${f.name}</div>
                        <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 15px;">
                            Lines: <span style="color: var(--danger); font-weight: 800;">${f.lines}</span> / 150
                        </div>
                        <button class="copy-btn" style="width: 100%; padding: 10px;" onclick="copyText('${f.fullPath}')">
                            Copy Path for Refactoring
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="files" class="tab-content">
            <h2 class="section-title">System File Registry</h2>
            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid var(--border);">
                <table class="file-table">
                    ${moduleData.flatMap(m => m.allFiles).map(f => `
                        <tr>
                            <td><span style="color: var(--text-secondary); font-size: 11px; margin-right: 10px;">${f.fullPath.split('\\').slice(0,-1).join(' / ')} /</span> <strong>${f.name}</strong></td>
                            <td style="text-align: right;">
                                <button class="copy-btn" onclick="copyText('${f.fullPath}')">Copy Path</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        }

        function copyText(text) {
            navigator.clipboard.writeText(text).then(() => {
                const btn = event.target;
                const original = btn.innerText;
                btn.innerText = 'Copied!';
                btn.style.background = '#dcfce7';
                btn.style.color = '#166534';
                setTimeout(() => {
                    btn.innerText = original;
                    btn.style.background = '#f1f5f9';
                    btn.style.color = '#64748b';
                }, 2000);
            });
        }
    </script>
</body>
</html>
    `;

    fs.writeFileSync(OUTPUT_FILE, html);
    console.log(`✨ Nexo Command V10: Dashboard synchronized at ${OUTPUT_FILE}`);
}

run();
