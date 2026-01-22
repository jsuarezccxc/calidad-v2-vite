import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectSearchOption } from 'react-select-search';
import { useHistory } from 'react-router-dom';
import character from '@assets/images/character.png';
import { CurrentStep } from '@components/current-step';
import { ChangeEvent, IOptionSelect, SelectInput, SelectSearchInput, TextInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { formatTaxDetails } from '@components/electronic-invoice';
import { InformationBulb } from '@components/information';
import { SimpleButton } from '@components/button';
import { DOCUMENT_TYPES } from '@constants/DynamicRequest';
import { Routes } from '@constants/Paths';
import { CIIUS, CITIES, DEPARTMENTS, FISCAL_RESPONSIBILITIES, TAX_DETAILS } from '@constants/UtilsConstants';
import { Step } from '@models/EnableElectronicBiller';
import { IGenericRecord } from '@models/GenericRecord';
import { INFORMATION, STEP_DATA, TOOLTIP_CONTRIBUTOR } from '@information-texts/EnableElectronicBiller';
import { RootState } from '@redux/rootReducer';
import { getInvoiceUtils } from '@redux/parameterization-customization-electronic-invoice/actions';
import { getInformationCompany, updateDataCompany } from '@redux/company/actions';
import { buttonsFooterProps } from '@utils/Button';
import { getRouteName } from '@utils/Paths';
import { buildOptions } from '@utils/Company';
import { getDateAnyFormat } from '@utils/Date';
import { isCorrectResponse } from '@utils/Response';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import useTaxpayerType from '@hooks/useTaxpayerType';
import useScrollToError from '@hooks/useScrollToError';
import useDigitVerification from '@hooks/useDigitVerification';
import {
    EconomicActivities,
    FieldName,
    TaxResponsibilities,
    formatOptions,
    validateEmptyFields,
    validateEmptyResponsibilities,
    validateEmptyCiius,
    ICompanyInformationProps,
    TOOLTIP_DATA,
    POSTAL_CODE_LENGTH,
    EMPTY_LOCATION_FIELDS,
    PERSON_OPTIONS,
    LOCATION_KEYS,
    DEFAULT_COMPANY_DATA,
    SELECT_INPUT_PROPS,
} from '.';

export const CompanyInformation: React.FC<ICompanyInformationProps> = ({
    returnStep,
    toggleModal,
    fullStepOne,
    selectStep = (): void => {},
    completedStep,
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { disabledInputs } = usePermissions();
    const { setDocumentType, optionsTaxpayer } = useTaxpayerType(true);
    const { information, getDynamicRequest, utils } = useSelector(
        ({ company, warehouses, parameterizationInvoice }: RootState) => ({
            ...company,
            ...warehouses,
            ...parameterizationInvoice,
        })
    );
    const { isTypeNit, digitVerification, setDocumentNumber, setTypeDocument } = useDigitVerification();

    const [data, setData] = useState<IGenericRecord>(DEFAULT_COMPANY_DATA);
    const [validate, setValidate] = useState<boolean>(false);

    const taxOptions = useMemo(() => formatTaxDetails(buildOptions(getDynamicRequest?.tax_details)), [getDynamicRequest]);

    const { scrollToInput } = useScrollToError();

    const { departments, groupedCities } = utils;

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        formatFieldData();
    }, [information]);

    const getData = async (): Promise<void> => {
        await Promise.all([
            dispatch(getInvoiceUtils([CITIES, DEPARTMENTS, FISCAL_RESPONSIBILITIES, TAX_DETAILS, CIIUS, DOCUMENT_TYPES])),
            dispatch(getInformationCompany()),
        ]);
    };

    const formatFieldData = (): void => {
        if (!information) return;
        setData({
            ...information,
            person_type: PERSON_OPTIONS.find(({ key }) => key === information?.person_type)?.value,
            tax_detail: taxOptions.find(item => item.id == information.tax_detail)?.value ?? '',
        });
        setDocumentType(information?.document_type);
        setDocumentNumber(information?.document_number);
        setTypeDocument(information?.document_type_name || '');
    };

    const handleOptionChange = ({ value, ...option }: IGenericRecord, field: string): void => {
        setData({ ...data, ...(EMPTY_LOCATION_FIELDS[field] ?? {}), [LOCATION_KEYS[field]]: option.name, [field]: value });
    };

    const handleTextChange = ({ target: { name, value } }: ChangeEvent): void => {
        setData({ ...data, [name]: value });
    };

    const getCityOptions = (): SelectSearchOption[] => {
        const departmentCode = departments?.find((department: IGenericRecord) => department.id === data?.department_id)?.code;
        return formatOptions(groupedCities?.[departmentCode?.trim()]);
    };

    const preventSaving = (): boolean => {
        return (
            validateEmptyFields(data) ||
            validateEmptyResponsibilities(data.fiscal_responsibilities) ||
            validateEmptyCiius(data.ciius)
        );
    };

    const formatRequestData = (): IGenericRecord => {
        const taxDetailValue = data.tax_detail?.split(' - ')[0];
        return {
            ...data,
            tax_detail: utils?.tax_details.find((item: IGenericRecord) => item.code === taxDetailValue)?.id ?? '',
            person_type: PERSON_OPTIONS.find(({ value }) => value === data?.person_type)?.key,
            fiscal_responsibilities: data?.fiscal_responsibilities?.map((item: IGenericRecord) => ({
                ...item,
                date: item?.date ?? getDateAnyFormat(new Date(), 'YYYY/MM/DD'),
            })),
        };
    };

    const saveData = async (): Promise<void> => {
        if (preventSaving()) {
            setValidate(true);
            return scrollToInput();
        }
        setValidate(false);
        const statusCode = Number(await dispatch(updateDataCompany(formatRequestData())));
        if (isCorrectResponse(statusCode)) {
            completedStep(Step.CompanyInformation);
            toggleModal();
        }
    };

    const documentType = utils?.document_types?.find((item: IGenericRecord) => item.id === data?.document_type)?.name;

    const cityOptions = useMemo(() => getCityOptions(), [groupedCities, data.department_id]);

    const departmentOptions = useMemo(() => formatOptions(departments), [departments]);

    return (
        <div className="company-information">
            {fullStepOne ? (
                <div className="pl-5 rounded">
                    <CurrentStep {...STEP_DATA.COMPANY_FULL_DATA} />
                    <div className="flex flex-col justify-center items-center w-full  bg-white mt-4.5 rounded electronic-biller__container-success">
                        <div className="flex flex-col items-center justify-center w-full pt-1 mb-7 md:flex-row">
                            <div className="md:mr-5 md:w-117 md:ml-14">
                                <h3 className="electronic-biller__steps-subtitle">¡Felicidades!</h3>
                                <p className="mb-8 text-xl leading-6 text-gray-dark">
                                    Ha completado la información de la empresa exitosamente.
                                </p>
                                <p className="text-xl leading-6 text-gray-dark">
                                    Continúe con el <span className="font-allerbold">Paso 2:</span> Registro en la DIAN
                                </p>
                            </div>
                            <img src={character} alt="character" style={{ width: '16.725rem', height: '14.875rem' }} />
                        </div>
                        <SimpleButton
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.COMPANY_INFORMATION}-go-step-dian-registration`,
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => {
                                Step?.DianRegistration && selectStep(Step?.DianRegistration);
                            }}
                            className="electronic-biller__next-button"
                        >
                            Paso 2: Registro en la DIAN
                        </SimpleButton>
                    </div>
                </div>
            ) : (
                <>
                    <CurrentStep {...STEP_DATA.COMPANY_INFORMATION} />
                    <InformationBulb
                        text={INFORMATION.TITLE_INFORMATION_BULB}
                        textDescription={INFORMATION.COMPANY_FIELDS}
                        wrapperClass="relative"
                        tooltipClass="top-6"
                    />
                    {INFORMATION.COMPANY_INFORMATION}
                    <form className="mt-4.5 flex flex-col gap-4.5">
                        <fieldset className="company-information__fields">
                            <h2 className="text-green font-allerbold mb-4.5 text-base">Información básica</h2>
                            <div className="flex gap-x-7 gap-y-4.5 mb-4.5 flex-wrap px-2 xs:w-full">
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-name-company`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="*Nombre de la empresa:"
                                    value={data?.name}
                                    disabled
                                    placeholder="..."
                                    required={validate && !data?.name}
                                    classesWrapper="xs:w-full w-73"
                                    {...TOOLTIP_DATA[FieldName.CompanyName]}
                                />
                                <SelectInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-document-type`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    labelText="*Tipo de documento:"
                                    value={documentType}
                                    classesWrapper="xs:w-full w-73"
                                    {...SELECT_INPUT_PROPS}
                                    disabled
                                />
                                <div className="flex xs:w-full">
                                    <TextInput
                                        id={generateId({
                                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                            submodule: `${ModuleApp.COMPANY_INFORMATION}-document-number`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        labelText="*Número de documento:"
                                        placeholder="..."
                                        disabled
                                        value={data?.document_number}
                                        classesWrapper={`${isTypeNit ? 'w-52.5' : 'w-73'} xs:w-full xs:flex-1`}
                                    />
                                    {isTypeNit && (
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                                submodule: `${ModuleApp.COMPANY_INFORMATION}-dv`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            labelText="DV:"
                                            value={digitVerification}
                                            classesWrapper="ml-4.5 w-11.2 xs:w-1/5"
                                            disabled
                                        />
                                    )}
                                </div>
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-company-representative-name`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    {...TOOLTIP_DATA[FieldName.CompanyRepresentativeName]}
                                    labelText="*Nombre del representante:"
                                    onChange={handleTextChange}
                                    name={FieldName.CompanyRepresentativeName}
                                    value={data?.company_representative_name}
                                    placeholder="..."
                                    required={validate && !data?.company_representative_name}
                                    disabled={disabledInputs}
                                    classesWrapper="xs:w-full w-73"
                                />
                            </div>
                        </fieldset>
                        <fieldset className="company-information__fields">
                            <h2 className="text-green font-allerbold mb-4.5 text-base">Información de contacto</h2>
                            <div className="flex gap-x-7 gap-y-4.5 mb-4.5 flex-wrap px-2">
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-address`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="*Dirección:"
                                    value={data?.address}
                                    onChange={handleTextChange}
                                    name={FieldName.Address}
                                    placeholder="..."
                                    required={validate && !data?.address}
                                    {...TOOLTIP_DATA[FieldName.Address]}
                                    maxLength={240}
                                    disabled={disabledInputs}
                                    classesWrapper="xs:w-full w-73"
                                />
                                <SelectSearchInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-country`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="*País:"
                                    placeholder="Colombia"
                                    disabled
                                    classesWrapperInput="rounded-md"
                                    classesWrapper="wx:w-full"
                                    classNameMain="xs:w-full xs:block w-73"
                                    {...TOOLTIP_DATA[FieldName.CountryId]}
                                    {...SELECT_INPUT_PROPS}
                                />
                                <SelectSearchInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-department`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="*Departamento/Estado:"
                                    optionSelect={departmentOptions}
                                    valueSelect={data?.department_id}
                                    placeholder={data?.department_name ? data?.department_name : 'Seleccionar'}
                                    onChangeSelect={(_, option): void => handleOptionChange(option, FieldName.DepartmentId)}
                                    classesWrapper={`${data?.department_name ? 'select--dark-placeholder' : ''} w-73 xs:w-full`}
                                    classNameMain="xs:w-full xs:block"
                                    required={validate && !data?.department_id}
                                    {...TOOLTIP_DATA[FieldName.DepartmentId]}
                                    {...SELECT_INPUT_PROPS}
                                    disabled={disabledInputs}
                                />
                                <SelectSearchInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-city`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="*Ciudad:"
                                    placeholder={data?.city_name ? data?.city_name : 'Seleccionar'}
                                    optionSelect={cityOptions}
                                    valueSelect={data?.city_id}
                                    onChangeSelect={(_, option): void => {
                                        handleOptionChange(option, FieldName.CityId);
                                    }}
                                    classesWrapper={`${data?.city_name ? 'select--dark-placeholder' : ''} w-73 xs:w-full`}
                                    classNameMain="xs:w-full xs:block"
                                    required={validate && !data?.city_id}
                                    {...TOOLTIP_DATA[FieldName.CityId]}
                                    {...SELECT_INPUT_PROPS}
                                    disabled={disabledInputs}
                                />
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-postal-code`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="*Código postal:"
                                    value={data?.postal_code}
                                    onChange={handleTextChange}
                                    name={FieldName.PostalCode}
                                    maxLength={POSTAL_CODE_LENGTH}
                                    placeholder="..."
                                    required={validate && !data?.postal_code}
                                    {...TOOLTIP_DATA[FieldName.PostalCode]}
                                    disabled={disabledInputs}
                                    classesWrapper="xs:w-full w-73"
                                />
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-phone`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    labelText="*Teléfono:"
                                    onlyNumbers
                                    value={data?.phone}
                                    placeholder="..."
                                    onChange={handleTextChange}
                                    name={FieldName.Phone}
                                    maxLength={10}
                                    required={validate && !data?.phone}
                                    {...TOOLTIP_DATA[FieldName.Phone]}
                                    disabled={disabledInputs}
                                    classesWrapper="xs:w-full w-73"
                                />
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-email`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    disabled
                                    labelText="*Correo electrónico:"
                                    value={data?.email}
                                    name="email"
                                    placeholder="..."
                                    limitCharacters={false}
                                    classesWrapper="xs:w-full w-73"
                                />
                            </div>
                        </fieldset>
                        <fieldset className="company-information__fields">
                            <h2 className="text-green font-allerbold mb-4.5 text-base">Detalles tributarios</h2>
                            <div className="flex flex-col lg:flex-row gap-x-7 gap-y-4.5 mb-4.5 flex-wrap lg:px-2">
                                <SelectInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-person-type`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    labelText="*Tipo de contribuyente:"
                                    options={optionsTaxpayer as IOptionSelect[]}
                                    value={data?.person_type}
                                    optionSelected={(option): void => handleOptionChange(option, FieldName.PersonType)}
                                    classesWrapper="company-information__field w-73"
                                    titleTooltip="Tipo de contribuyente:"
                                    descTooltip={TOOLTIP_CONTRIBUTOR}
                                    required={validate && !data?.person_type}
                                    disabled={disabledInputs}
                                    {...SELECT_INPUT_PROPS}
                                />
                                <SelectInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `${ModuleApp.COMPANY_INFORMATION}-tax-detail`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    labelText="*Detalle de impuesto:"
                                    options={taxOptions}
                                    value={data?.tax_detail}
                                    optionSelected={(option): void => handleOptionChange(option, FieldName.TaxDetail)}
                                    classesWrapper="company-information__field w-73"
                                    {...TOOLTIP_DATA[FieldName.TaxDetail]}
                                    required={validate && !data?.tax_detail}
                                    disabled={disabledInputs}
                                    {...SELECT_INPUT_PROPS}
                                />
                            </div>
                            <div className="flex flex-col gap-4.5 lg:px-2">
                                <TaxResponsibilities
                                    data={data}
                                    handleDataChange={(data: IGenericRecord): void => setData(data)}
                                    fiscalOptions={utils?.fiscal_responsibilities}
                                    validate={validate}
                                />
                                <EconomicActivities
                                    data={data}
                                    handleDataChange={(data: IGenericRecord): void => setData(data)}
                                    options={utils?.ciius}
                                    validate={validate}
                                />
                            </div>
                        </fieldset>
                    </form>
                </>
            )}
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.ELECTRONIC_DOCUMENTS,
                    history,
                    fullStepOne ? (): void => selectStep(Step.DianRegistration) : saveData,
                    {
                        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    INFORMATION.BUTTON_NEXT
                )}
                disabledRight={disabledInputs}
                onClickButtonLeft={(): void => returnStep(true)}
            />
        </div>
    );
};
