/**
 * CardEffectUtils - Advanced rendering utilities for card effects
 * Glassmorphism, glow layers, shadows, corner brackets, scanlines
 */

const { createLinearGradient, setShadow, clearShadow } = require('./canvas');
const { setAlpha } = require('./color');

/**
 * Apply glassmorphism effect to canvas region
 */
function applyGlassmorphism(ctx, x, y, width, height, options = {}) {
  const {
    blur = 20,
    opacity = 0.6,
    highlight = true,
    border = true,
    noise = false
  } = options;

  ctx.save();

  // Create clipping path
  roundRectPath(ctx, x, y, width, height, options.radius || 16);
  ctx.clip();

  // Frosted glass base
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`);
  gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.1})`);
  gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.05})`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  // Highlight line at top
  if (highlight) {
    const highlightGrad = ctx.createLinearGradient(x, y, x + width, y);
    highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    highlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = highlightGrad;
    ctx.fillRect(x, y, width, 1);
  }

  // Subtle border
  if (border) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
    ctx.lineWidth = 1;
    roundRectPath(ctx, x + 0.5, y + 0.5, width - 1, height - 1, options.radius || 16);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render multi-layer glow effect
 */
function renderGlowLayer(ctx, x, y, width, height, color, options = {}) {
  const {
    strength = 20,
    layers = 3,
    radius = 16,
    inset = false
  } = options;

  ctx.save();

  // Multiple glow layers for depth
  for (let i = layers; i > 0; i--) {
    const layerStrength = strength * (i / layers);
    const alpha = 0.3 * (1 / i);
    
    setShadow(ctx, {
      color: setAlpha(color, alpha),
      blur: layerStrength,
      offsetX: 0,
      offsetY: 0
    });

    if (inset) {
      // Inner glow - stroke inside
      ctx.strokeStyle = setAlpha(color, alpha * 2);
      ctx.lineWidth = layerStrength * 0.5;
      roundRectPath(ctx, x, y, width, height, radius);
      ctx.stroke();
    } else {
      // Outer glow - fill shape
      ctx.fillStyle = 'transparent';
      roundRectPath(ctx, x, y, width, height, radius);
      ctx.fill();
    }
  }

  clearShadow(ctx);
  ctx.restore();
}

/**
 * Render neon glow with gradient
 */
function renderNeonGlow(ctx, x, y, width, height, color1, color2, options = {}) {
  const { strength = 30, radius = 16 } = options;

  ctx.save();

  // Outer glow
  setShadow(ctx, {
    color: color1,
    blur: strength,
    offsetX: 0,
    offsetY: 0
  });

  // Inner shape
  const gradient = createLinearGradient(ctx, x, y, x + width, y + height, [
    { pos: 0, color: setAlpha(color1, 0.8) },
    { pos: 1, color: setAlpha(color2, 0.8) }
  ]);

  ctx.fillStyle = gradient;
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.fill();

  clearShadow(ctx);
  ctx.restore();
}

/**
 * Render corner brackets (tech/cyberpunk style)
 */
function renderCornerBrackets(ctx, x, y, width, height, color, options = {}) {
  const {
    size = 20,
    thickness = 2,
    offset = 4,
    style = 'square' // 'square' | 'angled' | 'rounded'
  } = options;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'square';

  const left = x + offset;
  const right = x + width - offset;
  const top = y + offset;
  const bottom = y + height - offset;

  // Top-left
  ctx.beginPath();
  if (style === 'angled') {
    ctx.moveTo(left + size - 5, top);
    ctx.lineTo(left, top);
    ctx.lineTo(left, top + size - 5);
  } else {
    ctx.moveTo(left + size, top);
    ctx.lineTo(left, top);
    ctx.lineTo(left, top + size);
  }
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  if (style === 'angled') {
    ctx.moveTo(right - size + 5, top);
    ctx.lineTo(right, top);
    ctx.lineTo(right, top + size - 5);
  } else {
    ctx.moveTo(right - size, top);
    ctx.lineTo(right, top);
    ctx.lineTo(right, top + size);
  }
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  if (style === 'angled') {
    ctx.moveTo(left, bottom - size + 5);
    ctx.lineTo(left, bottom);
    ctx.lineTo(left + size - 5, bottom);
  } else {
    ctx.moveTo(left, bottom - size);
    ctx.lineTo(left, bottom);
    ctx.lineTo(left + size, bottom);
  }
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  if (style === 'angled') {
    ctx.moveTo(right, bottom - size + 5);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right - size + 5, bottom);
  } else {
    ctx.moveTo(right, bottom - size);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right - size, bottom);
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * Render scanlines (retro/holographic effect)
 */
function renderScanlines(ctx, x, y, width, height, options = {}) {
  const {
    lineHeight = 2,
    gapHeight = 2,
    opacity = 0.1,
    color = '#000000',
    offset = 0
  } = options;

  ctx.save();
  ctx.fillStyle = setAlpha(color, opacity);

  for (let py = y + offset; py < y + height; py += lineHeight + gapHeight) {
    ctx.fillRect(x, py, width, lineHeight);
  }

  ctx.restore();
}

/**
 * Render holographic shimmer effect
 */
function renderHolographicShimmer(ctx, x, y, width, height, options = {}) {
  const {
    shimmerWidth = 100,
    angle = -45,
    opacity = 0.3
  } = options;

  ctx.save();

  // Create diagonal gradient for shimmer
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * shimmerWidth;
  const dy = Math.sin(rad) * shimmerWidth;

  const gradient = ctx.createLinearGradient(x - dx, y - dy, x + dx, y + dy);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  ctx.restore();
}

/**
 * Render metallic gradient overlay
 */
function renderMetallicEffect(ctx, x, y, width, height, options = {}) {
  const { direction = 'vertical', intensity = 0.3 } = options;

  ctx.save();

  let gradient;
  if (direction === 'vertical') {
    gradient = ctx.createLinearGradient(x, y, x, y + height);
  } else {
    gradient = ctx.createLinearGradient(x, y, x + width, y);
  }

  // Metallic sheen bands
  gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
  gradient.addColorStop(0.2, `rgba(255, 255, 255, ${intensity * 0.5})`);
  gradient.addColorStop(0.5, `rgba(255, 255, 255, ${intensity})`);
  gradient.addColorStop(0.8, `rgba(255, 255, 255, ${intensity * 0.5})`);
  gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  ctx.restore();
}

/**
 * Render progress bar with glow trail
 */
function renderProgressWithGlow(ctx, x, y, width, height, progress, max, colors, options = {}) {
  const {
    glowStrength = 15,
    glowColor = colors.primary,
    trackColor = 'rgba(128, 128, 128, 0.3)',
    radius = 4
  } = options;

  const fillWidth = (progress / max) * width;

  ctx.save();

  // Track background
  ctx.fillStyle = trackColor;
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.fill();

  // Glow effect
  if (glowStrength > 0 && fillWidth > 0) {
    setShadow(ctx, {
      color: glowColor,
      blur: glowStrength,
      offsetX: 0,
      offsetY: 0
    });
  }

  // Fill gradient
  const gradient = createLinearGradient(ctx, x, y, x + fillWidth, y, [
    { pos: 0, color: colors.primary },
    { pos: 1, color: colors.secondary || colors.primary }
  ]);

  ctx.fillStyle = gradient;
  roundRectPath(ctx, x, y, fillWidth, height, radius);
  ctx.fill();

  clearShadow(ctx);
  ctx.restore();
}

/**
 * Render card shadow with proper layering
 */
function renderCardShadow(ctx, x, y, width, height, options = {}) {
  const {
    color = 'rgba(0, 0, 0, 0.3)',
    blur = 20,
    offsetX = 0,
    offsetY = 4,
    radius = 16,
    layers = 2
  } = options;

  ctx.save();

  // Multiple shadow layers for depth
  for (let i = 0; i < layers; i++) {
    const layerBlur = blur * (1 + i * 0.5);
    const layerOffset = offsetY * (1 + i * 0.3);
    const layerAlpha = 1 / (i + 1);

    setShadow(ctx, {
      color: setAlpha(color, layerAlpha * 0.3),
      blur: layerBlur,
      offsetX,
      offsetY: layerOffset
    });

    // Draw invisible shape to cast shadow
    ctx.fillStyle = 'transparent';
    roundRectPath(ctx, x, y, width, height, radius);
    ctx.fill();
  }

  clearShadow(ctx);
  ctx.restore();
}

/**
 * Create gradient border effect
 */
function renderGradientBorder(ctx, x, y, width, height, colors, options = {}) {
  const {
    thickness = 2,
    radius = 16
  } = options;

  ctx.save();

  // Create stroke path
  roundRectPath(ctx, x, y, width, height, radius);

  // Gradient stroke
  const gradient = createLinearGradient(ctx, x, y, x + width, y + height, [
    { pos: 0, color: colors[0] },
    { pos: 0.5, color: colors[1] || colors[0] },
    { pos: 1, color: colors[2] || colors[0] }
  ]);

  ctx.strokeStyle = gradient;
  ctx.lineWidth = thickness;
  ctx.stroke();

  ctx.restore();
}

/**
 * Utility: Round rect path for clipping/stroking
 */
function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Utility: Clip to round rect
 */
function clipRoundRect(ctx, x, y, width, height, radius) {
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.clip();
}

module.exports = {
  applyGlassmorphism,
  renderGlowLayer,
  renderNeonGlow,
  renderCornerBrackets,
  renderScanlines,
  renderHolographicShimmer,
  renderMetallicEffect,
  renderProgressWithGlow,
  renderCardShadow,
  renderGradientBorder,
  roundRectPath,
  clipRoundRect
};
