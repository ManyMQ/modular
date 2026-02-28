/**
 * Pink Gradient Theme
 * Modern gradient aesthetic with glass effects and rounded corners.
 */

const pinkGradient = {
    name: 'pink-gradient',
    description: 'Modern gradient aesthetic with glass effects',
    colors: {
        surface: {
            primary: '#0F0F14',
            secondary: 'rgba(255, 255, 255, 0.05)',
            tertiary: 'rgba(255, 255, 255, 0.1)',
            elevated: '#1a1a1a'
        },
        accent: {
            primary: '#F093FB',
            secondary: '#F5576C',
            tertiary: '#4FACFE',
            glow: 'rgba(245, 87, 108, 0.4)',
            gradientStart: '#F093FB',
            gradientMid: '#F5576C',
            gradientEnd: '#4FACFE'
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',
            muted: '#9CA3AF',
            inverse: '#000000'
        },
        border: {
            default: 'rgba(255, 255, 255, 0.1)',
            accent: 'rgba(240, 147, 251, 0.3)',
            subtle: 'rgba(255, 255, 255, 0.05)'
        },
        status: {
            online: '#10B981',
            idle: '#F59E0B',
            dnd: '#EF4444',
            offline: '#6B7280'
        }
    },
    fonts: {
        family: '"Inter", "Roboto", sans-serif',
        sizes: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 20,
            xl: 24,
            '2xl': 32
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
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48
    },
    radius: {
        card: 24,
        inner: 16,
        pill: 9999,
        avatar: 9999 // Circle
    },
    effects: {
        glowStrength: 20,
        shadowBlur: 20,
        shadowOffset: 4,
        glassBlur: 10,
        borderWidth: 1,
        progressHeight: 12,
        gradientBorder: true,
        smoothGradients: true
    },
    shadows: {
        card: '0 8px 32px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(245, 87, 108, 0.3)'
    },
    avatar: {
        shape: 'circle',
        borderGradient: true
    }
};

module.exports = pinkGradient;
