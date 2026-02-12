# Themes

## Built-in Themes

| Theme | Description |
|-------|-------------|
| `cyberpunk` | Neon cyberpunk aesthetic with glow effects |
| `neon` | Glowing neon colors |
| `dark` | Clean dark theme |
| `midnight` | Deep midnight blue |

## Usage

```javascript
card.useTheme('cyberpunk');
```

## Custom Theme Structure

```typescript
interface Theme {
  name: string;
  version: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      online: string;
      idle: string;
      dnd: string;
      offline: string;
    };
  };
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  effects: {
    glow: boolean;
    shadow: boolean;
    gradient: boolean;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
}
```

## Creating Custom Theme

```javascript
const myTheme = {
  name: 'my-theme',
  version: '1.0.0',
  colors: {
    background: '#0f0f23',
    surface: '#1a1a2e',
    primary: '#6c5ce7',
    secondary: '#a29bfe',
    accent: '#00cec9',
    text: {
      primary: '#ffffff',
      secondary: '#b2bec3',
      muted: '#636e72'
    },
    status: {
      online: '#00b894',
      idle: '#fdcb6e',
      dnd: '#d63031',
      offline: '#636e72'
    }
  },
  fonts: {
    body: 'Inter',
    heading: 'Inter',
    mono: 'JetBrains Mono'
  },
  effects: {
    glow: true,
    shadow: true,
    gradient: true
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, full: 9999 }
};

engine.themes.register('custom', myTheme);
card.useTheme('custom');
```

## Theme Overrides

```javascript
const overrides = {
  colors: {
    primary: '#ff00ff',
    accent: '#00ffff'
  },
  fonts: {
    body: 'Poppins'
  }
};
card.useTheme('dark', overrides);
```
