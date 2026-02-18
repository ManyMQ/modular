/**
 * Design Token to Theme Property Mapper
 * Bridges the gap between design naming and the library's ThemeConfig structure.
 */
import { colorTokens } from '../tokens/colors';
import { typographyTokens } from '../tokens/typography';

export function mapDesignToTheme(designerChoice: 'default' | 'neon' | 'glass') {
    return {
        colors: {
            surface: {
                primary: colorTokens['Background/Primary'],
                secondary: colorTokens['Background/Secondary'],
                elevated: colorTokens['Background/Elevated']
            },
            accent: {
                primary: colorTokens['Accent/Primary'],
                secondary: colorTokens['Accent/Secondary']
            }
        },
        fonts: {
            family: typographyTokens.Families.Primary
        }
        // ... etc
    };
}
