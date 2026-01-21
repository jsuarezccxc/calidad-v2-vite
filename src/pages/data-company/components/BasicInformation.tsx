//--- Libraries ---//
import React, { FC } from 'react';
//--- Models ---//
import { FieldName } from '@models/DataCompany';
//--- Hooks ---//
import usePermissions from '@hooks/usePermissions';
//--- Components ---//
import { MAX_LENGTH_INPUT, TextInput } from '@components/input';
//--- Information Texts ---//
import { TOOLTIP_DATA } from '@information-texts/DataCompany';
//--- Root ---//
import { IBasicInformationProps } from '..';

export const BasicInformation: FC<IBasicInformationProps> = ({
    title,
    requiredFields,
    dataInformation,
    digitVerification,
    onChangeText,
}) => {
    const { disabledInputs } = usePermissions();
    return (
        <section className="p-4 mb-4 bg-white rounded-md shadow-lg">
            <h2 className="mb-3 text-green font-allerbold">{title}</h2>
            <div className="flex flex-wrap">
                <TextInput
                    name="name"
                    value={dataInformation.name}
                    required={requiredFields.name}
                    maxLength={MAX_LENGTH_INPUT}
                    labelText="*Nombre de la empresa"
                    tooltipInfo
                    classesInput="w-full"
                    classesWrapper="md:mr-7 w-full md:w-73 mb-4"
                    onChange={onChangeText}
                    {...TOOLTIP_DATA[FieldName.CompanyName]}
                    disabled={disabledInputs}
                />
                <TextInput
                    value={dataInformation.document_type_name}
                    disabled
                    required={requiredFields.document_type_name}
                    labelText="*Tipo de documento:"
                    classesInput="w-full"
                    classesWrapper="md:mr-7 w-full md:w-73 mb-4"
                    classesWrapperInput="border-none"
                    onChange={onChangeText}
                />
                <TextInput
                    value={dataInformation.document_number}
                    disabled
                    required={requiredFields.document_number}
                    labelText="*Número de documento:"
                    classesInput="w-full"
                    classesWrapper="mr-3 md:mr-5 w-4/5 md:w-56 mb-4"
                    classesWrapperInput="border-none"
                    onChange={onChangeText}
                />
                <TextInput
                    value={digitVerification}
                    disabled
                    labelText="DV:"
                    tooltipInfo
                    classesInput="w-full"
                    classesWrapper="w-1/6 md:w-11.2 mb-4"
                    classesWrapperInput="border-none"
                    {...TOOLTIP_DATA[FieldName.Dv]}
                    onChange={onChangeText}
                />
                <TextInput
                    name="company_representative_name"
                    value={dataInformation.company_representative_name}
                    maxLength={MAX_LENGTH_INPUT}
                    labelText="Nombre del representante:"
                    tooltipInfo
                    alphanumeric
                    classesInput="w-full"
                    classesWrapper="w-full md:w-73 mb-4 md:ml-5 xl:ml-0"
                    {...TOOLTIP_DATA[FieldName.RepresentativeName]}
                    onChange={onChangeText}
                    disabled={disabledInputs}
                />
            </div>
        </section>
    );
};
