# Theme System

<div align="center">

**Customize the appearance of your cards with themes**

[![Themes](https://img.shields.io/npm/dw/modular?style=flat-square&logo=paintbrush)](themes.md)

</div>

Modular's theme system provides a powerful way to customize the appearance of your cards. Themes allow you to maintain consistent styling across all cards while providing flexibility for customization.

<div align="center">

![Dark Theme](assets/@modulardark_transparent.png)

*Dark theme preview*

</div>

## Table of Contents

- [Overview](#overview)
- [Built-in Themes](#built-in-themes)
- [Creating Custom Themes](#creating-custom-themes)
- [Theme Structure](#theme-structure)
- [Using Themes](#using-themes)
- [Theme Registry](#theme-registry)
- [Theme Inheritance](#theme-inheritance)
- [Dynamic Themes](#dynamic-themes)
- [Best Practices](#best-practices)

---

## Overview

Themes in Modular are comprehensive styling objects that define:

- **Colors** - Background, primary, secondary, accent, text colors
- **Fonts** - Typography settings for different text types
- **Effects** - Visual effects like glow, shadow, gradients
- **Layout** - Spacing, borders, padding

Themes can be:

- **Built-in** - Ready to use themes included with Modular
- **Custom** - User-defined themes registered with the engine
- **Dynamic** - Themes generated at runtime based on user input

---

## Built-in Themes

Modular includes several professionally designed built-in themes:

<div align="center">

![Light Theme](assets/@modularlight_transparent.png)

*Light theme - Clean and minimal*

</div>

### cyberpunk

Neon cyberpunk aesthetic with glowing effects and futuristic styling.

```javascript
card.useTheme('cyberpunk');
```

**Color Palette:**
- Background: `#1a1a2e`
- Primary: `#00ffcc` (cyan)
- Secondary: `#ff00ff` (magenta)
- Accent: `#ffff00` (yellow)
- Text: White with cyan accents

**Effects:** Glow, Shadow, Gradient

### neon

Vibrant neon glow effects with high contrast.

```javascript
card.useTheme('neon');
```

**Color Palette:**
- Background: `#0a0a0a`
- Primary: `#ff00ff` (magenta)
- Secondary: `#00ffff` (cyan)
- Accent: `#ffff00` (yellow)
- Text: White

**Effects:** Glow (intense), Shadow

### dark

Clean, modern dark theme suitable for all use cases.

```javascript
card.useTheme('dark');
```

**Color Palette:**
- Background: `#1a1a2e`
- Primary: `#6366f1` (indigo)
- Secondary: `#8b5cf6` (purple)
- Accent: `#10b981` (emerald)
- Text: White

**Effects:** Subtle shadow, Gradient

### midnight

Deep midnight blue with elegant gradients.

```javascript
card.useTheme('midnight');
```

**Color Palette:**
- Background: `#0f172a`
- Primary: `#3b82f6` (blue)
- Secondary: `#8b5cf6` (purple)
- Accent: `#06b6d4` (cyan)
- Text: White

**Effects:** Gradient, Subtle glow

### light

Minimalist light theme for bright environments.

```javascript
card.useTheme('light');
```

**Color Palette:**
- Background: `#ffffff`
- Primary: `#6366f1` (indigo)
- Secondary: `#f43f5e` (rose)
- Accent: `#10b981` (emerald)
- Text: `#1f2937` (dark gray)

**Effects:** Subtle shadow

### ocean

Ocean blue gradient theme.

```javascript
card.useTheme('ocean');
```

**Color Palette:**
- Background: `#1e3a5f`
- Primary: `#0ea5e9` (sky blue)
- Secondary: `#8b5cf6` (purple)
- Accent: `#06b6d4` (cyan)
- Text: White

**Effects:** Gradient (blue-purple), Subtle glow

### sunset

Warm sunset gradient with orange and pink tones.

```javascript
card.useTheme('sunset');
```

**Color Palette:**
- Background: `#2d1f3d`
- Primary: `#f97316` (orange)
- Secondary: `#ec4899` (pink)
- Accent: `#eab308` (yellow)
- Text: White

**Effects:** Gradient (orange-pink)

---

## Creating Custom Themes

### Basic Custom Theme

```javascript
const myTheme = {
  name: 'my-custom-theme',
  version: '1.0.0',
  colors: {
    background: '#1a1a2e',
    primary: '#00ffcc',
    secondary: '#ff00ff',
    accent: '#ffff00',
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      muted: '#666666'
    },
    progress: {
      fill: '#00ffcc',
      background: '#333333'
    }
  },
  fonts: {
    title: 'Montserrat Bold',
    body: 'Inter',
    mono: 'JetBrains Mono'
  },
  effects: {
    glow: true,
    shadow: true,
    gradient: true
  },
  borderRadius: 16,
  padding: 20
};

engine.themes.register('custom', myTheme);
```

### Advanced Custom Theme

```javascript
const advancedTheme = {
  name: 'advanced-theme',
  version: '1.0.0',
  description: 'A theme with advanced styling options',

  colors: {
    background: {
      type: 'gradient',
      colors: ['#1a1a2e', '#16213e'],
      direction: 'horizontal'
    },
    primary: '#00ffcc',
    secondary: '#ff00ff',
    accent: '#ffff00',
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      muted: '#666666',
      glow: '#00ffcc'
    },
    progress: {
      fill: '#00ffcc',
      background: 'rgba(255, 255, 255, 0.1)',
      glow: true
    },
    avatar: {
      border: '#00ffcc',
      glow: '#00ffcc'
    },
    badge: {
      background: '#00ffcc',
      text: '#000000'
    },
    rank: {
      background: '#ff00ff',
      text: '#ffffff'
    }
  },

  fonts: {
    title: {
      family: 'Montserrat',
      weight: 700,
      size: 24,
      transform: 'uppercase'
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 16
    },
    mono: {
      family: 'JetBrains Mono',
      weight: 500,
      size: 14
    },
    stat: {
      family: 'Montserrat',
      weight: 600,
      size: 32
    }
  },

  effects: {
    glow: {
      enabled: true,
      intensity: 'medium',
      color: '#00ffcc'
    },
    shadow: {
      enabled: true,
      blur: 10,
      offset: { x: 0, y: 4 },
      color: 'rgba(0, 0, 0, 0.3)'
    },
    gradient: {
      enabled: true,
      type: 'linear',
      direction: 'horizontal'
    },
    animation: {
      pulse: true,
      fade: true
    }
  },

  borderRadius: {
    card: 16,
    avatar: 50,
    progress: 5,
    badge: 8
  },

  padding: {
    card: 24,
    avatar: 16,
    content: 12
  },

  spacing: {
    small: 4,
    medium: 8,
    large: 16,
    xlarge: 24
  },

  layout: {
    avatar: {
      position: 'left',
      size: 80
    },
    progress: {
      height: 12,
      showLabel: true
    },
    rank: {
      position: 'right',
      size: 48
    }
  }
};

engine.themes.register('advanced', advancedTheme);
```

---

## Theme Structure

### Complete Theme Interface

```typescript
interface Theme {
  // Required
  name: string;

  // Optional metadata
  version?: string;
  description?: string;
  author?: string;

  // Colors
  colors: {
    background: string | BackgroundConfig;
    primary: string;
    secondary: string;
    accent: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
      glow?: string;
    };
    progress: {
      fill: string;
      background: string;
      glow?: string;
    };
    avatar?: {
      border: string;
      glow?: string;
    };
    badge?: {
      background: string;
      text: string;
    };
    rank?: {
      background: string;
      text: string;
    };
  };

  // Typography
  fonts: {
    title: string | FontConfig;
    body: string | FontConfig;
    mono: string | FontConfig;
    stat?: string | FontConfig;
  };

  // Visual Effects
  effects?: {
    glow?: boolean | GlowConfig;
    shadow?: boolean | ShadowConfig;
    gradient?: boolean | GradientConfig;
    animation?: boolean | AnimationConfig;
    blur?: boolean;
  };

  // Layout properties
  borderRadius?: number | BorderRadiusConfig;
  padding?: number | PaddingConfig;
  spacing?: number | SpacingConfig;

  // Custom layout
  layout?: LayoutConfig;
}
```

### BackgroundConfig

```typescript
interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image';
  value?: string;
  colors?: string[];
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  opacity?: number;
  blend?: 'normal' | 'multiply' | 'screen' | 'overlay';
}
```

### FontConfig

```typescript
interface FontConfig {
  family: string;
  weight?: number | string;
  size?: number;
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  style?: 'normal' | 'italic';
}
```

### GlowConfig

```typescript
interface GlowConfig {
  enabled: boolean;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  blur?: number;
}
```

---

## Using Themes

### Applying a Theme to a Card

```javascript
// Use a built-in theme
card.useTheme('cyberpunk');

// Use a custom theme
card.useTheme('my-custom-theme');
```

### Theme with Token Override

```javascript
card.useTheme('dark')
  .setTokens({
    'card.background': '#0a0a0a',
    'text.primary': '#ff00ff'
  });
```

### Theme Inheritance

```javascript
// Create a theme based on another
const darkVariant = {
  ...engine.themes.get('dark'),
  name: 'dark-variant',
  colors: {
    ...engine.themes.get('dark').colors,
    background: '#000000',
    primary: '#ff00ff'
  }
};

engine.themes.register('dark-variant', darkVariant);
```

---

## Theme Registry

### Register Theme

```javascript
engine.themes.register('my-theme', {
  name: 'my-theme',
  colors: {
    background: '#1a1a2e',
    primary: '#00ffcc',
    secondary: '#ff00ff',
    accent: '#ffff00',
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      muted: '#666666'
    },
    progress: {
      fill: '#00ffcc',
      background: '#333333'
    }
  },
  fonts: {
    title: 'Montserrat Bold',
    body: 'Inter',
    mono: 'JetBrains Mono'
  }
});
```

### Get Theme

```javascript
const theme = engine.themes.get('cyberpunk');
console.log(theme.colors.primary); // '#00ffcc'
```

### List Themes

```javascript
const themes = engine.themes.list();
console.log(themes); // ['cyberpunk', 'neon', 'dark', 'midnight', 'light', 'ocean', 'sunset', 'my-theme']
```

### Delete Theme

```javascript
engine.themes.delete('my-theme');
```

---

## Theme Inheritance

Themes can extend other themes to create variants:

```javascript
const baseTheme = engine.themes.get('dark');

const customTheme = {
  ...baseTheme,
  name: 'custom-dark',
  description: 'Custom dark theme variant',
  colors: {
    ...baseTheme.colors,
    primary: '#ff00ff',  // Override primary color
    background: '#0a0a0a'  // Override background
  }
};

engine.themes.register('custom-dark', customTheme);
```

---

## Dynamic Themes

Generate themes at runtime based on user input:

```javascript
function createDynamicTheme(userColor) {
  return {
    name: 'dynamic',
    colors: {
      background: '#1a1a2e',
      primary: userColor,
      secondary: '#ff00ff',
      accent: '#ffff00',
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
        muted: '#666666'
      },
      progress: {
        fill: userColor,
        background: '#333333'
      }
    },
    fonts: {
      title: 'Montserrat Bold',
      body: 'Inter',
      mono: 'JetBrains Mono'
    }
  };
}

const userTheme = createDynamicTheme('#ff6600');
engine.themes.register('user-theme', userTheme);
card.useTheme('user-theme');
```

---

## Best Practices

### 1. Use Semantic Colors

```javascript
// Good - semantic naming
colors: {
  primary: '#00ffcc',
  secondary: '#ff00ff',
  accent: '#ffff00'
}

// Avoid - unclear purpose
colors: {
  color1: '#00ffcc',
  color2: '#ff00ff',
  color3: '#ffff00'
}
```

### 2. Define Color Variables

```javascript
const brandColors = {
  cyan: '#00ffcc',
  magenta: '#ff00ff',
  yellow: '#ffff00'
};

const theme = {
  colors: {
    primary: brandColors.cyan,
    secondary: brandColors.magenta,
    accent: brandColors.yellow
  }
};
```

### 3. Test Across Themes

```javascript
// Always test your cards with multiple themes
const themes = ['dark', 'light', 'neon', 'cyberpunk'];

themes.forEach(themeName => {
  card.useTheme(themeName);
  const buffer = await card.toBuffer();
  // Verify the card looks good
});
```

### 4. Document Custom Themes

```javascript
const myTheme = {
  name: 'my-theme',
  description: 'Custom theme for server X',
  author: 'Your Name',
  version: '1.0.0',
  // ... rest of theme
};

engine.themes.register('my-theme', myTheme);
```

---

## Related Documentation

- [Getting Started](getting-started.md) - Quick start guide
- [API Reference](api-reference.md) - Complete API documentation
- [Output Guide](output-guide.md) - Export options
- [Design Tokens](getting-started.md#-using-design-tokens) - Token system

<div align="center">

![Terms](assets/@modularterms.png)

*Customize your cards with themes*

</div>
