'use strict';

/**
 * Shared canvas drawing helpers used by all card renderers.
 * All functions are pure — they take ctx + tokens and draw to it.
 * No class needed here; plain functions are easier to tree-shake and test.
 */

const { roundRect, createLinearGradient, setShadow, clearShadow } = require('../../utils/canvas');
const { setAlpha } = require('../../utils/color');

/**
 * Draw the card base: background fill, glass overlay, grid, scanlines, and border glow.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {Object} tokens
 * @param {Function} scale - scale(value) helper from the renderer
 * @param {Function} roundRectPath - roundRectPath() helper from BaseComponent
 */
async function renderCardBackground(ctx, width, height, tokens, scale, roundRectPath) {
    const radius = scale(tokens['radius.card'] || 16);
    const bgColor = tokens['surface.primary'] || '#1a1b26';

    ctx.save();
    roundRectPath(ctx, 0, 0, width, height, radius);
    ctx.clip();

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    if (tokens['effect.glassmorphism'] || tokens['effect.backdropBlur']) {
        await renderGlassEffect(ctx, width, height);
    }

    if (tokens['effect.gridBackground']) {
        drawGrid(ctx, width, height, tokens['accent.primary'], 0.15, scale);
    }

    if (tokens['effect.scanlines']) {
        drawScanlines(ctx, width, height, 'rgba(255,255,255,0.05)');
    }

    ctx.restore();

    // Border / glow
    const glowStrength = tokens['glow.strength'];
    if (glowStrength > 0 || tokens['effect.gradientBorder']) {
        setShadow(ctx, {
            color: tokens['accent.glow'],
            blur: scale(glowStrength),
            offsetX: 0,
            offsetY: 0
        });

        if (tokens['effect.gradientBorder']) {
            ctx.strokeStyle = createLinearGradient(ctx, 0, 0, width, height, [
                { pos: 0, color: tokens['accent.primary'] },
                { pos: 1, color: tokens['accent.secondary'] }
            ]);
        } else {
            ctx.strokeStyle = tokens['accent.primary'];
        }

        ctx.lineWidth = scale(tokens['border.width'] || 1.5);
        roundRectPath(ctx, 0, 0, width, height, radius);
        ctx.stroke();
        clearShadow(ctx);
    }
}

/** Inner gradient for glassmorphism depth */
async function renderGlassEffect(ctx, width, height) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(255,255,255,0.10)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
    grad.addColorStop(1, 'rgba(255,255,255,0.02)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
}

/**
 * Render background-layer and foreground-layer theme decorations.
 * @param {'background'|'foreground'} layer
 */
function renderThemeDecorations(ctx, width, height, tokens, layer, scale, roundRectPath) {
    if (layer === 'background') {
        if (tokens['effect.particles']) {
            renderParticles(ctx, width, height, tokens, scale);
        }
    } else {
        if (tokens['effect.cornerBrackets']) {
            renderCornerBrackets(ctx, width, height, tokens, scale);
        }
        if (tokens['effect.neonBorders']) {
            renderNeonBorders(ctx, width, height, tokens, scale, roundRectPath);
        }
        if (tokens['effect.scanlines']) {
            renderMatrixScanlines(ctx, width, height, tokens, scale);
        }
        if (tokens['effect.techDeco']) {
            renderTechDeco(ctx, width, height, tokens, scale);
        }
    }
}

