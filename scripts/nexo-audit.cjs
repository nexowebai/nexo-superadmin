const fs = require('fs');
const path = require('path');

const CRITICAL_LINES = 250;
const WARNING_LINES = 200;
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.husky', 'docs', '.agents', '.gemini'];
const ROOT = path.join(__dirname, '..');
const REPORT_PATH = path.join(ROOT, 'docs/audit-report.json');

let violations = [];
let totalFiles = 0;

function auditFile(filePath) {
    totalFiles++;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/');

    // 1. Check Line Count (250 is Critical, 200-250 is Warning)
    if (lines.length > CRITICAL_LINES) {
        violations.push({
            type: 'LINE_COUNT',
            file: relativePath,
            message: `File has ${lines.length} lines (Critical Limit: ${CRITICAL_LINES})`,
            severity: 'CRITICAL'
        });
    } else if (lines.length > WARNING_LINES) {
        violations.push({
            type: 'LINE_COUNT',
            file: relativePath,
            message: `File has ${lines.length} lines (Institutional Target: <${WARNING_LINES})`,
            severity: 'WARNING'
        });
    }

    // 2. Check Inline Styles
    if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
        const hasInline = content.includes('style={{');
        const isBypassed = content.includes('/* allowed-inline */');

        if (hasInline && !isBypassed) {
            violations.push({
                type: 'INLINE_STYLE',
                file: relativePath,
                message: 'Contains forbidden inline styles.',
                severity: 'CRITICAL'
            });
        } else if (hasInline && isBypassed) {
            violations.push({
                type: 'INLINE_STYLE',
                file: relativePath,
                message: 'Bypassed inline style detected. Audit required.',
                severity: 'WARNING'
            });
        }
    }

    // 3. Check for legacy organizations.css imports
    if (content.includes('organizations.css') && !relativePath.includes('styles/organizations.css')) {
         violations.push({
             type: 'LEGACY_IMPORT',
             file: relativePath,
             message: 'Uses legacy organizations.css monolith. Move to modular styles.',
             severity: 'WARNING'
         });
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                walk(filePath);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            auditFile(filePath);
        }
    });
}

console.log('🏔️ Nexo Architect: Starting Global Codebase Audit...');
if (!fs.existsSync(path.dirname(REPORT_PATH))) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
}

walk(path.join(ROOT, 'src'));

const criticalViolations = violations.filter(v => v.severity === 'CRITICAL');
const report = {
    timestamp: new Date().toISOString(),
    totalFiles,
    violationsCount: violations.length,
    criticalCount: criticalViolations.length,
    violations: violations,
    healthScore: Math.max(0, 100 - (criticalViolations.length * 2))
};

fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

console.log(`✅ Audit Complete. Health Score: ${report.healthScore}%`);
console.log(`📄 Report saved to: ${REPORT_PATH}`);

const isStrict = process.argv.includes('--strict');
if (report.healthScore < 50 && isStrict) {
    console.error('❌ Critical failure: Global health score too low. Cleanup required.');
    process.exit(1);
}

process.exit(0);
