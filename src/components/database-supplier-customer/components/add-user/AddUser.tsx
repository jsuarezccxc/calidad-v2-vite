/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { urls } from '@api/urls';
import { TextInput, FileInput, IFile, IOptionSelect, DEFAULT_REQUIRED_TEXT, SelectSearchInput } from '@components/input';
import { Form } from '@components/form';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { ModalType } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { RadioButton } from '@components/radiobutton';
import { IDataClientOrSupplier, ModalWarningClientOrSupplier } from '@components/modal-custom';
import { CUSTOMER, SUPPLIER } from '@components/database-supplier-customer';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { ResolutionFields, Withholdings } from '@components/electronic-documents/tax-responsibilities';
import { IGenericRecord } from '@models/GenericRecord';
import { ISupplier, ISupplierExistResponse } from '@models/Supplier';
import { Field } from '@models/PaymentPlans';
import { IRequiredProps } from '@models/EditUser';
import { RootState } from '@redux/rootReducer';
import { getClientById } from '@redux/client-portal/actions';
import { postExistDuplicateSupplier } from '@redux/suppliers/actions';
import { validateCustomerFile, validateExistence } from '@redux/clients/actions';
import useParam from '@hooks/useParam';
import usePermissions from '@hooks/usePermissions';
import useTaxpayerType from '@hooks/useTaxpayerType';
import useValidateLocation from '@hooks/useValidateLocation';
import useDigitVerification from '@hooks/useDigitVerification';
import { QueryParamSupplier } from '@pages/supplier-database';
import { QueryParamCustomer } from '@pages/customer-database';
import { Routes } from '@constants/Paths';
import { EMAIL } from '@constants/UserManagement';
import { IS_EMAIL_EXISTS, REQUIRED_FIELD, VALIDATE_EMAIL_FORMAT } from '@constants/FieldsValidation';
import { DEFAULT_RESPONSIBILITY, NATURAL_RESPONSIBILITIES, WITHHOLDINGS } from '@constants/ElectronicInvoice';
import { ADDRESS, CITY, COUNTRY, DEPARTMENT, REQUIRED_LOCATIONS_KEYS, REQUIRED_LOCATION_KEY } from '@constants/Location';
import { LEGAL_PERSON, NATURAL_PERSON_MERCHANT, SELF_RETAINING, SINGLE_TAX_RESPONSIBILITIES } from '@constants/DynamicRequest';
import { formatString } from '@utils/Date';
import { getRouteName } from '@utils/Paths';
import { validateEmail } from '@utils/Validation';
import { buttonsFooterProps } from '@utils/Button';
import { isCorrectResponse } from '@utils/Response';
import { numericsInput } from '@utils/SpecialCharacters';
import { removeSpecialCharactersNumbers } from '@utils/Text';
import { propsToPersonType, toggleWithholdings } from '@utils/ElectronicInvoice';
import { buildOptions, buildOptionsSearch } from '@utils/Company';
import { lengthGreaterThanOne, lengthGreaterThanZero } from '@utils/Length';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { findItemOption } from '@utils/Array';
import {
    IAddSupplierProps,
    IUserData,
    SUPPLIER_INITIAL,
    routesAddSupplier,
    KEY_SELECT_INPUT,
    SelectAddSupplier,
    SupplierName,
    COLOMBIA_ID,
    getEntitiesUser,
    FISCAL_RESPONSIBILITIES,
    KEY_SELECT_INPUT_NAME,
    TOOLTIP_PROPS,
    ZERO_FILE,
    MAX_LENGTH_TEXT,
    MAX_LENGTH_NUMBER,
    MAX_LENGTH_NUMBER_CO,
    MAX_LENGTH_DOCUMENT_NUMBER,
    NAME_INPUT,
    SELECT_DEFAULT,
    SELECT,
    NATURAL_PERSON,
    DATE,
    ADD_USER,
    validationText,
    FISCAL_RESPONSIBILITY_CODES,
    RESOLUTION_REQUIRED_PREFIXES,
    IValidateResponse,
    ICustomerExistResponse,
    REQUIRED_FIELDS,
    TYPE_TAXPAYER_NAME,
} from '.';
import './AddUser.scss';

