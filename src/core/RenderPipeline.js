/**
 * RenderPipeline - Orchestrates the multi-step card rendering process
 * 
 * Pipeline Phases:
 * 1. Layout Resolve - Compute element sizes and positions
 * 2. Token Resolve  - Resolve design tokens and variables
 * 3. Style Resolve  - Map tokens to visual styles
 * 4. Asset Preload  - Load images and fonts required for rendering
 * 5. Pre-Render     - Execute before-render plugins and hooks
 * 6. Render Pass    - Draw components onto the canvas
 * 7. FX Pass        - Apply global visual effects (glow, scanlines, etc.)
 * 8. Post-Render    - Execute after-render plugins and hooks
 * 9. Export         - Encode canvas to desired buffer format
 * 
 * @module RenderPipeline
 */

'use strict';

const { ComponentError } = require('../errors/ModularError');

/**
 * RenderPipeline - Coordinates the modular rendering engine workflow
 */
class RenderPipeline {
  /**
   * Execute the full render pipeline
   * 
   * @param {Engine} engine - Engine instance orchestrating the subsystems
   * @param {Object} layout - Root layout definition for the card
   * @param {Object} data - Dynamic data values to inject into layout/tokens
   * @param {Object} options - Custom render configuration
   * @param {number} [options.width=800] - Override canvas width
   * @param {number} [options.height=400] - Override canvas height
   * @param {number} [options.dpi] - Override global engine DPI
   * @param {string} [options.format='png'] - Export format (png|jpeg|webp)
   * 
   * @returns {Promise<Buffer>} The rendered card buffer
   */
  static async execute(engine, layout, data, options) {
    const context = {
      engine,
      layout,
      data,
      options,
      width: options.width || 800,
      height: options.height || 400,
      dpi: options.dpi || engine.config.dpi || 2
    };

    // Step 1: Layout Resolve
    const resolvedLayout = await this.stepLayoutResolve(engine, context);
    context.resolvedLayout = resolvedLayout;

    // Step 2: Token Resolve
    const tokens = await this.stepTokenResolve(engine, context);
    context.tokens = tokens;

    // Step 3: Style Resolve
    const styles = await this.stepStyleResolve(engine, context);
    context.styles = styles;

    // Step 4: Asset Preload
    await this.stepAssetPreload(engine, context);

    // Step 5: Pre Render Hooks
    await this.stepPreRenderHooks(engine, context);

    // Step 6: Component Render Pass
    const renderContext = await this.stepComponentRender(engine, context);

    try {
      // Step 7: FX Pass
      await this.stepFXPass(engine, renderContext, context);

      // Step 8: Post Hooks
      await this.stepPostHooks(engine, renderContext, context);

      // Step 9: Export Encode
      return await this.stepExportEncode(engine, renderContext, context);
    } finally {
      // Release the render context to prevent memory leaks
      if (renderContext && typeof renderContext.release === 'function') {
        renderContext.release();
      }
    }
  }

  /**
   * Step 1: Resolve layout tree into absolute coordinates
   * @param {Engine} engine
   * @param {Object} context - Render pipeline context
   * @returns {Promise<Object>} Resolved layout tree
   * @private
   */
  static async stepLayoutResolve(engine, context) {
    const { layout, width, height } = context;

    // Parse layout if it's a JSON DSL
    const parsed = engine.layoutParser.parse(layout);

    // Resolve final positions and dimensions
    const resolved = engine.layoutResolver.resolve(parsed, { width, height });

    await engine.executeHooks('preLayout', { ...context, parsed, resolved });
    await engine.executeHooks('postLayout', { ...context, resolved });

    return resolved;
  }

  /**
   * Step 2: Resolve design tokens and variables
   * @param {Engine} engine
   * @param {Object} context - Render pipeline context
   * @returns {Promise<Object>} Map of resolved token values
   * @private
   */
  static async stepTokenResolve(engine, context) {
    const { data, resolvedLayout, options } = context;
    const { themeToTokens } = require('../canvas/themes/index');

    // Determine active theme
    const themeName = options.theme || engine.themeManager.getActive();

    // Get theme tokens
    const themeTokens = themeToTokens(themeName);

    // Merge global tokens with layout-specific tokens
    const tokens = engine.tokenEngine.resolve({
      ...themeTokens,
      ...resolvedLayout.tokens,
      ...data
    });

    return tokens;
  }

