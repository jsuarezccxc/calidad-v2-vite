import { formatMoney } from './Decimals';

/**
 * Function that remove the zero of the input value
 *
 * @param value: number - Input value
 * @returns string
 */
export const removeZero = (value: string): string => {
    return String(value)
        ?.split('')
        .filter((item: string, index: number) => (!index ? Number(item) : true))
        .join('');
};

/**
 * Function that return the thousands of the value
 *
 * @param value: string - Value
 * @returns string
 */
export const getThousands = (value: string): string => formatMoney(String(value)).slice(1, formatMoney(String(value)).length - 3);

/**
 * Function that return the round value to Decimals
 *
 * @param value: number - Number
 * @returns number
 */
export const roundToDecimals  = (number : number) : number => {
    const factor = 10 ** 2;
    return Math.round(number * factor) / factor;
}

/**
 * Function that return the round value to number
 *
 * @param value: string - String
 * @returns number
 */
export const formatNumber = (value: string): number => {
    return parseInt(value);
};
