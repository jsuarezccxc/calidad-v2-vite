import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { IElectronicDocument, INoteTypeForm, ISelectSearchOption, TypeNote } from '@models/CorrectCancelElectronicDocument';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, CUSTOMER_RESPONSE, DEBIT_NOTE, DOCUMENT_TYPE_ISSUED } from '@constants/ElectronicInvoice';

export { default } from './CorrectCancelElectronicDocument';

/**
 * This const is options main form
 */
const NOTE_TYPE_OPTIONS: IOptionSelect[] = [
    {
        key: DEBIT_NOTE,
        value: DOCUMENT_TYPE_ISSUED.DEBIT_NOTE,
    },
    {
        key: CREDIT_NOTE,
        value: DOCUMENT_TYPE_ISSUED.CREDIT_NOTE,
    },
    {
        key: ADJUSTMENT_NOTE,
        value: DOCUMENT_TYPE_ISSUED.ADJUSTMENT_NOTE,
    },
];

/**
 * This function is build options
 *
 * @param documents: IElectronicDocument[] - List electronic documents
 * @returns ISelectSearchOption[]
 */
const buildOptionsSearch = (documents: IElectronicDocument[]): ISelectSearchOption[] => {
    return documents.flatMap((document) => {
        if (
            document.answer_dian === CUSTOMER_RESPONSE.REJECTED_CLIENT ||
            [CUSTOMER_RESPONSE.VOIDED, 'VOIDED'].includes(document.invoice_state)
        ) {
            return [];
        }
        return {
            name: document.number,
            value: document.id,
        };
    });
};

/**
 * This const is for validate keys in note
 */
const KEYS_VALIDATE_NOTE: string[] = ['prefix_name'];
const KEYS_VALIDATE_NOTE_FORM: string[] = ['reason', 'associatedDocument'];
const GET_CURRENT_NOTE = 0;

/**
 * This function is validate main form
 *
 * @param form: INoteTypeForm - Form state
 * @returns string[]
 */
const validateMainForm = (form: INoteTypeForm): string[] => {
    return Object.keys(form).flatMap(key => {
        if (KEYS_VALIDATE_NOTE_FORM.includes(key) && !form[key as keyof INoteTypeForm]) return key;
        return [];
    });
};

/**
 * This function code reason rejection
 *
 * @param reasonsRejection: IGenericRecord[] - Reason rejections
 * @param idReasonRejection: string - Reason rejection ID
 * @param typeNote: string: - Type note
 * @returns
 */
const codeReasonRejection = (
    reasonsRejection: IGenericRecord[],
    idReasonRejection: string,
    typeNote: string
): { code_adjustment_note: number | null; code_debit_note: number | null; code_credit_note: number | null } => {
    const { code_debit_note, code_credit_note, code_adjustment_note } =
        reasonsRejection.find(({ id }) => id === idReasonRejection) || {};
    return {
        code_adjustment_note: typeNote === ADJUSTMENT_NOTE ? code_adjustment_note : null,
        code_debit_note: typeNote === DEBIT_NOTE ? code_debit_note : null,
        code_credit_note: typeNote === CREDIT_NOTE ? code_credit_note : null,
    };
};

/**
 * This function validate same note type
 *
 * @param currentType: TypeNote - Current type note
 * @param noteType: string - Note type
 * @returns boolean
 */
const validateSameNoteType = (currentType: TypeNote, noteType: string): boolean => {
    const key = NOTE_TYPE_OPTIONS.find((item) => item.value === noteType)?.key;
    return currentType === key;
}

/**
 * This const is utils for page
 */
export const UTILS = {
    GET_CURRENT_NOTE,
    NOTE_TYPE_OPTIONS,
    KEYS_VALIDATE_NOTE,
    validateMainForm,
    buildOptionsSearch,
    codeReasonRejection,
    validateSameNoteType,
};
