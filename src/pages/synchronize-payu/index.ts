import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './SynchronizePayu'

export const routesSynchronizePayu = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_MENU),
    },
    {
        name: getRouteName(Routes.WEBSITE_EDITOR),
        route: getRoute(Routes.WEBSITE_EDITOR),
    },

];
