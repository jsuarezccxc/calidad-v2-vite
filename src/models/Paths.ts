import React from 'react';

type RouteType = 'public' | 'private';

/**
 * This interface describes structure for paths
 *
 * @typeParam [path: string]: { route: string; component: React.FC | null; type: RouteType; title: string }
 *            - Route, component private or public route and title for each path
 */
export interface IPath {
    [path: string]: {
        route: string;
        component: React.FC | null;
        type: RouteType;
        title: string;
    };
}
