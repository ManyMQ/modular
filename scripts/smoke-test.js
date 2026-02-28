/**
 * Smoke Test — Module Load & Basic API Verification
 *
 * Run: node scripts/smoke-test.js
 */

'use strict';

let passed = 0;
let failed = 0;

function assert(condition, label) {
    if (condition) {
        console.log(`  ✓ ${label}`);
        passed++;
    } else {
        console.log(`  ✗ ${label}`);
        failed++;
    }
}

console.log('\n  Smoke Test\n');
console.log('─'.repeat(50));

// 1. Module loads without errors
let mod;
try {
    mod = require('..');
    assert(true, 'Module loads without errors');
} catch (e) {
    console.log(`  ✗ Module load FAILED: ${e.message}`);
    process.exit(1);
}

// 2. Core exports exist
assert(typeof mod.Engine === 'function', 'Engine class exported');
assert(typeof mod.CardBuilder === 'function', 'CardBuilder class exported');
assert(typeof mod.RenderPipeline === 'function', 'RenderPipeline class exported');
assert(typeof mod.ThemeManager === 'function', 'ThemeManager class exported');
assert(typeof mod.BaseTheme === 'function', 'BaseTheme class exported');
assert(typeof mod.themeToTokens === 'function', 'themeToTokens function exported');
assert(typeof mod.getAvailableThemes === 'function', 'getAvailableThemes function exported');
assert(typeof mod.createEngine === 'function', 'createEngine factory exported');

// 3. Engine creates successfully
let engine;
try {
    engine = mod.createEngine();
    assert(true, 'createEngine() succeeds');
} catch (e) {
    console.log(`  ✗ createEngine failed: ${e.message}`);
    failed++;
}

// 4. Theme listing
const themes = mod.getAvailableThemes();
assert(Array.isArray(themes), 'getAvailableThemes returns array');
assert(themes.length >= 21, `At least 21 themes registered (got ${themes.length})`);

// 5. Token generation
const discordTokens = mod.themeToTokens('discord');
assert(discordTokens['surface.primary'] !== undefined, 'discord theme has surface.primary token');
assert(discordTokens['avatar.shape'] !== undefined, 'discord theme has avatar.shape token');

const neonTokens = mod.themeToTokens('neon-tech');
assert(neonTokens['effect.levelCircle'] === true, 'neon-tech has effect.levelCircle');
assert(neonTokens['effect.scanlines'] === true, 'neon-tech has effect.scanlines');

// 6. Builder API
if (engine) {
    try {
        const builder = engine.createRankCard();
        assert(typeof builder.setTheme === 'function', 'RankCardBuilder has setTheme');
        assert(typeof builder.render === 'function', 'RankCardBuilder has render');
        builder.setTheme('neon-tech');
        assert(true, 'setTheme(neon-tech) does not throw');
    } catch (e) {
        console.log(`  ✗ Builder test failed: ${e.message}`);
        failed++;
    }
}

console.log('─'.repeat(50));
console.log(`\n  Total: ${passed + failed} checks | ${passed} passed | ${failed} failed`);

if (failed > 0) {
    console.log('  FAILED\n');
    process.exit(1);
} else {
    console.log('  PASSED\n');
}
