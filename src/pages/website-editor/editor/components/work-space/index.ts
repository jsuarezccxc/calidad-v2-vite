import { IconsNames } from '@components/icon';
import { Screen } from '@models/WebsiteNode';

export * from './ActionButtons';
export * from './PageEditor';
export * from './Screens';
export * from './WorkSpace';

/**
 * This describes the screen structure
 *
 * @typeParam activeIcon: IconsNames - Active icon
 * @typeParam className: string - Tab className
 * @typeParam idleIcon: IconsNames - Idle icon
 * @typeParam text: string - Optional text
 * @typeParam type: Version - Version type
 * @typeParam iconClassNames: string - Optional icon class names
 */
export interface IScreen {
    activeIcon: IconsNames;
    className: string;
    idleIcon: IconsNames;
    text?: string;
    type: Screen;
    iconClassNames?: string;
}

/**
 * This describes the props of the screens
 *
 * @typeParam activeScreen: Screen - Active screen
 * @typeParam handleScreenChange: (screen: Screen) => void - Function to handle screen change
 */
export interface IScreensProps {
    activeScreen: Screen;
    handleScreenChange: (screen: Screen) => void;
}

/**
 * Display screens, used for painting tabs in the workspace
 */
export const SCREENS: IScreen[] = [
    {
        activeIcon: 'desktopWhite',
        className: 'work-space__tab work-space__tab--left',
        idleIcon: 'desktopBlue',
        text: 'Versión escritorio',
        type: Screen.Desktop,
        iconClassNames: 'w-5 h-4.5',
    },
    {
        activeIcon: 'mobileWhite',
        className: 'work-space__tab work-space__tab--right',
        idleIcon: 'mobileBlue',
        text: 'Versión móvil',
        type: Screen.Mobile,
        iconClassNames: 'w-2.5 h-4',
    },
];
