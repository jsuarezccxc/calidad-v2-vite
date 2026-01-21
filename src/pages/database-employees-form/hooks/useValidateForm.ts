import { MINIMUM_SALARY } from '@constants/Salary';
import { lengthEqualToZero } from '@utils/Length';
import { IDataForm } from '../models/DatabaseEmployeesForm';
import {
    FIELDS_EMPLOYEE_FORM,
    SalaryType,
    STUDENTS_CONTRACTS_IDS,
    TRANSFER_ID,
    UNDEFINED_TERM_ID,
} from '../constants/DatabaseEmployeesForm';

export const useValidateForm = (
    isSubmitted: boolean,
    dataForm: IDataForm
): {
    handleShowEndDate: (value: string) => boolean;
    handleShowFee: (value: string) => boolean;
    handleEnableBankFields: (value: string) => boolean;
    handleValidateIntegralSalary: (value: number, salary_type: string) => boolean;
    handleValidateSalary: (salary: number, handleModal: () => void) => void;
    handleValidateFields: (field: string) => boolean;
    handleValidateForm: (dataForm: IDataForm, isEdit: boolean) => boolean;
} => {
    const INTEGRAL_SALARY = MINIMUM_SALARY * 13;
    const {
        ID,
        INITIAL_DATE,
        SALARY,
        SALARY_TYPE_ID,
        HAS_TRANSPORTATION_ASSISTANCE,
        BANK_ID,
        ACCOUNT_NUMBER,
        ACCOUNT_TYPE_ID,
        FINAL_DATE,
        PAYMENT_FREQUENCY_ID,
        CODE,
        IS_SALARY,
        CONTRACT_TYPE_ID,
        PAYMENT_METHOD_ID,
        BIRTHDAY,
        CONTRACT_ID,
        COMPANY_ID,
        DEPARTMENT_ID,
        COUNTRY_ID,
        CITY_ID,
        DEPARTMENT,
        CITY,
    } = FIELDS_EMPLOYEE_FORM;
    /**
     * Validation to show end date field
     * @param value string - Value contract type
     * @returns boolean - If contract has end date
     */
    const handleShowEndDate = (value: string): boolean => UNDEFINED_TERM_ID !== value;

    /**
     * Validate if it's a student contract
     * @param value string - Value contract type
     * @returns boolean - Should return boolean to change text field
     */
    const handleShowFee = (value: string): boolean => STUDENTS_CONTRACTS_IDS.includes(value);

    /**
     * Validation to show more fields in form
     * @param value string - Option select ('transfer')
     * @returns boolean - Should return boolean to show more fields in form
     */
    const handleEnableBankFields = (value: string): boolean => TRANSFER_ID === value;

    /**
     * Validation to know if salary has an incorrect value with salary type
     * @param value string - Current salary value
     * @param salary_type string - Current salary type
     * @returns boolean - Should return boolean to know if it's a wrong value
     */
    const handleValidateIntegralSalary = (value: number, salary_type: string): boolean =>
        salary_type === SalaryType.INTEGRAL && value < INTEGRAL_SALARY;

    /**
     * Validation to show modal by salary
     * @param salary string - Current salary employee
     * @param handleModal () => void - Action to show modal
     * @returns void
     */
    const handleValidateSalary = (salary: number, handleModal: () => void): void => {
        const maxValueSalary = MINIMUM_SALARY * 2;
        if (Number(salary) <= maxValueSalary) handleModal();
        return;
    };

    /**
     * Validate fields required
     * @param field string - Current field to validate
     * @returns boolean - Return field validated
     */
    const handleValidateFields = (field: string, isForm?: boolean): boolean => {
        let isValid = false;

        if (isSubmitted || isForm) {
            Object.keys(dataForm).forEach(currentProperty => {
                if (currentProperty === field) {
                    isValid = !dataForm[currentProperty as keyof IDataForm];
                }
            });
        }

        return isValid;
    };

    /**
     * Validation to know if it's a valid form
     * @param data IDataForm - Current data in form
     * @param isEdit: boolean - Data edit form
     * @returns boolean - Return is it's a valid form
     */
    const handleValidateForm = (data: IDataForm, isEdit: boolean): boolean => {
        const {
            contract_type_id,
            final_date,
            payment_method_id,
            bank_id,
            account_type_id,
            account_number,
            salary,
            salary_type_id,
        } = data;
        const options: string[] = [
            ...(isEdit ? [CONTRACT_TYPE_ID, INITIAL_DATE, SALARY, SALARY_TYPE_ID, PAYMENT_METHOD_ID] : []),
            ID,
            HAS_TRANSPORTATION_ASSISTANCE,
            BANK_ID,
            ACCOUNT_NUMBER,
            ACCOUNT_TYPE_ID,
            FINAL_DATE,
            PAYMENT_FREQUENCY_ID,
            CODE,
            IS_SALARY,
            BIRTHDAY,
            CONTRACT_ID,
            COMPANY_ID,
            DEPARTMENT_ID,
            COUNTRY_ID,
            CITY_ID,
            DEPARTMENT,
            CITY,
        ];
        const errors: string[] = [];

        Object.keys(data).forEach(field => {
            if (handleValidateFields(field, true) && !options.includes(field)) errors.push(field);
        });
        if (!isEdit) {
            if (handleShowEndDate(contract_type_id) && !final_date) errors.push(CONTRACT_TYPE_ID);
            if (handleEnableBankFields(payment_method_id) && !bank_id && !account_type_id && !account_number)
                errors.push(PAYMENT_METHOD_ID);
            if (handleValidateIntegralSalary(salary, salary_type_id)) errors.push(SALARY_TYPE_ID);
        }

        return lengthEqualToZero(errors);
    };

    return {
        handleShowEndDate,
        handleShowFee,
        handleEnableBankFields,
        handleValidateIntegralSalary,
        handleValidateSalary,
        handleValidateFields,
        handleValidateForm,
    };
};
