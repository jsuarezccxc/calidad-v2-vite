import { IOptionSelect } from '@components/input';

import { stringToFloat } from '@utils/ElectronicInvoice';

/**
 * Sorts product batch options by batch number in ascending order
 * Extracts numeric value from batch option value string and sorts accordingly
 *
 * @typeParam optionBatch: IOptionSelect[] - Array of batch options with numeric values
 * @returns Sorted array with batch numbers in ascending order
 */
export const sortOptionBatch = (optionBatch: IOptionSelect[]): IOptionSelect[] => {
    return [...optionBatch].sort((aOption, bOption) => {
        const [, numberA] = aOption.value.split(' ');
        const [, numberB] = bOption.value.split(' ');
        if (stringToFloat(numberA) < stringToFloat(numberB)) return -1;
        if (stringToFloat(numberA) > stringToFloat(numberB)) return 1;
        return 0;
    });
};
