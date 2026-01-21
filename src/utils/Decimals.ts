export const isDecimalWithComma = (item: string): boolean => {
    return String(item).includes(',');
};

export const isDecimalWithPoint = (item: string): boolean => {
    return String(item).includes('.');
};

export const replaceCommaByPoint = (item: string): string => {
    if (isDecimalWithComma(item)) return String(item).replaceAll(',', '.');
    return String(item);
};

export const replacePointByComma = (item: string): string => {
    if (isDecimalWithPoint(item)) return String(item).replaceAll('.', ',');
    return String(item);
};

export const removeThousandsPoint = (item: string): string => {
    if (isDecimalWithPoint(item)) return String(item).replaceAll('.', '');
    return String(item);
};

export const removeThousandsComma = (item: string): string => (item ? String(item).replaceAll(',', '') : String(item));

export const formatMoney = (item: string | number, fixedNumber = 2): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: fixedNumber,
    }).format(Number(item));
};

export const removeDecimal = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
};

export const removeSeparators = (value: string): number => {
    const intValue = String(value).split('.').join('');
    if (!String(value).includes(',')) Number(intValue);
    return Number(intValue.split(',').join('.'));
};

export const formatInitialNumber = (item: number): string => ('00' + item).slice(-3);
