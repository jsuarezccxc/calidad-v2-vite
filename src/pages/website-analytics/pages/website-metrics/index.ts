import { Section } from '@components/bread-crumb';
import { DOCUMENT_SUPPORT } from '@constants/Memberships';
import { Routes } from '@constants/Paths';
import { WEBSITE_ANALYTIC_VIRTUAL_STORE, WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/website';
import { WEBSITE_DASHBOARD } from '@information-texts/WebsiteDashboard';
import { IGenericRecord } from '@models/GenericRecord';
import { getUniqueValues } from '@utils/Array';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './WebsiteMetrics';

/**
 * This interface describes the plan properties
 *
 * @typeParam sections: string[] - Plan sections
 * @typeParam name: Plan - Plan name
 */
export interface IPlan {
    sections: string[];
    name: Plan;
}

/**
 * Business plans
 */
export enum Plan {
    Basic = 'BASIC',
    Standard = 'STANDARD',
    Advanced = 'ADVANCED',
    Premium = 'PREMIUM',
}

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routes = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_DASHBOARD),
    },
    {
        name: WEBSITE_DASHBOARD.TITLE,
        route: '#',
    },
    {
        name: `${getRouteName(Routes.WEBSITE_ANALYTICS)}`,
        route: getRoute(Routes.WEBSITE_ANALYTICS),
    },
];

/**
 * Function that returns the routes for the breadcrumb
 * @returns Section[]
 */
export const routesPremium = (): Section[] => [
    {
        name: getRouteName(Routes.WEBSITE_MENU),
        route: getRoute(Routes.WEBSITE_DASHBOARD),
    },
    {
        name: WEBSITE_DASHBOARD.TITLE,
        route: '#',
    },
    {
        name: WEBSITE_ANALYTIC_VIRTUAL_STORE,
        route: getRoute(Routes.WEBSITE_ANALYTICS),
    },
];

/**
 * Positions in array for top buyer card
 */
export enum positions {
    FIRST = 0,
    SECOND = 1,
}

/**
 * This constant is used to show colors background that represent position of the buyer
 */
export const colorsPositions: { [key: number]: string } = {
    0: 'bg-purple',
    1: 'bg-blue',
    2: 'bg-green',
};

/**
 * Function that returns the selected memberships
 *
 * @param memberships: IGenericRecord[] - Current memberships
 * @returns string[]
 */
export const getSelectedMemberships = (memberships: IGenericRecord[]): number[] => {
    if (memberships.length) {
        const selectedMemberships: number[] = [];
        memberships.forEach(membership =>
            membership.modules?.forEach((item: IGenericRecord) => {
                const subModules = item?.membership_submodules ?? item?.sub_modules;
                if (item.name === WEBSITE_DESIGN_AND_ADMINISTRATION && Array.isArray(subModules) && subModules.length) {
                    selectedMemberships.push(
                        ...subModules?.flatMap((item: IGenericRecord) =>
                            isNaN(item?.sub_module_id) ? [] : item.sub_module_id ?? []
                        )
                    );
                }
            })
        );
        return selectedMemberships;
    }
    return [];
};

/**
 * Function that returns the website plan
 *
 * @param memberships: IGenericRecord[] - Company memberships
 * @returns IPlan
 */
export const getPlan = (memberships: IGenericRecord[]): IPlan => {
    const websiteMemberships = getSelectedMemberships(memberships).flatMap(section => section ?? []);
    if (websiteMemberships.length) {
        const sections: string[] = [];
        websiteMemberships.forEach(membership => sections.push(...(PLAN_SECTIONS[membership] ?? [])));
        const bestPlan = Math.max(...websiteMemberships);
        return {
            sections: getUniqueValues(sections),
            name: PLANS[bestPlan],
        };
    }

    return { sections: [], name: Plan.Basic };
};

/**
 * Plans with their respective ids and names
 */
const PLANS: { [key: number]: Plan } = {
    5: Plan.Basic,
    6: Plan.Standard,
    7: Plan.Advanced,
    10: Plan.Premium,
};

/**
 * Sections of each plan according to their id
 */
export const PLAN_SECTIONS: { [key: string]: string[] } = {
    5: ['home', 'contact-us', 'catalog', 'catalog-product'],
    6: ['home', 'contact-us', 'catalog', 'catalog-product'],
    7: ['home', 'contact-us', 'catalog', 'blog', 'catalog-product'],
    10: ['home', 'contact-us', 'catalog', 'blog', 'catalog-product'],
};

/**
 * Function that detects if the user has the website and virtual store module active
 *
 * @param membershipSelected: IGenericRecord[] - User modules to validate virtual store
 * @returns boolean
 */
export const includesSupportDocument = (membershipSelected: IGenericRecord[] = []): boolean =>
    membershipSelected.some((item: IGenericRecord) =>
        item.modules.some((module: IGenericRecord) => module.name === DOCUMENT_SUPPORT)
    );
