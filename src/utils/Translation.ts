import { getRoute, removeSlash } from './Paths';

export const getRouteKey = (routeIndex: number): string => `paths.${removeSlash(getRoute(routeIndex))}`;

export const getTranslationKey = (module: string, key: string): string => `${module}.${key}`;
