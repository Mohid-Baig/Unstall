export const TINY_ACTIONS = [
    'Open VS Code',
    'Read one paragraph',
    'Write one sentence',
    'Drink water',
    'Open your notebook',
    'Stretch for 30 seconds',
];

/**
 * Picks one task at random. Kept as a plain function (not a hook) so
 * it can be called once per ritual, not re-rolled on every re-render.
 */
export function getRandomTinyAction() {
    const index = Math.floor(Math.random() * TINY_ACTIONS.length);
    return TINY_ACTIONS[index];
}