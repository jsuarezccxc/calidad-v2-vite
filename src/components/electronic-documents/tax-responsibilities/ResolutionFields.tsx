import React from 'react';
import { DatePickerDayInput, TextInput } from '@components/input';
import { getUnixFromDate } from '@utils/Date';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IResolutionFieldsProps } from '.';

export const ResolutionFields: React.FC<IResolutionFieldsProps> = ({ data, handleChange, requiredResolution }) => (
    <div className="flex gap-4.5 flex-col lg:flex-row w-full mt-4.5 lg:mt-0">
        <TextInput
            id={generateId({
                module: ModuleApp.PAYMENT_METHODS,
                submodule: `resolution-field-number-fiscal-responsability-${data.resolutionNumber}`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            })}
            classesWrapper="w-full lg:w-38"
            labelText="*Número de resolución de la responsabilidad fiscal:"
            name="number_resolution"
            onChange={({ target: { name, value } }): void => handleChange({ name, value })}
            onlyNumbers
            placeholder="..."
            required={requiredResolution}
            value={data.resolutionNumber}
        />
        <DatePickerDayInput
            id={generateId({
                module: ModuleApp.PAYMENT_METHODS,
                submodule: `resolution-field-date-fiscal-responsability-${data.date}`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            })}
            classesWrapper="w-full lg:w-38"
            selected={getUnixFromDate(data.date)}
            labelText="*Fecha de resolución de la responsabilidad fiscal:"
            name="date"
            onChangeDate={(value): void => handleChange({ value, name: 'date' })}
        />
    </div>
);
