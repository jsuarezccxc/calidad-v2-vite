import React from 'react';
import { useSelector } from 'react-redux';
import { Information } from '@components/information';
import { Form } from '@components/form';
import { TextInput } from '@components/input';
import useDigitVerification from '@hooks/useDigitVerification';
import { RootState } from '@redux/rootReducer';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { FieldsNamesInputs, IFormCompanyDataProps, MAX_LENGTH_PHONE_COMPANY, MAX_LENGTH_TEXT_COMPANY } from '.';
import './FormCompanyData.scss';

export const FormCompanyData: React.FC<IFormCompanyDataProps> = ({ formData, onInputChange }) => {
    const { document_types, information } = useSelector(({ company }: RootState) => ({
        ...company,
    }));

    const { isTypeNit, digitVerification } = useDigitVerification(
        document_types.find(item => item.id === information?.document_type)?.name || '',
        information?.document_number
    );

    return (
        <div className="container-contact-form">
            <div className="contact-form">
                <div className="flex flex-col items-center">
                    <Information
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: 'company-data-title-form',
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        title="Información básica"
                        classNameTitle="text-base text-green font-poppinsbold"
                    />
                    <p className="font-poppins text-tiny text-blue xs:text-center">
                        Los campos marcados con (*) son obligatorios.
                    </p>
                </div>
                <div className="flex xs:flex-col justify-evenly">
                    <div className="flex flex-col p-5 border border-none rounded-lg font-aller xs:w-full lg:gap-y-4 xs:gap-y-5 xs:mt-6 min-w-224 container-form-landing">
                        <div className="flex justify-between gap-x-5 xs:flex-col gap-y-5">
                            <Form>
                                <div className="flex flex-wrap mt-2.25 w-full justify-center contact-form-company">
                                    <div className="flex w-148 gap-y-5 gap-x-5 xs:flex-col">
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.LANDING,
                                                submodule: 'company-data-document-type-form',
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            labelText="*Tipo de documento de la empresa:"
                                            classesWrapper="w-71.9 xs:w-full"
                                            classesWrapperInput="contact-form-company__input-disabled"
                                            value={
                                                document_types.find(item => item.id === information?.document_type)?.name || ''
                                            }
                                            disabled
                                        />
                                        <div className="flex gap-x-8 xs:flex-col">
                                            <TextInput
                                                id={generateId({
                                                    module: ModuleApp.LANDING,
                                                    submodule: 'company-data-document-number-form',
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.TXT,
                                                })}
                                                labelText="*Número de documento de la empresa:"
                                                classesWrapper=" w-71.9 xs:w-full xs:mb-4"
                                                classesWrapperInput="contact-form-company__input-disabled"
                                                value={information?.document_number}
                                                disabled
                                            />
                                            {isTypeNit && (
                                                <TextInput
                                                    id={generateId({
                                                        module: ModuleApp.LANDING,
                                                        submodule: 'company-data-dv-form',
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.TXT,
                                                    })}
                                                    classesWrapperInput="contact-form-company__input-dv"
                                                    classesWrapper="ml-2 w-11.2 xs:w-full xs:ml-0"
                                                    labelText="DV:"
                                                    disabled
                                                    value={digitVerification}
                                                    tooltipInfo
                                                    titleTooltip="DV:"
                                                    descTooltip={'Dígito de verificación'}
                                                    classTittleTooltip="font-aller"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex w-148 gap-y-5 gap-x-5 xs:flex-col">
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.LANDING,
                                                submodule: 'company-data-company-representative-name-form',
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            labelText="Nombre de contacto:"
                                            classesWrapper="w-71.9 xs:w-full"
                                            classesWrapperInput="contact-form-company__input"
                                            value={formData.company_representative_name}
                                            placeholder="..."
                                            onChange={(e): void =>
                                                onInputChange(FieldsNamesInputs.COMPANY_REPRESENTATIVE_NAME, e.target.value)
                                            }
                                            tooltipInfo
                                            descTooltip="En caso de que el nombre de contacto sea el mismo nombre que el de persona natural, déjelo vacío"
                                            maxLength={MAX_LENGTH_TEXT_COMPANY}
                                        />
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.LANDING,
                                                submodule: 'company-data-name-form',
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            labelText="*Nombre de persona natural o de la empresa:"
                                            classesWrapper="w-71.9 xs:w-full"
                                            classesWrapperInput="contact-form-company__input"
                                            value={formData.name}
                                            placeholder="..."
                                            onChange={(e): void => onInputChange(FieldsNamesInputs.NAME, e.target.value)}
                                            maxLength={MAX_LENGTH_TEXT_COMPANY}
                                            required={!formData.name}
                                        />
                                    </div>
                                    <div className="flex w-148 gap-y-5 gap-x-5 xs:flex-col">
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.LANDING,
                                                submodule: 'company-data-phone-form',
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            labelText="Teléfono o celular:"
                                            classesWrapperInput="contact-form-company__input"
                                            classesWrapper="w-71.9 xs:w-full"
                                            value={formData.phone}
                                            placeholder="..."
                                            onChange={(e): void => onInputChange(FieldsNamesInputs.PHONE, e.target.value)}
                                            maxLength={MAX_LENGTH_PHONE_COMPANY}
                                            onlyNumbers
                                        />
                                        <div className="w-71.9 xs:w-full"></div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