  /**
   * Step 3: Map tokens to visual styles
   * @param {Engine} engine
   * @param {Object} context - Render pipeline context
   * @returns {Promise<Object>} Computed styles object
   * @private
   */
  static async stepStyleResolve(engine, context) {
    const { tokens, resolvedLayout, options } = context;
    const theme = options.theme || engine.themeManager.getActive();

    // Apply theme + tokens to generate computed styles
    const styles = engine.styleEngine.compute(resolvedLayout, theme, tokens);

    return styles;
  }

  /**
   * Step 4: Preload assets into cache
   * @param {Engine} engine
   * @param {Object} context - Render pipeline context
   * @private
   */
  static async stepAssetPreload(engine, context) {
    const { resolvedLayout } = context;
    const assets = engine.layoutParser.extractAssets(resolvedLayout);

    // Preload all images in parallel
    await Promise.all(
      assets.map(asset => engine.assetLoader.load(asset))
    );
  }

  /**
   * Step 5: Execute pre-render plugins and hooks
   * @param {Engine} engine
   * @param {Object} context - Render pipeline context
   * @private
   */
  static async stepPreRenderHooks(engine, context) {
    await engine.executeHooks('beforeRender', context);
  }

  /**
   * Step 6: Component rendering pass
   * @param {Engine} engine
   * @param {Object} context - Render pipeline context
   * @returns {Promise<Object>} Render context with canvas and ctx
   * @private
   */
  static async stepComponentRender(engine, context) {
    const { width, height, dpi } = context;

    // Create render context
    const renderContext = engine.renderer.createContext(width, height, dpi);

    // Clear background
    renderContext.ctx.fillStyle = context.styles?.background?.color || '#0a0a0f';
    renderContext.ctx.fillRect(0, 0, width, height);

    // Render each component in layout tree
    await this.renderNode(engine, context.resolvedLayout, renderContext, context);

    return renderContext;
  }

  /**
   * Recursively render layout nodes
   * @param {Engine} engine
   * @param {Object} node - Layout node to render
   * @param {Object} renderContext - Target canvas context
   * @param {Object} context - Render pipeline context
   * @throws {ComponentError} If component type is not registered
   * @private
   */
  static async renderNode(engine, node, renderContext, context) {
    if (!node) return;

    const { type, props = {}, children = [], bounds } = node;

    // Get component class
    const ComponentClass = engine.componentRegistry.get(type);
    if (!ComponentClass) {
      throw new ComponentError(`Unknown component type: "${type}". Register it with engine.componentRegistry.register('${type}', YourComponent)`, { type });
    }

    // Create component instance
    const component = new ComponentClass({ ...props, data: context.data });

    // Execute beforeComponent hooks
    await engine.executeHooks('beforeComponent', {
      ...context,
      component,
      node,
      bounds
    });

    // Render component
    await component.render(renderContext.ctx, bounds, context.styles, context.tokens);

    // Execute afterComponent hooks
    await engine.executeHooks('afterComponent', {
      ...context,
      component,
      node,
      bounds
    });

    // Render children
    if (children.length > 0) {
      for (const child of children) {
        await this.renderNode(engine, child, renderContext, context);
      }
    }
  }

  /**
   * Step 7: Apply global post-processing effects
   * @param {Engine} engine
   * @param {Object} renderContext - Render context with canvas
   * @param {Object} context - Render pipeline context
   * @private
   */
  static async stepFXPass(engine, renderContext, context) {
    const { resolvedLayout } = context;

    if (resolvedLayout.effects && resolvedLayout.effects.length > 0) {
      for (const effect of resolvedLayout.effects) {
        await engine.renderer.applyEffect(renderContext.ctx, effect);
      }
    }
  }

  /**
   * Step 8: Execute post-render plugins and hooks
   * @param {Engine} engine
   * @param {Object} renderContext - Render context with canvas
   * @param {Object} context - Render pipeline context
   * @private
   */
  static async stepPostHooks(engine, renderContext, context) {
    await engine.executeHooks('afterRender', {
      ...context,
      renderContext
    });
  }

  /**
   * Step 9: Export and encode canvas to buffer
   * @param {Engine} engine
   * @param {Object} renderContext - Render context with canvas
   * @param {Object} context - Render pipeline context
   * @returns {Promise<Buffer>} Final image buffer
   * @private
   */
  static async stepExportEncode(engine, renderContext, context) {
    const { format = 'png', quality } = context.options;

    return engine.bufferManager.encode(renderContext.canvas, { format, quality });
  }
}

module.exports = RenderPipeline;

