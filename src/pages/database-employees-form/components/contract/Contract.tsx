import React from 'react';
import { Checkbox } from '@components/checkbox';
import { RadioButton } from '@components/radiobutton';
import { DatePickerDayInput, SelectSearchInput, MoneyInput, NumberInput, IOptionSelect } from '@components/input';
import { FIELDS_EMPLOYEE_FORM, MAX_LENGTH, TypesInputs } from '@pages/database-employees-form/constants/DatabaseEmployeesForm';
import { IContractProps } from '@pages/database-employees-form/models/DatabaseEmployeesForm';
import { TEXT_FORM } from '@information-texts/DatabaseEmployeesForm';
import { getDateFromUnix } from '@utils/Date';
import { findItemOption } from '@utils/Array';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { DATABASE_EMPLOYEE_FORM } from '@information-texts/DatabaseEmployees';
import usePermissions from '@hooks/usePermissions';

export const Contract: React.FC<IContractProps> = ({ isEdit, data, options, validationsContract, handleChange }) => {
    const { disabledInputs } = usePermissions();
    const {
        contractType,
        startDateContract,
        endDateContract,
        paymentFrequency,
        salary: salary_text,
        transport,
        type_salary,
        paymentMethod,
        bank: bank_text,
        accountType,
        numberAccount,
        supportFee,
    } = TEXT_FORM;
    const { REQUIRED, VALUE } = DATABASE_EMPLOYEE_FORM;
    const {
        CONTRACT_TYPE_ID,
        INITIAL_DATE,
        FINAL_DATE,
        PAYMENT_FREQUENCY_ID,
        SALARY,
        SALARY_TYPE_ID,
        PAYMENT_METHOD_ID,
        BANK_ID,
        ACCOUNT_TYPE_ID,
        ACCOUNT_NUMBER,
        HAS_TRANSPORTATION_ASSISTANCE,
    } = FIELDS_EMPLOYEE_FORM;
    const {
        contract_type_id,
        initial_date,
        final_date,
        payment_frequency_id,
        salary,
        has_transportation_assistance,
        salary_type_id,
        payment_method_id,
        bank_id,
        account_type_id,
        account_number,
    } = data;
    const { contractTypes, salaryTypes, paymentMethods, bankAccountTypes, banks } = options;
    const { handleValidateFields, handleShowEndDate, handleShowFee, handleValidateIntegralSalary, handleEnableBankFields } =
        validationsContract;

    const contractOptionsRender = contractTypes.map(item => ({ ...item, name: item.value }));
    const paymentMethodsRender = paymentMethods.map(item => ({ ...item, name: item.value }));
    const banksOptionsRender = banks.map(item => ({ ...item, name: item.value }));
    const bankAccountTypesRender = bankAccountTypes.map(item => ({ ...item, name: item.value }));

    return (
        <div className="flex flex-col bg-white rounded-lg p-4.5 gap-y-4.5 shadow-templateDesign">
            <h2 className="text-base text-left text-gray-dark font-allerbold">Contrato</h2>
            <div className="flex flex-row w-full xs:flex-col gap-x-7 xs:gap-y-4.5">
                <div>
                    <SelectSearchInput
                        {...contractType}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-contract-type',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        name={CONTRACT_TYPE_ID}
                        valueSelect={findItemOption(contractOptionsRender, contract_type_id)}
                        optionSelect={contractOptionsRender}
                        onChangeSelect={(_, option: IOptionSelect): void =>
                            handleChange(TypesInputs.SELECT, option, CONTRACT_TYPE_ID)
                        }
                        required={handleValidateFields(CONTRACT_TYPE_ID)}
                        disabled={disabledInputs || isEdit}
                        classesWrapper="xs:w-full w-73"
                        classesInput="w-73"
                        selectIconType="arrowDownGreen"
                    />
                </div>
                <div>
                    <DatePickerDayInput
                        {...startDateContract}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-date-start-contract',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name={INITIAL_DATE}
                        selected={initial_date}
                        onChangeDate={(date: Date): void => handleChange(TypesInputs.DATE, date, INITIAL_DATE)}
                        required={handleValidateFields(INITIAL_DATE)}
                        disabled={disabledInputs || isEdit}
                        classesWrapper="xs:w-full w-38"
                        classesInput="w-38"
                        withoutDate
                        selectIconType="calendarGreen"
                    />
                </div>
                <div>
                    {handleShowEndDate(contract_type_id) && (
                        <DatePickerDayInput
                            {...endDateContract}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-date-end-contract',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name={FINAL_DATE}
                            selected={final_date}
                            onChangeDate={(date: Date): void => handleChange(TypesInputs.DATE, date, FINAL_DATE)}
                            {...(initial_date && {
                                minDate: new Date(getDateFromUnix(Number(initial_date)).date),
                            })}
                            required={handleValidateFields(FINAL_DATE)}
                            disabled={disabledInputs || isEdit || !initial_date}
                            classesWrapper="xs:w-full w-38"
                            classesInput="w-38"
                            withoutDate
                            selectIconType="calendarGreen"
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-row w-full xs:flex-col gap-x-7 xs:gap-y-4.5">
                <div>
                    <SelectSearchInput
                        {...paymentFrequency}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-payment-frequency',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        name={PAYMENT_FREQUENCY_ID}
                        valueSelect={findItemOption([], payment_frequency_id).value}
                        optionSelect={[]}
                        onChangeSelect={(_, option: IOptionSelect): void =>
                            handleChange(TypesInputs.SELECT, option, PAYMENT_FREQUENCY_ID)
                        }
                        required={handleValidateFields(PAYMENT_FREQUENCY_ID)}
                        disabled
                        classesWrapper="xs:w-full w-36"
                        classesInput="w-36"
                        selectIconType="arrowDownGreen"
                    />
                </div>
                <div>
                    <MoneyInput
                        {...(handleShowFee(contract_type_id) ? { ...supportFee } : { ...salary_text })}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-salary',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name={SALARY}
                        value={salary}
                        onChange={(value): void => handleChange(TypesInputs.MONEY, value, SALARY)}
                        required={handleValidateFields(SALARY)}
                        disabled={disabledInputs || isEdit}
                        classesWrapper="xs:w-full  w-38"
                        classesInput="w-38"
                        containerClass={`${isEdit ? 'input--disabled my-0 py-1' : ''}`}
                        maxLength={MAX_LENGTH.MONEY}
                    />
                </div>
                <div className="flex flex-col items-center justify-end xs:items-start">
                    <Checkbox
                        {...transport}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-transportation-assistance',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.CHK,
                        })}
                        classLabel="rounded-lg bg-gray-light xs:py-0 py-2 px-3 text-xs text-gray-dark"
                        name={HAS_TRANSPORTATION_ASSISTANCE}
                        checked={has_transportation_assistance}
                        onChange={(): void => {}}
                        disabled={disabledInputs || isEdit}
                        classContainer="w-73 xlg:w-full"
                    />
                </div>
            </div>
            <div>
                {salary ? (
                    <div className="flex flex-col">
                        <p className="mb-2 text-tiny font-allerbold text-blue">{type_salary.label}</p>
                        <RadioButton
                            moduleId={ModuleApp.TECHNICAL_SHEET_EMPLOYEES}
                            classesLabel="rounded-lg bg-gray-light py-2 px-3 text-xs text-gray-dark"
                            size="md-row"
                            name={SALARY_TYPE_ID}
                            entities={salaryTypes}
                            selected={salary_type_id}
                            handleChangeOption={(option, name): void => {
                                isEdit ? (): void => {} : handleChange(TypesInputs.RADIO_BUTTON, option, name);
                            }}
                            disabled={disabledInputs || isEdit}
                        />
                        {!isEdit && handleValidateFields(SALARY_TYPE_ID) && REQUIRED}
                        {!isEdit && handleValidateIntegralSalary(salary, salary_type_id) && VALUE}
                    </div>
                ) : null}
            </div>
            <div className="flex xs:flex-col xs:gap-y-4.5 flex-row w-full gap-x-7">
                <div>
                    <SelectSearchInput
                        {...paymentMethod}
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                            submodule: 'add-payment-method',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        name={PAYMENT_METHOD_ID}
                        valueSelect={findItemOption(paymentMethodsRender, payment_method_id)}
                        optionSelect={paymentMethodsRender}
                        onChangeSelect={(_, option: IOptionSelect): void =>
                            handleChange(TypesInputs.SELECT, option, PAYMENT_METHOD_ID)
                        }
                        required={handleValidateFields(PAYMENT_METHOD_ID)}
                        disabled={disabledInputs || isEdit}
                        classesWrapper="xs:w-full w-36.5"
                        classesInput="w-36.5"
                        selectIconType="arrowDownGreen"
                    />
                </div>
                <div>
                    {handleEnableBankFields(payment_method_id) && (
                        <SelectSearchInput
                            {...bank_text}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-bank',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            name={BANK_ID}
                            valueSelect={findItemOption(banksOptionsRender, bank_id || '')}
                            optionSelect={banksOptionsRender}
                            onChangeSelect={(_, option: IOptionSelect): void => handleChange(TypesInputs.SELECT, option, BANK_ID)}
                            required={handleValidateFields(BANK_ID)}
                            disabled={disabledInputs || isEdit}
                            classesWrapper="xs:w-full w-62"
                            classesInput="w-62"
                            selectIconType="arrowDownGreen"
                        />
                    )}
                </div>
                <div>
                    {handleEnableBankFields(payment_method_id) && (
                        <SelectSearchInput
                            {...accountType}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-account-type',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            name={ACCOUNT_TYPE_ID}
                            valueSelect={findItemOption(bankAccountTypesRender, account_type_id || '')}
                            optionSelect={bankAccountTypesRender}
                            onChangeSelect={(_, option: IOptionSelect): void =>
                                handleChange(TypesInputs.SELECT, option, ACCOUNT_TYPE_ID)
                            }
                            required={handleValidateFields(ACCOUNT_TYPE_ID)}
                            disabled={disabledInputs || isEdit}
                            classesWrapper="xs:w-full w-38.4"
                            classesInput="w-38.4"
                            selectIconType="arrowDownGreen"
                        />
                    )}
                </div>
                <div>
                    {handleEnableBankFields(payment_method_id) && (
                        <NumberInput
                            {...numberAccount}
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                submodule: 'add-number-account',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name={ACCOUNT_NUMBER}
                            value={account_number || ''}
                            onChange={(event): void => handleChange(TypesInputs.NUMBER, event, ACCOUNT_NUMBER)}
                            required={handleValidateFields(ACCOUNT_NUMBER)}
                            maxLength={MAX_LENGTH.ACCOUNT_NUMBER}
                            disabled={disabledInputs || isEdit}
                            classesWrapper="xs:w-full w-73"
                            classesInput="w-73"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