function renderParticles(ctx, width, height, tokens, scale) {
    ctx.save();
    for (let i = 0; i < 50; i++) {
        const x = (i * 137.5) % width;
        const y = (i * 258.1) % height;
        const size = (i % 3) + 0.5;
        const alpha = 0.2 + (i % 5) * 0.1;
        ctx.fillStyle = setAlpha('#FFFFFF', alpha);
        ctx.beginPath();
        ctx.arc(x, y, scale(size), 0, Math.PI * 2);
        ctx.fill();
        if (i % 10 === 0) {
            ctx.fillStyle = setAlpha(tokens['accent.primary'], alpha * 0.5);
            ctx.beginPath();
            ctx.arc(x, y, scale(size * 2), 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();
}

function renderCornerBrackets(ctx, width, height, tokens, scale) {
    const size = scale(20);
    const thick = scale(2);
    const offset = scale(4);
    ctx.strokeStyle = tokens['accent.primary'];
    ctx.lineWidth = thick;
    ctx.lineCap = 'square';

    // Top-left
    ctx.beginPath(); ctx.moveTo(offset + size, offset); ctx.lineTo(offset, offset); ctx.lineTo(offset, offset + size); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(width - offset - size, offset); ctx.lineTo(width - offset, offset); ctx.lineTo(width - offset, offset + size); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(offset, height - offset - size); ctx.lineTo(offset, height - offset); ctx.lineTo(offset + size, height - offset); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(width - offset - size, height - offset); ctx.lineTo(width - offset, height - offset); ctx.lineTo(width - offset, height - offset - size); ctx.stroke();
}

function renderNeonBorders(ctx, width, height, tokens, scale, roundRectPath) {
    ctx.save();
    const radius = scale(tokens['radius.card']);
    const color = tokens['accent.primary'];
    const weight = scale(tokens['border.width'] || 2.5);
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = setAlpha(color, 0.3 - i * 0.1);
        ctx.lineWidth = weight + scale(i * 4);
        roundRectPath(ctx, 0, 0, width, height, radius);
        ctx.stroke();
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    roundRectPath(ctx, 0, 0, width, height, radius);
    ctx.stroke();
    ctx.restore();
}

function renderMatrixScanlines(ctx, width, height, tokens, scale) {
    ctx.save();
    ctx.strokeStyle = setAlpha(tokens['accent.primary'], 0.05);
    ctx.lineWidth = scale(1);
    for (let i = 0; i < height; i += scale(4)) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }
    ctx.restore();
}

function renderTechDeco(ctx, width, height, tokens, scale) {
    ctx.save();
    const color = tokens['accent.secondary'] || '#38EF7D';
    const subColor = tokens['accent.primary'] || '#11998E';
    const barH = scale(4);
    const topGrad = createLinearGradient(ctx, 0, 0, width, 0, [
        { pos: 0, color: subColor },
        { pos: 1, color }
    ]);
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, barH);
    ctx.fillRect(0, height - barH, width, barH);

    const size = scale(30);
    const thick = scale(3);
    ctx.strokeStyle = color;
    ctx.lineWidth = thick;
    ctx.beginPath(); ctx.moveTo(width - size, 0); ctx.lineTo(width, 0); ctx.lineTo(width, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, height - size); ctx.lineTo(0, height); ctx.lineTo(size, height); ctx.stroke();
    ctx.restore();
}

function drawGrid(ctx, width, height, color, opacity, scale) {
    ctx.save();
    ctx.strokeStyle = setAlpha(color, opacity);
    ctx.lineWidth = 1;
    const gridSize = 30;
    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for (let y = 0; y <= height; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke();
    ctx.restore();
}

function drawScanlines(ctx, width, height, color) {
    ctx.save();
    ctx.fillStyle = color;
    for (let y = 0; y < height; y += 4) { ctx.fillRect(0, y, width, 1); }
    ctx.restore();
}

/**
 * Render avatar image with optional glow, shape clip (circle/hexagon/polygon), and border.
 */
async function renderAvatar(ctx, x, y, size, src, tokens, scale, roundRectPath, loadImage, getFontWeight, withGlow = false) {
    const isCircle = tokens['avatar.shape'] === 'circle' || tokens['radius.avatar'] >= 50;
    const radius = scale(tokens['rank.radius.avatar'] || (isCircle ? size / 2 : 12));
    const shape = tokens['avatar.shape'] || 'circle';

    if (withGlow) {
        setShadow(ctx, { color: tokens['accent.glow'], blur: scale(tokens['glow.strength']), offsetX: 0, offsetY: 0 });
    }

    const _drawShape = () => {
        if (shape === 'hexagon') drawHexagon(ctx, x, y, size);
        else if (shape === 'polygon-clip') drawPolygonClip(ctx, x, y, size);
        else roundRectPath(ctx, x, y, size, size, radius);
    };

    _drawShape();

    if (withGlow) {
        setShadow(ctx, { color: tokens['shadow.color'] || tokens['accent.glow'], blur: scale(tokens['shadow.blur'] || 20), offsetX: 0, offsetY: scale(4) });
        ctx.fill();
        clearShadow(ctx);
    }

    ctx.save();
    ctx.beginPath();
    _drawShape();
    ctx.clip();

    ctx.fillStyle = tokens['surface.tertiary'];
    ctx.fillRect(x, y, size, size);

    if (src) {
        try {
            const img = await loadImage(src);
            ctx.drawImage(img, x, y, size, size);
        } catch {
            ctx.font = `${getFontWeight('bold')} ${scale(size * 0.4)}px Inter, sans-serif`;
            ctx.fillStyle = tokens['text.muted'];
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', x + size / 2, y + size / 2);
        }
    }
    ctx.restore();

    ctx.strokeStyle = tokens['accent.primary'] || '#5865F2';
    ctx.lineWidth = scale(2);
    ctx.beginPath();
    _drawShape();
    ctx.stroke();
}

/**
 * Draw a simple icon onto the canvas at (cx, cy).
 * Supports: play, pause, next, prev, shuffle, repeat, loop, volume,
 *           trophy, users, gift, award, target
 */
function drawIcon(ctx, cx, cy, size, type, color, scale) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = scale(2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const s = size / 2;

    switch (type) {
        case 'play':
            ctx.beginPath(); ctx.moveTo(cx - s * 0.7, cy - s); ctx.lineTo(cx + s, cy); ctx.lineTo(cx - s * 0.7, cy + s); ctx.closePath(); ctx.fill(); break;
        case 'pause':
            ctx.fillRect(cx - s * 0.8, cy - s, s * 0.5, s * 2); ctx.fillRect(cx + s * 0.3, cy - s, s * 0.5, s * 2); break;
        case 'next':
            ctx.beginPath(); ctx.moveTo(cx - s, cy - s); ctx.lineTo(cx, cy); ctx.lineTo(cx - s, cy + s); ctx.stroke();
            ctx.fillRect(cx + s * 0.2, cy - s, s * 0.4, s * 2); break;
        case 'prev':
            ctx.beginPath(); ctx.moveTo(cx + s, cy - s); ctx.lineTo(cx, cy); ctx.lineTo(cx + s, cy + s); ctx.stroke();
            ctx.fillRect(cx - s * 0.6, cy - s, s * 0.4, s * 2); break;
        case 'shuffle':
            ctx.beginPath(); ctx.moveTo(cx - s, cy - s * 0.5); ctx.lineTo(cx + s, cy + s * 0.5);
            ctx.moveTo(cx - s, cy + s * 0.5); ctx.lineTo(cx + s, cy - s * 0.5); ctx.stroke(); break;
        case 'repeat':
            ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 1.5); ctx.stroke(); break;
        case 'loop':
            ctx.strokeRect(cx - s, cy - s * 0.6, s * 2, s * 1.2); break;
        case 'volume':
            ctx.beginPath();
            ctx.moveTo(cx - s, cy - s * 0.3); ctx.lineTo(cx - s * 0.4, cy - s * 0.3);
            ctx.lineTo(cx + s * 0.3, cy - s * 0.8); ctx.lineTo(cx + s * 0.3, cy + s * 0.8);
            ctx.lineTo(cx - s * 0.4, cy + s * 0.3); ctx.lineTo(cx - s, cy + s * 0.3);
            ctx.closePath(); ctx.fill(); break;
        case 'trophy':
            ctx.beginPath();
            ctx.moveTo(cx - s * 0.6, cy - s); ctx.lineTo(cx + s * 0.6, cy - s); ctx.lineTo(cx + s * 0.6, cy);
            ctx.quadraticCurveTo(cx + s * 0.6, cy + s, cx, cy + s);
            ctx.quadraticCurveTo(cx - s * 0.6, cy + s, cx - s * 0.6, cy);
            ctx.closePath(); ctx.fill();
            ctx.fillRect(cx - s * 0.1, cy + s, s * 0.2, s * 0.5);
            ctx.fillRect(cx - s * 0.4, cy + s * 0.5, s * 0.8, s * 0.2); break;
        case 'users':
            ctx.beginPath(); ctx.arc(cx, cy - s * 0.2, s * 0.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx, cy + s * 0.8, s * 0.8, Math.PI, 0); ctx.fill();
            ctx.fillStyle = setAlpha(color, 0.6);
            ctx.beginPath(); ctx.arc(cx - s * 0.8, cy, s * 0.4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx + s * 0.8, cy, s * 0.4, 0, Math.PI * 2); ctx.fill(); break;
        case 'gift':
            ctx.fillRect(cx - s * 0.8, cy - s * 0.4, s * 1.6, s * 1.4);
            ctx.fillStyle = setAlpha('#FFFFFF', 0.8);
            ctx.fillRect(cx - s * 0.1, cy - s * 0.4, s * 0.2, s * 1.4);
            ctx.fillRect(cx - s * 0.8, cy + s * 0.2, s * 1.6, s * 0.2); break;
        case 'award':
            ctx.beginPath(); ctx.arc(cx, cy + s * 0.2, s * 0.6, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath();
            ctx.moveTo(cx - s * 0.4, cy + s * 0.2); ctx.lineTo(cx - s * 0.6, cy - s);
            ctx.lineTo(cx + s * 0.6, cy - s); ctx.lineTo(cx + s * 0.4, cy + s * 0.2);
            ctx.stroke(); break;
        case 'target':
            ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, s * 0.6, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, s * 0.2, 0, Math.PI * 2); ctx.fill(); break;
    }
    ctx.restore();
}

function drawHexagon(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + size / 2 + (size / 2) * Math.cos(angle);
        const py = y + size / 2 + (size / 2) * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

function drawPolygonClip(ctx, x, y, size) {
    const cut = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(x + cut, y); ctx.lineTo(x + size - cut, y);
    ctx.lineTo(x + size, y + cut); ctx.lineTo(x + size, y + size - cut);
    ctx.lineTo(x + size - cut, y + size); ctx.lineTo(x + cut, y + size);
    ctx.lineTo(x, y + size - cut); ctx.lineTo(x, y + cut);
    ctx.closePath();
}

function getFontWeight(weight) {
    return { regular: '400', medium: '500', semibold: '600', bold: '700' }[weight] || '400';
}

module.exports = {
    renderCardBackground,
    renderGlassEffect,
    renderThemeDecorations,
    renderAvatar,
    drawIcon,
    drawHexagon,
    drawPolygonClip,
    drawGrid,
    drawScanlines,
    getFontWeight
};
