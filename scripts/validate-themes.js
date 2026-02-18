/**
 * Theme Validation Script
 * Verifies all themes produce unique, complete token sets.
 *
 * Run: node scripts/validate-themes.js
 */

'use strict';

const { cardThemes, themeToTokens } = require('../src/canvas/themes/index');

const REQUIRED_TOKENS = [
    'surface.primary', 'surface.secondary', 'accent.primary', 'accent.secondary',
    'text.primary', 'text.secondary', 'text.muted',
    'font.family', 'spacing.md', 'radius.card',
    'glow.strength', 'border.width', 'avatar.shape'
];

let errors = 0;
let warnings = 0;
const themeNames = Object.keys(cardThemes);

console.log(`\n  Theme Validation — ${themeNames.length} themes\n`);
console.log('─'.repeat(55));

// 1. Check each theme has required tokens
for (const name of themeNames) {
    const tokens = themeToTokens(name);
    const missing = REQUIRED_TOKENS.filter(key => tokens[key] === undefined);
    if (missing.length > 0) {
        console.log(`  ✗ ${name}: missing tokens → ${missing.join(', ')}`);
        errors++;
    } else {
        console.log(`  ✓ ${name}`);
    }
}

console.log('─'.repeat(55));

// 2. Check color uniqueness (no two themes should share all 3 surface+accent colors)
const signatures = {};
for (const name of themeNames) {
    const t = themeToTokens(name);
    const sig = [t['surface.primary'], t['accent.primary'], t['accent.secondary']].join('|');
    if (signatures[sig]) {
        console.log(`  ⚠ ${name} has identical colors to ${signatures[sig]}`);
        warnings++;
    }
    signatures[sig] = name;
}

// 3. Check effect flags are booleans
for (const name of themeNames) {
    const t = themeToTokens(name);
    for (const [key, val] of Object.entries(t)) {
        if (key.startsWith('effect.') && typeof val !== 'boolean') {
            console.log(`  ✗ ${name}: effect token '${key}' is ${typeof val}, expected boolean`);
            errors++;
        }
    }
}

console.log('─'.repeat(55));
console.log(`\n  Total: ${themeNames.length} themes | ${errors} errors | ${warnings} warnings`);

if (errors > 0) {
    console.log('  FAILED\n');
    process.exit(1);
} else {
    console.log('  PASSED\n');
}