export const AddUser: React.FC<IAddSupplierProps> = ({
    isSupplierEdit,
    saveUser,
    title,
    pageRoute,
    showModalSave,
    setShowModalSave,
    editData,
    handleAddSupplier,
    handleSetSupplierEdit,
    editUser,
}) => {
    const [dispatch, history, { fiscal_responsibilities }] = [useDispatch(), useHistory(), SUPPLIER_INITIAL];
    const { queryParam } = useParam('name');
    const { disabledInputs } = usePermissions();
    const { DocumentType } = SupplierName;
    const { utils } = useSelector(({ utils }: RootState) => ({
        ...utils,
    }));

    const { optionsTaxpayer, setDocumentType } = useTaxpayerType();

    const [addUser, setAddUser] = useState(SelectAddSupplier.AddDiggiPymes);
    const [userData, setUserData] = useState<IUserData | IGenericRecord>({ ...SUPPLIER_INITIAL });
    const [file, setFile] = useState<IFile>([{ name: 'supplierExcel', files: [] }]);
    const [validateUser, setValidateUser] = useState<boolean>(false);
    const [userDataFile, setUserDataFile] = useState<IGenericRecord[]>([]);
    const [validateFileErrors, setValidateFileErrors] = useState('');
    const [isValidateFile, setIsValidateFile] = useState(false);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const [existingUserData, setExistingUserData] = useState<IGenericRecord>({});
    const [isEmailExisting, setIsEmailExisting] = useState(false);
    const colorText = validateFileErrors ? 'text-purple' : 'text-green';

    const { isYes, propsRadio, setRadio, changeTitle, isYesOrNo } = useValidateLocation(
        userData as ISupplier,
        setUserData,
        ModuleApp.ACCOUNT_ACCREDITATION
    );

    const isSupplierView = useMemo(() => title.singular.includes('proveedor'), [title.singular]);
    const isSupplierLocation = useMemo(() => isYes && isSupplierView, [isYes, isSupplierView]);
    const isValidateSupplier = useMemo(() => isSupplierView && validateUser, [validateUser, isSupplierView]);

    const { isTypeNit, digitVerification, setTypeDocument, setDocumentNumber } = useDigitVerification(
        userData?.document_name,
        userData?.document_number
    );

    useEffect(() => {
        if (editData && isSupplierEdit) {
            setRadio(isYesOrNo(editData?.country_id));
            setDocumentType(editData?.document_type);
            return setUserData(editData);
        }
        setUserData(SUPPLIER_INITIAL);
    }, [editData, isSupplierEdit]);

    useEffect(() => {
        if (userData.document_type) validateClient('document_type');
    }, [userData.document_type]);

    const getCities = (): IGenericRecord[] => {
        if (!userData?.department_id) {
            return utils?.cities;
        }
        return utils?.cities?.filter((item: IGenericRecord) => item.department_id === userData?.department_id?.toString());
    };

    const handleSupplierData = (option: IGenericRecord): void => {
        const { value, name } = option.target;
        if (name === Field.DocumentNumber) setDocumentNumber(value);
        setUserData({
            ...userData,
            [name]: name === NAME_INPUT ? removeSpecialCharactersNumbers(value) : value,
        });
    };

    const handleSearchSupplier = (option: IGenericRecord, nameSelect: string): void => {
        const { value, name, id } = option;
        const isDocumentType = nameSelect === DocumentType;
        if (isDocumentType) {
            setDocumentType(id);
            setTypeDocument(value);
            setUserData({
                ...userData,
                [nameSelect]: id,
                type_taxpayer_id: '',
                type_taxpayer_name: '',
                fiscal_responsibilities: [{ id_fiscal: uuid(), ...DEFAULT_RESPONSIBILITY }],
            });

            return;
        }
        setUserData({ ...userData, [nameSelect]: value, [KEY_SELECT_INPUT_NAME[nameSelect]]: name === SELECT ? '' : name });
    };

    const handleSelectSupplier = (option: IOptionSelect, name: string, idFiscal = ''): void => {
        const { id = '', value = '', code = '' } = option;
        if (name !== FISCAL_RESPONSIBILITIES) {
            setUserData({
                ...userData,
                [name]: (!code ? id : code).toString(),
                [KEY_SELECT_INPUT[name]]: value === SELECT ? '' : value,
                fiscal_responsibilities:
                    SupplierName.TypeTaxpayerId === name ? fiscal_responsibilities : userData.fiscal_responsibilities,
            });
            return;
        }
        if (SINGLE_TAX_RESPONSIBILITIES.includes(value)) {
            return setUserData({ ...userData, fiscal_responsibilities: [{ ...option, id: String(id), name: value }] });
        }
        setUserData({
            ...userData,
            fiscal_responsibilities: userData?.fiscal_responsibilities?.map((item: IGenericRecord) => {
                if (item?.id_fiscal.toString() === idFiscal.toString()) return { ...item, id: id?.toString() || '', name: value };
                return item;
            }),
        });
    };

    const addFiscalResponsibilities = (): void => {
        setUserData({
            ...userData,
            fiscal_responsibilities: [...userData.fiscal_responsibilities, { id_fiscal: uuid(), ...DEFAULT_RESPONSIBILITY }],
        });
    };

    const getOptionFiscalResponsibilities = (): IOptionSelect[] => {
        const { type_taxpayer_name } = userData;
        const filtered =
            utils?.fiscal_responsibilities?.filter((item: IGenericRecord) => {
                if (type_taxpayer_name === NATURAL_PERSON) {
                    return [FISCAL_RESPONSIBILITY_CODES.NOT_APPLICABLE, FISCAL_RESPONSIBILITY_CODES.SIMPLE_REGIME].includes(
                        item.code
                    );
                }
                if ([LEGAL_PERSON, NATURAL_PERSON_MERCHANT].includes(type_taxpayer_name)) {
                    return [
                        FISCAL_RESPONSIBILITY_CODES.GC,
                        FISCAL_RESPONSIBILITY_CODES.SELF_RETAINING,
                        FISCAL_RESPONSIBILITY_CODES.VAT_AGENT,
                        FISCAL_RESPONSIBILITY_CODES.SIMPLE_REGIME,
                    ].includes(item.code);
                }
                return false;
            }) || [];
        return buildOptions(filtered);
    };

    const handleSaveUser = (): void => {
        setValidateUser(true);
        if (isEmailExisting) return;
        if (addUser === SelectAddSupplier.AddDiggiPymes) {
            let areFiscalResponsibilitiesValid = true;
            if (title.singular === SUPPLIER) {
                areFiscalResponsibilitiesValid = userData.fiscal_responsibilities.every((resp: IGenericRecord) => {
                    const isValidName = !!resp.name;

                    const requiresResolution = RESOLUTION_REQUIRED_PREFIXES.includes(resp.code);
                    const isValidResolution = requiresResolution ? !!resp.number_resolution && !!resp.date : true;

                    const isSelfRetaining = resp.code === FISCAL_RESPONSIBILITY_CODES.SELF_RETAINING;
                    const isValidWithholdings = isSelfRetaining ? lengthGreaterThanZero(resp?.withholdings) : true;

                    const isSimpleRegime = resp.code === FISCAL_RESPONSIBILITY_CODES.SIMPLE_REGIME;
                    const hasInvalidCombination = isSimpleRegime && lengthGreaterThanOne(userData?.fiscal_responsibilities);

                    return isValidName && isValidResolution && isValidWithholdings && !hasInvalidCombination;
                });
            }
            const validateLocation = Object.keys(userData).some(
                key =>
                    (REQUIRED_LOCATION_KEY.includes(key) || (isYes && REQUIRED_LOCATIONS_KEYS.includes(key))) &&
                    !userData[key as keyof IUserData]
            );
            if (isSupplierView && validateLocation) return;
            if (
                REQUIRED_FIELDS.filter(key => !isSupplierView && key !== TYPE_TAXPAYER_NAME).every(
                    key => !!userData[key as keyof IUserData]
                ) &&
                areFiscalResponsibilitiesValid
            ) {
                let data = { ...userData };
                if (!isSupplierView && !userData.type_taxpayer_id) {
                    const [option] = optionsTaxpayer;
                    data = {
                        ...data,
                        type_taxpayer_id: option.id,
                        type_taxpayer_name: option.value,
                    };
                }
                saveUser(data);
            }
            return;
        }
        if (!validateFileErrors && isValidateFile && userDataFile.length) {
            saveUser(userDataFile);
        }
    };

    const cities = getCities();
    const fiscalResponsibilities = getOptionFiscalResponsibilities();

    const validateFile = async (): Promise<void> => {
        setIsValidateFile(true);
        if (file[ZERO_FILE]?.files.length) {
            const { data, statusCode }: any = await dispatch(
                validateCustomerFile(file[ZERO_FILE]?.files[ZERO_FILE], title.singular)
            );

            if (data?.errors?.length) {
                setValidateFileErrors(
                    data?.errors
                        ?.map((item: IGenericRecord) => ` columna ${item?.column} fila ${item?.row}: ${item.error}`)
                        .join(',')
                );
                return;
            }

            if (
                !isCorrectResponse(statusCode) ||
                (data?.errors?.length && (title.singular === CUSTOMER ? !data?.customers?.length : !data?.suppliers?.length))
            ) {
                setValidateFileErrors('Error al validar, ingrese un archivo correcto');
                return;
            }

            setUserDataFile(data?.customers || data?.suppliers);
            setValidateFileErrors('');
        }
    };

    const deleteFiscalResponsibilities = (id: string): void => {
        setUserData({
            ...userData,
            fiscal_responsibilities: userData.fiscal_responsibilities.filter(
                (item: IGenericRecord) => (item?.id || item?.id_fiscal) !== id
            ),
        });
    };

    const typeTaxpayerOptions = buildOptions([
        ...(utils?.tax_details?.map((item: IGenericRecord) => ({ ...item, name: `${item?.code} - ${item?.value}` })) ?? []),
        SELECT_DEFAULT,
    ]);

    const handleValidationResponse = ({ email, file, response }: IValidateResponse): void => {
        if (response.is_created) {
            if (file === EMAIL && editData?.email === email) return;

            if (file === EMAIL) {
                setIsEmailExisting(true);
            } else {
                if ('supplier' in response) setExistingUserData(response.supplier as IGenericRecord);
                if ('customer' in response) setExistingUserData(response.customer);
                setShowDuplicateWarning(true);
            }
        } else if (file === EMAIL) {
            setIsEmailExisting(false);
        }
    };

    const createRequestData = (
        file: keyof IUserData,
        document_number: string | undefined,
        document_type: string | undefined
    ): { [key: string]: string } | null => {
        const fieldsToValidate = ['document_number', 'document_type'];

        if (fieldsToValidate.includes(file) && document_number && document_type) {
            return { document_number, document_type };
        } else if (!fieldsToValidate.includes(file)) {
            return { [file]: userData[file] };
        }
        return null;
    };

    const validateClient = async (file: keyof IUserData): Promise<void> => {
        if (editData?.client_id) return;

        const { document_number, document_type, email } = userData;

        if (!userData[file]) return;

        const requestData = createRequestData(file, document_number, document_type);

        if (!requestData) return;

        try {
            let response: ICustomerExistResponse | ISupplierExistResponse;
            if (isSupplierView) {
                response = ((await dispatch(postExistDuplicateSupplier(requestData))) as unknown) as ISupplierExistResponse;
            } else {
                response = ((await dispatch(validateExistence(requestData))) as unknown) as ICustomerExistResponse;
            }
            handleValidationResponse({ response, file, email });
        } catch (error) {
            console.error('Error validating client:', error);
        }
    };

    const sendEditClient = async (): Promise<void> => {
        editUser();
        isSupplierView ? handleSetSupplierEdit(existingUserData.id) : dispatch(getClientById(existingUserData.client_id || ''));
        handleAddSupplier(isSupplierView ? QueryParamSupplier.EditSupplier : QueryParamCustomer.EditCustomer);
        setShowDuplicateWarning(false);
        setExistingUserData({});
    };

    const {
        name,
        documentType,
        documentNumber,
        address,
        country,
        department,
        city,
        postalCode,
        phone,
        typeTaxpayer,
        taxDetails,
        responsibility,
    } = TOOLTIP_PROPS[title.singular];

    const nameIcon = validateFileErrors ? 'infoPurple' : 'checkGreen';

    const enableTaxButton = (index: number): boolean => {
        if (!fiscalResponsibilities.length) return false;
        return (
            userData.fiscal_responsibilities[index].name &&
            userData.type_taxpayer_id &&
            userData?.fiscal_responsibilities.every(
                ({ name }: IGenericRecord) => name && !SINGLE_TAX_RESPONSIBILITIES.includes(name)
            )
        );
    };

    const handleResolutionChange = ({ value, name }: IGenericRecord, itemIndex: number): void => {
        const valueFormatted = name === DATE ? formatString(value) : numericsInput(value);
        setUserData(data => ({
            ...data,
            fiscal_responsibilities: data.fiscal_responsibilities.map((item: IGenericRecord, index: number) => ({
                ...item,
                [name]: itemIndex === index ? valueFormatted : item[name],
            })),
        }));
    };

    const selectRetention = (retention: string, itemIndex: number): void => {
        setUserData(data => ({
            ...data,
            fiscal_responsibilities: data.fiscal_responsibilities.map(
                ({ withholdings, ...item }: IGenericRecord, index: number) => ({
                    ...item,
                    withholdings:
                        index === itemIndex ? toggleWithholdings(withholdings || WITHHOLDINGS, retention) : withholdings,
                })
            ),
        }));
    };

    const returnNameScreen = (): string => (isSupplierEdit ? `Editar ${title.singular}` : `Agregar ${title.singular}`);

    const descriptionByModule = (): { text: string; marginTop: string } => {
        const text = isSupplierEdit
            ? `Agregue la información requerida para modificar su ${title.singular} en ficha técnica.`
            : `Ingrese la información requerida para agregar su ${title.singular} a la ficha técnica, permitiendo su uso en el módulo de Documentos electrónicos.`;

        const marginTop = isSupplierEdit ? 'mt-4.5' : '';

        return { text, marginTop };
    };

    const urlBySingular = (): string =>
        title.singular === CUSTOMER ? urls.clients.masiveCreateClients : urls.suppliers.masiveCreateSuppliers;

    const requiredSupplierExcel = (): boolean => (isValidateFile || validateUser) && !file[ZERO_FILE]?.files?.length;

    const showErrorsLoad = (): boolean =>
        (!!userDataFile?.length || !!validateFileErrors) && !!file[ZERO_FILE]?.files?.length && isValidateFile;

    const titleInput = (): string => {
        if (!isSupplierView) return '*Nombre del cliente o empresa:';
        return `*Nombre del ${title.singular}:`;
    };

    const validateRequiredEmail = ({ email }: IUserData | IGenericRecord): IRequiredProps => {
        const isCorrectFormatEmail = email && !validateEmail(email);
        let requiredText = REQUIRED_FIELD;
        if (isEmailExisting) requiredText = IS_EMAIL_EXISTS;
        if (isCorrectFormatEmail) requiredText = VALIDATE_EMAIL_FORMAT;
        return {
            required: isCorrectFormatEmail || isEmailExisting || (!email && validateUser),
            requiredText,
        };
    };

    const renderBasicInformation = (userData: IGenericRecord): React.ReactElement => {
        return (
            <Form sendWithEnter className="flex gap-4.5 flex-col card-add-supplier">
                <h3 className="text-gray-dark font-allerbold">Información básica</h3>
                <div className="flex gap-4.5 flex-wrap xs:flex-col">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-name',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="name"
                        labelText={titleInput()}
                        classesWrapper="w-full lg:w-73"
                        placeholder="..."
                        value={userData.name}
                        onChange={handleSupplierData}
                        maxLength={MAX_LENGTH_TEXT}
                        tooltipInfo
                        titleTooltip={name.title}
                        descTooltip={name.description}
                        required={validateUser && !userData.name}
                        requiredText={DEFAULT_REQUIRED_TEXT}
                        type="text"
                        lettersWithAccent
                        onPaste={handleSupplierData}
                        disabled={disabledInputs}
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-document-type',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="*Tipo de documento:"
                        placeholder="Seleccionar"
                        optionSelect={buildOptions(utils?.document_types).map(item => ({
                            ...item,
                            id: item.id,
                            name: item.value,
                        }))}
                        classesWrapper="w-full lg:w-73"
                        name="document_type"
                        onChangeSelect={(_, option): void => handleSearchSupplier(option, SupplierName.DocumentType)}
                        selectIconType="arrowDownGreen"
                        valueSelect={
                            userData?.document_name ||
                            utils?.document_types?.find((item: IGenericRecord) => item.id === userData.document_type)?.name
                        }
                        selectTextClass="sales-report__select"
                        tooltipInfo
                        titleTooltip={documentType.title}
                        descTooltip={documentType.description}
                        required={validateUser && !userData.document_type}
                        requiredText={DEFAULT_REQUIRED_TEXT}
                        disabled={disabledInputs || isSupplierEdit}
                        classesWrapperInput={`${isSupplierEdit ? 'border_none' : ''}`}
                    />
                    <div className="flex">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                submodule: 'add-document-number',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="document_number"
                            labelText="*Número de documento:"
                            classesWrapper={isTypeNit ? 'w-full lg:w-57 mr-2' : 'w-full lg:w-73'}
                            placeholder="..."
                            value={userData.document_number}
                            onChange={handleSupplierData}
                            maxLength={MAX_LENGTH_DOCUMENT_NUMBER}
                            tooltipInfo
                            titleTooltip={documentNumber.title}
                            descTooltip={documentNumber.description}
                            required={validateUser && !userData.document_number}
                            requiredText={DEFAULT_REQUIRED_TEXT}
                            integerNumbers
                            disabled={disabledInputs || isSupplierEdit}
                            onBlur={(): Promise<void> => validateClient('document_number')}
                            classesWrapperInput={`${isSupplierEdit ? 'border_none' : ''}`}
                        />
                        {isTypeNit && (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                    submodule: 'add-dv',
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
                    {!isSupplierView && (
                        <TextInput
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                submodule: 'add-name-legal-representative',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            value={userData?.name_legal_representative}
                            labelText="Nombre del representante legal:"
                            name="name_legal_representative"
                            onChange={handleSupplierData}
                            maxLength={MAX_LENGTH_TEXT}
                            disabled={disabledInputs}
                            classesWrapper="w-full lg:w-73"
                            lettersWithAccent
                        />
                    )}
                </div>
            </Form>
        );
    };

    const renderInformationContact = (userData: IGenericRecord, citiesList: IGenericRecord[]): React.ReactElement => {
        return (
            <Form sendWithEnter className="flex gap-4.5 flex-col card-add-supplier">
                <h3 className="text-gray-dark font-allerbold">Información de contacto</h3>
                {isSupplierView && <RadioButton {...propsRadio} />}
                <div className="flex gap-4.5 flex-wrap xs:w-full">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-address',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="address"
                        labelText={changeTitle(isSupplierLocation, ADDRESS)}
                        classesWrapper="w-full lg:w-73"
                        placeholder="..."
                        value={userData.address}
                        tooltipInfo
                        disabled={disabledInputs}
                        maxLength={MAX_LENGTH_TEXT}
                        titleTooltip={address.title}
                        onChange={handleSupplierData}
                        descTooltip={address.description}
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-country',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText={changeTitle(isSupplierView, COUNTRY)}
                        placeholder={userData?.country_name ? userData?.country_name : 'Seleccionar'}
                        optionSelect={buildOptionsSearch(utils?.countries)}
                        valueSelect={userData?.country_id}
                        onChangeSelect={(_, option): void => handleSearchSupplier(option, SupplierName.CountryId)}
                        tooltipInfo
                        titleTooltip={country.title}
                        descTooltip={country.description}
                        name="country"
                        classesWrapper="w-73 xs:w-full"
                        classNameMain="w-73 xs:w-full"
                        selectIconType="arrowDownGreen"
                        selectTextClass="sales-report__select"
                        classesWrapperInput={`bg-white ${userData?.country_name ? 'placeholder-dark' : ''}`}
                        disabled={disabledInputs || isSupplierLocation}
                        required={isValidateSupplier && !userData?.country_id}
                    />

                    {userData.country_id === COLOMBIA_ID ? (
                        <>
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                    submodule: 'add-department',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                labelText={changeTitle(isSupplierLocation, DEPARTMENT)}
                                placeholder={userData?.department_name ? userData?.department_name : 'Seleccionar'}
                                optionSelect={buildOptionsSearch([...(utils?.departments || []), SELECT_DEFAULT])}
                                valueSelect={userData?.department_id}
                                onChangeSelect={(_, option): void => handleSearchSupplier(option, SupplierName.DepartmentId)}
                                tooltipInfo
                                titleTooltip={department.title}
                                descTooltip={department.description}
                                classNameMain="w-73 xs:w-full"
                                classesWrapper="w-73 xs:w-full"
                                selectIconType="arrowDownGreen"
                                selectTextClass="sales-report__select"
                                classesWrapperInput={`bg-white ${userData?.department_id ? 'placeholder-dark' : ''}`}
                                disabled={disabledInputs || !userData?.country_id}
                                required={isValidateSupplier && !userData?.department_id}
                            />
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                    submodule: 'add-city',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                labelText={changeTitle(isSupplierLocation, CITY)}
                                required={isValidateSupplier && !userData?.city_id}
                                placeholder={userData?.city_id ? userData?.city_name : 'Seleccionar'}
                                optionSelect={buildOptionsSearch([...(citiesList || []), SELECT_DEFAULT])}
                                valueSelect={userData?.city_id}
                                onChangeSelect={(_, option): void => handleSearchSupplier(option, SupplierName.CityId)}
                                tooltipInfo
                                titleTooltip={city.title}
                                descTooltip={city.description}
                                classNameMain="w-73 xs:w-full"
                                classesWrapper="w-73 xs:w-full"
                                selectIconType="arrowDownGreen"
                                selectTextClass="sales-report__select"
                                classesWrapperInput={`bg-white ${userData?.city_id ? 'placeholder-dark' : ''}`}
                                disabled={!userData?.department_id || disabledInputs}
                            />
                        </>
                    ) : (
                        <>
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                    submodule: 'add-department',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                lettersWithAccent
                                name="department_name"
                                placeholder="..."
                                labelText={changeTitle(isSupplierLocation, DEPARTMENT)}
                                value={userData.department_name}
                                classesWrapper="w-full lg:w-73"
                                onChange={handleSupplierData}
                                tooltipInfo
                                titleTooltip={department.title}
                                descTooltip={department.description}
                                disabled={disabledInputs}
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                    submodule: 'add-city',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="city_name"
                                lettersWithAccent
                                labelText={changeTitle(isSupplierLocation, CITY)}
                                placeholder="..."
                                value={userData.city_name}
                                classesWrapper="w-full lg:w-73"
                                onChange={handleSupplierData}
                                tooltipInfo
                                titleTooltip={city.title}
                                descTooltip={city.description}
                                disabled={disabledInputs}
                                required={isValidateSupplier && !userData?.city_name}
                            />
                        </>
                    )}
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-postal-code',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="postal_code"
                        labelText="Código postal:"
                        classesWrapper="w-full lg:w-73"
                        placeholder="..."
                        value={userData.postal_code}
                        onChange={handleSupplierData}
                        maxLength={6}
                        tooltipInfo
                        titleTooltip={postalCode.title}
                        descTooltip={postalCode.description}
                        integerNumbers
                        disabled={disabledInputs}
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-phone',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="phone"
                        labelText="Teléfono:"
                        classesWrapper="w-full lg:w-73"
                        placeholder="..."
                        value={userData.phone || userData.cellphone}
                        maxLength={userData?.country_id === COLOMBIA_ID ? MAX_LENGTH_NUMBER_CO : MAX_LENGTH_NUMBER}
                        onChange={handleSupplierData}
                        tooltipInfo
                        titleTooltip={phone.title}
                        descTooltip={phone.description}
                        disabled={disabledInputs}
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-email',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="email"
                        labelText="*Correo electrónico:"
                        classesWrapper="w-full lg:w-73"
                        placeholder="..."
                        value={userData.email}
                        onChange={handleSupplierData}
                        {...validateRequiredEmail(userData)}
                        disabled={disabledInputs}
                        onBlur={(): Promise<void> => validateClient(EMAIL)}
                        limitCharacters={false}
                    />
                </div>
            </Form>
        );
    };

    const renderTaxDetails = (userData: IGenericRecord): React.ReactElement => {
        const typeTaxpayerOptionsRender = typeTaxpayerOptions.map(item => ({ ...item, name: item.value }));
        const optionsTaxpayerRender = buildOptions(optionsTaxpayer)?.map(({ id, value, ...item }: IGenericRecord) => ({
            ...item,
            id: String(id),
            name: String(value),
            value: String(value),
            key: String(id),
        }));

        return (
            <Form sendWithEnter className="flex gap-4.5 flex-col card-add-supplier">
                <h3 className="text-gray-dark font-allerbold">Detalles tributarios</h3>
                <div className="flex gap-4.5 xs:flex-col">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-type-taxpayer',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        placeholder="Seleccionar"
                        optionSelect={optionsTaxpayerRender}
                        classesWrapper="w-full lg:w-73"
                        onChangeSelect={(_, value): void => handleSelectSupplier(value, SupplierName.TypeTaxpayerId)}
                        {...propsToPersonType(validateUser, !isSupplierView, userData.type_taxpayer_name)}
                        selectIconType="arrowDownGreen"
                        valueSelect={findItemOption(optionsTaxpayerRender, userData.type_taxpayer_id)}
                        selectTextClass="sales-report__select"
                        tooltipInfo
                        descTooltip={typeTaxpayer.description}
                        requiredText={DEFAULT_REQUIRED_TEXT}
                        disabled={disabledInputs}
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'add-taxpayer-options',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="Detalle de impuesto:"
                        placeholder="Seleccionar"
                        optionSelect={typeTaxpayerOptionsRender}
                        classesWrapper="w-full lg:w-73"
                        onChangeSelect={(_, option): void => handleSelectSupplier(option, SupplierName.TaxDetailsId)}
                        selectIconType="arrowDownGreen"
                        valueSelect={typeTaxpayerOptionsRender.find(
                            option => String(option.name) === String(userData.tax_details_name)
                        )}
                        selectTextClass="sales-report__select"
                        tooltipInfo
                        titleTooltip={taxDetails.title}
                        descTooltip={taxDetails.description}
                        disabled={disabledInputs}
                    />
                </div>
                <div className="flex flex-col gap-y-4.5">
                    {userData?.fiscal_responsibilities?.map((item: IGenericRecord, index: number) => {
                        const { date, number_resolution: resolutionNumber = '', withholdings, name } = item;
                        const enableButton = enableTaxButton(index);
                        const requiresResolution = validateUser && !String(resolutionNumber);
                        const fiscalResponsibilitiesOptionsRender = fiscalResponsibilities?.map(
                            ({ code, value, id, ...item }: IGenericRecord) => ({
                                ...item,
                                id,
                                key: code,
                                name: value,
                                value,
                            })
                        );

                        return (
                            <div key={item.id} className="xs:w-full">
                                <div className="flex items-center gap-x-2 xs:w-full xs:flex-col">
                                    <SelectSearchInput
                                        id={generateId({
                                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                            submodule: 'add-fiscal-responsabilities',
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        required={queryParam !== ADD_USER && validateUser && !item?.name}
                                        key={Symbol(item.id).toString()}
                                        valueSelect={item?.name}
                                        placeholder="Seleccionar"
                                        name={FISCAL_RESPONSIBILITIES}
                                        selectTextClass="select__input"
                                        labelText={`${queryParam === ADD_USER ? ' ' : '*'}Responsabilidad fiscal:`}
                                        selectIconType="arrowDownGreen"
                                        disabled={disabledInputs || !userData.type_taxpayer_id}
                                        classesWrapper="w-73 xs:w-full"
                                        optionSelect={fiscalResponsibilitiesOptionsRender}
                                        onChangeSelect={(_, option): void =>
                                            handleSelectSupplier(option, SupplierName.FiscalResponsibilities, item?.id_fiscal)
                                        }
                                        tooltipInfo
                                        titleTooltip={responsibility.title}
                                        descTooltip={responsibility.description}
                                        classNameMain="xs:w-full"
                                    />
                                    {name && !NATURAL_RESPONSIBILITIES.includes(name) && (
                                        <div className="flex items-end gap-2 lg:ml-7">
                                            <ResolutionFields
                                                data={{ date, resolutionNumber }}
                                                handleChange={(option: IGenericRecord): void =>
                                                    handleResolutionChange(option, index)
                                                }
                                                requiredResolution={requiresResolution}
                                            />
                                            {!!index && (
                                                <Icon
                                                    name="trashBlue"
                                                    className="w-5 h-5 mt-1 mr-auto cursor-pointer"
                                                    onClick={(): void => deleteFiscalResponsibilities(item.id || item.id_fiscal)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {name === SELF_RETAINING && (
                                    <Withholdings
                                        selectRetention={(name): void => selectRetention(name, index)}
                                        validate={validateUser}
                                        withholdings={withholdings}
                                    />
                                )}
                                {userData.fiscal_responsibilities.length - 1 === index && (
                                    <button
                                        id={generateId({
                                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                            submodule: 'add-fiscal-responsability',
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.BTN,
                                        })}
                                        className={`mt-2 text-base underline ${
                                            enableButton ? 'text-green' : 'cursor-default text-gray-blocking'
                                        }`}
                                        onClick={addFiscalResponsibilities}
                                        type="button"
                                        disabled={!enableButton}
                                    >
                                        +Agregar adicional
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Form>
        );
    };

    return (
        <>
            <ModalType
                moduleId={`${ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER}-success-save`}
                iconName="check"
                text={{
                    title: 'Información guardada',
                    description: '¡Su información ha sido guardada con éxito!',
                }}
                open={showModalSave}
                finalAction={(): void => {
                    setShowModalSave(false);
                    history.push(pageRoute);
                }}
            />
            <ModalWarningClientOrSupplier
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                show={showDuplicateWarning}
                editClient={sendEditClient}
                isSupplier={isSupplierView}
                documentTypes={utils?.document_types}
                dataClientOrSupplier={existingUserData as IDataClientOrSupplier}
                closeModal={(): void => {
                    setShowDuplicateWarning(false);
                    setUserData(userData => ({ ...userData, document_number: '' }));
                }}
            />
            <div className="flex flex-col justify-between h-full">
                <div className="supplier-database">
                    <PageTitle title="Ficha técnica" classTitle="text-left text-base" classContainer="w-full" />
                    <BreadCrumb routes={routesAddSupplier(returnNameScreen(), title.plural, pageRoute)} />
                    <h2 className="text-center text-26lg text-blue font-allerbold xs:text-xl xs:mb-4.5">{returnNameScreen()}</h2>
                    {!isSupplierEdit && (
                        <Form className="flex flex-col gap-4.5 card-add-supplier">
                            <h3 className="text-lg text-blue font-allerbold">Método para agregar {title.plural}</h3>
                            <p className="text-gray-dark">Seleccione la opción para agregar un {title.singular}</p>
                            <RadioButton
                                moduleId={ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER}
                                classesLabel="w-auto px-2"
                                entities={getEntitiesUser(title.singular)}
                                selected={addUser}
                                setSelected={setAddUser}
                                bgCircle="white"
                                classesRadioInput="card-add-supplier__checkbox"
                                disabled={disabledInputs}
                            />
                        </Form>
                    )}

                    {addUser === SelectAddSupplier.AddDiggiPymes ? (
                        <>
                            <p className={`text-gray-dark ${descriptionByModule().marginTop}`}>{descriptionByModule().text}</p>
                            {renderBasicInformation(userData)}
                            {renderInformationContact(userData, cities)}
                            {renderTaxDetails(userData)}
                        </>
                    ) : (
                        <Form className="flex flex-col card-add-supplier">
                            <h3 className=" text-blue font-allerbold">Agregar {title.singular} a través de Excel</h3>
                            <p className="pr-2 text-gray-dark my-4.5">
                                Haga click en &nbsp;
                                <a href={urlBySingular()} className="mt-2 text-base text-purple" target="_blank" rel="noreferrer">
                                    plantilla carga masiva {title.plural}
                                </a>
                                &nbsp; para descargar un ejemplo del formato requerido. Una vez haya terminado de agregar la
                                información de sus {title.plural} a excel, vuelva a subir el archivo en el cuadro que se muestra a
                                continuación y haga click en validar.
                            </p>
                            <div>
                                <FileInput
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                        submodule: 'file-raw',
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.UPL,
                                    })}
                                    name="supplierExcel"
                                    instructions="Subir archivo"
                                    classesWrapper="lg:w-72 w-full"
                                    required={requiredSupplierExcel()}
                                    requiredText="No ha ingresado ningún archivo de carga masiva"
                                    fileExtensionAccept=".xls,.xlsx,.xlsm"
                                    file={file}
                                    setFile={(file): void => {
                                        setFile(file);
                                        setIsValidateFile(false);
                                        setValidateFileErrors('');
                                    }}
                                    labelText={`Plantilla ${title.plural}:`}
                                    disabled={disabledInputs}
                                />
                                {showErrorsLoad() && (
                                    <div className="flex items-start">
                                        <Icon
                                            alt="Información"
                                            name={nameIcon}
                                            className="w-5 mr-2 cursor-pointer"
                                            hoverIcon="infoBlue"
                                        />
                                        <p className={`text-sm pr-12 ${colorText}`}>{validationText(validateFileErrors)}</p>
                                    </div>
                                )}
                            </div>

                            <Button
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                    submodule: 'info',
                                    action: ActionElementType.VALIDATE,
                                    elementType: ElementType.BTN,
                                })}
                                disabled={disabledInputs}
                                text="Validar"
                                onClick={validateFile}
                                classes="ml-auto mb-2 mt-5.5"
                            />
                            <p className="text-gray-dark">
                                Una vez la validación sea exitosa haga click en &nbsp;
                                <span className="mx-2 font-allerbold">Guardar</span>para continuar con el proceso.
                            </p>
                        </Form>
                    )}
                </div>
                <PageButtonsFooter
                    disabledRight={disabledInputs}
                    {...buttonsFooterProps(
                        ModuleApp.ACCOUNT_ACCREDITATION,
                        history,
                        (): void => handleSaveUser(),
                        {
                            name: getRouteName(Routes.CUSTOMER_DATABASE),
                            moduleName: getRouteName(Routes.DATABASE_MENU),
                        },
                        'Guardar'
                    )}
                />
            </div>
        </>
    );
};
