import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, LinkColor } from '@components/button';
import { LANGUAGE_KEY } from '@constants/Translate';
import { getRouteKey } from '@utils/Translation';
import { IBreadCrumb, Section } from '@components/bread-crumb';
import '@components/bread-crumb/BreadCrumb.scss';

const BreadCrumbPrint: React.FC<IBreadCrumb> = ({ routes, className }) => {
    const [translate] = useTranslation(LANGUAGE_KEY);

    const getRouteName = (route: Section): string => (route?.routeIndex ? translate(getRouteKey(route.routeIndex)) : route.name);

    return (
        <div className={`mb-4.5 bread-crumb ${className} flex flex-row items-center leading-3`}>
            {routes.map((route, index) => (
                <div key={index}>
                    {routes[routes.length - 1].name === route.name ? (
                        <a className="bread-crumb__route--current">{getRouteName(route)}</a>
                    ) : (
                        <>
                            <Link
                                text={getRouteName(route)}
                                href={route.route}
                                classes="bread-crumb__route"
                                onClick={route.onClick || ((): void => {})}
                                linkColor={LinkColor.BLUE}
                            />
                            <span className="bread-crumb__route--arrow">{'>'}</span>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BreadCrumbPrint;
