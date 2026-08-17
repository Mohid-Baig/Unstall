import { MMKV } from 'react-native-mmkv';

/**
 * Single shared MMKV instance for the whole app.
 * Import `storage` anywhere you need fast local read/write —
 * do not create additional instances elsewhere.
 */
export const storage = new MMKV({
    id: 'unstall-storage',
});

export const STORAGE_KEYS = {
    ONBOARDING_COMPLETE: 'onboarding_complete',
    STREAK_COUNT: 'streak_count',
    TODAY_RESET_COUNT: 'today_reset_count',
    LAST_RESET_DATE: 'last_reset_date',
    SESSION_HISTORY: 'session_history',
    IS_PREMIUM: 'is_premium',
    THEME: 'theme',
    HAPTICS_ENABLED: 'haptics_enabled',
    NOTIFICATIONS_ENABLED: 'notifications_enabled',
};