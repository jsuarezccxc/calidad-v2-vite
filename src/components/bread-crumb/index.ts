export * from './BreadCrumb';

/**
 * This interface describes that properties the bread crumb component receives in object
 * @typeParam name: string - Name section
 * @typeParam route: string - Route to go with section
 * @typeParam onClick: () => void - Optional click handler
 * @typeParam routeIndex: number - Optional prop with the route index
 * @typeParam disabled: boolean - Optional prop that indicates if the route is disabled
 */
export type Section = {
    name: string;
    route: string;
    onClick?: () => void;
    routeIndex?: number;
    disabled?: boolean;
};

/**
 * * This interface describes that properties the list routes in bread crumb component receives
 *
 * @typeParam routes: Section[] - List routes to bread crumb
 * @typeParam className: string - Optional className for customize the bread crumb
 * @typeParam isTitle: boolean - Optional prop that indicates if the route is a title
 */
export interface IBreadCrumb {
    routes: Section[];
    className?: string;
    isTitle?: boolean;
}
