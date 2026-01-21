import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, DatePickerMonthInput, IOptionSelect, PasswordInput, SelectSearchInput, TextInput } from '@components/input';
import { SingleCheckBox } from '@components/checkbox';
import { TaxResponsibilities } from '@components/electronic-documents/tax-responsibilities';
import { COLOMBIA_ID } from '@constants/Location';
import { CARD_TYPES } from '@constants/PaymentPlans';
import { CREDIT_CARD } from '@constants/PaymentMethods';
import { PERSON_UTILS } from '@constants/UtilsConstants';
import useLocationOptions from '@hooks/useLocationOptions';
import useTaxpayerType from '@hooks/useTaxpayerType';
import usePermissions from '@hooks/usePermissions';
import useDigitVerification from '@hooks/useDigitVerification';
import { IGenericRecord } from '@models/GenericRecord';
import { Field, PaymentMethod } from '@models/PaymentPlans';
import InactivityDetector from '@pages/payment-methods/components/InactivityDetector';
import { RootState } from '@redux/rootReducer';
import { getUtils } from '@redux/utils/actions';
import { buildOptions } from '@utils/Company';
import { getUnix } from '@utils/Date';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { getFieldProps, IPaymentFormProps, getPaymentInstallments, EMPTY_LOCATION_FIELDS, ID_KEY, RESET_FIELDS } from '.';
import './PaymentForm.scss';

