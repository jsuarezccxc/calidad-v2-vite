import React from 'react';
import { SelectInput, TextInput } from '@components/input';
import type { IConditionalFieldInputProps } from '@models/QuoteGeneration';

export const ConditionalFieldInput: React.FC<IConditionalFieldInputProps> = ({
    condition,
    id,
    labelText,
    classesWrapper = 'form-field',
    tooltipData = {},
    disabled = false,
    required = false,
    selectProps,
    textProps,
}) => {
    if (condition && selectProps) {
        return (
            <SelectInput
                id={`${id}-select`}
                labelText={labelText}
                classesWrapper={classesWrapper}
                disabled={disabled}
                required={required}
                value={selectProps.value}
                options={selectProps.options}
                optionSelected={selectProps.optionSelected}
                name={selectProps.name}
                {...tooltipData}
            />
        );
    }

    return (
        <TextInput
            id={`${id}-input`}
            labelText={labelText}
            value={textProps?.value || ''}
            disabled={disabled}
            required={required}
            classesWrapper={classesWrapper}
            name={textProps?.name}
            onChange={textProps?.onChange}
            {...tooltipData}
        />
    );
};
