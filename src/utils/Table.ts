import { IGenericRecord } from '@models/GenericRecord';
import { DISABLED_CLASS_PREFIX } from '@constants/UtilsConstants';

export const getFieldClass = (canEdit = false): string => `field-body--${!canEdit ? DISABLED_CLASS_PREFIX : ''}editable`;

export const getEmptyFields = (data: IGenericRecord[], fields: { name: string; value: string }[]): { [key: string]: number } => {
    const emptyFields: IGenericRecord = {};
    data.forEach(item =>
        fields.some(({ name }) => {
            if (!String(item?.[name] ?? '')) {
                emptyFields[name] = (emptyFields[name] ?? 0) + 1;
            }
        })
    );
    return emptyFields;
};

export const getErrorMessages = (emptyFields: IGenericRecord, fields: { name: string; value: string }[]): string[] => {
    const messages: string[] = [];
    for (const key in emptyFields) {
        const isOneField = emptyFields[key] === 1;
        const name = fields.find(field => field.name === key)?.value;
        messages.push(`${isOneField ? 'El campo' : 'Los campos'} ${name} ${isOneField ? 'es obligatorio' : 'son obligatorios'}`);
    }
    return messages;
};
