import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, LinkColor } from '@components/button';
import { LANGUAGE_KEY } from '@constants/Translate';
import { getRouteKey } from '@utils/Translation';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IBreadCrumb, Section } from '.';

import './BreadCrumb.scss';

export const BreadCrumb: React.FC<IBreadCrumb> = ({ routes, className = 'mb-4.5' }) => {
    const [translate] = useTranslation(LANGUAGE_KEY);

    const getRouteName = (route: Section): string => (route?.routeIndex ? translate(getRouteKey(route.routeIndex)) : route.name);

    return (
        <p className={`bread-crumb ${className} leading-3`}>
            {routes.map((route, index) => (
                <span key={index}>
                    {routes[routes.length - 1].name === route.name ? (
                        <span className="bread-crumb__route--current">{getRouteName(route)}</span>
                    ) : (
                        <>
                            <Link
                                id={generateId({
                                    module: ModuleApp.BREAD_CRUMB,
                                    submodule: `${route.route}-link-${index}`,
                                    action: ActionElementType.REDIRECT,
                                    elementType: ElementType.LNK,
                                })}
                                text={getRouteName(route)}
                                href={route.route}
                                classes="bread-crumb__route text-blue no-underline text-tiny"
                                onClick={route.onClick || ((): void => {})}
                                linkColor={LinkColor.BLUE}
                                disabled={!!route?.disabled}
                            />
                            <span className="bread-crumb__route--arrow">{'>'}</span>
                        </>
                    )}
                </span>
            ))}
        </p>
    );
};
