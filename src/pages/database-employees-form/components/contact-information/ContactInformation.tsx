import React from 'react';
import { IOptionSelect, NumberInput, SelectSearchInput, TextInput } from '@components/input';
import { TEXT_FORM } from '@information-texts/DatabaseEmployeesForm';
import { COLOMBIA_ID } from '@constants/Location';
import { FIELDS_EMPLOYEE_FORM, MAX_LENGTH, TypesInputs } from '@pages/database-employees-form/constants/DatabaseEmployeesForm';
import { IContactInformationProps } from '@pages/database-employees-form/models/DatabaseEmployeesForm';
import { findItemOption } from '@utils/Array';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';

export const ContactInformation: React.FC<IContactInformationProps> = ({ data, options, handleValidateFields, handleChange }) => {
    const { disabledInputs } = usePermissions();
    const {
        phone,
        address: address_text,
        country,
        department: department_text,
        city: city_text,
        zipCode,
        email: email_text,
    } = TEXT_FORM;
    const {
        PHONE_NUMBER,
        ADDRESS,
        COUNTRY_ID,
        DEPARTMENT_ID,
        CITY_ID,
        DEPARTMENT,
        CITY,
        POSTAL_CODE,
        EMAIL,
    } = FIELDS_EMPLOYEE_FORM;
    const { phone_number, address, country_id, department_id, city_id, department, city, postal_code, email } = data;
    const { countries, departments, cities } = options;

    const countriesOptionsRender = countries.map(item => ({ ...item, name: item.value }));
    const departmentsOptionsRender = departments.map(item => ({ ...item, name: item.value }));
    const citiesOptionsRender = cities.map(item => ({ ...item, name: item.value }));

    return (
        <div className="flex flex-col bg-white rounded-lg p-4.5 shadow-templateDesign">
            <h2 className="text-base text-left text-gray-dark font-allerbold mb-4.5">Información de contacto</h2>
            <div className="grid w-full grid-cols-3 xs:grid-cols-1 gap-x-7 gap-y-4.5">
                <div>
                    <NumberInput
                        {...phone}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-phone',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        required={handleValidateFields(PHONE_NUMBER)}
                        name={PHONE_NUMBER}
                        value={phone_number}
                        onChange={(event): void => handleChange(TypesInputs.NUMBER, event, PHONE_NUMBER)}
                        maxLength={MAX_LENGTH.PHONE}
                        classesWrapper="xs:w-full w-73 xlg:w-full"
                        classesInput="w-73 xlg:w-full"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    <TextInput
                        {...address_text}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-address',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        required={handleValidateFields(ADDRESS)}
                        name={ADDRESS}
                        value={address}
                        onChange={(event): void => handleChange(TypesInputs.TEXT, event, ADDRESS)}
                        maxLength={MAX_LENGTH.ADDRESS}
                        classesWrapper="xs:w-full w-73 xlg:w-full"
                        classesInput="w-73 xlg:w-full"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    <SelectSearchInput
                        {...country}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-country',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        valueSelect={findItemOption(countriesOptionsRender, String(country_id))}
                        optionSelect={countriesOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void => handleChange(TypesInputs.SELECT, option, COUNTRY_ID)}
                        classesWrapper="xs:w-full w-73 xlg:w-full"
                        classesInput="w-73 xlg:w-full"
                        selectIconType="arrowDownGreen"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    {country_id === COLOMBIA_ID ? (
                        <SelectSearchInput
                            {...department_text}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-department',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            valueSelect={findItemOption(departmentsOptionsRender, department_id)}
                            optionSelect={departmentsOptionsRender}
                            onChangeSelect={(_, option: IOptionSelect): void =>
                                handleChange(TypesInputs.SELECT, option, DEPARTMENT_ID)
                            }
                            disabled={!country_id || disabledInputs}
                            classesWrapper="xs:w-full w-73 xlg:w-full"
                            classesInput="w-73 xlg:w-full"
                            selectIconType="arrowDownGreen"
                        />
                    ) : (
                        <TextInput
                            {...department_text}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-department',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name={DEPARTMENT}
                            value={department}
                            onChange={(event): void => handleChange(TypesInputs.TEXT, event, DEPARTMENT)}
                            disabled={disabledInputs || !country_id}
                            classesWrapper="xs:w-full w-73 xlg:w-full"
                            classesInput="w-73 xlg:w-full"
                        />
                    )}
                </div>
                <div>
                    {country_id === COLOMBIA_ID ? (
                        <SelectSearchInput
                            {...city_text}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-city',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            valueSelect={findItemOption(citiesOptionsRender, city_id)}
                            optionSelect={citiesOptionsRender}
                            onChangeSelect={(_, option: IOptionSelect): void => handleChange(TypesInputs.SELECT, option, CITY_ID)}
                            disabled={disabledInputs || !country_id}
                            classesWrapper="xs:w-full w-73 xlg:w-full"
                            classesInput="w-73 xlg:w-full"
                            selectIconType="arrowDownGreen"
                        />
                    ) : (
                        <TextInput
                            {...city_text}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-city',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name={CITY}
                            value={city}
                            onChange={(event): void => handleChange(TypesInputs.TEXT, event, CITY)}
                            disabled={disabledInputs || !country_id}
                            classesWrapper="xs:w-full w-73 xlg:w-full"
                            classesInput="w-73 xlg:w-full"
                        />
                    )}
                </div>
                <div>
                    <NumberInput
                        {...zipCode}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-postal-code',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name={POSTAL_CODE}
                        value={postal_code}
                        onChange={(event): void => handleChange(TypesInputs.NUMBER, event, POSTAL_CODE)}
                        maxLength={MAX_LENGTH.POSTAL_CODE}
                        classesWrapper="xs:w-full w-73 xlg:w-full"
                        classesInput="w-73 xlg:w-full"
                        disabled={disabledInputs}
                    />
                </div>
                <div>
                    <TextInput
                        {...email_text}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-email',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name={EMAIL}
                        value={email}
                        onChange={(event): void => handleChange(TypesInputs.TEXT, event, EMAIL)}
                        maxLength={MAX_LENGTH.EMAIL}
                        required={handleValidateFields(EMAIL)}
                        classesWrapper="xs:w-full w-73 xlg:w-full"
                        classesInput="w-73 xlg:w-full"
                        disabled={disabledInputs}
                    />
                </div>
            </div>
        </div>
    );
};
