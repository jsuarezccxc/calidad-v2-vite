import React, { useMemo, useState } from 'react';
import { Screen, StyleKey } from '@models/WebsiteNode';
import { ScreensContext } from '.';

export const ScreensProvider: React.FC = ({ children }) => {
    const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Desktop);

    const styleKey = useMemo(() => (activeScreen === Screen.Desktop ? StyleKey.DesktopStyle : StyleKey.MobileStyle), [
        activeScreen,
    ]);

    const isMobile = styleKey === StyleKey.MobileStyle;

    const selectScreen = (screen: Screen): void => setActiveScreen(screen);

    return (
        <ScreensContext.Provider value={{ activeScreen, isMobile, selectScreen, styleKey }}>{children}</ScreensContext.Provider>
    );
};
