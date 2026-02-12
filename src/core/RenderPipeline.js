/**
 * Render Pipeline - Orchestrates the 9-step render process
 * 1. Layout Resolve
 * 2. Token Resolve
 * 3. Style Resolve
 * 4. Asset Preload
 * 5. Pre Render Hooks
 * 6. Component Render Pass
 * 7. FX Pass
 * 8. Post Hooks
 * 9. Export Encode
 */

class RenderPipeline {
  /**
   * Execute full render pipeline
   * @param {Engine} engine - Engine instance
   * @param {Object} layout - Layout definition
   * @param {Object} data - Card data
   * @param {Object} options - Render options
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

    // Step 7: FX Pass
    await this.stepFXPass(engine, renderContext, context);

    // Step 8: Post Hooks
    await this.stepPostHooks(engine, renderContext, context);

    // Step 9: Export Encode
    return this.stepExportEncode(engine, renderContext, context);
  }

  /**
   * Step 1: Resolve layout tree
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
   * Step 2: Resolve design tokens
   */
  static async stepTokenResolve(engine, context) {
    const { data, resolvedLayout } = context;
    
    // Merge global tokens with layout-specific tokens
    const tokens = engine.tokenEngine.resolve({
      ...resolvedLayout.tokens,
      ...data
    });
    
    return tokens;
  }

  /**
   * Step 3: Resolve styles
   */
  static async stepStyleResolve(engine, context) {
    const { tokens, resolvedLayout } = context;
    const theme = engine.themeManager.getActive();
    
    // Apply theme + tokens to generate computed styles
    const styles = engine.styleEngine.compute(resolvedLayout, theme, tokens);
    
    return styles;
  }

  /**
   * Step 4: Preload assets
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
   * Step 5: Execute pre-render hooks
   */
  static async stepPreRenderHooks(engine, context) {
    await engine.executeHooks('beforeRender', context);
  }

  /**
   * Step 6: Component render pass
   */
  static async stepComponentRender(engine, context) {
    const { width, height, dpi } = context;
    
    // Create render context
    const renderContext = engine.renderer.createContext(width, height, dpi);
    
    // Clear background
    renderContext.ctx.fillStyle = context.styles?.background?.color || '#0a0a0f';
    renderContext.ctx.fillRect(0, 0, width * dpi, height * dpi);
    
    // Render each component in layout tree
    await this.renderNode(engine, context.resolvedLayout, renderContext, context);
    
    return renderContext;
  }

  /**
   * Recursively render layout nodes
   */
  static async renderNode(engine, node, renderContext, context) {
    if (!node) return;

    const { type, props = {}, children = [], bounds } = node;
    
    // Get component class
    const ComponentClass = engine.componentRegistry.get(type);
    if (!ComponentClass) {
      throw new Error(`Unknown component type: ${type}`);
    }

    // Create component instance
    const component = new ComponentClass(props);
    
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
   * Step 7: Apply FX effects
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
   * Step 8: Execute post-render hooks
   */
  static async stepPostHooks(engine, renderContext, context) {
    await engine.executeHooks('afterRender', {
      ...context,
      renderContext
    });
  }

  /**
   * Step 9: Export and encode
   */
  static async stepExportEncode(engine, renderContext, context) {
    const { format = 'png', quality } = context.options;
    
    return engine.bufferManager.encode(renderContext.canvas, { format, quality });
  }
}

module.exports = RenderPipeline;
