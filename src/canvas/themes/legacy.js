/**
 * CardThemes - Complete visual theme definitions
 * Reverse-engineered from screenshot analysis
 * 16 distinct visual styles for card rendering
 */

const cardThemes = {
  /**
   * Discord Cards
   * Clean, modern aesthetic with purple/blue accents
   * Rounded corners, soft shadows
   */
  discord: {
    name: 'Discord',
    description: 'Clean modern UI with purple/blue accents',
    colors: {
      surface: {
        primary: '#1a1b26',
        secondary: '#24283b',
        tertiary: '#414868',
        elevated: '#16161e'
      },
      accent: {
        primary: '#7aa2f7',
        secondary: '#bb9af7',
        glow: 'rgba(122, 162, 247, 0.3)',
        gradientStart: '#7aa2f7',
        gradientEnd: '#bb9af7'
      },
      text: {
        primary: '#c0caf5',
        secondary: '#a9b1d6',
        muted: '#565f89',
        inverse: '#1a1b26'
      },
      border: {
        default: '#414868',
        accent: '#7aa2f7',
        subtle: 'rgba(65, 72, 104, 0.5)'
      },
      status: {
        online: '#9ece6a',
        idle: '#e0af68',
        dnd: '#f7768e',
        offline: '#565f89'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 20,
        '2xl': 24
      },
      weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      '2xl': 32
    },
    radius: {
      card: 16,
      inner: 12,
      pill: 20,
      avatar: 12
    },
    effects: {
      glowStrength: 15,
      shadowBlur: 20,
      shadowOffset: 4,
      glassBlur: 0,
      borderWidth: 1,
      progressHeight: 8
    },
    shadows: {
      card: '0 4px 20px rgba(0, 0, 0, 0.3)',
      elevated: '0 8px 32px rgba(0, 0, 0, 0.4)',
      glow: '0 0 20px rgba(122, 162, 247, 0.3)'
    }
  },

  /**
   * Discord Retro Modern
   * Dark theme with orange/red accents, corner brackets
   * Sharper edges, retro terminal aesthetic
   */
  retroModern: {
    name: 'Retro Modern',
    description: 'Dark theme with orange/red accents and corner brackets',
    colors: {
      surface: {
        primary: '#0f0f14',
        secondary: '#1a1a24',
        tertiary: '#252532',
        elevated: '#15151c'
      },
      accent: {
        primary: '#ff6b35',
        secondary: '#f7931e',
        glow: 'rgba(255, 107, 53, 0.4)',
        gradientStart: '#ff6b35',
        gradientEnd: '#f7931e'
      },
      text: {
        primary: '#ffffff',
        secondary: '#b8b8c8',
        muted: '#6b6b7b',
        inverse: '#0f0f14'
      },
      border: {
        default: '#2a2a3a',
        accent: '#ff6b35',
        subtle: 'rgba(42, 42, 58, 0.8)'
      },
      status: {
        online: '#4ade80',
        idle: '#fbbf24',
        dnd: '#f87171',
        offline: '#6b6b7b'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, '2xl': 22 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 28 },
    radius: { card: 8, inner: 6, pill: 4, avatar: 6 },
    effects: {
      glowStrength: 20,
      shadowBlur: 0,
      shadowOffset: 2,
      glassBlur: 0,
      borderWidth: 2,
      progressHeight: 6,
      cornerBrackets: true
    },
    shadows: {
      card: '0 2px 8px rgba(0, 0, 0, 0.5)',
      elevated: '0 4px 16px rgba(0, 0, 0, 0.6)',
      glow: '0 0 30px rgba(255, 107, 53, 0.4)'
    }
  },

  /**
   * Cyberpunk System / Holographic
   * Cyan borders, tech aesthetic, corner accents
   * High contrast, sharp edges with selective glow
   */
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Cyan accent tech theme with corner decorations',
    colors: {
      surface: {
        primary: '#0a0a0f',
        secondary: '#11111a',
        tertiary: '#1a1a2e',
        elevated: '#0d0d14'
      },
      accent: {
        primary: '#00d4ff',
        secondary: '#0099cc',
        glow: 'rgba(0, 212, 255, 0.5)',
        gradientStart: '#00d4ff',
        gradientEnd: '#0099cc'
      },
      text: {
        primary: '#ffffff',
        secondary: '#a0d0e0',
        muted: '#507080',
        inverse: '#0a0a0f'
      },
      border: {
        default: '#1a3a4a',
        accent: '#00d4ff',
        subtle: 'rgba(0, 212, 255, 0.2)'
      },
      status: {
        online: '#00ff88',
        idle: '#ffcc00',
        dnd: '#ff3366',
        offline: '#507080'
      }
    },
    fonts: {
      family: 'Inter, JetBrains Mono, system-ui, sans-serif',
      sizes: { xs: 9, sm: 11, md: 13, lg: 15, xl: 17, '2xl': 20 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 6, md: 10, lg: 14, xl: 18, '2xl': 24 },
    radius: { card: 4, inner: 2, pill: 2, avatar: 2 },
    effects: {
      glowStrength: 25,
      shadowBlur: 10,
      shadowOffset: 0,
      glassBlur: 0,
      borderWidth: 2,
      progressHeight: 4,
      cornerBrackets: true,
      scanlines: true
    },
    shadows: {
      card: '0 0 20px rgba(0, 212, 255, 0.1)',
      elevated: '0 0 30px rgba(0, 212, 255, 0.15)',
      glow: '0 0 40px rgba(0, 212, 255, 0.5)'
    }
  },

  /**
   * Synthwave Neon
   * Pink/purple gradients, heavy glow, rounded
   * 80s aesthetic with neon effects
   */
  synthwave: {
    name: 'Synthwave',
    description: '80s neon aesthetic with pink/purple gradients',
    colors: {
      surface: {
        primary: '#0d0415',
        secondary: '#1a0b2e',
        tertiary: '#2d1b4e',
        elevated: '#150821'
      },
      accent: {
        primary: '#ff006e',
        secondary: '#8338ec',
        glow: 'rgba(255, 0, 110, 0.6)',
        gradientStart: '#ff006e',
        gradientEnd: '#8338ec'
      },
      text: {
        primary: '#ffffff',
        secondary: '#ffb3d9',
        muted: '#8b5a8c',
        inverse: '#0d0415'
      },
      border: {
        default: '#3d1b5e',
        accent: '#ff006e',
        subtle: 'rgba(255, 0, 110, 0.3)'
      },
      status: {
        online: '#00f5d4',
        idle: '#fee440',
        dnd: '#f15bb5',
        offline: '#8b5a8c'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 26 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 20, inner: 16, pill: 24, avatar: 50 },
    effects: {
      glowStrength: 35,
      shadowBlur: 30,
      shadowOffset: 4,
      glassBlur: 0,
      borderWidth: 1,
      progressHeight: 10,
      gradientOverlay: true
    },
    shadows: {
      card: '0 8px 32px rgba(255, 0, 110, 0.2)',
      elevated: '0 12px 48px rgba(255, 0, 110, 0.3)',
      glow: '0 0 60px rgba(255, 0, 110, 0.6)'
    }
  },

  /**
   * Glassmorphism Layers
   * Frosted glass effect with blur
   * Teal accents, layered depth
   */
  glassmorphism: {
    name: 'Glassmorphism',
    description: 'Frosted glass effect with blur and teal accents',
    colors: {
      surface: {
        primary: 'rgba(30, 41, 59, 0.6)',
        secondary: 'rgba(51, 65, 85, 0.4)',
        tertiary: 'rgba(71, 85, 105, 0.5)',
        elevated: 'rgba(30, 41, 59, 0.8)'
      },
      accent: {
        primary: '#2dd4bf',
        secondary: '#5eead4',
        glow: 'rgba(45, 212, 191, 0.3)',
        gradientStart: '#2dd4bf',
        gradientEnd: '#5eead4'
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        muted: '#64748b',
        inverse: '#0f172a'
      },
      border: {
        default: 'rgba(255, 255, 255, 0.1)',
        accent: 'rgba(45, 212, 191, 0.5)',
        subtle: 'rgba(255, 255, 255, 0.05)'
      },
      status: {
        online: '#34d399',
        idle: '#fbbf24',
        dnd: '#f87171',
        offline: '#64748b'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 24, inner: 16, pill: 20, avatar: 16 },
    effects: {
      glowStrength: 20,
      shadowBlur: 40,
      shadowOffset: 8,
      glassBlur: 20,
      borderWidth: 1,
      progressHeight: 8,
      backdropBlur: true,
      noiseTexture: false
    },
    shadows: {
      card: '0 8px 40px rgba(0, 0, 0, 0.2)',
      elevated: '0 16px 60px rgba(0, 0, 0, 0.3)',
      glow: '0 0 30px rgba(45, 212, 191, 0.3)'
    }
  },

  /**
   * Sci-Fi Holographic
   * Cyan terminal aesthetic, corner brackets
   * Sharp edges, scanline-ready
   */
  holographic: {
    name: 'Holographic',
    description: 'Sci-fi terminal aesthetic with cyan accents',
    colors: {
      surface: {
        primary: '#020408',
        secondary: '#0a1525',
        tertiary: '#152238',
        elevated: '#050a10'
      },
      accent: {
        primary: '#00f0ff',
        secondary: '#00a8b5',
        glow: 'rgba(0, 240, 255, 0.6)',
        gradientStart: '#00f0ff',
        gradientEnd: '#00a8b5'
      },
      text: {
        primary: '#ffffff',
        secondary: '#a0e0e8',
        muted: '#408080',
        inverse: '#020408'
      },
      border: {
        default: '#0a3040',
        accent: '#00f0ff',
        subtle: 'rgba(0, 240, 255, 0.15)'
      },
      status: {
        online: '#00ffaa',
        idle: '#ffee00',
        dnd: '#ff0055',
        offline: '#408080'
      }
    },
    fonts: {
      family: 'JetBrains Mono, Fira Code, monospace',
      sizes: { xs: 9, sm: 11, md: 13, lg: 15, xl: 17, '2xl': 20 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 6, md: 10, lg: 14, xl: 18, '2xl': 24 },
    radius: { card: 2, inner: 0, pill: 0, avatar: 0 },
    effects: {
      glowStrength: 30,
      shadowBlur: 15,
      shadowOffset: 0,
      glassBlur: 0,
      borderWidth: 1,
      progressHeight: 4,
      cornerBrackets: true,
      holographic: true,
      scanlines: true
    },
    shadows: {
      card: '0 0 30px rgba(0, 240, 255, 0.1)',
      elevated: '0 0 40px rgba(0, 240, 255, 0.15)',
      glow: '0 0 50px rgba(0, 240, 255, 0.6)'
    }
  },

  /**
   * Minimal Soft UI
   * Soft pink/peach, ultra-rounded, gentle shadows
   * Warm, friendly aesthetic
   */
  minimalSoft: {
    name: 'Minimal Soft',
    description: 'Soft warm aesthetic with pink/peach tones',
    colors: {
      surface: {
        primary: '#fef1f5',
        secondary: '#fce7f0',
        tertiary: '#fbcfe8',
        elevated: '#fff5f8'
      },
      accent: {
        primary: '#f472b6',
        secondary: '#db2777',
        glow: 'rgba(244, 114, 182, 0.2)',
        gradientStart: '#f472b6',
        gradientEnd: '#db2777'
      },
      text: {
        primary: '#831843',
        secondary: '#9d174d',
        muted: '#db2777',
        inverse: '#fef1f5'
      },
      border: {
        default: '#fbcfe8',
        accent: '#f472b6',
        subtle: 'rgba(244, 114, 182, 0.2)'
      },
      status: {
        online: '#86efac',
        idle: '#fde047',
        dnd: '#fca5a5',
        offline: '#db2777'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 26 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 32, inner: 24, pill: 28, avatar: 50 },
    effects: {
      glowStrength: 15,
      shadowBlur: 25,
      shadowOffset: 4,
      glassBlur: 0,
      borderWidth: 0,
      progressHeight: 8,
      softShadows: true
    },
    shadows: {
      card: '0 8px 32px rgba(244, 114, 182, 0.15)',
      elevated: '0 16px 48px rgba(244, 114, 182, 0.2)',
      glow: '0 0 30px rgba(244, 114, 182, 0.2)'
    }
  },

  /**
   * Premium Gold Luxury
   * Gold/yellow accents, elegant, dark background
   * Premium feel with subtle shimmer
   */
  goldLuxury: {
    name: 'Gold Luxury',
    description: 'Premium elegant theme with gold accents',
    colors: {
      surface: {
        primary: '#0f0a00',
        secondary: '#1a1405',
        tertiary: '#2d2410',
        elevated: '#181005'
      },
      accent: {
        primary: '#ffd700',
        secondary: '#ffaa00',
        glow: 'rgba(255, 215, 0, 0.4)',
        gradientStart: '#ffd700',
        gradientEnd: '#ffaa00'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e8d5a0',
        muted: '#8b7355',
        inverse: '#0f0a00'
      },
      border: {
        default: '#3d3010',
        accent: '#ffd700',
        subtle: 'rgba(255, 215, 0, 0.2)'
      },
      status: {
        online: '#a3e635',
        idle: '#facc15',
        dnd: '#ef4444',
        offline: '#8b7355'
      }
    },
    fonts: {
      family: 'Inter, Playfair Display, Georgia, serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, '2xl': 22 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 12, inner: 8, pill: 16, avatar: 12 },
    effects: {
      glowStrength: 25,
      shadowBlur: 25,
      shadowOffset: 4,
      glassBlur: 0,
      borderWidth: 1,
      progressHeight: 6,
      metallic: true
    },
    shadows: {
      card: '0 8px 32px rgba(255, 215, 0, 0.15)',
      elevated: '0 16px 48px rgba(255, 215, 0, 0.2)',
      glow: '0 0 50px rgba(255, 215, 0, 0.4)'
    }
  },

  /**
   * Gradient Dashboard
   * Pink/blue gradients, modern flat design
   * Clean dashboard aesthetic
   */
  gradientDashboard: {
    name: 'Gradient Dashboard',
    description: 'Modern gradient theme with pink/blue tones',
    colors: {
      surface: {
        primary: '#0f0518',
        secondary: '#1a0d2e',
        tertiary: '#2d1b4e',
        elevated: '#180a28'
      },
      accent: {
        primary: '#ec4899',
        secondary: '#3b82f6',
        glow: 'rgba(236, 72, 153, 0.4)',
        gradientStart: '#ec4899',
        gradientEnd: '#3b82f6'
      },
      text: {
        primary: '#ffffff',
        secondary: '#f9a8d4',
        muted: '#6b7280',
        inverse: '#0f0518'
      },
      border: {
        default: '#3d1b5e',
        accent: '#ec4899',
        subtle: 'rgba(236, 72, 153, 0.2)'
      },
      status: {
        online: '#4ade80',
        idle: '#fbbf24',
        dnd: '#f87171',
        offline: '#6b7280'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 20, inner: 16, pill: 20, avatar: 16 },
    effects: {
      glowStrength: 25,
      shadowBlur: 25,
      shadowOffset: 4,
      glassBlur: 0,
      borderWidth: 1,
      progressHeight: 8,
      gradientOverlay: true
    },
    shadows: {
      card: '0 8px 32px rgba(236, 72, 153, 0.2)',
      elevated: '0 16px 48px rgba(59, 130, 246, 0.2)',
      glow: '0 0 40px rgba(236, 72, 153, 0.4)'
    }
  },

  /**
   * Matrix Terminal
   * Green terminal aesthetic, monospace
   * Pure functional design
   */
  matrix: {
    name: 'Matrix',
    description: 'Terminal aesthetic with green monospace text',
    colors: {
      surface: {
        primary: '#000800',
        secondary: '#001800',
        tertiary: '#002800',
        elevated: '#001200'
      },
      accent: {
        primary: '#00ff00',
        secondary: '#00cc00',
        glow: 'rgba(0, 255, 0, 0.4)',
        gradientStart: '#00ff00',
        gradientEnd: '#00cc00'
      },
      text: {
        primary: '#ffffff',
        secondary: '#00cc00',
        muted: '#006600',
        inverse: '#000800'
      },
      border: {
        default: '#003300',
        accent: '#00ff00',
        subtle: 'rgba(0, 255, 0, 0.2)'
      },
      status: {
        online: '#00ff00',
        idle: '#88ff00',
        dnd: '#ff0044',
        offline: '#008822'
      }
    },
    fonts: {
      family: 'Inter, JetBrains Mono, monospace',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, '2xl': 22 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 28 },
    radius: { card: 2, inner: 1, pill: 1, avatar: 2 },
    effects: {
      glowStrength: 20,
      shadowBlur: 10,
      shadowOffset: 0,
      glassBlur: 0,
      borderWidth: 2,
      progressHeight: 6,
      monospace: true,
      scanlines: true
    },
    shadows: {
      card: '0 0 20px rgba(0, 255, 0, 0.1)',
      elevated: '0 0 30px rgba(0, 255, 0, 0.15)',
      glow: '0 0 40px rgba(0, 255, 0, 0.5)'
    }
  },

  /**
   * Cyber Synth
   * Starry background with vibrant pink/yellow gradients
   * Premium futuristic aesthetic
   */
  cyberSynth: {
    name: 'Cyber Synth',
    description: 'Starry background with vibrant pink/yellow gradients',
    colors: {
      surface: {
        primary: '#0f0c29',
        secondary: '#0a0a1a',
        tertiary: '#1a1a2e',
        elevated: '#050510'
      },
      accent: {
        primary: '#ff007f',
        secondary: '#ffd700',
        glow: 'rgba(255, 0, 127, 0.4)',
        gradientStart: '#ff007f',
        gradientEnd: '#ffd700'
      },
      text: {
        primary: '#ffffff',
        secondary: '#ffd700',
        muted: '#9a8abf',
        inverse: '#0f0c29'
      },
      border: {
        default: '#2a2a4a',
        accent: '#ff007f',
        subtle: 'rgba(255, 0, 127, 0.2)'
      },
      status: {
        online: '#00ffcc',
        idle: '#ffd700',
        dnd: '#ff007f',
        offline: '#3a3a5a'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 24, inner: 16, pill: 30, avatar: 20 },
    effects: {
      glowStrength: 25,
      shadowBlur: 30,
      shadowOffset: 6,
      glassBlur: 10,
      borderWidth: 1.5,
      progressHeight: 10,
      particles: true,
      gradientOverlay: true
    },
    shadows: {
      card: '0 8px 32px rgba(0, 0, 0, 0.5)',
      elevated: '0 12px 48px rgba(0, 0, 0, 0.6)',
      glow: '0 0 30px rgba(255, 0, 127, 0.4)'
    }
  },

  /**
   * Neon Gamer
   * High-contrast magenta/pink neon with thick borders
   * Aggressive gamer aesthetic
   */
  neonGamer: {
    name: 'Neon Gamer',
    description: 'High-contrast magenta/pink neon with thick borders',
    colors: {
      surface: {
        primary: '#050505',
        secondary: '#0a0a0a',
        tertiary: '#111111',
        elevated: '#000000'
      },
      accent: {
        primary: '#ff0055',
        secondary: '#00ccff',
        glow: 'rgba(255, 0, 85, 0.5)',
        gradientStart: '#ff0055',
        gradientEnd: '#ff00aa'
      },
      text: {
        primary: '#ffffff',
        secondary: '#ff0055',
        muted: '#666666',
        inverse: '#000000'
      },
      border: {
        default: '#222222',
        accent: '#ff0055',
        subtle: 'rgba(255, 0, 85, 0.3)'
      },
      status: {
        online: '#00ffa2',
        idle: '#ffd700',
        dnd: '#ff0055',
        offline: '#333333'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 12, inner: 8, pill: 10, avatar: 12 },
    effects: {
      glowStrength: 30,
      shadowBlur: 20,
      shadowOffset: 0,
      glassBlur: 0,
      borderWidth: 2.5,
      progressHeight: 12,
      neonBorders: true
    },
    shadows: {
      card: '0 0 30px rgba(255, 0, 85, 0.2)',
      elevated: '0 0 40px rgba(255, 0, 85, 0.3)',
      glow: '0 0 50px rgba(255, 0, 85, 0.6)'
    }
  },

  /**
   * Neon Vibe
   * Vibrant Pink-to-Blue gradient theme
   * Premium futuristic aesthetic with soft secondary glow
   */
  neonVibe: {
    name: 'Neon Vibe',
    description: 'Vibrant Pink-to-Blue gradient theme',
    colors: {
      surface: {
        primary: '#0d0d0f',
        secondary: '#15151a',
        tertiary: '#1f1f29',
        elevated: '#050508'
      },
      accent: {
        primary: '#ff00cc',
        secondary: '#3333ff',
        glow: 'rgba(255, 0, 204, 0.4)',
        gradientStart: '#ff00cc',
        gradientEnd: '#3333ff'
      },
      text: {
        primary: '#ffffff',
        secondary: '#ff00cc',
        muted: '#8e8e9c',
        inverse: '#0d0d0f'
      },
      border: {
        default: '#2a2a35',
        accent: '#ff00cc',
        subtle: 'rgba(255, 0, 204, 0.2)'
      },
      status: {
        online: '#00ffa2',
        idle: '#ffd700',
        dnd: '#ff00cc',
        offline: '#3a3a45'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 24, inner: 16, pill: 30, avatar: 16, badge: 6 },
    effects: {
      glowStrength: 25,
      shadowBlur: 30,
      shadowOffset: 4,
      glassBlur: 8,
      borderWidth: 2,
      progressHeight: 10,
      gradientBorder: true,
      gradientProgress: true,
      overlapLevelBadge: true
    },
    shadows: {
      card: '0 8px 32px rgba(0, 0, 0, 0.5)',
      elevated: '0 12px 48px rgba(0, 0, 0, 0.6)',
      glow: '0 0 30px rgba(255, 0, 204, 0.3)'
    }
  },

  /**
   * Arctic Teal
   * Sophisticated Teal-to-Cyan theme
   * Clean energy aesthetic
   */
  arcticTeal: {
    name: 'Arctic Teal',
    description: 'Sophisticated Teal-to-Cyan theme',
    colors: {
      surface: {
        primary: '#000000',
        secondary: '#050505',
        tertiary: '#10151a',
        elevated: '#020202'
      },
      accent: {
        primary: '#00D4FF',
        secondary: '#00FFA3',
        glow: '#00D4FF'
      },
      text: {
        primary: '#ffffff',
        secondary: '#00D4FF',
        muted: 'rgba(255, 255, 255, 0.5)',
        label: '#00FFA3'
      },
      border: {
        default: '#343a46',
        accent: '#00D4FF',
        subtle: 'rgba(0, 212, 255, 0.2)'
      },
      status: {
        online: '#00ffa2',
        idle: '#ffd700',
        dnd: '#ff3366',
        offline: '#4a5568'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 4, inner: 2, pill: 10, avatar: 4, badge: 2 },
    effects: {
      glowStrength: 15,
      shadowBlur: 20,
      shadowOffset: 2,
      glassBlur: 0,
      borderWidth: 2,
      progressHeight: 8,
      gradientBorder: true,
      gradientProgress: true,
      gridBackground: true,
      scanlines: true
    },
    shadows: {
      card: '0 4px 20px rgba(0, 0, 0, 0.4)',
      elevated: '0 8px 32px rgba(0, 0, 0, 0.5)',
      glow: '0 0 25px rgba(0, 242, 254, 0.25)'
    }
  },

  /**
   * Neon
   * Deep black backgrounds, vibrant neon accents
   * High glow strength, strong shadows, neon borders
   */
  neon: {
    name: 'Neon',
    description: 'Deep black backgrounds with vibrant neon accents',
    colors: {
      surface: {
        primary: '#0a0a0a',
        secondary: '#111111',
        tertiary: '#1a1a1a',
        elevated: '#000000'
      },
      accent: {
        primary: '#00ffff',
        secondary: '#ff00ff',
        glow: 'rgba(0, 255, 255, 0.5)',
        gradientStart: '#00ffff',
        gradientEnd: '#ff00ff'
      },
      text: {
        primary: '#ffffff',
        secondary: '#00ffff',
        muted: 'rgba(255, 255, 255, 0.6)',
        inverse: '#000000'
      },
      border: {
        default: '#333333',
        accent: '#00ffff',
        subtle: 'rgba(0, 255, 255, 0.3)'
      },
      status: {
        online: '#00ffaa',
        idle: '#ffff00',
        dnd: '#ff0055',
        offline: '#666666'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 12, inner: 8, pill: 10, avatar: 50 },
    effects: {
      glowStrength: 35,
      shadowBlur: 30,
      shadowOffset: 4,
      glassBlur: 0,
      borderWidth: 2,
      progressHeight: 12,
      neonBorders: true,
      gradientProgress: true
    },
    shadows: {
      card: '0 8px 32px rgba(0, 255, 255, 0.2)',
      elevated: '0 12px 48px rgba(0, 255, 255, 0.3)',
      glow: '0 0 60px rgba(0, 255, 255, 0.6)'
    }
  },

  /**
   * Dark
   * Pure dark backgrounds, subtle purple/blue accents
   * Minimal glow, moderate shadows, clean borders
   */
  dark: {
    name: 'Dark',
    description: 'Pure dark backgrounds with subtle purple/blue accents',
    colors: {
      surface: {
        primary: '#0d0d0d',
        secondary: '#1a1a1a',
        tertiary: '#262626',
        elevated: '#050505'
      },
      accent: {
        primary: '#5865f2',
        secondary: '#7289da',
        glow: 'rgba(88, 101, 242, 0.3)',
        gradientStart: '#5865f2',
        gradientEnd: '#7289da'
      },
      text: {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        muted: '#525252',
        inverse: '#000000'
      },
      border: {
        default: '#2a2a2a',
        accent: '#5865f2',
        subtle: 'rgba(88, 101, 242, 0.15)'
      },
      status: {
        online: '#3ba55c',
        idle: '#faa61a',
        dnd: '#ed4245',
        offline: '#747f8d'
      }
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      sizes: { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, '2xl': 24 },
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
    radius: { card: 8, inner: 4, pill: 12, avatar: 50 },
    effects: {
      glowStrength: 12,
      shadowBlur: 16,
      shadowOffset: 2,
      glassBlur: 0,
      borderWidth: 1,
      progressHeight: 8,
      softShadows: true
    },
    shadows: {
      card: '0 4px 16px rgba(0, 0, 0, 0.4)',
      elevated: '0 8px 24px rgba(0, 0, 0, 0.5)',
      glow: '0 0 20px rgba(88, 101, 242, 0.25)'
    }
  }
};

/**
 * Card dimensions for each card type
 */
const cardDimensions = {
  rank: { width: 450, height: 280 },
  music: { width: 500, height: 320 },
  leaderboard: { width: 500, height: 520 },
  invite: { width: 450, height: 380 }
};

/**
 * Flatten a theme definition object into a flat token map.
 * This is the pure flattening logic — does NOT resolve theme names.
 * Use `themeToTokens` from `themes/index.js` for string resolution.
 *
 * @param {Object} theme - Theme definition object
 * @returns {Object} Flat token map keyed by dot-notation paths
 */
function flattenTheme(theme) {
  const t = theme;
  if (!t || typeof t !== 'object') return {};

  const colors = t.colors || {};
  const surface = colors.surface || colors.background || {};
  const accent = colors.accent || {};
  const text = colors.text || {};
  const border = colors.border || {};
  const status = colors.status || {};

  const fonts = t.fonts || { family: 'Inter, sans-serif', sizes: {}, weights: {} };
  const spacing = t.spacing || {};
  const radius = t.radius || {};
  const effects = t.effects || {};
  const shadows = t.shadows || {};
  const avatar = t.avatar || {};

  return {
    // Surface colors
    'surface.primary': surface.primary || '#1a1b26',
    'surface.secondary': surface.secondary || '#16161e',
    'surface.tertiary': surface.tertiary || '#1f1f29',
    'surface.elevated': surface.elevated || '#0d0d0f',

    // Accent colors
    'accent.primary': accent.primary || '#7c3aed',
    'accent.secondary': accent.secondary || '#8b5cf6',
    'accent.tertiary': accent.tertiary || null,
    'accent.glow': accent.glow || 'rgba(124, 58, 237, 0.4)',
    'accent.gradientStart': accent.gradientStart || accent.primary || '#7c3aed',
    'accent.gradientMid': accent.gradientMid || null,
    'accent.gradientEnd': accent.gradientEnd || accent.secondary || '#8b5cf6',

    // Text colors
    'text.primary': text.primary || '#ffffff',
    'text.secondary': text.secondary || '#9ca3af',
    'text.muted': text.muted || '#6b7280',
    'text.inverse': text.inverse || '#1a1b26',
    'text.label': text.label || null,

    // Border colors
    'border.default': border.default || 'rgba(255, 255, 255, 0.1)',
    'border.accent': border.accent || accent.primary || '#7c3aed',
    'border.subtle': border.subtle || 'rgba(255, 255, 255, 0.05)',

    // Status colors
    'status.online': status.online || '#22c55e',
    'status.idle': status.idle || '#f59e0b',
    'status.dnd': status.dnd || '#ef4444',
    'status.offline': status.offline || '#6b7280',

    // Fonts
    'font.family': fonts.family,
    'font.size.xs': (fonts.sizes || {}).xs || 10,
    'font.size.sm': (fonts.sizes || {}).sm || 12,
    'font.size.md': (fonts.sizes || {}).md || 14,
    'font.size.lg': (fonts.sizes || {}).lg || 16,
    'font.size.xl': (fonts.sizes || {}).xl || 20,
    'font.size.2xl': (fonts.sizes || {})['2xl'] || 24,
    'font.weight.regular': (fonts.weights || {}).regular || 400,
    'font.weight.medium': (fonts.weights || {}).medium || 500,
    'font.weight.semibold': (fonts.weights || {}).semibold || 600,
    'font.weight.bold': (fonts.weights || {}).bold || 700,

    // Spacing
    'spacing.xs': spacing.xs || 4,
    'spacing.sm': spacing.sm || 8,
    'spacing.md': spacing.md || 12,
    'spacing.lg': spacing.lg || 16,
    'spacing.xl': spacing.xl || 24,
    'spacing.2xl': spacing['2xl'] || 32,

    // Radius
    'radius.card': radius.card != null ? radius.card : 12,
    'radius.inner': radius.inner != null ? radius.inner : 8,
    'radius.pill': radius.pill != null ? radius.pill : 20,
    'radius.avatar': radius.avatar != null ? radius.avatar : 12,
    'radius.badge': radius.badge != null ? radius.badge : null,

    // Effects (numeric)
    'glow.strength': effects.glowStrength != null ? effects.glowStrength : 15,
    'shadow.blur': effects.shadowBlur != null ? effects.shadowBlur : 20,
    'shadow.offset': effects.shadowOffset != null ? effects.shadowOffset : 4,
    'glass.blur': effects.glassBlur || 0,
    'border.width': effects.borderWidth || 1,
    'progress.height': effects.progressHeight || 10,

    // Shadows
    'shadow.card': shadows.card || '0 8px 32px rgba(0, 0, 0, 0.3)',
    'shadow.elevated': shadows.elevated || '0 12px 48px rgba(0, 0, 0, 0.4)',
    'shadow.glow': shadows.glow || '0 0 20px rgba(124, 58, 237, 0.2)',

    // Effect flags
    'effect.cornerBrackets': effects.cornerBrackets || false,
    'effect.scanlines': effects.scanlines || false,
    'effect.glassmorphism': (effects.glassBlur || 0) > 0,
    'effect.backdropBlur': effects.backdropBlur || false,
    'effect.holographic': effects.holographic || false,
    'effect.metallic': effects.metallic || false,
    'effect.monospace': effects.monospace || false,
    'effect.gradientOverlay': effects.gradientOverlay || false,
    'effect.particles': effects.particles || false,
    'effect.neonBorders': effects.neonBorders || false,
    'effect.gradientBorder': effects.gradientBorder || false,
    'effect.gradientProgress': effects.gradientProgress || false,
    'effect.overlapLevelBadge': effects.overlapLevelBadge || false,
    'effect.softShadows': effects.softShadows || false,
    'effect.noiseTexture': effects.noiseTexture || false,
    'effect.gridBackground': effects.gridBackground || false,
    'effect.clipPaths': effects.clipPaths || false,
    'effect.techDeco': effects.techDeco || false,
    'effect.smoothGradients': effects.smoothGradients || false,
    'effect.levelCircle': effects.levelCircle || false,

    // Avatar shape
    'avatar.shape': avatar.shape || 'default',
    'avatar.borderGradient': avatar.borderGradient || false
  };
}

module.exports = {
  cardThemes,
  cardDimensions,
  flattenTheme
};
