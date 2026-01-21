import { Section } from '@components/bread-crumb';
import { IError } from '@models/Error';
import { IGenericRecord } from '@models/GenericRecord';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { TYPES_NOTE, VALIDATION_MESSAGES, keysFields } from '@constants/PrefixNote';
import { getRoute, getRouteName } from '@utils/Paths';

export { default } from './PrefixNote';

/**
 * This const is for keys fields
 */
const { PREFIX, CHECK, PREFIX_COPY, TYPE, TYPE_NAME } = keysFields;

/**
 * This interface is structure data
 *
 * @typeParam id: string | null - ID prefix
 * @typeParam check: boolean - Check prefix
 * @typeParam type: string - Type prefix
 * @typeParam type_name: string - Type name prefix
 * @typeParam company_id: string - Company ID
 * @typeParam prefix: string - Name prefix
 * @typeParam isChange: boolean - If change prefix
 * @typeParam errors: IError[] - Errors prefix
 */
export interface IPrefixNote {
    id: string | null;
    check: boolean;
    type: string;
    type_name: string;
    company_id: string;
    prefix: string;
    isChange: boolean;
    errors: IError[];
}

/**
 * This interface is param state
 *
 * @typeParam prefix: IPrefixNote - Prefix state
 * @typeParam item: IPrefixNote - Item change
 * @typeParam name: keyof IPrefixNote - Name key
 * @typeParam value: string | boolean - Value change
 */
export interface IParamAssign {
    prefix: IPrefixNote;
    item: IPrefixNote;
    name: keyof IPrefixNote;
    value: string | boolean;
}

/**
 * This const is breadcrumb page
 */
const BREAD_CRUMB: Section[] = [
    {
        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
        route: getRoute(Routes.ELECTRONIC_DOCUMENTS),
        routeIndex: Routes.ELECTRONIC_DOCUMENTS,
    },
    {
        name: MODULE_TITLES.NOTE,
        route: '#',
    },
    {
        name: 'Prefijos nota débito/crédito y nota de ajuste',
        route: '#',
    },
];

/**
 * This function is for filter types notes
 *
 * @param prefixes: IGenericRecord[] - Param prefixes back
 * @param typesNote: string[] - Param filter type note
 * @returns IPrefixNote[]
 */
const filterTypeNote = (prefixes: IGenericRecord[], typesNote: string[]): IPrefixNote[] => {
    return prefixes.flatMap(({ type, ...item }) => {
        if (typesNote.includes(type)) {
            return {
                id: item.id,
                type: type,
                company_id: item.company_id,
                type_name: TYPES_NOTE[type],
                prefix: item.prefix,
                isChange: false,
                check: false,
                errors: [],
            };
        }
        return [];
    });
};

/**
 * This interface is for param validate prefix
 *
 * @typeParam prefixes: IPrefixNote[] - List prefix note
 * @typeParam prefix: IPrefixNote - Prefix note
 * @typeParam index: number - Index
 */
interface IParamValidatePrefix {
    prefixes: IPrefixNote[];
    prefix: IPrefixNote;
    index: number;
}

/**
 * This function is for validation prefix
 *
 * @param param0: IParamValidatePrefix - Param state prefix
 * @returns string
 */
const validatePrefix = ({ prefixes, prefix: { prefix, type, ...item }, index }: IParamValidatePrefix): string => {
    if (item.isChange) {
        if (prefix && !type) return TYPE_NAME;
        if (prefixes.some(({ prefix: prefixSome }, indexSome) => prefix && prefixSome === prefix && indexSome !== index))
            return PREFIX_COPY;
        if (!prefix && type) return PREFIX;
    }
    return '';
};

/**
 * This function is for message validate table
 *
 * @param prefixes: IPrefixNote[] - Param state tables
 * @returns string[]
 */
const validateMessages = (prefixes: IPrefixNote[]): string[] => {
    return prefixes.flatMap((prefix, index) => {
        const key = validatePrefix({ prefix, prefixes, index });
        if (key) return VALIDATION_MESSAGES[key];
        return [];
    }).reduce((acc: string[], item) => {
        if (!acc.includes(item)) acc.push(item);
        return acc;
    }, []);
};

/**
 * This function is for validate states table
 *
 * @param prefixes: IPrefixNote[] - Param state tables
 * @param isValidateBoolean: boolean - Optional param for validation
 * @returns IPrefixNote[] | boolean
 */
const validatePrefixes = (prefixes: IPrefixNote[], isValidateBoolean = false): IPrefixNote[] | boolean => {
    let existError = false;
    const prefixesWithErrors = prefixes.map((prefix, index) => {
        const key = validatePrefix({ prefix, prefixes, index });
        if (key) {
            existError = true;
            return {
                ...prefix,
                errors: [{ field: key === PREFIX_COPY ? PREFIX : key, error: '' }],
            };
        }
        return {...prefix, errors: [] };
    });
    return isValidateBoolean ? existError : prefixesWithErrors;
};

/**
 * This functions delete and assign prefixes
 * 
 * @param state: IPrefixNote[] - State prefixes
 * @returns IPrefixNote[]
 */
const deleteAndAssignPrefixes = (state: IPrefixNote[]): IPrefixNote[] => {
    return [...state].filter(item => !item.check);
};

/**
 * This const is tools for page
 */
export const UTILS = {
    TYPE,
    CHECK,
    PREFIX,
    Routes,
    getRoute,
    BREAD_CRUMB,
    filterTypeNote,
    validatePrefixes,
    validateMessages,
    deleteAndAssignPrefixes,
    SUPPORT_DOCUMENTS_SUBTITLE,
    TITLE_PAGE: getRouteName(Routes.PREFIX_NOTE),
};
