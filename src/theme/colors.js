/**
 * Dark-first palette. Every screen pulls from here — never hardcode hex
 * values directly in a component file.
 */
export const colors = {
    background: '#0B0B0F',
    backgroundElevated: '#15151C',
    surface: '#1C1C24',

    textPrimary: '#F5F5F7',
    textSecondary: '#9A9AA5',
    textMuted: '#6B6B76',

    accent: '#7C6CF0', // soft violet — used across Screens 3-8
    accentPressed: '#6858D9',

    glassBorder: 'rgba(255,255,255,0.08)',

    success: '#4ADE80',
    danger: '#F87171',

    // Amber glow palette — reserved for the Landing screen's signature
    // "first impression" moment. Kept separate from the app-wide violet
    // accent on purpose: Landing is the one screen designed to feel like
    // a warm ember igniting, everything after it settles into the calmer
    // violet system.
    amber: '#FFB86B',
    amberDim: '#7A5326',
    amberGlow: 'rgba(255, 184, 107, 0.35)',
    amberGlowFaint: 'rgba(255, 184, 107, 0.12)',
};