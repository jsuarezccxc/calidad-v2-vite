import { IRadioButtonProps } from '@components/radiobutton';
import { IOption } from '@components/select-search';
import { NO, YES } from '@constants/RadioButtonOptions';
import { IGenericRecord } from '@models/GenericRecord';

/**
 * Function that return the RadioButton props physical store
 *
 * @param { selected, setSelected, translate }: IGenericRecord - Variables used to store the checked option
 * @returns IRadioButtonProps
 */
export const radioButtonPropsPhysicalStore = ({ selected, setSelected }: IGenericRecord): IRadioButtonProps => {
    return {
        entities: [
            {
                name: YES,
                label: 'Si',
            },
            {
                name: NO,
                label: 'No',
            },
        ],
        selected,
        setSelected,
        classesLabel: 'text-blue',
    };
};

/**
 * Function that returns the select options
 *
 * @param list: IGenericRecord[] - Array of search options
 * @returns IOption[]
 */
export const getSelectSearchOptions = (list: IGenericRecord[]): IOption[] => {
    return list?.map(element => ({
        value: element.id.toString(),
        name: element.name,
    }));
};

export const NATURAL_PERSON = 'c8dfbea8-11ca-35bb-bea2-3dc15b66af64';

/**
 * This constant represents the maximum number of characters to hold in text fields in a physical storage table.
 */
export const MAX_LENGTH_TEXT = 100;

/**
 * Max length phone
 */
export const MAX_INPUT_PHONE = 12;

/**
 *
 * Max length phone co
 */
export const MAX_INPUT_PHONE_CO = 10;
