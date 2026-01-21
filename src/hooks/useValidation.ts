import { useState } from 'react';

import { IGenericRecord } from '@models/GenericRecord';

/**
 * Custom hook that validate inputs
 *
 * @param requiredField: IGenericRecord - Prop for required fields
 * @param updateState: (props: IUpdateStateProps) => void - Function to update state
 * @param initialValue: VoidFunction - Function to funtion to change initial values
 */
type IUseValidationProps = {
    requiredField: IGenericRecord;
    updateState: (props: IUpdateStateProps) => void;
    initialValue: VoidFunction;
};

/**
 * Custom hook that validate inputs
 *
 * @param [key: string]: boolean | string - Prop for fields keys
 */
interface IRequiredFields {
    [key: string]: boolean | string;
}

/**
 * Custom hook that validate inputs
 *
 * @param value: string; - Prop for value
 * @param text?: string - Optional prop for text
 * @param hasMoreText?: string - Optional prop for additional text
 * @param allInputs?: IRequiredFields - Optional prop inputs
 * @param valueState?: boolean - Optional prop for value state
 */
interface IUpdateStateProps {
    value: string;
    text?: string;
    hasMoreText?: string;
    allInputs?: IRequiredFields;
    valueState?: boolean;
}

const useValidation = (dataForRequired: IGenericRecord): IUseValidationProps => {
    const [requiredField, setRequiredField] = useState<IGenericRecord>(dataForRequired);

    const initialValue: VoidFunction = () => setRequiredField(dataForRequired);

    const updateState = ({ value, text, hasMoreText, allInputs, valueState = true }: IUpdateStateProps): void => {
        const textProp = hasMoreText ? hasMoreText : 'text';
        if (allInputs) {
            setRequiredField(allInputs);
        } else {
            setRequiredField({
                ...requiredField,
                [value]: valueState,
                [textProp]: text ? text : '',
            });
        }
    };

    return { requiredField, updateState, initialValue };
};

export default useValidation;
