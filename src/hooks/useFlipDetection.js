import { useEffect, useRef, useState } from 'react';
import {
    accelerometer,
    setUpdateIntervalForType,
    SensorTypes,
} from 'react-native-sensors';

// z-axis reads ~+9.8 when the phone lies screen-up on a flat surface,
// ~-9.8 when screen-down. Thresholds are set inside that range (not
// at the extremes) so a genuine flip registers reliably even if the
// phone isn't perfectly flat.
const FACE_DOWN_THRESHOLD = -8.5;
const FACE_UP_THRESHOLD = 8.5;

// A reading has to hold steady for this long before we trust it as a
// real flip, not a quick jostle while picking the phone up or setting
// it down on a table. This is the single most important number for
// avoiding false triggers — tune here first if flips feel unreliable.
const STABLE_DURATION_MS = 350;

const SAMPLE_INTERVAL_MS = 100;

/**
 * Tracks whether the phone is currently face-up or face-down.
 * Returns 'up' | 'down' | 'unknown' — 'unknown' covers the phone
 * being held on its side or during the brief moment mid-flip.
 */
export function useFlipDetection() {
    const [orientation, setOrientation] = useState('unknown');
    const pendingRef = useRef(null); // { candidate, since }

    useEffect(() => {
        setUpdateIntervalForType(SensorTypes.accelerometer, SAMPLE_INTERVAL_MS);

        const subscription = accelerometer.subscribe(
            ({ z }) => {
                let candidate = null;
                if (z <= FACE_DOWN_THRESHOLD) candidate = 'down';
                else if (z >= FACE_UP_THRESHOLD) candidate = 'up';

                if (!candidate) {
                    // Phone is on its side / mid-flip — reset the pending timer
                    // so a brief pass-through doesn't count toward stability.
                    pendingRef.current = null;
                    return;
                }

                const now = Date.now();

                if (pendingRef.current?.candidate === candidate) {
                    if (now - pendingRef.current.since >= STABLE_DURATION_MS) {
                        setOrientation((prev) => (prev === candidate ? prev : candidate));
                    }
                } else {
                    pendingRef.current = { candidate, since: now };
                }
            },
            (error) => {
                // Device has no accelerometer, or permission denied — fail
                // quietly rather than crashing the ritual screen. The screen
                // itself should offer a manual fallback in this case.
                console.warn('useFlipDetection: sensor error', error);
            },
        );

        return () => subscription.unsubscribe();
    }, []);

    return orientation;
}