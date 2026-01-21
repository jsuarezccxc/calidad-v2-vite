import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { RadioButton } from '@components/radiobutton';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { ChangeEvent, SelectSearchInput, TextInput } from '@components/input';
import { TaxResponsibilities } from '@components/electronic-documents/tax-responsibilities';
import { IDataClientOrSupplier, ModalWarningClientOrSupplier } from '@components/modal-custom';
import { Routes } from '@constants/Paths';
import { ID } from '@constants/BuildProduct';
import { EMAIL } from '@constants/UserManagement';
import {
    ADDRESS,
    CITY,
    COLOMBIA,
    COLOMBIA_ID,
    COUNTRY,
    DEPARTMENT,
    REQUIRED_LOCATIONS_KEYS,
    REQUIRED_LOCATION_KEY,
} from '@constants/Location';
import { TitleButtons } from '@constants/Buttons';
import { KEY_ASSIGN_SUPPLIER } from '@constants/Supplier';
import { INPUTS_RESET_LOCATION } from '@constants/Location';
import { ModalImport } from '@constants/ElectronicDocuments';
import { SUCCESS_RESPONSE_CODE } from '@constants/StatusCodes';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import useTaxpayerType from '@hooks/useTaxpayerType';
import useScrollToError from '@hooks/useScrollToError';
import useLocationOptions from '@hooks/useLocationOptions';
import useValidateLocation from '@hooks/useValidateLocation';
import { INFORMATION, TOOLTIP_BUTTON, TOOLTIP_DATA } from '@information-texts/Invoice';
import { FieldName } from '@models/Company';
import { Form } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { ISupplier, ISupplierResponse } from '@models/Supplier';
import {
    getSupplier,
    getSuppliers,
    postExistDuplicateSupplier,
    postStoreSupplier,
    putUpdateSupplier,
} from '@redux/suppliers/actions';
import { RootState } from '@redux/rootReducer';
import { getClientById } from '@redux/client-portal/actions';
import { createClient, getClientsThin, updateClient, validateExistence } from '@redux/clients/actions';
import { getRouteName } from '@utils/Paths';
import { AssignDataToObject } from '@utils/Json';
import { buttonsFooterProps } from '@utils/Button';
import { validateEmptyFields } from '@utils/Fields';
import { validateEmail } from '@utils/Validation';
import { isCorrectResponse } from '@utils/Response';
import { propsToPersonType } from '@utils/ElectronicInvoice';
import { buildOptions, EMPTY_LOCATION_FIELDS, LOCATION_KEYS } from '@utils/Company';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { useImportModal } from '../hook/useImportModal';
import { ConsultClient, Error, ImportClient, Warning } from '../content-modal';
import {
    IAddPersonProps,
    getRequiredFields,
    InputFieldsLimits,
    formatPersonRequest,
    formatSupplierRequest,
    DEFAULT_PERSON_DATA,
} from '.';
import './AddPerson.scss';

