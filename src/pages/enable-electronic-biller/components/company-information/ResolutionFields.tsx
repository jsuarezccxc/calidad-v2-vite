import React from 'react';
import { DatePickerDayInput, TextInput } from '@components/input';
import { getUnixFromDate } from '@utils/Date';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { IResolutionFieldsProps } from '.';

export const ResolutionFields: React.FC<IResolutionFieldsProps> = ({ data, handleChange, requiredResolution }) => {
    const { disabledInputs } = usePermissions();
    return (
        <div className="flex gap-4.5 flex-col lg:flex-row w-full mt-4.5 lg:mt-0">
            <TextInput
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.COMPANY_INFORMATION}-resolution-number`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                classesWrapper="w-full lg:w-38"
                labelText="*Número de resolución de la responsabilidad fiscal:"
                name="number_resolution"
                onChange={({ target: { name, value } }): void => handleChange({ name, value })}
                onlyNumbers
                placeholder="..."
                required={requiredResolution}
                value={data.resolutionNumber}
                disabled={disabledInputs}
            />
            <DatePickerDayInput
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.COMPANY_INFORMATION}-resolution-date`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                classesWrapper="w-full lg:w-38"
                selected={getUnixFromDate(data.date)}
                labelText="*Fecha de resolución de la responsabilidad fiscal:"
                name="date"
                onChangeDate={(value): void => handleChange({ value, name: 'date' })}
                disabled={disabledInputs}
            />
        </div>
    );
};
