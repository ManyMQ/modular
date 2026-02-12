/**
 * LayoutParser - Parses and transforms layout definitions
 * Converts JSON DSL to internal layout tree
 */
class LayoutParser {
  /**
   * Parse layout definition
   * @param {Object|string} layout - Layout object or JSON string
   * @returns {Object} - Parsed layout tree
   */
  parse(layout) {
    if (typeof layout === 'string') {
      layout = JSON.parse(layout);
    }

    // Normalize layout structure
    return this._normalizeNode(layout);
  }

  /**
   * Normalize a layout node
   * @private
   */
  _normalizeNode(node, parent = null) {
    if (!node) return null;

    const normalized = {
      type: node.type || 'container',
      props: { ...node.props },
      style: { ...node.style },
      children: [],
      bounds: null // Will be computed by LayoutResolver
    };

    // Copy legacy properties
    if (node.src) normalized.props.src = node.src;
    if (node.text) normalized.props.text = node.text;
    if (node.x !== undefined) normalized.props.x = node.x;
    if (node.y !== undefined) normalized.props.y = node.y;
    if (node.width) normalized.props.width = node.width;
    if (node.height) normalized.props.height = node.height;

    // Process children
    if (node.children) {
      normalized.children = node.children
        .map(child => this._normalizeNode(child, normalized))
        .filter(Boolean);
    }

    return normalized;
  }

  /**
   * Extract assets from layout tree
   * @param {Object} layout - Layout tree
   * @returns {string[]} - Array of asset URLs
   */
  extractAssets(layout) {
    const assets = new Set();
    this._extractAssetsRecursive(layout, assets);
    return Array.from(assets);
  }

  /**
   * Recursively extract assets
   * @private
   */
  _extractAssetsRecursive(node, assets) {
    if (!node) return;

    // Check for image sources
    if (node.props?.src) assets.add(node.props.src);
    if (node.props?.avatar) assets.add(node.props.avatar);
    if (node.props?.image) assets.add(node.props.image);
    if (node.src) assets.add(node.src);
    if (node.avatar) assets.add(node.avatar);

    // Recurse into children
    if (node.children) {
      for (const child of node.children) {
        this._extractAssetsRecursive(child, assets);
      }
    }
  }

  /**
   * Validate layout structure
   * @param {Object} layout - Layout tree
   * @returns {boolean}
   */
  validate(layout) {
    try {
      this._validateNode(layout);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Validate a node
   * @private
   */
  _validateNode(node, path = 'root') {
    if (!node || typeof node !== 'object') {
      throw new Error(`Invalid node at ${path}`);
    }

    if (!node.type && !node.props) {
      throw new Error(`Node at ${path} missing type or props`);
    }

    if (node.children && !Array.isArray(node.children)) {
      throw new Error(`Invalid children at ${path}`);
    }

    // Validate children
    if (node.children) {
      node.children.forEach((child, i) => {
        this._validateNode(child, `${path}.children[${i}]`);
      });
    }
  }

  /**
   * Serialize layout to JSON
   * @param {Object} layout - Layout tree
   * @returns {string} - JSON string
   */
  serialize(layout) {
    return JSON.stringify(layout, null, 2);
  }
}

module.exports = { LayoutParser };
