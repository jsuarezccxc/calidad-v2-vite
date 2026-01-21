import { CommonProperty } from '@models/WebsiteNode';

export const DOMAIN = process.env.REACT_APP_AWS_ROOT_DOMAIN;
export const AVAILABLE_DOMAIN = 'El dominio esta disponible';
export const VERIFY_SUBDOMAIN = '* Primero verifique el nombre del subdominio';
export const ACTIVE_SUBDOMAIN = '* Primero active el nombre del subdominio';
export const REQUIRED_SUBDOMAIN = '*Campo obligatorio';
export const HOSTED_ZONE_PROPERTIES = [CommonProperty.HostedZone, CommonProperty.Domain];
export const URL_GUIE_CONNECT_DOMAIN =
    'https://storageccxc1.s3.us-west-2.amazonaws.com/famiefi/83e80ae5-affc-32b4-b11d-b4cab371c48b/invoice/vouchers/2024-02-06-0006aebd-a034-4466-bc99-f11088a7f772-1707238648.pdf';

/**
 * Options step for domain
 */
export enum MainStepSelection {
    WELCOME = 'WELCOME',
    OWN_DOMAIN = 'OWN_DOMAIN',
    DIGGIPYMES_DOMAIN = 'DIGGIPYMES_DOMAIN',
}

/**
 * This constant is the route where it should go for when it's a plan advanced or basic and hasn't it domain
 */
export const URL_DOMAIN = 'website-active-domain';

/**
 * This constant is the route where it should go for when it's a plan advanced or basic and has it domain
 */
export const URL_DASHBOARD = 'website-dashboard';

/**
 * Sub steps when you select the main option "OWN_DOMAIN"
 */
export enum SubStepSelection {
    OPTIONS_OWN_DOMAIN,
    CONNECT_DOMAIN,
    CONFIG_DNS,
    ACTIVE_DOMAIN,
    CONGRATULATIONS,
}

/**
 * Steps pagination by step two
 */
export enum PaginationSteps {
    CONFIG_DNS = 1,
    COPY_DNS = 2,
    DNS_MANAGEMENT = 3,
    SERVER_NAMES = 4,
    CHANGE_SERVER_NAME = 5,
    ADD_DNS = 6,
}
