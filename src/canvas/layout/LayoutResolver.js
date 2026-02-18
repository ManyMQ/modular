/**
 * LayoutResolver - Resolves layout dimensions and positions
 */
class LayoutResolver {
  /**
   * Resolve layout tree with computed bounds
   * @param {Object} layout - Parsed layout tree
   * @param {Object} container - Container dimensions
   * @param {number} container.width
   * @param {number} container.height
   * @returns {Object} - Layout tree with resolved bounds
   */
  resolve(layout, container) {
    const { width, height } = container;
    
    // Create root context
    const context = {
      x: 0,
      y: 0,
      width,
      height,
      availableWidth: width,
      availableHeight: height
    };

    // Resolve root node
    return this._resolveNode(layout, context);
  }

  /**
   * Resolve a single node
   * @private
   */
  _resolveNode(node, parentContext) {
    if (!node) return null;

    // Compute bounds
    const bounds = this._computeBounds(node, parentContext);
    
    // Create resolved node
    const resolved = {
      ...node,
      bounds,
      children: []
    };

    // Create child context
    const childContext = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      availableWidth: bounds.width,
      availableHeight: bounds.height
    };

    // Apply padding if specified
    if (node.style?.padding) {
      const p = node.style.padding;
      childContext.x += p;
      childContext.y += p;
      childContext.availableWidth -= p * 2;
      childContext.availableHeight -= p * 2;
    }

    // Resolve children
    if (node.children) {
      // Use appropriate layout algorithm
      const layoutAlgorithm = this._getLayoutAlgorithm(node);
      
      resolved.children = layoutAlgorithm(
        node.children,
        childContext,
        this._resolveNode.bind(this)
      );
    }

    return resolved;
  }

  /**
   * Compute node bounds
   * @private
   */
  _computeBounds(node, context) {
    const props = node.props || {};
    const style = node.style || {};

    // Get explicit dimensions
    let x = props.x !== undefined ? props.x : context.x;
    let y = props.y !== undefined ? props.y : context.y;
    let width = props.width || style.width;
    let height = props.height || style.height;

    // Resolve percentage values
    if (typeof width === 'string' && width.endsWith('%')) {
      const pct = parseFloat(width) / 100;
      width = context.availableWidth * pct;
    }

    if (typeof height === 'string' && height.endsWith('%')) {
      const pct = parseFloat(height) / 100;
      height = context.availableHeight * pct;
    }

    // Apply defaults
    if (width === undefined) width = context.availableWidth;
    if (height === undefined) height = context.availableHeight;

    return { x, y, width, height };
  }

  /**
   * Get layout algorithm for node
   * @private
   */
  _getLayoutAlgorithm(node) {
    const layoutType = node.props?.layout || node.style?.layout || 'flow';

    switch (layoutType) {
      case 'stack':
        return this._stackLayout.bind(this);
      case 'row':
        return this._rowLayout.bind(this);
      case 'column':
        return this._columnLayout.bind(this);
      case 'grid':
        return this._gridLayout.bind(this);
      case 'flow':
      default:
        return this._flowLayout.bind(this);
    }
  }

  /**
   * Flow layout - positions children at their specified coordinates
   * @private
   */
  _flowLayout(children, context, resolveFn) {
    return children
      .map(child => resolveFn(child, context))
      .filter(Boolean);
  }

  /**
   * Stack layout - children overlap at same position
   * @private
   */
  _stackLayout(children, context, resolveFn) {
    return children
      .map(child => resolveFn(child, context))
      .filter(Boolean);
  }

  /**
   * Row layout - horizontal arrangement
   * @private
   */
  _rowLayout(children, context, resolveFn) {
    let currentX = context.x;
    const gap = context.gap || 0;

    return children.map(child => {
      // Update child context with current position
      const childContext = {
        ...context,
        x: currentX
      };

      const resolved = resolveFn(child, childContext);
      if (resolved) {
        currentX += resolved.bounds.width + gap;
      }

      return resolved;
    }).filter(Boolean);
  }

  /**
   * Column layout - vertical arrangement
   * @private
   */
  _columnLayout(children, context, resolveFn) {
    let currentY = context.y;
    const gap = context.gap || 0;

    return children.map(child => {
      // Update child context with current position
      const childContext = {
        ...context,
        y: currentY
      };

      const resolved = resolveFn(child, childContext);
      if (resolved) {
        currentY += resolved.bounds.height + gap;
      }

      return resolved;
    }).filter(Boolean);
  }

  /**
   * Grid layout - grid arrangement (simplified)
   * @private
   */
  _gridLayout(children, context, resolveFn) {
    // Simplified grid - just flow for now
    return this._flowLayout(children, context, resolveFn);
  }
}

module.exports = { LayoutResolver };
