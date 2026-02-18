/**
 * Esport Theme
 * Aggressive, high-contrast theme with clipped corners and vibrant green accents.
 */

const esport = {
    name: 'esport',
    description: 'Aggressive, high-contrast theme with clipped corners',
    colors: {
        surface: {
            primary: '#050505',
            secondary: '#111111',
            tertiary: '#0F172A',
            elevated: '#1a1a1a'
        },
        accent: {
            primary: '#11998E',
            secondary: '#38EF7D',
            tertiary: '#00FFA3',
            glow: 'rgba(56, 239, 125, 0.4)',
            gradientStart: '#11998E',
            gradientEnd: '#38EF7D'
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#38EF7D',
            muted: '#64748B',
            inverse: '#000000'
        },
        border: {
            default: '#1E293B',
            accent: '#38EF7D',
            subtle: '#11998E'
        },
        status: {
            online: '#38EF7D',
            idle: '#F59E0B',
            dnd: '#EF4444',
            offline: '#64748B'
        }
    },
    fonts: {
        family: '"JetBrains Mono", "Courier New", monospace',
        sizes: {
            xs: 11,
            sm: 13,
            md: 15,
            lg: 18,
            xl: 24,
            '2xl': 30
        },
        weights: {
            regular: 400,
            medium: 500,
            semibold: 700,
            bold: 800
        }
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 20,
        xl: 28,
        '2xl': 40
    },
    radius: {
        card: 0, // Sharp corners for clip path
        inner: 0,
        pill: 0,
        avatar: 0
    },
    effects: {
        glowStrength: 10,
        shadowBlur: 0,
        shadowOffset: 0,
        glassBlur: 0,
        borderWidth: 2,
        progressHeight: 16,
        clipPaths: true,
        techDeco: true
    },
    shadows: {
        card: 'none',
        glow: '0 0 10px rgba(56, 239, 125, 0.4)'
    },
    avatar: {
        shape: 'polygon-clip'
    }
};

module.exports = esport;
