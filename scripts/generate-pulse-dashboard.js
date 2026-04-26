import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

/**
 * 🏔️ NEXO COMMAND ARCHITECT (V11.0) - THE 12-LPA ELITE EDITION
 * 
 * A high-stakes, production-grade engineering command center.
 * - Global Font: Open Sans (Strict Enforcement)
 * - Aesthetic: High-Growth SaaS (Clean, Soft Depth, Premium Spacing)
 * - Features: DX Score, Maintenance Rating, Refactor Priority Matrix
 * - Layout: Fluid Fixed-Sidebar with Glassmorphism Overlays
 */

const ROOT = process.cwd();
const FEATURES_DIR = path.join(ROOT, "src/features");
const OUTPUT_DIR = path.join(ROOT, "docs");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.html");

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf-8");
    try {
        const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
        const data = {
            name: path.basename(filePath),
            fullPath: filePath.replace(ROOT, "").replace(/\\/g, "/"),
            lines: code.split("\n").length,
            exports: 0,
            hooks: 0,
            priority: "Low"
        };

        traverse(ast, {
            ExportNamedDeclaration: () => { data.exports++; },
            CallExpression(p) {
                const name = p.node.callee.name || (p.node.callee.property ? p.node.callee.property.name : "");
                if (name.startsWith("use")) data.hooks++;
            }
        });
        
        if (data.lines > 300) data.priority = "Critical";
        else if (data.lines > 150) data.priority = "High";
        
        return data;
    } catch {
        const lines = code.split("\n").length;
        return { 
            name: path.basename(filePath), 
            fullPath: filePath.replace(ROOT, "").replace(/\\/g, "/"), 
            lines, 
            exports: 0, 
            hooks: 0, 
            priority: lines > 300 ? "Critical" : (lines > 150 ? "High" : "Low") 
        };
    }
}

