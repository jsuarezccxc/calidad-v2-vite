export const TAX_IVA = [
    {
        key: '19',
        value: '19%',
        type: 'iva',
    },
    {
        key: '5',
        value: '5%',
        type: 'iva',
    },
    {
        key: '0',
        value: '0%',
        type: 'iva',
    },
    {
        key: 'untaxed',
        value: 'No gravado',
        type: 'iva',
    },
    {
        key: 'Excluded',
        value: 'Excluido',
        type: 'iva',
    },
];

export const TAX_IMPOCONSUMPTION = [
    {
        key: '4',
        value: '4%',
        type: 'impoconsumption',
    },
    {
        key: '8',
        value: '8%',
        type: 'impoconsumption',
    },
    {
        key: '16',
        value: '16%',
        type: 'impoconsumption',
    },
    {
        key: 'Excluded',
        value: 'Excluido',
        type: 'impoconsumption',
    },
];

export const FLOAT_PERCENTAGE = { MINIMUM_PERCENTAGE: 0, MAXIMUM_PERCENTAGE: 100 };

export const PERCENTAGE = { ZERO: '0%', FOUR: '4%', FIVE: '5%', EIGHT: '8%', SIXTEEN: '16%', NINETEEN: '19%' };

export const SPECIAL_TAX = { UNTAXED: 'No gravado', EXCLUDED: 'Excluido', EXEMPT: 'Exento (0%)' };

export const TAX_NAME_IVA = [SPECIAL_TAX.UNTAXED, SPECIAL_TAX.EXEMPT];

export const IVA = 'IVA';

/**
 * This const is name retention
 */
export const RETE_ICA = '07 ReteICA';
export const RETE_IVA = '08 ReteIVA';
export const UNTAXED = 'No gravado';
