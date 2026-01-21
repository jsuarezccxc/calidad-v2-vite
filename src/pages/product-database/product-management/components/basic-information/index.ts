import { IGenericRecord } from '@models/GenericRecord';

export * from './BasicInformation';

export const newVariant = {
    variant_details: [],
    name: '',
};

/**
 * Function that classifies variants
 *
 * @param variantList: IGenericRecord[] - Variant list
 * @returns IGenericRecord[]
 */
export const separateVariants = (variantList: IGenericRecord[]): IGenericRecord[] => {
    const variants: IGenericRecord = {};
    variantList.forEach(item => (variants[item.order] = [...(variants[item.order] || []), item]));
    return Object.values(variants);
};

/**
 * Function that builds references based on variants
 *
 * @param variants: IGenericRecord[] - Variant list
 * @returns IGenericRecord[]
 */
export const getReferences = (variants: IGenericRecord[]): IGenericRecord[] => {
    return variants
        .reduce(
            (total, item) =>
                total.flatMap((subItem: IGenericRecord) =>
                    item.map((item: IGenericRecord) => subItem.concat({ ...item, reference: item.name }))
                ),
            [[]]
        )
        .map((items: IGenericRecord) => {
            const [references, details]: [references: string[], details: IGenericRecord[]] = [[], []];
            items.forEach(({ reference, id }: IGenericRecord) => {
                references.push(reference);
                details.push(id);
            });
            return {
                reference: references.join(' / '),
                details,
            };
        });
};

/**
 * Table variant properties
 */
export const variantProperties = {
    select: false,
    name: '',
    sku_internal: '',
    wholesale_value: 0,
    wholesale_quantity: 0,
    mandate_id: '',
    includes_mandate: false,
    images: [],
    taxes: [],
};

/**
 * Option that represents the max lenght of description input
 */
export const MAX_LENGHT_DESCRIPTION = 500;
