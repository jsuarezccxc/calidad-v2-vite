import { Routes } from '@constants/Paths';
import { Section } from '@components/bread-crumb';
import { getRoute, getRouteName } from '@utils/Paths';
import { CommonProperty, IDomainProps } from '@models/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { DOMAIN } from '@constants/Domain';
import { DIGGIPYMES } from '@constants/AppConstants';
export { default } from './WebsiteActiveDomain';

/**
 * Function that returns the routes for the breadcrumb
 * @param domain: string - Domain
 * @returns Section[]
 */
export const routes = (domain: string): Section[] => {
    if (domain) {
        if (domain.includes(DIGGIPYMES.toLowerCase())) {
            return [
                {
                    name: getRouteName(Routes.WEBSITE_MENU),
                    route: getRoute(Routes.WEBSITE_DASHBOARD),
                },
                {
                    name: getRouteName(Routes.WEBSITE_ACTIVE_DOMAIN),
                    route: getRoute(Routes.WEBSITE_ACTIVE_DOMAIN),
                },
                {
                    name: 'Actualizar dominio',
                    route: getRoute(Routes.WEBSITE_ACTIVE_DOMAIN),
                },
            ];
        } else {
            return [
                {
                    name: getRouteName(Routes.HOME),
                    route: getRoute(Routes.WEBSITE_DASHBOARD),
                },
                {
                    name: getRouteName(Routes.WEBSITE_ACTIVE_DOMAIN),
                    route: getRoute(Routes.WEBSITE_ACTIVE_DOMAIN),
                },
            ];
        }
    } else {
        return [
            {
                name: getRouteName(Routes.HOME),
                route: getRoute(Routes.WEBSITE_DASHBOARD),
            },
            {
                name: getRouteName(Routes.WEBSITE_ACTIVE_DOMAIN),
                route: getRoute(Routes.WEBSITE_ACTIVE_DOMAIN),
            },
        ];
    }
};

/**
 * Common properties to get data domain
 */
export const COMMON_PROPERTIES = [CommonProperty.Domain, CommonProperty.HostedZone];

/**
 * Get data from domain
 * @param data
 * @returns
 */
export const getDomainProps = (data: IGenericRecord): IDomainProps => {
    const { domain, hosted_zone: hostedZone } = data;
    const isDomain = !domain?.includes(DOMAIN);
    return {
        domain,
        hostedZone: {
            dns: hostedZone?.dns,
            domain,
            id: hostedZone?.hostedZoneId,
        },
        isDomain,
    };
};

/**
 * Select domain step
 */
export const STEP_SELECT_DOMAIN = 0;

/**
 * Connect domain step
 */
export const STEP_CONNECT_DOMAIN = 1;

/**
 * Active domain step
 */
export const STEP_ACTIVE_DOMAIN = 3;

/**
 * Congrats domain step
 */
export const STEP_CONGRATS_DOMAIN = 4;

/**
 * Array to caint steps
 */
export const STEPS_DOMAIN = [STEP_SELECT_DOMAIN, STEP_ACTIVE_DOMAIN];
