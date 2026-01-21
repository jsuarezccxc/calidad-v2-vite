import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle } from '@components/page-title';
import { ModalType, SharedModal } from '@components/modal';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { IOptionSelect } from '@components/input';
import { IEntity } from '@components/radiobutton';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { MINIMUM_SALARY } from '@constants/Salary';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { buildOptions } from '@utils/Company';
import { debounce } from '@utils/Debounce';
import { lengthGreaterThanZero } from '@utils/Length';
import { ModuleApp } from '@utils/GenerateId';
import { ID } from '@constants/UtilsConstants';
import { DATABASE_EMPLOYEE, DATABASE_EMPLOYEE_FORM, EDIT_CONTENT } from '@information-texts/DatabaseEmployees';
import { IGenericRecord } from '@models/GenericRecord';
import { IEmployeeDetail, IFormEmployee } from '@models/DataEmployees';
import { ActionChange, IDataForm } from './models/DatabaseEmployeesForm';
import { RootState } from '@redux/rootReducer';
import { getDynamicRequest } from '@redux/dynamic-data/actions';
import { getAreas, getDetailEmployee, getListEmployees, saveDataEmployee } from '@redux/company/actions';
import { getBanks } from '@redux/payments/actions';
import usePermissions from '@hooks/usePermissions';
import {
    allowedCharsRegex,
    CurrentModal,
    DYNAMIC_REQUEST,
    FIELDS_EMPLOYEE_FORM,
    TypeInput,
    TypeModal,
    TypesInputs,
} from './constants/DatabaseEmployeesForm';
import { useValidateForm } from './hooks';
import { Affiliations, BasicInformation, ContactInformation, Contract } from './components';
import { INITIAL_DATA, optionsDefault, routes } from '.';
import './DatabaseEmployeesForm.scss';

