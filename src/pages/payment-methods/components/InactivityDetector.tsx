import React, { useEffect } from 'react';

const InactivityDetector: React.FC<{ onInactive: () => void }> = ({ onInactive }) => {
    let timeoutID: number;

    useEffect(() => {
        const setup = (): void => {
            window.addEventListener('mousemove', resetTimer, false);
            window.addEventListener('mousedown', resetTimer, false);
            window.addEventListener('keypress', resetTimer, false);
            window.addEventListener('DOMMouseScroll', resetTimer, false);
            window.addEventListener('mousewheel', resetTimer, false);
            window.addEventListener('touchmove', resetTimer, false);
            window.addEventListener('MSPointerMove', resetTimer, false);

            startTimer();
        };
        setup();

        return (): void => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('mousedown', resetTimer);
            window.removeEventListener('keypress', resetTimer);
            window.removeEventListener('DOMMouseScroll', resetTimer);
            window.removeEventListener('mousewheel', resetTimer);
            window.removeEventListener('touchmove', resetTimer);
            window.removeEventListener('MSPointerMove', resetTimer);
            window.clearTimeout(timeoutID);
        };
    }, []);

    const startTimer = (): void => {
        timeoutID = window.setTimeout(goInactive, 10 * 60 * 1000);
    };

    const resetTimer = (): void => {
        window.clearTimeout(timeoutID);

        goActive();
    };

    const goInactive = (): void => {
        onInactive();
    };

    const goActive = (): void => {
        startTimer();
    };

    return null;
};

export default InactivityDetector;
