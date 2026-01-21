/**
 * Type documents constants
 */
export const IDS_FOR_NATURAL_PERSON = [
    'f73f5793-795e-33db-9115-95437f9ecaea',
    '8cb0159c-d095-35ad-9cad-62e171c15dc8',
    'ccffb71e-dbad-3400-ab3a-f261eaec8849',
    '137064a1-a3ba-453c-9098-bd05413f8bf5',
    '492da28b-6c6b-4c42-a28c-0b51fe66c7ed',
    'ec09d027-b9ef-4f92-b421-c32dd858c67a',
    '73c12b97-ac29-4398-adc0-d923d054f5eb',
    '6a272d7e-4c0f-420a-887e-8bcd11628134',
    'a03e0a95-ec5b-49e0-82b4-5b0919a876d9',
    'e178b534-c18d-49cb-8f9f-3c17c9aacc37',
];
export const ID_FOR_ARTIFICIAL_PERSON = ['80fc8d67-9a2b-3027-9eae-09db2d46dfd1', '12e3621c-30b0-4d86-b68e-dd8a164523b7'];
export const ID_FOR_BUSINESSMAN = '919fff6d-b156-4f95-a4ca-0a27f450cf59';

/**
 * Taxpayer type enum
 */
export enum TaxpayerType {
    LEGAL_PERSON = '02287cd4-2eaf-3e16-a341-1f894429aebd',
    NATURAL_PERSON = 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64',
    NATURAL_PERSON_MERCHANT = '3bdcf2b7-38d5-4a68-b194-023909cb904a',
}

/**
 * Taxpayer key
 */
export const TAXPAYER_KEY: { [key in TaxpayerType]: string } = {
    [TaxpayerType.LEGAL_PERSON]: 'LEGAL_PERSON',
    [TaxpayerType.NATURAL_PERSON]: 'NATURAL_PERSON',
    [TaxpayerType.NATURAL_PERSON_MERCHANT]: 'NATURAL_PERSON_MERCHANT',
};
