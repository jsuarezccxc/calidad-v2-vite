import { useMemo } from 'react';
import { Section } from '@components/bread-crumb';
import { getRoutes } from '@utils/Paths';

/**
 * Custom hook that returns the props of the breadcrumb
 *
 * @typeParam breadCrumbRoutes: number[] - Page routes
 * @returns { routes: Section[] }
 */
const useRoutes = (pageRoutes: number[]): { routes: Section[] } => {
    const routes = useMemo(() => getRoutes(pageRoutes), [pageRoutes]);
    return {
        routes,
    };
};

export default useRoutes;
