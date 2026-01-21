import React from 'react';
import { SelectInput, SearchInput, MultiSelectInput } from '@components/input';
import { Form } from '@components/form';
import { ButtonWithIcon } from '@components/button';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IInputsProps } from '..';

export const Inputs: React.FC<IInputsProps> = ({ data = [], handleRedirect }) => {
    const [columnsSelect, stateSelect, search] = data;

    return (
        <Form className="flex flex-row justify-between mb-7 mt-4.5 xs:flex-col xs:items-center">
            <div className="flex items-center gap-6 lg:flex-wrap xs:gap-4 xs:flex-col xs:mb-4.5 xs:w-full">
                <MultiSelectInput {...columnsSelect} />
                <SelectInput {...stateSelect} />
                <SearchInput {...search} />
            </div>
            <div className="">
                <ButtonWithIcon
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                        action: ActionElementType.ADD,
                        elementType: ElementType.BTN,
                    })}
                    nameIcon="plusWhite"
                    classIcon="w-5 h-5"
                    className="w-40 px-2 py-3 text-white bg-green shadow-templateDesign"
                    onClick={(): void => handleRedirect()}
                >
                    Agregar empleado
                </ButtonWithIcon>
            </div>
        </Form>
    );
};
