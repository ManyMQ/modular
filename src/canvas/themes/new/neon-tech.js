/**
 * Neon Tech Theme
 * A high-energy futuristic theme with vibrant cyan/magenta glow and tech patterns.
 */

const neonTech = {
    name: 'neon-tech',
    description: 'High-energy futuristic theme with vibrant cyan/magenta glow',
    colors: {
        surface: {
            primary: '#050505',
            secondary: '#0a0a0a',
            tertiary: '#111111',
            elevated: '#000000'
        },
        accent: {
            primary: '#00f0ff', // Cyber Cyan
            secondary: '#ff00ff', // Neo Magenta
            glow: 'rgba(0, 240, 255, 0.6)',
            gradientStart: '#00f0ff',
            gradientEnd: '#ff00ff'
        },
        text: {
            primary: '#ffffff',
            secondary: '#00f0ff',
            muted: '#4b5563',
            inverse: '#050505'
        },
        border: {
            default: '#1f2937',
            accent: '#00f0ff',
            subtle: 'rgba(0, 240, 255, 0.3)'
        },
        status: {
            online: '#00ff88',
            idle: '#fee440',
            dnd: '#ff0055',
            offline: '#4b5563'
        }
    },
    fonts: {
        family: '"Orbitron", "Inter", sans-serif',
        sizes: {
            xs: 10,
            sm: 12,
            md: 14,
            lg: 16,
            xl: 20,
            '2xl': 26
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
        pill: 24,
        avatar: 50
    },
    avatar: {
        shape: 'hexagon'
    },
    effects: {
        glowStrength: 40,
        shadowBlur: 30,
        shadowOffset: 0,
        glassBlur: 0,
        borderWidth: 2,
        progressHeight: 12,
        neonBorders: true,
        scanlines: true,
        particles: true,
        levelCircle: true
    },
    shadows: {
        card: '0 0 30px rgba(0, 240, 255, 0.2)',
        glow: '0 0 60px rgba(0, 240, 255, 0.6)'
    }
};

module.exports = neonTech;
