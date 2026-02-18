/**
 * Rank Card Design Definition 
 * This definition is used to map designer layout to the Layout Engine.
 */
export const RankCardDesign = {
    canvas: {
        width: 930,
        height: 280
    },
    components: {
        Avatar: {
            size: 180,
            x: 42,
            y: 35,
            radius: '{Radii.Avatar}'
        },
        LevelBadge: {
            size: 48,
            anchor: 'Avatar.BottomRight',
            offset: -12
        },
        ProgressBar: {
            height: 22,
            radius: 11,
            bottom: 34
        }
    }
};