export const AddPerson: React.FC<IAddPersonProps> = ({ isClient, toggleModal, backAddUser }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { queryParam } = useParam(ID);
    const { scrollToInput } = useScrollToError();
    const { setDocumentType, optionsTaxpayer } = useTaxpayerType();
    const { user, utils, clientSelected, information } = useSelector(({ session, utils, clientPortal, company }: RootState) => ({
        ...session,
        ...utils,
        ...clientPortal,
        ...company,
    }));

    const [data, setData] = useState<IGenericRecord>(DEFAULT_PERSON_DATA);
    const [validate, setValidate] = useState<boolean>(false);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const [existingUserData, setExistingUserData] = useState<IGenericRecord>({});
    const [isEmailExisting, setIsEmailExisting] = useState(false);

    const { disabledInputs } = usePermissions();
    const { activeModal, propsImportClient, handleModal, ...propsContent } = useImportModal();
    const { countries, departments, cities } = useLocationOptions(data.department_id);
    const { isYes, propsRadio, setRadio, changeTitle, isYesOrNo } = useValidateLocation(
        data as ISupplier,
        setData,
        ModuleApp.ELECTRONIC_DOCUMENTS
    );

    const documentTypeOptions = useMemo(() => buildOptions(utils?.document_types), [utils]);
    const isSupplierLocation = useMemo(() => isYes && !isClient, [isYes]);
    const isValidateSupplier = useMemo(() => !isClient && validate, [validate]);

    const isColombia = data.country_name === COLOMBIA;

    const handleOptionChange = ({ value, ...option }: IGenericRecord, field: string): void => {
        const isDocumentType = field === FieldName.DocumentType;
        setData({
            ...data,
            ...(EMPTY_LOCATION_FIELDS[field] ?? {}),
            ...(LOCATION_KEYS[field] && { [LOCATION_KEYS[field]]: option.name }),
            ...(isDocumentType && { person_type: '' }),
            [field]: value,
        });
        if (isDocumentType) setDocumentType(option.id);
    };

    const handleTextChange = ({ target: { name, value } }: ChangeEvent): void => {
        setData({ ...data, [name]: value });
    };

    const documentType = useMemo(
        () => utils?.document_types?.find((item: IGenericRecord) => item.id === data?.document_type)?.name,
        [utils, data?.document_type]
    );

    const preventSaving = (): boolean => {
        return (
            (data?.country_id && !data?.country_name) ||
            (data?.country_id && validateEmptyFields(getRequiredFields(isColombia), data))
        );
    };

    const addClient = async (): Promise<IGenericRecord> => {
        if (data.customerId) {
            if (data.id) {
                delete data.id;
            }
            const filteredFiscalResponsibilities = data?.fiscal_responsibilities?.filter(
                (item: IGenericRecord) => item.id && item.id !== ''
            ) || [];
            const clientDataToUpdate = {
                ...data,
                fiscal_responsibilities: filteredFiscalResponsibilities,
            };
            const statusCode = await dispatch(updateClient(data?.client_id, clientDataToUpdate, data?.customerId));
            await dispatch(getClientsThin());
            return { statusCode: statusCode || SUCCESS_RESPONSE_CODE, data: { customer: { client_id: data.client_id } } };
        }
        const [option] = optionsTaxpayer;
        const response: IGenericRecord = await dispatch(
            createClient(formatPersonRequest({
                ...data,
                person_type: option.name,
                type_taxpayer_id: option.id,
                type_taxpayer_name: option.value,
            }, utils))
        );
        await dispatch(getClientsThin());
        return response;
    };

    const addSupplier = async (): Promise<IGenericRecord> => {
        if (data.id) {
            delete data.id;
            const success: IGenericRecord = await dispatch(
                putUpdateSupplier(data.supplier_id, formatSupplierRequest({ data, utils, user }))
            );
            await dispatch(getSuppliers(true));
            return { statusCode: success };
        }
        const success: IGenericRecord = await dispatch(postStoreSupplier(formatSupplierRequest({ data, utils, user }), false));
        await dispatch(getSuppliers(true));
        return success;
    };

    const resetData = (id = ''): void => {
        setData(DEFAULT_PERSON_DATA);
        toggleModal(id);
        setValidate(false);
    };

    const validateFields = (isClient = false): boolean => {
        const isFiscalResponsibilities = data?.fiscal_responsibilities[0]?.id;
        const isLocation = Object.keys(data).some(
            key => (REQUIRED_LOCATION_KEY.includes(key) || (isYes && REQUIRED_LOCATIONS_KEYS.includes(key))) && !data[key]
        );

        return (
            !data?.name ||
            !data?.document_number ||
            !data?.document_type ||
            (!isClient && (!isFiscalResponsibilities || !data?.person_type)) ||
            (!isClient && isLocation)
        );
    };

    const saveData = async (): Promise<void> => {
        if (
            (data?.country_id && preventSaving()) ||
            (data?.email && !validateEmail(data?.email)) ||
            (data?.email && isEmailExisting) ||
            validateFields(isClient)
        ) {
            scrollToInput();
            return setValidate(true);
        }
        const correctResponse = await (isClient ? addClient() : addSupplier());
        if (isCorrectResponse(correctResponse?.statusCode)) {
            resetData(isClient ? correctResponse?.data?.customer?.client_id : '');
        }
    };

    const currentForm = data.client_id ? Form.EditClient : Form.Client;
    const currentEdit = data.supplier_id ? Form.EditSupplier : Form.Supplier;
    const isEditView = currentEdit === Form.EditSupplier || currentForm === Form.EditClient;
    const { title, description } = INFORMATION[isClient ? currentForm : currentEdit];

    const tooltipText = TOOLTIP_DATA(isClient);
    const validateClient = async (file: string): Promise<void> => {
        const fieldsToValidate = ['document_number', 'document_type'];
        const { document_number, document_type, email } = data;

        if (!data[file]) return;

        const requestData =
            fieldsToValidate.includes(file) && document_number && document_type
                ? {
                      document_number,
                      document_type: documentTypeOptions.find(type => type.value === document_type)?.id ?? '',
                  }
                : { [file]: data[file] };

        if (fieldsToValidate.includes(file) && (!document_number || !document_type)) {
            return;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await dispatch(
                isClient ? validateExistence(requestData) : postExistDuplicateSupplier(requestData)
            );
            const isEmail = file === EMAIL;
            if (response.is_created) {
                if (isEmail && email === existingUserData.email) return;
                if ('supplier' in response) {
                    const isDifferentSupplier = response.supplier.id !== data.id;
                    if (isDifferentSupplier && isEmail) return setIsEmailExisting(true);
                    if (isDifferentSupplier) {
                        setExistingUserData(response.supplier);
                        setShowDuplicateWarning(true);
                    }
                }
                if ('customer' in response) {
                    const isDifferentCustomer = response.customer.id !== data.id;
                    if (isDifferentCustomer && isEmail) return setIsEmailExisting(true);
                    if (isDifferentCustomer) {
                        setExistingUserData(response.customer);
                        setShowDuplicateWarning(true);
                    }
                }
            } else if (isEmail) {
                setIsEmailExisting(false);
            }
        } catch (error) {
            console.error('Error validating client:', error);
        }
    };

    const assignToSupplier = async (id: string): Promise<void> => {
        const supplier = ((await dispatch(getSupplier(id))) as unknown) as ISupplierResponse;
        if (!supplier) return;
        setData({
            ...AssignDataToObject(
                {
                    ...KEY_ASSIGN_SUPPLIER,
                    tax_detail: 'tax_details_name',
                    person_type: 'person.type_taxpayer_name',
                },
                supplier
            ),
            company_id: information?.id,
        });
        setRadio(isYesOrNo(supplier.person.country_id));
    };

    const sendEditClient = async (): Promise<void> => {
        setShowDuplicateWarning(false);
        if (existingUserData.client_id && isClient) dispatch(getClientById(existingUserData.client_id));
        if (existingUserData.id && !isClient) history.push(`?form=${Form.EditSupplier}&id=${existingUserData.id}`);
        setExistingUserData({});
    };

    const setClient = (client: IGenericRecord): void => {
        const {
            customer,
            customer: {
                person,
                person: {
                    fiscalResposibilities = DEFAULT_PERSON_DATA.fiscal_responsibilities,
                    country_name,
                    type_taxpayer_name,
                    document_type,
                },
                client_id,
                id,
                tax_details_name,
            },
        } = client;
        const countryId = countries.find(item => item.name === country_name)?.value;
        setData({
            ...customer,
            ...person,
            fiscal_responsibilities: fiscalResposibilities.map((item: IGenericRecord) => ({
                ...item,
                id: String(item?.id),
            })),
            document_type,
            customerId: id,
            country_id: countryId,
            customerClientId: client_id,
            tax_detail: tax_details_name,
            person_type: type_taxpayer_name,
        });
        setDocumentType(document_type);
    };

    const switchModal = (key: string): JSX.Element => {
        switch (key) {
            case ModalImport.ConsultClient:
                return <ConsultClient {...propsContent.propsConsultClient} />;
            case ModalImport.ImportClient:
                return (
                    <ImportClient {...propsImportClient} onClickRight={(): void => propsImportClient.onClickRight(setClient)} />
                );
            case ModalImport.Warning:
                return (
                    <Warning
                        {...propsContent.propsWarning}
                        onClickRight={(): void => toggleModal(propsImportClient.fieldValue.client_id || '', true)}
                    />
                );
            default:
                return <Error {...propsContent.propsError} />;
        }
    };

    const titleInput = (): string => {
        if (isClient) return '*Nombre del cliente o empresa:';
        return `*Nombre del proveedor:`;
    };

    const backToPage = (): void => {
        setData(DEFAULT_PERSON_DATA);
        setValidate(false);
        if (backAddUser) return backAddUser();
        history.goBack();
    };

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    useEffect(() => {
        if (clientSelected.customer) setClient(clientSelected);
    }, [clientSelected]);

    useEffect(() => {
        if (!queryParam) return;
        assignToSupplier(queryParam);
    }, [queryParam]);

    useEffect(() => {
        if (!isClient && !queryParam)
            setData({ ...data, ...INPUTS_RESET_LOCATION, country_id: COLOMBIA_ID, country_name: COLOMBIA });
    }, [countries]);

    const documentTypeOptionsRender = documentTypeOptions.map(item => ({ ...item, name: item.value }));
    const optionsTaxpayerRender = buildOptions(optionsTaxpayer).map(item => ({ ...item, name: item.value }));
    const taxDetailsOptionsRender = utils?.tax_details?.map((item: IGenericRecord) => ({ ...item, name: item.value }));

    return (
        <div>
            {activeModal && (
                <Modal
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-${activeModal}`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.MDL,
                    })}
                    open
                    modalClassName="shared-modal"
                    handleClose={(): void => handleModal('')}
                >
                    <article className="shared-modal__content w-max xs:w-full">{switchModal(activeModal)}</article>
                </Modal>
            )}
            <article className="flex justify-between">
                <section>
                    <h2 className="text-lg font-allerbold text-blue">{title}</h2>
                    <p className="text-gray-dark mt-2 mb-4.5">{description}</p>
                </section>
                {isClient && !isEditView && (
                    <Button
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person`,
                            action: ActionElementType.SEARCH,
                            elementType: ElementType.BTN,
                        })}
                        background="green"
                        classes="import-button"
                        tooltip={TOOLTIP_BUTTON}
                        text="Base de datos DIAN"
                        onClick={(): void => handleModal(ModalImport.ConsultClient)}
                    />
                )}
            </article>
            <form>
                <fieldset className="bg-white rounded-lg py-4.5 px-2.5">
                    <h2 className="font-allerbold text-gray-dark mb-4.5">Información básica</h2>
                    <div className="flex gap-x-7 gap-y-4.5 mb-4.5 flex-wrap px-2">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-name`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText={titleInput()}
                            value={data?.name}
                            onChange={handleTextChange}
                            name={FieldName.ClientName}
                            type="text"
                            required={validate && !data?.name}
                            lettersWithAccent
                            placeholder="..."
                            maxLength={InputFieldsLimits.ClientName}
                            {...tooltipText[FieldName.ClientName]}
                            disabled={disabledInputs}
                        />
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-document-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="*Tipo de documento:"
                            valueSelect={documentType}
                            optionSelect={documentTypeOptionsRender}
                            classesWrapper="w-73"
                            onChangeSelect={(_, option): void => handleOptionChange(option, FieldName.DocumentType)}
                            required={validate && !data?.document_type}
                            {...tooltipText[FieldName.DocumentType]}
                            classesWrapperInput={`${data.client_id ? 'border_none' : ''}`}
                            disabled={disabledInputs || isEditView}
                        />
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-document-number`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="*Número de documento:"
                            value={data?.document_number}
                            onChange={handleTextChange}
                            name={FieldName.DocumentNumber}
                            required={validate && !data?.document_number}
                            maxLength={InputFieldsLimits.DocumentNumber}
                            onlyNumbers
                            placeholder="..."
                            {...tooltipText[FieldName.DocumentNumber]}
                            onBlur={(): Promise<void> => validateClient('document_number')}
                            requiredText="*Campo obligatorio"
                            classesWrapperInput={`${data.client_id ? 'border_none' : ''}`}
                            disabled={disabledInputs || isEditView}
                        />
                        {isClient && !isEditView && (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-name-legal-representative`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Nombre del representante legal:"
                                maxLength={InputFieldsLimits.ClientName}
                                value={data?.name_legal_representative}
                                onChange={handleTextChange}
                                name={FieldName.NameLegal}
                                classesWrapper="w-73"
                                lettersWithAccent
                                type="text"
                            />
                        )}
                    </div>
                </fieldset>
                <fieldset className="bg-white rounded-lg py-4.5 px-2.5 my-4.5">
                    <h2 className="font-allerbold text-gray-dark mb-4.5">Información de contacto</h2>
                    {!isClient && <RadioButton {...propsRadio} />}
                    <div className="flex gap-x-7 gap-y-4.5 mb-4.5 flex-wrap px-2">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-address`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText={changeTitle(isSupplierLocation, ADDRESS)}
                            required={isSupplierLocation && data?.address}
                            maxLength={InputFieldsLimits.Direction}
                            {...tooltipText[FieldName.Address]}
                            onChange={handleTextChange}
                            disabled={disabledInputs}
                            name={FieldName.Address}
                            value={data?.address}
                            placeholder="..."
                        />
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-country`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            onChangeSelect={(_, option): void => handleOptionChange(option, FieldName.CountryId)}
                            required={isValidateSupplier && !data?.country_id}
                            disabled={disabledInputs || isSupplierLocation}
                            labelText={changeTitle(!isClient, COUNTRY)}
                            {...tooltipText[FieldName.CountryId]}
                            valueSelect={data?.country_id}
                            placeholder="Seleccionar"
                            optionSelect={countries}
                        />
                        {isColombia ? (
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-department`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                onChangeSelect={(_, option): void => handleOptionChange(option, FieldName.DepartmentId)}
                                classesWrapper={`${data?.department_name ? 'select--dark-placeholder' : ''} w-73`}
                                labelText={changeTitle(isSupplierLocation, DEPARTMENT)}
                                required={isValidateSupplier && !data?.department_id}
                                disabled={!data?.country_id || disabledInputs}
                                {...tooltipText[FieldName.DepartmentId]}
                                valueSelect={data?.department_id}
                                optionSelect={departments}
                                placeholder="Seleccionar"
                            />
                        ) : (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-department`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText={changeTitle(isSupplierLocation, DEPARTMENT)}
                                {...tooltipText[FieldName.DepartmentId]}
                                name={FieldName.DepartmentName}
                                value={data?.department_name}
                                onChange={handleTextChange}
                                disabled={disabledInputs}
                                placeholder="..."
                            />
                        )}
                        {isColombia ? (
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-city`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                onChangeSelect={(_, option): void => handleOptionChange(option, FieldName.CityId)}
                                classesWrapper={`${data?.city_name ? 'select--dark-placeholder' : ''} w-73`}
                                labelText={changeTitle(isSupplierLocation, CITY)}
                                disabled={!data?.department_id || disabledInputs}
                                required={isValidateSupplier && !data?.city_id}
                                {...tooltipText[FieldName.CityId]}
                                valueSelect={data?.city_id}
                                placeholder="Seleccionar"
                                optionSelect={cities}
                            />
                        ) : (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-city`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                required={isValidateSupplier && !data?.city_name}
                                labelText={changeTitle(!isClient, CITY)}
                                {...tooltipText[FieldName.CityId]}
                                onChange={handleTextChange}
                                disabled={disabledInputs}
                                name={FieldName.CityName}
                                value={data?.city_name}
                                placeholder="..."
                            />
                        )}

                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-postal-code`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            maxLength={InputFieldsLimits.PostalCode}
                            {...tooltipText[FieldName.PostalCode]}
                            onChange={handleTextChange}
                            name={FieldName.PostalCode}
                            labelText="Código postal:"
                            value={data?.postal_code}
                            disabled={disabledInputs}
                            placeholder="..."
                            onlyNumbers
                        />
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-phone`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Teléfono:"
                            onlyNumbers
                            value={data?.phone || data.cellphone}
                            onChange={handleTextChange}
                            name={FieldName.Phone}
                            maxLength={InputFieldsLimits.Phone}
                            placeholder="..."
                            {...tooltipText[FieldName.Phone]}
                            disabled={disabledInputs}
                        />
                        <TextInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-email`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Correo electrónico:"
                            value={data?.email}
                            name={FieldName.Email}
                            onChange={handleTextChange}
                            type="email"
                            placeholder="..."
                            required={isEmailExisting || (validate && !validateEmail(data?.email))}
                            requiredText={`${
                                isEmailExisting
                                    ? '*El correo electrónico ingresado ya está en uso'
                                    : '*Ingrese un correo electrónico valido'
                            }`}
                            disabled={disabledInputs}
                            onBlur={(): Promise<void> => validateClient(EMAIL)}
                            limitCharacters={false}
                        />
                    </div>
                </fieldset>
                <fieldset className="bg-white rounded-lg py-4.5 px-2.5">
                    <h2 className="font-allerbold text-gray-dark mb-4.5">Detalles tributarios</h2>
                    <div className="flex flex-col lg:flex-row gap-x-7 gap-y-4.5 mb-4.5 flex-wrap lg:px-2">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-person-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            onChangeSelect={(_, option): void => handleOptionChange(option, FieldName.PersonType)}
                            {...propsToPersonType(validate, isClient, data?.person_type)}
                            classesWrapper="company-information__field w-73"
                            {...tooltipText[FieldName.PersonType]}
                            optionSelect={optionsTaxpayerRender}
                            valueSelect={data?.person_type}
                            disabled={disabledInputs}
                        />
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person-tax-detail`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText="Detalle de impuesto:"
                            optionSelect={taxDetailsOptionsRender}
                            valueSelect={data?.tax_detail}
                            onChangeSelect={(_, option): void => handleOptionChange(option, FieldName.TaxDetail)}
                            classesWrapper="company-information__field w-73"
                            {...tooltipText[FieldName.TaxDetail]}
                            disabled={disabledInputs}
                        />
                    </div>
                    <div className="flex flex-col gap-4.5 lg:px-2">
                        <TaxResponsibilities
                            isClient={isClient}
                            data={data}
                            handleDataChange={(data: IGenericRecord): void => setData(data)}
                            fiscalOptions={utils?.fiscal_responsibilities}
                            validate={!isClient ? validate : false}
                        />
                    </div>
                </fieldset>
            </form>
            <ModalWarningClientOrSupplier
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `${ModuleApp.ELECTRONIC_INVOICE}-add-person`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                show={showDuplicateWarning}
                dataClientOrSupplier={existingUserData as IDataClientOrSupplier}
                closeModal={(): void => {
                    setShowDuplicateWarning(!showDuplicateWarning);
                    setData(data => ({ ...data, document_number: '' }));
                }}
                documentTypes={utils?.document_types}
                editClient={sendEditClient}
                isSupplier={!isClient}
            />
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.ELECTRONIC_DOCUMENTS,
                    history,
                    saveData,
                    {
                        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    TitleButtons.SAVE
                )}
                disabledRight={disabledInputs}
                onClickButtonLeft={backToPage}
            />
        </div>
    );
};
