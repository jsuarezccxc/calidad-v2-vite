import React from 'react';
import { TEXT_FORM } from '@information-texts/DatabaseEmployeesForm';
import { IBasicInformationProps } from '@pages/database-employees-form/models/DatabaseEmployeesForm';
import { FIELDS_EMPLOYEE_FORM, MAX_LENGTH, TypesInputs } from '@pages/database-employees-form/constants/DatabaseEmployeesForm';
import {
    TextInput,
    NumberInput,
    DatePickerDayInput,
    IOptionSelect,
    SelectSearchInput,
    SelectInputWithFooter,
} from '@components/input';
import { Checkbox } from '@components/checkbox';
import { Form } from '@components/form';
import { findItemOption } from '@utils/Array';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';

export const BasicInformation: React.FC<IBasicInformationProps> = ({
    isEdit,
    editData,
    handleEditData,
    data,
    options,
    handleValidateFields,
    handleRedirectAddOption,
    handleChange,
}) => {
    const { disabledInputs } = usePermissions();
    const {
        employeeName,
        documentType,
        documentNumber,
        area,
        rol,
        birthday: birthday_text,
        employeeCode,
        basicInformation,
    } = TEXT_FORM;
    const { NAME, DOCUMENT_TYPE_ID, DOCUMENT_NUMBER, AREA_ID, POSITION_ID, BIRTHDAY, CODE } = FIELDS_EMPLOYEE_FORM;
    const { name, document_number, document_type_id, area_id, position_id, birthday, code } = data;
    const { documentTypes, areas, positions } = options;

    const documentTypesOptionsRender = documentTypes.map(item => ({ ...item, name: item.value }));

    return (
        <div className="flex flex-col bg-white rounded-lg p-4.5 shadow-templateDesign">
            <h2 className="text-base text-left text-gray-dark font-allerbold mb-4.5">Información básica</h2>
            <Form sendWithEnter>
                <div className="grid w-full xs:grid-cols-1 grid-cols-3 gap-x-7 gap-y-4.5">
                    <div>
                        <TextInput
                            {...employeeName}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-name',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            required={handleValidateFields(NAME)}
                            value={name}
                            maxLength={MAX_LENGTH.NAME}
                            name={NAME}
                            onChange={(event): void => handleChange(TypesInputs.TEXT, event, NAME)}
                            classesWrapper="xs:w-full w-73 xlg:w-full"
                            classesInput="w-73 xlg:w-full"
                            disabled={disabledInputs}
                        />
                    </div>
                    <div>
                        <SelectSearchInput
                            {...documentType}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-document-type',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            required={handleValidateFields(DOCUMENT_TYPE_ID)}
                            name={DOCUMENT_TYPE_ID}
                            valueSelect={findItemOption(documentTypesOptionsRender, document_type_id)}
                            optionSelect={documentTypesOptionsRender}
                            onChangeSelect={(_, option: IOptionSelect): void =>
                                handleChange(TypesInputs.SELECT, option, DOCUMENT_TYPE_ID)
                            }
                            disabled={disabledInputs || (isEdit && !editData)}
                            classesWrapper="xs:w-full w-73 xlg:w-full"
                            classesInput="w-73 xlg:w-full"
                            selectIconType="arrowDownGreen"
                        />
                    </div>
                    <div>
                        <NumberInput
                            {...documentNumber}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-document-number',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            required={handleValidateFields(DOCUMENT_NUMBER)}
                            name={DOCUMENT_NUMBER}
                            value={document_number}
                            maxLength={MAX_LENGTH.DOCUMENT_NUMBER}
                            onChange={(event): void => handleChange(TypesInputs.NUMBER, event, DOCUMENT_NUMBER)}
                            disabled={disabledInputs || (isEdit && !editData)}
                            classesWrapper="xs:w-full w-73 xlg:w-full"
                            classesInput="w-73 xlg:w-full"
                        />
                    </div>
                    <div>
                        <SelectInputWithFooter
                            {...area}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-area',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            required={handleValidateFields(AREA_ID)}
                            name={AREA_ID}
                            value={findItemOption(areas, area_id).value}
                            options={areas}
                            newSelectFields={{
                                footerClick: (): void => handleRedirectAddOption(),
                                nameFooter: '+Agregar Área',
                            }}
                            onClickValue={(option: IOptionSelect): void => handleChange(TypesInputs.SELECT, option, AREA_ID)}
                            disabled={disabledInputs || isEdit}
                            classesWrapper="xs:w-full w-73 xlg:w-full z-1"
                            classesInput="w-73 xlg:w-full"
                            selectIconType="arrowDownGreen"
                        />
                    </div>
                    <div>
                        <SelectInputWithFooter
                            {...rol}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-position',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            required={handleValidateFields(POSITION_ID)}
                            name={POSITION_ID}
                            value={findItemOption(positions, position_id).value}
                            options={positions}
                            newSelectFields={{
                                footerClick: (): void => handleRedirectAddOption(),
                                nameFooter: '+Agregar cargo',
                            }}
                            onClickValue={(option: IOptionSelect): void => handleChange(TypesInputs.SELECT, option, POSITION_ID)}
                            disabled={disabledInputs || isEdit}
                            classesWrapper="xs:w-full w-73 xlg:w-full z-1"
                            classesInput="w-73 xlg:w-full"
                            selectIconType="arrowDownGreen"
                        />
                    </div>
                    <div>
                        <DatePickerDayInput
                            {...birthday_text}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-date-birthday',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name={BIRTHDAY}
                            selected={birthday}
                            onChangeDate={(date: Date): void => handleChange(TypesInputs.DATE, date, BIRTHDAY)}
                            classesWrapper="xs:w-full w-38"
                            classesInput="w-38"
                            withoutDate
                            selectIconType="calendarGreen"
                            disabled={disabledInputs}
                        />
                    </div>
                    {isEdit && (
                        <div>
                            <NumberInput
                                {...employeeCode}
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                    submodule: 'add-employee-code',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name={CODE}
                                value={String(code)}
                                onChange={(event): void => handleChange(TypesInputs.NUMBER, event, CODE)}
                                disabled={disabledInputs || isEdit}
                                classesWrapper="w-73 xlg:w-full"
                                classesInput="w-73 xlg:w-full"
                            />
                        </div>
                    )}
                </div>
            </Form>
            {isEdit && (
                <div className="mt-4.5">
                    <Checkbox
                        {...basicInformation}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'selected-edit',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.CHK,
                        })}
                        classLabel="text-base text-gray-dark"
                        checked={editData}
                        onChange={(): void => handleEditData()}
                        classContainer="w-73 xlg:w-full"
                        disabled={disabledInputs}
                    />
                </div>
            )}
        </div>
    );
};