const DatabaseEmployeesForm: React.FC = () => {
    const [history, { search }, dispatch] = [useHistory(), useLocation(), useDispatch()];
    const { disabledInputs } = usePermissions();
    const {
        company: {
            employee,
            areas: { data: areas },
        },
        payments: { banks },
        session: { user },
        dynamicData: { dynamicData },
    } = useSelector(({ company, payments, session, dynamicData }: RootState) => ({ company, payments, session, dynamicData }));
    const searchParams = new URLSearchParams(search);
    const [modals, setModals] = useState<{
        save: boolean;
        information: boolean;
    }>({
        save: false,
        information: false,
    });
    const [dataForm, setDataForm] = useState<IDataForm>(INITIAL_DATA);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [editData, setEditData] = useState<boolean>(false);

    const employeeId = searchParams.get(ID) || null;
    const { TITLE, ADD } = DATABASE_EMPLOYEE;
    const { TITLE: EDIT_TITLE } = EDIT_CONTENT;
    const { ADD_TITLE, MODAL_TITLE, MODAL_DESCRIPTION } = DATABASE_EMPLOYEE_FORM;
    const { NAME, HAS_TRANSPORTATION_ASSISTANCE, DOCUMENT_TYPE_ID } = FIELDS_EMPLOYEE_FORM;
    const {
        handleValidateSalary,
        handleValidateFields,
        handleShowEndDate,
        handleShowFee,
        handleValidateIntegralSalary,
        handleEnableBankFields,
        handleValidateForm,
    } = useValidateForm(isSubmitted, dataForm);

    useEffect(() => {
        (async (): Promise<void> => {
            employeeId && dispatch(getDetailEmployee(employeeId));
        })();
    }, [employeeId]);

    useEffect(() => {
        employee && setDataForm(handleGetData(employee));
    }, [employee]);

    const debouncedValidate = debounce((salary: number) => {
        handleValidateSalary(salary, () => handleModal(TypeModal.INFORMATION));
    }, 2000);

    useEffect(() => {
        if (!employeeId) {
            dataForm.salary && Number(dataForm.salary) > 0 && debouncedValidate(dataForm.salary);
            handleTransportationAssistance(dataForm.salary);
        }
    }, [dataForm.salary]);

    const optionsForm = useMemo(() => {
        if (lengthGreaterThanZero(Object?.keys(dynamicData || {}))) {
            return {
                ...(dataForm.country_id
                    ? {
                          departments: buildOptions(
                              dynamicData.departments.filter(
                                  ({ country_id }: IGenericRecord) => country_id === dataForm.country_id
                              )
                          ),
                          cities: buildOptions(
                              dynamicData.cities.filter(
                                  ({ department_id }: IGenericRecord) => String(department_id) === String(dataForm.department_id)
                              )
                          ),
                      }
                    : { ...optionsDefault }),
                documentTypes: buildOptions(dynamicData.document_types),
                areas: buildOptions(areas),
                positions: buildOptions(areas?.find(area => area.id === dataForm.area_id)?.positions || []),
                countries: buildOptions(dynamicData.countries),
                contributorTypes: buildOptions(dynamicData.contributor_type),
                contributorSubtypes: buildOptions(dynamicData.contributor_subtype),
                epsOptions: buildOptions(dynamicData.eps),
                severancesPay: buildOptions(dynamicData.severance_pay),
                pensions: buildOptions(dynamicData.pension),
                compensationsFunds: buildOptions(dynamicData.compensation_fund),
                riskClasses: buildOptions(
                    dynamicData?.risk_classes?.map((risk_class: IGenericRecord) => ({ ...risk_class, name: risk_class.level }))
                ),
                contractTypes: buildOptions(dynamicData.contract_types),
                salaryTypes: dynamicData?.salary_types?.map(
                    ({
                        id,
                        name,
                    }: {
                        id: string;
                        name: string;
                    }): {
                        label: string;
                        name: string;
                    } => ({ label: name, name: id })
                ),
                paymentMethods: buildOptions(dynamicData.payment_methods_payroll),
                banks: buildOptions(banks?.map(bank => ({ ...bank, name: bank.description }))),
                bankAccountTypes: buildOptions(dynamicData.bank_account_types),
            };
        }
        return optionsDefault;
    }, [dynamicData, banks, dataForm]);

    const handleGetData = (data: IEmployeeDetail): IDataForm => {
        const {
            id,
            name,
            document_type_id,
            document_number,
            birthday,
            code,
            phone_number,
            address,
            country_id,
            department_id,
            city_id,
            postal_code,
            email,
            contributor_type_id,
            contributor_subtype_id,
            eps_id,
            severance_pay_id,
            pension_id,
            compensation_fund_id,
            risk_level_id,
            status,
            company_id,
            contract,
        } = data;
        const {
            id: contract_id,
            area_id,
            position_id,
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
        } = contract;
        return {
            id,
            name,
            document_type_id,
            document_number,
            birthday: String(birthday),
            code: Number(code),
            phone_number,
            address,
            country_id,
            department_id,
            city_id,
            postal_code,
            email,
            contributor_type_id,
            contributor_subtype_id,
            eps_id,
            severance_pay_id,
            pension_id,
            compensation_fund_id,
            risk_level_id,
            contract_id,
            status,
            company_id,
            area_id,
            position_id,
            contract_type_id,
            initial_date: String(initial_date),
            final_date: String(final_date),
            payment_frequency_id,
            salary,
            is_salary: !handleShowFee(contract_type_id),
            has_transportation_assistance,
            salary_type_id,
            payment_method_id,
            bank_id,
            account_type_id,
            account_number,
        };
    };

    const handleModal = (type: CurrentModal): void => setModals({ ...modals, [type]: !modals[type] });

    const handleDataForm = <T,>(name: string, value: T): void =>
        setDataForm({
            ...dataForm,
            [name]: value,
        });

    const handleChangeInput = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = target;

        if ((name && name === NAME && allowedCharsRegex.test(value)) || (name && name !== NAME)) handleDataForm(name, value);
    };

    const handleChangeValue = (event: IGenericRecord, field: string): void => {
        const { value } = event;
        if (field) handleDataForm(field, value);
    };

    const handleChangeRadioButton = (option: IEntity, name: string): void => {
        if (name) handleDataForm(name, option.name);
    };

    const handleChangeDatepicker = (date: Date, field: string): void => {
        if (field) handleDataForm(field, getUnixFromDate(date));
    };
    const handleChangeSelect = (option: IOptionSelect, field: string): void => {
        if (field) handleDataForm(field, option.id);
    };

    const handleChange = <T,>(type: TypeInput, value: T, field: string): void => {
        switch (type) {
            case TypesInputs.MONEY:
                handleChangeValue(value as unknown as IGenericRecord, field);
                break;
            case TypesInputs.RADIO_BUTTON:
                handleChangeRadioButton(value as unknown as IEntity, field);
                break;
            case TypesInputs.DATE:
                handleChangeDatepicker(value as unknown as Date, field);
                break;
            case TypesInputs.SELECT:
                handleChangeSelect(value as unknown as IOptionSelect, field);
                break;
            default:
                handleChangeInput(value as unknown as React.ChangeEvent<HTMLInputElement>);
                break;
        }
    };

    const handleTransportationAssistance = (value: number): void => {
        const maxValueSalary = MINIMUM_SALARY * 2;
        const has_assistance = Number(value) >= MINIMUM_SALARY && Number(value) <= maxValueSalary;
        handleDataForm(HAS_TRANSPORTATION_ASSISTANCE, has_assistance);
        return;
    };

    const handleEditData = (): void => setEditData(!editData);

    const commonPropertiesSections = (
        data: IDataForm,
        handleValidateFields: (field: string) => boolean,
        handleChange: ActionChange
    ): {
        data: IDataForm;
        handleValidateFields: (field: string) => boolean;
        handleChange: ActionChange;
    } => {
        return {
            data,
            handleValidateFields,
            handleChange,
        };
    };

    const handleFormatData = (data: IDataForm, isEdit: boolean): IFormEmployee => {
        const {
            id,
            name,
            document_type_id,
            document_number,
            birthday,
            code,
            phone_number,
            address,
            country_id,
            department_id,
            city_id,
            postal_code,
            email,
            contributor_type_id,
            contributor_subtype_id,
            eps_id,
            severance_pay_id,
            pension_id,
            compensation_fund_id,
            risk_level_id,
            contract_id,
            status,
            area_id,
            position_id,
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
        return {
            employee: {
                id: id || null,
                name,
                document_type_id,
                document_number,
                birthday: getDateFromUnix(Number(birthday)).formatYearMonthDay || '',
                code,
                phone_number,
                address,
                country_id,
                department_id,
                city_id,
                postal_code: postal_code || null,
                email,
                contributor_type_id,
                contributor_subtype_id,
                eps_id,
                severance_pay_id,
                pension_id,
                compensation_fund_id,
                risk_level_id,
                contract_id,
                status,
                company_id: user?.company_id || '',
            },
            contract: !isEdit
                ? {
                      id: contract_id,
                      area_id,
                      position_id,
                      contract_type_id,
                      initial_date: getDateFromUnix(Number(initial_date)).formatYearMonthDay || '',
                      final_date: getDateFromUnix(Number(final_date)).formatYearMonthDay || '',
                      payment_frequency_id,
                      salary,
                      is_salary: !handleShowFee(contract_type_id),
                      has_transportation_assistance,
                      salary_type_id,
                      payment_method_id,
                      bank_id: bank_id || null,
                      account_type_id: account_type_id || null,
                      account_number: account_number || null,
                  }
                : [],
        };
    };

    const handleRedirect = (path: string, params?: URLSearchParams): void =>
        !params ? history.push(path) : history.push({ pathname: path, search: params.toString() });

    const handleSubmit = async (): Promise<void> => {
        if (!handleValidateForm(dataForm, !!employeeId)) return setIsSubmitted(true);
        const dataFormatted = handleFormatData(dataForm, !!employeeId);
        await dispatch(saveDataEmployee(dataFormatted, (): void => handleModal(TypeModal.SAVE)));
    };

    useEffect(() => {
        (async (): Promise<void> => {
            Promise.all([
                dispatch(getListEmployees(true)),
                dispatch(getDynamicRequest(DYNAMIC_REQUEST)),
                dispatch(getBanks()),
                dispatch(getAreas(true)),
            ]);
        })();
    }, []);

    return (
        <div className="database-employees xs:px-2">
            <SharedModal
                moduleId={ModuleApp.TECHNICAL_SHEET_EMPLOYEES}
                open={modals.save}
                finalAction={(): void => {
                    handleModal(TypeModal.SAVE);
                    if (employeeId) searchParams.set(ID, employeeId);
                    handleRedirect(
                        getRoute(employeeId ? Routes.DATABASE_EMPLOYEE_DETAIL : Routes.DATABASE_EMPLOYEES),
                        searchParams
                    );
                }}
            />
            <ModalType
                moduleId={ModuleApp.TECHNICAL_SHEET_EMPLOYEES}
                open={modals.information}
                finalAction={(): void => handleModal(TypeModal.INFORMATION)}
                iconName="alertMulticolor"
                text={{
                    title: MODAL_TITLE,
                    description: MODAL_DESCRIPTION,
                }}
            />
            <PageTitle title={TITLE} classTitle="text-left text-base" classContainer="w-full" />
            <BreadCrumb routes={routes(employeeId)} className="mb-4.5" />
            <h2 className="text-26lg mb-4.5 text-blue text-center font-allerbold">{employeeId ? EDIT_TITLE : ADD_TITLE}</h2>
            {employeeId ? EDIT_CONTENT.DESCRIPTION((): void => handleRedirect(getRoute(Routes.HOME))) : ADD}
            <div className="flex flex-col gap-y-4.5">
                <BasicInformation
                    isEdit={!!employeeId}
                    editData={editData}
                    handleEditData={handleEditData}
                    options={{
                        documentTypes: optionsForm.documentTypes,
                        areas: optionsForm.areas,
                        positions: optionsForm.positions,
                    }}
                    handleRedirectAddOption={(): void => handleRedirect(getRoute(Routes.DATABASE_ORGANIZATION_CHART))}
                    {...commonPropertiesSections(dataForm, handleValidateFields, handleChange)}
                />
                <ContactInformation
                    options={{
                        countries: optionsForm.countries,
                        departments: optionsForm.departments,
                        cities: optionsForm.cities,
                    }}
                    {...commonPropertiesSections(dataForm, handleValidateFields, handleChange)}
                />
                <Affiliations
                    options={{
                        contributorTypes: optionsForm.contributorTypes,
                        contributorSubtypes: optionsForm.contributorSubtypes,
                        epsOptions: optionsForm.epsOptions,
                        severancesPay: optionsForm.severancesPay,
                        pensions: optionsForm.pensions,
                        compensationsFunds: optionsForm.compensationsFunds,
                        riskClasses: optionsForm.riskClasses,
                    }}
                    {...commonPropertiesSections(dataForm, handleValidateFields, handleChange)}
                />
                <Contract
                    isEdit={!!employeeId}
                    options={{
                        contractTypes: optionsForm.contractTypes,
                        salaryTypes: optionsForm.salaryTypes,
                        paymentMethods: optionsForm.paymentMethods,
                        banks: optionsForm.banks,
                        bankAccountTypes: optionsForm.bankAccountTypes,
                    }}
                    validationsContract={{
                        handleValidateFields,
                        handleShowEndDate,
                        handleShowFee,
                        handleValidateIntegralSalary,
                        handleEnableBankFields,
                    }}
                    {...commonPropertiesSections(dataForm, handleValidateFields, handleChange)}
                />
            </div>
            <PageButtonsFooter
                disabledRight={disabledInputs}
                {...buttonsFooterProps(
                    ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                    history,
                    (): Promise<void> => handleSubmit(),
                    {
                        name: '#',
                        moduleName: getRouteName(Routes.DATABASE_MENU),
                    },
                    TitleButtons.SAVE
                )}
            />
        </div>
    );
};

export default DatabaseEmployeesForm;