function run() {
    console.log("🏔️ Nexo Command Architect: Orchestrating Elite-Grade Engineering Portal...");

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
    const systemHealth = Math.round(moduleData.reduce((s, m) => s + (m.rating === "A+" ? 100 : (m.rating === "B" ? 70 : 40)), 0) / moduleData.length);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexo Command Architect | Engineering Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4f46e5;
            --primary-glow: rgba(79, 70, 229, 0.1);
            --bg: #fdfdfe;
            --sidebar: #ffffff;
            --surface: #ffffff;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border: #f1f5f9;
            --border-active: #e2e8f0;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: var(--bg); 
            color: var(--text-main); 
            font-family: 'Open Sans', sans-serif;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        /* Sidebar - SaaS Integrated Style */
        .sidebar {
            width: 280px;
            height: 100vh;
            background: var(--sidebar);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            position: fixed;
            left: 0; top: 0; z-index: 100;
        }

        .brand { 
            padding: 40px 32px; 
            display: flex; align-items: center; gap: 12px;
            font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
        }
        .brand-icon { 
            width: 36px; height: 36px; background: var(--primary); border-radius: 10px; 
            display: grid; place-items: center; color: white;
        }
        .brand span { color: var(--primary); }

        .nav { padding: 0 16px; flex: 1; }
        .nav-item {
            padding: 14px 16px;
            border-radius: 12px;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
            display: flex; align-items: center; gap: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .nav-item svg { width: 18px; height: 18px; stroke-width: 2.2; }
        .nav-item:hover { background: #f8fafc; color: var(--text-main); }
        .nav-item.active { background: var(--primary-glow); color: var(--primary); }

        /* Header */
        header {
            position: fixed;
            top: 0; left: 280px; right: 0;
            height: 80px;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            padding: 0 48px;
            display: flex; justify-content: space-between; align-items: center;
            z-index: 90;
        }

        .h-info h2 { font-size: 18px; font-weight: 700; color: var(--text-main); }
        .h-info p { font-size: 12px; color: var(--text-muted); font-weight: 500; }

        /* Content Area */
        .content {
            margin-left: 280px;
            margin-top: 80px;
            flex: 1;
            padding: 48px;
            overflow-y: auto;
            height: calc(100vh - 80px);
            scroll-behavior: smooth;
        }

        .hero-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 48px;
        }

        .stat-box {
            background: var(--surface);
            padding: 28px;
            border-radius: 24px;
            border: 1px solid var(--border);
            box-shadow: var(--shadow-sm);
        }
        .sb-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
        .sb-value { font-size: 32px; font-weight: 800; color: var(--text-main); }

        .section-header { 
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; 
        }
        .section-header h3 { font-size: 20px; font-weight: 800; }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 24px;
        }

        .feature-card {
            background: var(--surface);
            border-radius: 24px;
            border: 1px solid var(--border);
            padding: 32px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-card:hover { border-color: var(--primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }

        .f-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .f-name { font-size: 20px; font-weight: 800; }
        .f-rating { 
            width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; 
            font-weight: 800; font-size: 16px; border: 1px solid var(--border);
        }

        .f-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px; color: var(--text-muted); font-weight: 500; }
        .f-val { color: var(--text-main); font-weight: 700; }

        .f-progress { width: 100%; height: 6px; background: #f1f5f9; border-radius: 10px; margin: 20px 0; }
        .f-bar { height: 100%; border-radius: 10px; transition: width 1s; }

        /* Tables & Action Styles */
        .portal-card { background: white; border-radius: 28px; border: 1px solid var(--border); padding: 32px; box-shadow: var(--shadow-sm); }
        .portal-table { width: 100%; border-collapse: collapse; }
        .portal-table th { text-align: left; padding: 16px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); }
        .portal-table td { padding: 20px 16px; border-bottom: 1px solid #fcfcfd; font-size: 14px; }

        .action-btn { 
            background: #f8fafc; border: 1px solid var(--border); padding: 10px 18px; border-radius: 12px; 
            font-size: 12px; font-weight: 700; color: var(--text-muted); cursor: pointer; transition: all 0.2s;
        }
        .action-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-glow); }

        .priority-tag { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .priority-Critical { background: #fee2e2; color: #991b1b; }
        .priority-High { background: #ffedd5; color: #9a3412; }
        .priority-Low { background: #dcfce7; color: #166534; }

        .tab-view { display: none; }
        .tab-view.active { display: block; animation: fadeInUp 0.5s forwards; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; border: 4px solid var(--bg); }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="brand">
            <div class="brand-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            NEXO <span>PORTAL</span>
        </div>
        <div class="nav">
            <div class="nav-item active" onclick="showTab('dashboard')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                Infrastructure Overview
            </div>
            <div class="nav-item" onclick="showTab('audit')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Technical Audit
            </div>
            <div class="nav-item" onclick="showTab('priority')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Refactor Priority
            </div>
            <div class="nav-item" onclick="showTab('registry')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Node Registry
            </div>
        </div>
        <div style="padding: 32px; border-top: 1px solid var(--border);">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 12px;">System Stability</div>
            <div style="font-size: 28px; font-weight: 800;">${systemHealth}%</div>
            <div style="width: 100%; height: 6px; background: #f1f5f9; border-radius: 10px; margin-top: 16px; overflow: hidden;">
                <div style="width: ${systemHealth}%; height: 100%; background: var(--primary); border-radius: 10px;"></div>
            </div>
        </div>
    </div>

    <header>
        <div class="h-info">
            <h2>Engineering Command Center</h2>
            <p>Institutional Grade Architectural Intelligence • V11.0 Elite</p>
        </div>
        <div style="display: flex; align-items: center; gap: 24px;">
            <div style="text-align: right;">
                <div style="font-weight: 800; font-size: 14px;">Senior Architect</div>
                <div style="font-size: 11px; color: var(--text-muted);">Instance: Production-Spec</div>
            </div>
            <div style="width: 44px; height: 44px; background: #f1f5f9; border-radius: 14px; border: 2px solid white; box-shadow: var(--shadow-md);"></div>
        </div>
    </header>

    <div class="content">
        <div id="dashboard" class="tab-view active">
            <div class="hero-stats">
                <div class="stat-box">
                    <div class="sb-label">Logical Volume</div>
                    <div class="sb-value">${totalSystemLines.toLocaleString()}</div>
                </div>
                <div class="stat-box">
                    <div class="sb-label">Infrastructure Modules</div>
                    <div class="sb-value">${moduleData.length}</div>
                </div>
                <div class="stat-box">
                    <div class="sb-label">DX Health Score</div>
                    <div class="sb-value" style="color: var(--success)">${systemHealth}%</div>
                </div>
                <div class="stat-box">
                    <div class="sb-label">Maintenance Risk</div>
                    <div class="sb-value" style="color: ${totalRefactors > 5 ? 'var(--danger)' : 'var(--success)'}">${totalRefactors > 10 ? 'High' : (totalRefactors > 0 ? 'Med' : 'Low')}</div>
                </div>
            </div>

            <div class="section-header">
                <h3>Domain Ecosystem Health</h3>
            </div>
            <div class="feature-grid">
                ${moduleData.map(m => `
                    <div class="feature-card">
                        <div class="f-top">
                            <div class="f-name">${m.name}</div>
                            <div class="f-rating" style="color: ${m.rating === 'A+' ? 'var(--success)' : (m.rating === 'B' ? 'var(--warning)' : 'var(--danger)')}; border-color: currentColor;">
                                ${m.rating}
                            </div>
                        </div>
                        <div class="f-row"><span>Total Nodes</span><span class="f-val">${m.totalFiles} Units</span></div>
                        <div class="f-row"><span>Logic Density</span><span class="f-val">${m.totalLines} Lines</span></div>
                        <div class="f-progress">
                            <div class="f-bar" style="width: ${m.rating === 'A+' ? 100 : (m.rating === 'B' ? 70 : 40)}%; background: ${m.rating === 'A+' ? 'var(--success)' : (m.rating === 'B' ? 'var(--warning)' : 'var(--danger)')};"></div>
                        </div>
                        <div style="font-size: 13px; color: var(--text-muted); font-weight: 600; margin-top: 16px;">
                            ${m.refactorFiles.length > 0 ? `<span style="color: var(--danger)">⚠️ Integrity Alert: ${m.refactorFiles.length} nodes need review</span>` : '✅ All nodes meet institutional standards'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="audit" class="tab-view">
            <div class="section-header"><h3>Technical Node Audit</h3></div>
            ${moduleData.map(m => `
                <div class="portal-card" style="margin-bottom: 32px;">
                    <h4 style="margin-bottom: 24px; font-size: 18px;">${m.name} Resource Pool</h4>
                    <table class="portal-table">
                        <thead>
                            <tr>
                                <th>Logical Path</th>
                                <th>Lines</th>
                                <th>Maintenance Grade</th>
                                <th style="text-align: right;">Orchestration</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${m.allFiles.map(f => `
                                <tr>
                                    <td style="font-weight: 700;">${f.name}</td>
                                    <td style="font-family: 'JetBrains Mono'; font-weight: 600; color: var(--text-muted);">${f.lines}</td>
                                    <td>
                                        <span class="priority-tag priority-${f.priority}">
                                            ${f.priority === 'Low' ? 'STABLE' : f.priority}
                                        </span>
                                    </td>
                                    <td style="text-align: right;">
                                        <button class="action-btn" onclick="copySnippet('${f.fullPath}')">Copy Path</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}
        </div>

        <div id="priority" class="tab-view">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 48px; border-radius: 32px; color: white; margin-bottom: 48px; position: relative; overflow: hidden;">
                <div style="position: relative; z-index: 2;">
                    <h1 style="font-size: 36px; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px;">Maintenance Priority Matrix</h1>
                    <p style="opacity: 0.8; font-size: 16px; font-weight: 500;">High-volumetric nodes detected in system: <strong>${totalRefactors}</strong></p>
                </div>
                <div style="position: absolute; right: 40px; top: 40px; font-size: 80px; opacity: 0.1;">⚡</div>
            </div>

            <div class="feature-grid">
                ${moduleData.flatMap(m => m.refactorFiles).map(f => `
                    <div class="feature-card" style="border-top: 5px solid ${f.priority === 'Critical' ? 'var(--danger)' : 'var(--warning)'};">
                        <div style="font-weight: 800; font-size: 18px; margin-bottom: 12px;">${f.name}</div>
                        <div style="font-size: 14px; color: var(--text-muted); font-weight: 600; margin-bottom: 24px;">
                            Violation: <span style="color: var(--danger); font-weight: 800;">${f.lines} Lines</span> (Limit: 150)
                        </div>
                        <button class="action-btn" style="width: 100%; padding: 14px; background: var(--text-main); color: white; border: none;" onclick="copySnippet('${f.fullPath}')">
                            Initialize Refactor Sequence
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>

        <div id="registry" class="tab-view">
            <div class="section-header"><h3>Institutional Node Registry</h3></div>
            <div class="portal-card">
                <table class="portal-table">
                    ${moduleData.flatMap(m => m.allFiles).map(f => `
                        <tr>
                            <td style="color: var(--text-muted); font-weight: 500;">
                                <span style="opacity: 0.4;">${f.fullPath.split('/').slice(0,-1).join(' / ')} /</span> 
                                <strong style="color: var(--text-main);">${f.name}</strong>
                            </td>
                            <td style="text-align: right;">
                                <button class="action-btn" onclick="copySnippet('${f.fullPath}')">Copy Path</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        </div>
    </div>

    <script>
        function showTab(id) {
            document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.currentTarget.classList.add('active');
            document.querySelector('.content').scrollTop = 0;
        }

        function copySnippet(txt) {
            navigator.clipboard.writeText(txt).then(() => {
                const b = event.target;
                const o = b.innerText;
                b.innerText = 'Synchronized!';
                b.style.borderColor = 'var(--success)';
                b.style.color = 'var(--success)';
                b.style.background = '#f0fdf4';
                setTimeout(() => {
                    b.innerText = o;
                    b.style.borderColor = 'var(--border)';
                    b.style.color = 'var(--text-muted)';
                    b.style.background = '#f8fafc';
                }, 2000);
            });
        }
    </script>
</body>
</html>
    `;

    fs.writeFileSync(OUTPUT_FILE, html);
    console.log(`✨ Nexo Command Architect V11.0: Six-Figure Engineering Portal synchronized at ${OUTPUT_FILE}`);
}

run();
