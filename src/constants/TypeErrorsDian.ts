import { IGenericRecord } from '@models/GenericRecord';

/**
 * This enum describe error codes dian
 */
export enum ErrorsCodesDian {
    FAD09d,
    FAB07a,
    FAB08a,
    CAD09d,
    DAD09d,
    FBH06,
    // Postal code
    FAJ73,
    FAJ74,
    FAM69,
    FAM70,
    CAJ73,
    CAJ74,
    CAK57,
    CAK58,
    CAM69,
    DAJ73,
    DAJ74,
    DAK58,
    DAM68,
    DAM69,
    DAK57,
    FBI06,
    // Email
    FAJ71,
    // Direction
    FAM10,
    // Table Fields
    FAS01b,
    FAS02,
    FAX07,
    FAS07,
    // Total table
    FAU02,
    FAU06,
    FAU08,
    FAU10,
    FAU14,
    FAX02,
}

/**
 * Errors type dian
 */
export const TypeErrorsDian: IGenericRecord[] = [
    {
        error: [
            ErrorsCodesDian.FAD09d,
            ErrorsCodesDian.FAB07a,
            ErrorsCodesDian.FAB08a,
            ErrorsCodesDian.CAD09d,
            ErrorsCodesDian.DAD09d,
            ErrorsCodesDian.FBH06,
        ],
        fields: ['date_issue'],
    },
    {
        error: [
            ErrorsCodesDian.FAJ73,
            ErrorsCodesDian.DAJ73,
            ErrorsCodesDian.FAJ74,
            ErrorsCodesDian.DAJ73,
            ErrorsCodesDian.FAM69,
            ErrorsCodesDian.FAM70,
            ErrorsCodesDian.CAJ73,
            ErrorsCodesDian.CAJ74,
            ErrorsCodesDian.CAK57,
            ErrorsCodesDian.CAK58,
            ErrorsCodesDian.CAM69,
            ErrorsCodesDian.DAJ74,
            ErrorsCodesDian.DAK57,
            ErrorsCodesDian.DAK58,
            ErrorsCodesDian.DAM68,
            ErrorsCodesDian.DAM69,
        ],
        fields: ['postal_code'],
    },
    {
        error: [ErrorsCodesDian.FAJ71],
        fields: ['email'],
    },
    {
        error: [ErrorsCodesDian.FAM10],
        fields: ['address', 'city', 'department_state'],
    },
    {
        error: [ErrorsCodesDian.FAS01b, ErrorsCodesDian.FAS02, ErrorsCodesDian.FAS07, ErrorsCodesDian.FAX07],
        fields: ['iva', 'percentage'],
    },
    {
        error: [
            ErrorsCodesDian.FAU02,
            ErrorsCodesDian.FAU06,
            ErrorsCodesDian.FAU08,
            ErrorsCodesDian.FAU10,
            ErrorsCodesDian.FAU14,
            ErrorsCodesDian.FAX02,
        ],
        fields: [],
        valueTotals: false,
    },
];
