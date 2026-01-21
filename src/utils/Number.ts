import { isUndefined } from 'lodash';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ONE } from '@constants/ElectronicInvoice';
import { CELL_NUMBER_LENGTH } from '@constants/website';
import { ISymbolCurrency } from '@models/Number';
import { stringToFloat } from './ElectronicInvoice';

//a function that limit the number of characters in a text to a certain number of characters, PD: this function is to value or format number input or numbers separated by thousand-points
export const toLimitedCharactersWithLengthValue = (text: string, length = 10, isInteger = false): string => {
    const points = (text.match(/\./g) || '').length;
    if (isInteger) {
        text = toReplaceCommaWithNothing(text);
    }
    if (text.includes(',')) {
        return text.substring(0, length + points + 3);
    }
    return text.substring(0, length + points);
};

//a function that replace coma  with nothing
export const toReplaceCommaWithNothing = (text: string): string => {
    return text.replace(',', '');
};

export const parseValue = (value: any): number => {
    if (typeof value === 'string') {
        if (!value.includes(',')) {
            return Number(value.split('.').join(''));
        }
        return Number(value.split('.').join('').split(',').join('.'));
    }
    return Number(value);
};

export const calculateVerificationDigit = (value: string): number => {
    const numberSeriesDian = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    const reverseNit = [...value].reverse().join('');
    let summation = 0;
    [...reverseNit].forEach((value: string, index: number) => (summation += Number(reverseNit[index]) * numberSeriesDian[index]));
    const verificationDigit = summation % 11;
    return verificationDigit > 1 ? 11 - verificationDigit : verificationDigit;
};

export const ivaDiscount = (valueWithIva = 0, iva = 0): number => stringToFloat((valueWithIva * 100) / (100 + iva));

export const calculatePercentageValue = (value: number, percentage: number): number => (value * percentage) / 100;

export const discountOfValue = (value: number, percentageDiscount: number): number => {
    if (isUndefined(percentageDiscount) || isUndefined(value)) return 0;
    return (value * percentageDiscount) / 100;
};

export const calculatePercentage = (valueMain = 0, valuePercentage = 0): number => (valuePercentage * 100) / valueMain;

export const isValidCellPhone = (value: string): boolean => value?.length === CELL_NUMBER_LENGTH && /3[0-9]{9}/.test(value);

export const isEven = (value: number): boolean => !(value % 2);

/**
 * This function format number
 *
 * @param value: Param value
 * @param options: Intl.NumberFormatOptions - Param options number format
 * @returns string
 */
export const formatNumber = (
    value: number,
    options: Intl.NumberFormatOptions = { style: CURRENCY, currency: 'COP', minimumFractionDigits: 0 }
): string => new Intl.NumberFormat('es-CO', options).format(value);

/**
 * This function returns the currency symbol for a given currency code
 *
 * @param code: string - The currency code
 * @param options: ISymbolCurrency - The locale and display options for the currency symbol
 * @returns string
 */
export const symbolCurrency = (code: string, { locale, display }: ISymbolCurrency): string => {
    const formatter = new Intl.NumberFormat(locale, {
        style: CURRENCY,
        currency: code,
        currencyDisplay: display,
    });
    const symbol = formatter.formatToParts(ONE).find(p => p.type === CURRENCY)?.value;
    return symbol || '$';
};

/**
 * Makes all properties of type T become number type
 * @template T - The type to convert all properties to number
 */
export type Numeric<T> = {
    [K in keyof T]: number;
};

/**
 * This constant represents the currency type used in the application
 */
const CURRENCY = 'currency';
