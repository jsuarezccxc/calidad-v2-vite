import { IOptionSelect } from '@components/input';
import { NATURAL_PERSON } from '@constants/DynamicRequest';
import { WITHHOLDINGS } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * This contains the id of each taxpayer according to their document type
 */
const TAXPAYERS_IDS: { [key: string]: string } = {
    '919fff6d-b156-4f95-a4ca-0a27f450cf59': '3bdcf2b7-38d5-4a68-b194-023909cb904a',
    '80fc8d67-9a2b-3027-9eae-09db2d46dfd1': '02287cd4-2eaf-3e16-a341-1f894429aebd',
};

/**
 * This contains the responsibilities of each taxpayer according to their id
 */
const TAXPAYER_RESPONSIBILITIES: { [key: string]: number[] } = {
    '02287cd4-2eaf-3e16-a341-1f894429aebd': [1, 2, 3, 4, 5],
    'c8dfbea8-11ca-35bb-bea2-3dc15b66af64': [4, 5],
    '3bdcf2b7-38d5-4a68-b194-023909cb904a': [1, 2, 3, 4],
};

/**
 * This returns taxpayers based on document id
 *
 * @param documentId: string - Document id
 * @param taxpayers: IOptionSelect[] - Taxpayers list
 * @returns IOptionSelect[]
 */
export const getTaxpayers = (documentId?: string, taxpayers: IOptionSelect[] = []): IOptionSelect[] => {
    if (!documentId) return [];
    const taxpayerId = TAXPAYERS_IDS[documentId];
    return taxpayers?.filter(({ id, value }) => (taxpayerId ? id === taxpayerId : value === NATURAL_PERSON));
};

/**
 * This returns taxpayers based on document id
 *
 * @param documentId: string - Document id
 * @param taxpayers: IOptionSelect[] - Taxpayers list
 * @returns IOptionSelect[]
 */
export const getTaxpayerResponsibilities = (taxpayerId: string, taxResponsibilities: IGenericRecord[] = []): IOptionSelect[] => {
    const ids = TAXPAYER_RESPONSIBILITIES[taxpayerId] ?? [];
    return taxResponsibilities
        .filter(({ id }) => ids.includes(id))
        .map(({ name, ...item }) => ({ ...item, name, value: name, key: name }));
};

/**
 * This returns the available options for tax responsibilities
 *
 * @param taxpayerResponsibilities: IOptionSelect[] - Taxpayer responsibilities
 * @param selectedOptions: IGenericRecord[] - Selected options
 * @returns IOptionSelect[]
 */
export const getAvailableOptions = (
    taxpayerResponsibilities: IOptionSelect[],
    selectedOptions: IGenericRecord[]
): IOptionSelect[] => {
    return taxpayerResponsibilities?.flatMap(option =>
        selectedOptions.every(({ name }: IGenericRecord) => name !== option?.name)
            ? [{ ...option, withholdings: WITHHOLDINGS }]
            : []
    );
};
