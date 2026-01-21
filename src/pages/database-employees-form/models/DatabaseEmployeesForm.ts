import { IOptionSelect } from '@components/input';
import { IEntity } from '@components/radiobutton';
import { IContract, IEmployee } from '@models/DataEmployees';
import { TypeInput } from '../constants/DatabaseEmployeesForm';

/**
 * Interface extending the employee and contract interface.
 */
export type IDataForm = IEmployee & IContract;
export type ActionChange = <T>(type: TypeInput, value: T, field: string) => void;

export type OptionsBasicInformationForm = {
    documentTypes: IOptionSelect[];
    areas: IOptionSelect[];
    positions: IOptionSelect[];
};

export type OptionsContactInformationForm = {
    countries: IOptionSelect[];
    departments: IOptionSelect[];
    cities: IOptionSelect[];
};

export type OptionsAffiliationsForm = {
    contributorTypes: IOptionSelect[];
    contributorSubtypes: IOptionSelect[];
    epsOptions: IOptionSelect[];
    severancesPay: IOptionSelect[];
    pensions: IOptionSelect[];
    compensationsFunds: IOptionSelect[];
    riskClasses: IOptionSelect[];
};
export type OptionsContractForm = {
    contractTypes: IOptionSelect[];
    salaryTypes: IEntity[];
    paymentMethods: IOptionSelect[];
    banks: IOptionSelect[];
    bankAccountTypes: IOptionSelect[];
};

export type ValidationsContract = {
    handleValidateFields: (field: string) => boolean;
    handleShowEndDate: (value: string) => boolean;
    handleShowFee: (value: string) => boolean;
    handleValidateIntegralSalary: (value: number, salary_type: string) => boolean;
    handleEnableBankFields: (value: string) => boolean;
};

/**
 * Interface props basic information component
 *
 * @typeParam isEdit: boolean - State to know if user is editing
 * @typeParam editData: boolean - State to edit field in basic information when you are editing
 * @typeParam handleEditData: boolean - Action to change state to edit fields
 * @typeParam data: IDataForm - Data form to use in section
 * @typeParam options: OptionsBasicInformationForm - Data options in form for selects
 * @typeParam handleValidateFields: (field: string) => boolean - Action to validate fields
 * @typeParam handleRedirectAddOption: () => void - Action to redirect when you want to create option
 * @typeParam handleChange: ActionChange - Action to change values form
 */
export interface IBasicInformationProps {
    isEdit: boolean;
    editData: boolean;
    handleEditData: () => void;
    data: IDataForm;
    options: OptionsBasicInformationForm;
    handleValidateFields: (field: string) => boolean;
    handleRedirectAddOption: () => void;
    handleChange: ActionChange;
}

/**
 * Interface props contact information component
 *
 * @typeParam data: IDataForm - Data form to use in section
 * @typeParam options: OptionsContactInformationForm - Data options in form for selects
 * @typeParam handleValidateFields: (field: string) => boolean - Action to validate fields
 * @typeParam handleChange: ActionChange - Action to change values form
 */
export interface IContactInformationProps {
    data: IDataForm;
    options: OptionsContactInformationForm;
    handleValidateFields: (field: string) => boolean;
    handleChange: ActionChange;
}

/**
 * Interface props affiliations component
 *
 * @typeParam data: IDataForm - Data form to use in section
 * @typeParam options: OptionsAffiliationsForm - Data options in form for selects
 * @typeParam handleValidateFields: (field: string) => boolean - Action to validate fields
 * @typeParam handleChange: ActionChange - Action to change values form
 */
export interface IAffiliationsProps {
    data: IDataForm;
    options: OptionsAffiliationsForm;
    handleValidateFields: (field: string) => boolean;
    handleChange: ActionChange;
}

/**
 * Interface props contract component
 *
 * @typeParam isEdit: boolean - State to know if user is editing
 * @typeParam data: IDataForm - Data form to use in section
 * @typeParam options: OptionsContractForm - Data options in form for selects
 * @typeParam handleValidateFields: (field: string) => boolean - Action to validate fields
 * @typeParam handleChange: ActionChange - Action to change values form
 * @typeParam validationsContract: ValidationsContract - Object validations for contract section
 */
export interface IContractProps {
    isEdit: boolean;
    data: IDataForm;
    options: OptionsContractForm;
    handleValidateFields: (field: string) => boolean;
    handleChange: ActionChange;
    validationsContract: ValidationsContract;
}