export const PaymentForm: React.FC<IPaymentFormProps> = ({ data, handleInactivity, updateData, validate }) => {
    const dispatch = useDispatch();

    const { banks, utils } = useSelector(({ payments, utils }: RootState) => ({
        ...payments,
        ...utils,
    }));

    const { disabledInputs } = usePermissions();
    const { setDocumentType, optionsTaxpayer } = useTaxpayerType();
    const { setDocumentType: setDocumentTypeClient, optionsTaxpayer: optionsTaxpayerClient } = useTaxpayerType();

    const { departments, cities, countries } = useLocationOptions(data.department_id);

    useEffect(() => {
        dispatch(getUtils(PERSON_UTILS));
    }, []);

    const fieldProps = getFieldProps(data, validate);

    const { isTypeNit, digitVerification, setTypeDocument, setDocumentNumber } = useDigitVerification(
        data?.document_type,
        data?.document_number
    );

    const {
        isTypeNit: isTypeNitHolder,
        digitVerification: digitVerificationHolder,
        setTypeDocument: setTypeDocumentHolder,
        setDocumentNumber: setDocumentNumberHolder,
    } = useDigitVerification(data?.holder_document_type, data?.holder_document_number);

    const handleOptionChange = ({ id, value }: IGenericRecord, name = ''): void => {
        const keyId = ID_KEY[name];

        if (name === Field.HolderDocumentType) {
            setDocumentType(id);
            setTypeDocumentHolder(value);
        }

        if (name === Field.DocumentType) {
            setDocumentTypeClient(id);
            setTypeDocument(value);
        }

        updateData({
            ...data,
            [name]: value,
            ...EMPTY_LOCATION_FIELDS[name],
            ...(keyId && { [keyId]: id }),
            ...(RESET_FIELDS[name] || {}),
        });
    };

    const handleValueChange = ({ target: { name, value } }: ChangeEvent): void => {
        updateData({ ...data, [name]: value });
        if (name === Field.DocumentNumber) setDocumentNumber(value);
        if (name === Field.HolderDocumentType) setDocumentNumberHolder(value);
    };

    const updateSearchOption = ({ value, name }: IOptionSelect, field: string): void => {
        const keyId = ID_KEY[field];
        updateData({ ...data, ...EMPTY_LOCATION_FIELDS[field], ...(keyId && { [keyId]: name }), [field]: value });
    };

    const bankList = useMemo(() => banks.map(bank => ({ ...bank, value: bank.pseCode, name: bank.description })).slice(1), [
        banks,
    ]);

    const isColombia = data[Field.CountryId] === COLOMBIA_ID;

    const documentTypesRender = utils?.document_types?.map((document_type: IGenericRecord) => ({
        ...document_type,
        id: document_type.id,
    }));
    const personTypesRender = buildOptions(optionsTaxpayerClient)?.map((item: IGenericRecord) => ({
        ...item,
        id: item.id,
        name: item.value,
        value: item.value,
    }));
    const taxDetailsOptionsRender = utils?.tax_details?.map((item: IGenericRecord) => ({ ...item, id: item.code }));
    const typeTaxpayerOptionsRender = buildOptions(optionsTaxpayer)?.map((item: IGenericRecord) => ({
        ...item,
        id: item.id,
        name: item.value,
        value: item.value,
    }));
    const cardTypesRender = CARD_TYPES?.map((item: IGenericRecord) => ({
        ...item,
        id: item.id,
        name: item.value,
        value: item.value,
    }));
    const quotasOptionsRender = getPaymentInstallments()?.map((item: IGenericRecord) => ({
        ...item,
        id: item.value,
        name: item.value,
        value: item.value,
    }));

    return (
        <form className="payment-form">
            {data.paymentMethod === PaymentMethod.Pse && (
                <fieldset className="payment-form__group">
                    <h2 className="payment-form__fields-title">Información del banco</h2>
                    <p className="text-gray-dark my-4.5">Agregue la información para facturar </p>
                    <SelectSearchInput
                        {...fieldProps[Field.Bank]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'bank',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelect={bankList}
                        onChangeSelect={(_, item): void => updateSearchOption(item, Field.Bank)}
                        disabled={disabledInputs}
                    />
                </fieldset>
            )}
            <fieldset className="payment-form__group">
                <h2 className="payment-form__fields-title">Información para facturar</h2>
                <p className="text-gray-dark my-4.5">Agregue la información para facturar </p>
                <div className="payment-form__fields">
                    <TextInput
                        {...fieldProps[Field.ClientName]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'client-name',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        disabled={disabledInputs}
                        onChange={handleValueChange}
                    />
                    <SelectSearchInput
                        {...fieldProps[Field.DocumentType]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'document-types',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelect={documentTypesRender}
                        disabled={disabledInputs}
                        onChangeSelect={(_, option): void => handleOptionChange(option, Field.DocumentType)}
                    />
                    <div className="flex">
                        <TextInput
                            {...fieldProps[Field.DocumentNumber]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'document-number',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            classesWrapper={isTypeNit ? 'w-57 mr-2' : 'form-field'}
                            onChange={handleValueChange}
                            disabled={disabledInputs}
                        />
                        {isTypeNit && (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PAYMENT_METHODS,
                                    submodule: 'dv',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                tooltipInfo
                                descTooltip="DV: Dígito de verificación"
                                classesWrapper="w-11.2"
                                labelText="DV:"
                                disabled
                                value={digitVerification}
                            />
                        )}
                    </div>
                </div>
            </fieldset>
            <fieldset className="payment-form__group">
                <h2 className="payment-form__fields-title mb-4.5">Información de contacto</h2>
                <div className="payment-form__fields">
                    <TextInput
                        {...fieldProps[Field.Address]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'address',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        disabled={disabledInputs}
                        onChange={handleValueChange}
                    />
                    <SelectSearchInput
                        {...fieldProps[Field.CountryId]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'country',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelect={countries?.map(country => ({ ...country, id: country.name }))}
                        onChangeSelect={(_, option): void => handleOptionChange(option, Field.CountryId)}
                        disabled={disabledInputs}
                    />
                    {isColombia ? (
                        <SelectSearchInput
                            {...fieldProps[Field.DepartmentId]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'department',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            optionSelect={departments}
                            onChangeSelect={(_, item): void => updateSearchOption(item, Field.DepartmentId)}
                            disabled={disabledInputs}
                        />
                    ) : (
                        <TextInput
                            {...fieldProps[Field.DepartmentName]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'department',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            onChange={handleValueChange}
                            disabled={disabledInputs}
                        />
                    )}

                    {isColombia ? (
                        <SelectSearchInput
                            {...fieldProps[Field.CityId]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'city',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            optionSelect={cities}
                            onChangeSelect={(_, item): void => updateSearchOption(item, Field.CityId)}
                            disabled={disabledInputs}
                        />
                    ) : (
                        <TextInput
                            {...fieldProps[Field.CityName]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'city',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            onChange={handleValueChange}
                            disabled={disabledInputs}
                        />
                    )}
                    <TextInput
                        {...fieldProps[Field.PostalCode]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'postal-code',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        disabled={disabledInputs}
                        onChange={handleValueChange}
                    />
                    <TextInput
                        {...fieldProps[Field.Phone]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'phone',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        disabled={disabledInputs}
                        onlyNumbers
                        onChange={handleValueChange}
                    />
                    <TextInput
                        {...fieldProps[Field.Email]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'email',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        disabled={disabledInputs}
                        onChange={handleValueChange}
                    />
                </div>
            </fieldset>
            <fieldset className="payment-form__group">
                <h2 className="payment-form__fields-title mb-4.5">Detalles tributarios</h2>
                <div className="payment-form__fields">
                    <SelectSearchInput
                        {...fieldProps[Field.PersonType]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'person-type',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelect={personTypesRender}
                        onChangeSelect={(_, option): void => handleOptionChange(option, Field.PersonType)}
                        disabled={disabledInputs}
                    />
                    <SelectSearchInput
                        {...fieldProps[Field.TaxDetail]}
                        id={generateId({
                            module: ModuleApp.PAYMENT_METHODS,
                            submodule: 'tax-detail',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelect={taxDetailsOptionsRender}
                        onChangeSelect={(_, option): void => handleOptionChange(option, Field.TaxDetail)}
                        disabled={disabledInputs}
                    />
                </div>
                <TaxResponsibilities
                    data={data}
                    fiscalOptions={utils?.fiscal_responsibilities}
                    handleDataChange={updateData}
                    validate={validate}
                />
            </fieldset>
            {data.paymentMethod === PaymentMethod.Card && (
                <fieldset className="payment-form__group">
                    <h2 className="payment-form__fields-title mb-4.5">Información de la tarjeta</h2>
                    <SingleCheckBox
                        checked={data.clientIsOwner}
                        handleChange={({ target: { checked } }: ChangeEvent): void =>
                            updateData({ ...data, clientIsOwner: checked })
                        }
                        disabled={disabledInputs}
                        labelClass="payment-form__check-text"
                        labelText="La información del titular de la tarjeta y la información de facturación es la misma"
                    />
                    <div className="payment-form__fields mt-4.5">
                        {!data.clientIsOwner && (
                            <>
                                <div className="flex w-full gap-7">
                                    <TextInput
                                        {...fieldProps[Field.HolderName]}
                                        id={generateId({
                                            module: ModuleApp.PAYMENT_METHODS,
                                            submodule: 'holder-name',
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        disabled={disabledInputs}
                                        onChange={handleValueChange}
                                    />
                                    <SelectSearchInput
                                        {...fieldProps[Field.HolderDocumentType]}
                                        id={generateId({
                                            module: ModuleApp.PAYMENT_METHODS,
                                            submodule: 'holder-document-type',
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        optionSelect={documentTypesRender}
                                        disabled={disabledInputs}
                                        onChangeSelect={(_, option): void => handleOptionChange(option, Field.HolderDocumentType)}
                                    />
                                </div>
                                <SelectSearchInput
                                    {...fieldProps[Field.TypeTaxpayer]}
                                    id={generateId({
                                        module: ModuleApp.PAYMENT_METHODS,
                                        submodule: 'holder-type-taxpayer',
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    disabled={disabledInputs}
                                    optionSelect={typeTaxpayerOptionsRender}
                                    onChangeSelect={(_, option): void => handleOptionChange(option, Field.TypeTaxpayer)}
                                />
                                <div className="flex">
                                    <TextInput
                                        {...fieldProps[Field.HolderDocumentNumber]}
                                        id={generateId({
                                            module: ModuleApp.PAYMENT_METHODS,
                                            submodule: 'holder-document-number',
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        classesWrapper={`${isTypeNitHolder ? 'w-57 mr-2' : 'form-field'}`}
                                        disabled={disabledInputs}
                                        onChange={handleValueChange}
                                    />
                                    {isTypeNitHolder && (
                                        <TextInput
                                            id={generateId({
                                                module: ModuleApp.PAYMENT_METHODS,
                                                submodule: 'holder-dv',
                                                action: ActionElementType.INPUT,
                                                elementType: ElementType.TXT,
                                            })}
                                            tooltipInfo
                                            descTooltip="DV: Dígito de verificación"
                                            classesWrapper="w-11.2"
                                            labelText="DV:"
                                            disabled
                                            value={digitVerificationHolder}
                                        />
                                    )}
                                </div>
                                <TextInput
                                    {...fieldProps[Field.HolderEmail]}
                                    id={generateId({
                                        module: ModuleApp.PAYMENT_METHODS,
                                        submodule: 'holder-email',
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    disabled={disabledInputs}
                                    onChange={handleValueChange}
                                />
                            </>
                        )}
                        <TextInput
                            {...fieldProps[Field.CardNumber]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'card-number',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            disabled={disabledInputs}
                            onChange={handleValueChange}
                        />
                        <DatePickerMonthInput
                            {...fieldProps[Field.CardExpiration]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'date-card-expiration',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            disabled={disabledInputs}
                            onChangeDate={(date: Date): void => updateData({ ...data, [Field.CardExpiration]: getUnix(date) })}
                        />
                        <PasswordInput
                            {...fieldProps[Field.CardCode]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'card-code',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            disabled={disabledInputs}
                            onChange={handleValueChange}
                        />
                        <SelectSearchInput
                            {...fieldProps[Field.CardType]}
                            id={generateId({
                                module: ModuleApp.PAYMENT_METHODS,
                                submodule: 'card-type',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            disabled={disabledInputs}
                            optionSelect={cardTypesRender}
                            onChangeSelect={(_, option): void => handleOptionChange(option, Field.CardType)}
                        />
                        {data.card_type_key === CREDIT_CARD && (
                            <SelectSearchInput
                                {...fieldProps[Field.Quotas]}
                                id={generateId({
                                    module: ModuleApp.PAYMENT_METHODS,
                                    submodule: 'quotas',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                disabled={disabledInputs}
                                optionSelect={quotasOptionsRender}
                                onChangeSelect={(_, option): void => handleOptionChange(option, Field.Quotas)}
                            />
                        )}
                    </div>
                </fieldset>
            )}
            <InactivityDetector onInactive={handleInactivity} />
        </form>
    );
};
