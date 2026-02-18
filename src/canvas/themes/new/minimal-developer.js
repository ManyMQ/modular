/**
 * Minimal Developer Theme
 * A clean, utility-focused theme inspired by code editors and terminal aesthetics.
 */

const minimalDeveloper = {
    name: 'minimal-developer',
    description: 'Clean, utility-focused theme inspired by terminal aesthetics',
    colors: {
        surface: {
            primary: '#0d0d0d',
            secondary: '#1a1a1a',
            tertiary: '#262626',
            elevated: '#121212'
        },
        accent: {
            primary: '#22c55e', // Terminal Green
            secondary: '#f97316', // Terminal Orange
            glow: 'rgba(34, 197, 94, 0.2)',
            gradientStart: '#22c55e',
            gradientEnd: '#16a34a'
        },
        text: {
            primary: '#e5e5e5',
            secondary: '#a3a3a3',
            muted: '#525252',
            inverse: '#0d0d0d'
        },
        border: {
            default: '#262626',
            accent: '#22c55e',
            subtle: 'rgba(34, 197, 94, 0.1)'
        },
        status: {
            online: '#22c55e',
            idle: '#eab308',
            dnd: '#ef4444',
            offline: '#525252'
        }
    },
    fonts: {
        family: '"JetBrains Mono", "Fira Code", monospace',
        sizes: {
            xs: 10,
            sm: 12,
            md: 14,
            lg: 16,
            xl: 18,
            '2xl': 22
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
        xl: 20,
        '2xl': 28
    },
    radius: {
        card: 4,
        inner: 2,
        pill: 2,
        avatar: 4
    },
    effects: {
        glowStrength: 5,
        shadowBlur: 10,
        shadowOffset: 0,
        glassBlur: 0,
        borderWidth: 1,
        progressHeight: 4,
        monospace: true
    },
    shadows: {
        card: '0 0 10px rgba(0, 0, 0, 0.5)',
        glow: '0 0 20px rgba(34, 197, 94, 0.1)'
    }
};

module.exports = minimalDeveloper;
