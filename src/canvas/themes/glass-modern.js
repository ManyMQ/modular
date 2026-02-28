/**
 * Glass Modern Theme
 * A minimalist modern theme focused on translucent surfaces and frosted glass effects.
 */

const glassModern = {
    name: 'glass-modern',
    description: 'Minimalist modern theme with translucent surfaces and frosted glass',
    colors: {
        surface: {
            primary: 'rgba(255, 255, 255, 0.1)',
            secondary: 'rgba(255, 255, 255, 0.05)',
            tertiary: 'rgba(255, 255, 255, 0.15)',
            elevated: 'rgba(255, 255, 255, 0.2)'
        },
        accent: {
            primary: '#6366f1', // Indigo
            secondary: '#8b5cf6', // Violet
            glow: 'rgba(99, 102, 241, 0.3)',
            gradientStart: '#6366f1',
            gradientEnd: '#8b5cf6'
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            muted: 'rgba(255, 255, 255, 0.4)',
            inverse: '#000000'
        },
        border: {
            default: 'rgba(255, 255, 255, 0.2)',
            accent: 'rgba(99, 102, 241, 0.5)',
            subtle: 'rgba(255, 255, 255, 0.1)'
        },
        status: {
            online: '#10b981',
            idle: '#f59e0b',
            dnd: '#ef4444',
            offline: 'rgba(255, 255, 255, 0.4)'
        }
    },
    fonts: {
        family: '"Outfit", "Inter", sans-serif',
        sizes: {
            xs: 10,
            sm: 12,
            md: 14,
            lg: 16,
            xl: 20,
            '2xl': 24
        },
        weights: {
            regular: 300,
            medium: 400,
            semibold: 500,
            bold: 600
        }
    },
    spacing: {
        xs: 6,
        sm: 12,
        md: 18,
        lg: 24,
        xl: 36,
        '2xl': 48
    },
    radius: {
        card: 24,
        inner: 16,
        pill: 32,
        avatar: 20
    },
    effects: {
        glowStrength: 15,
        shadowBlur: 40,
        shadowOffset: 8,
        glassBlur: 25,
        borderWidth: 1,
        progressHeight: 8,
        backdropBlur: true,
        softShadows: true
    },
    shadows: {
        card: '0 8px 32px rgba(0, 0, 0, 0.1)',
        glow: '0 0 30px rgba(99, 102, 241, 0.2)'
    }
};

module.exports = glassModern;
