export { Plans } from './Plans';

/**
 * This is used to filter plans
 */
export enum Plan {
    All = 'Todos los planes de pago 2024',
    ElectronicDocuments = 'Documentos electrónicos',
    Website = 'Sitio web y tienda diggital',
    Soon = 'Próximamente',
}

/**
 * List of plans used to filter
 */
export const PLANS = [
    {
        key: Plan.All,
        value: 'Todos los planes de pago 2024',
    },
    {
        key: Plan.Website,
        value: 'Sitio web y tienda diggital',
    },
    {
        key: Plan.ElectronicDocuments,
        value: 'Documentos electrónicos',
    },
    {
        key: Plan.Soon,
        value: 'Próximamente',
    },
];
