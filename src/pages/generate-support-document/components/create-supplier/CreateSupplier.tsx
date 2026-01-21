import React, { useContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { IGenericRecord } from '@models/GenericRecord';
import { IFiscalResponsibilitiesResponse, IFiscalResponsibility, ISupplierResponse } from '@models/Supplier';
import { SupportContext } from '@pages/generate-support-document/context';
import { TOOLTIPS_PAGE } from '@information-texts/SupportDocumentAndBuy';
import { Routes } from '@constants/Paths';
import { COLOMBIA, COLOMBIA_ID } from '@constants/Location';
import { KEYS_ASSIGN_SUPPLIER } from '@constants/SupportDocument';
import { IS_EMAIL_EXISTS, REQUIRED_FIELD } from '@constants/FieldsValidation';
import { LEGAL_PERSON, OTHERS, SELF_RETAINING, SIMPLE_REGIMEN } from '@constants/DynamicRequest';
import { NATURAL_RESPONSIBILITIES, WITHHOLDINGS } from '@constants/ElectronicInvoice';
import { getRoute } from '@utils/Paths';
import { assignValue } from '@utils/Json';
import { includeArray } from '@utils/Array';
import { formatString } from '@utils/Date';
import { numericsInput } from '@utils/SpecialCharacters';
import { toggleWithholdings } from '@utils/ElectronicInvoice';
import { buildOptions, buildOptionsSearch } from '@utils/Company';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import useTaxpayerType from '@hooks/useTaxpayerType';
import useValidateLocation from '@hooks/useValidateLocation';
import useDigitVerification from '@hooks/useDigitVerification';
import useFiscalResponsibilities from '@hooks/useFiscalResponsibility';
import { Form } from '@components/form';
import { Icon } from '@components/icon';
import { LinkAdd } from '@components/button';
import { Information } from '@components/information';
import { RadioButton } from '@components/radiobutton';
import { ModalWarningClientOrSupplier } from '@components/modal-custom';
import { ChangeEvent, IOptionSelect, SelectSearchInput, TextInput } from '@components/input';
import { ResolutionFields, Withholdings } from '@components/electronic-documents/tax-responsibilities';
import { getSupplier } from '@redux/suppliers/actions';
import { FieldsName, UTILS } from '.';
import './CreateSupplier.scss';

export const CreateSupplier: React.FC = () => {
    const {
        EMAIL,
        PHONE,
        ADDRESS,
        CITY_NAME,
        POSTAL_CODE,
        DOCUMENT_NAME,
        DOCUMENT_NUMBER,
        DEPARTMENT_NAME,
        TAX_DETAILS_NAME,
        TYPE_TAXPAYER_NAME,
    } = FieldsName;
    const { DEFAULT_FIELDS, HUNDRED, TWENTY, InputFieldsLimits } = UTILS;
    const [history, dispatch] = [useHistory(), useDispatch()];

    const {
        submit,
        supplier,
        utilsData,
        IDSupplier,
        optionsForm,
        validations: { supplierError },
        modalWarning: { handleModal, handleBlurEmail, isExistEmail, ...modalWarning },
        setSupplier,
    } = useContext(SupportContext);

    const { title, description } = IDSupplier ? UTILS.EDIT_SUPPLIER : UTILS.ADD_SUPPLIER;

    const { disabledAddFiscal, fiscalResponsibilitiesOptions, setTaxpayerSelected } = useFiscalResponsibilities(
        supplier.fiscal_responsibilities
    );
    const { disabledInputs } = usePermissions();
    const { optionsTaxpayer, setDocumentType } = useTaxpayerType();
    const { isYes, propsRadio, setRadio, changeTitle, isYesOrNo } = useValidateLocation(
        supplier,
        setSupplier,
        ModuleApp.SUPPORT_DOCUMENT
    );
    const { isTypeNit, digitVerification, setTypeDocument, setDocumentNumber } = useDigitVerification(
        supplier.document_name,
        supplier.document_number
    );

    const emailValidation = useMemo(
        () => ({
            text: isExistEmail ? IS_EMAIL_EXISTS : REQUIRED_FIELD,
            required: (submit && includeArray(supplierError, EMAIL)) || isExistEmail,
        }),
        [supplierError, isExistEmail]
    );
    const isColombia = useMemo(() => supplier.country_name === COLOMBIA, [supplier.country_name]);

    const handleText = ({ target: { name, value } }: ChangeEvent): void => {
        setSupplier({
            ...supplier,
            [name]: value,
        });
        if (name === DOCUMENT_NUMBER) setDocumentNumber(value);
    };

    const handleSelect = ({ value, id = '' }: IOptionSelect, name = ''): void => {
        const isDocumentName = name === DOCUMENT_NAME;
        setSupplier({
            ...supplier,
            ...(isDocumentName ? { document_type: id, type_taxpayer_id: '', type_taxpayer_name: '' } : {}),
            ...(name === TAX_DETAILS_NAME
                ? {
                      tax_details_id: id,
                      tax_details_code: utilsData.tax_details.find((item: IGenericRecord) => item.id === id)?.code || '',
                  }
                : {}),
            ...(name === TYPE_TAXPAYER_NAME ? { type_taxpayer_id: id } : {}),
            [name]: value,
        });
        if (isDocumentName) {
            setDocumentType(id);
            setTypeDocument(value);
        }
    };

    const handleResolutionChange = ({ value, name }: IGenericRecord, itemIndex: number): void => {
        setSupplier({
            ...supplier,
            fiscal_responsibilities: supplier?.fiscal_responsibilities.map((item, index) => ({
                ...item,
                [name]:
                    itemIndex === index
                        ? name === FieldsName.DATE
                            ? formatString(value)
                            : numericsInput(value)
                        : item[name as keyof IFiscalResponsibility],
            })),
        });
    };

    const selectRetention = (retention: string, itemIndex: number): void => {
        setSupplier({
            ...supplier,
            fiscal_responsibilities: supplier?.fiscal_responsibilities.map(
                ({ withholdings, ...item }: IFiscalResponsibility, index: number) => ({
                    ...item,
                    withholdings: index === itemIndex ? toggleWithholdings(withholdings, retention) : withholdings,
                })
            ),
        });
    };

    const handleFiscalResponsibility = ({ value, id = '' }: IOptionSelect, index: number): void => {
        const currentValue = {
            id,
            id_fiscal: id,
            name: value,
            withholdings: WITHHOLDINGS,
        };
        setSupplier({
            ...supplier,
            fiscal_responsibilities:
                value === SIMPLE_REGIMEN || (supplier.type_taxpayer_name === LEGAL_PERSON && value === OTHERS)
                    ? [currentValue]
                    : supplier.fiscal_responsibilities.map((fiscal, indexFiscal) => {
                          if (indexFiscal === index) {
                              return {
                                  ...fiscal,
                                  ...currentValue,
                              };
                          }
                          return fiscal;
                      }),
        });
    };

    const handleAddFiscal = (): void => {
        setSupplier({
            ...supplier,
            fiscal_responsibilities: [
                ...supplier.fiscal_responsibilities,
                { id: '', id_fiscal: '', name: '', withholdings: WITHHOLDINGS },
            ],
        });
    };

    const handleDeleteFiscal = (index: number): void => {
        setSupplier({
            ...supplier,
            fiscal_responsibilities: supplier.fiscal_responsibilities.filter((item, indexFiscal) => indexFiscal !== index),
        });
    };

    const handleDisabledButton = (): boolean => disabledAddFiscal || supplier.fiscal_responsibilities.some(item => !item.name);

    const handleEdit = (): void => history.push(`${getRoute(Routes.CREATE_SUPPLIER)}&ID=${modalWarning.supplier.id}`);

    const handleEditSupplier = async (): Promise<void> => {
        if (!IDSupplier) return;
        handleModal();
        const data = ((await dispatch(getSupplier(IDSupplier))) as unknown) as ISupplierResponse;
        if (data) {
            const { fiscal_responsibilities, ...supplierEdit } = assignValue(KEYS_ASSIGN_SUPPLIER, data);
            setSupplier({
                ...supplier,
                ...supplierEdit,
                person_id: data.person_id,
                tax_details_id: optionsForm.taxDetails.find(item => item.code === supplierEdit.tax_details_code)?.id || '',
                document_name: optionsForm.documentTypes.find(item => item.id == supplierEdit.document_type)?.value || '',
                fiscal_responsibilities: fiscal_responsibilities.map((item: IFiscalResponsibilitiesResponse) => ({
                    ...item,
                    id_fiscal: item.id,
                })),
            });
            setRadio(isYesOrNo(supplierEdit.country_id));
            setDocumentType(supplierEdit.document_type);
            handleBlurEmail('', IDSupplier);
        }
    };

    const handleCloseModal = (): void => {
        handleModal();
        setSupplier({
            ...supplier,
            document_number: '',
        });
    };

    useEffect(() => {
        if (!IDSupplier) setSupplier({ ...supplier, country_id: String(COLOMBIA_ID), country_name: COLOMBIA });
    }, [utilsData]);

    useEffect(() => {
        handleEditSupplier();
    }, [IDSupplier]);

    const documentTypesRender = optionsForm.documentTypes.map(item => ({ ...item, name: item.value }));
    const taxpayerOptionsRender = buildOptions(optionsTaxpayer).map(item => ({ ...item, name: item.value }));
    const taxDetailsOptionsRender = optionsForm.taxDetails.map(item => ({ ...item, name: item.value }));
    const fiscalResponsabilitiesOptionsRender = buildOptions(fiscalResponsibilitiesOptions).map(item => ({
        ...item,
        id: String(item.id),
        code: item.code,
        name: item.value,
        value: item.value,
    }));

    return (
        <Form sendWithEnter className="create-supplier">
            <ModalWarningClientOrSupplier
                id={generateId({
                    module: ModuleApp.SUPPORT_DOCUMENT,
                    submodule: `create-supplier`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                isSupplier
                keyDocumentType="value"
                editClient={handleEdit}
                closeModal={handleCloseModal}
                show={modalWarning.showModal && !IDSupplier}
                documentTypes={optionsForm.documentTypes}
                {...modalWarning.propsModal}
            />
            <Information color="blue" title={title} description={description} />
            <section className="card-style">
                <h3>Información básica</h3>
                <fieldset className="content-inputs">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-name`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        required={submit && includeArray(supplierError, FieldsName.DOCUMENT_NAME)}
                        classesWrapper="content-inputs__input-size"
                        labelText="*Nombre del proveedor:"
                        {...TOOLTIPS_PAGE.SUPPLIER}
                        disabled={disabledInputs}
                        onChange={handleText}
                        value={supplier.name}
                        placeholder="..."
                        lettersWithAccent
                        maxLength={HUNDRED}
                        tooltipInfo
                        name="name"
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-document-type`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        required={submit && includeArray(supplierError, FieldsName.DOCUMENT_NAME)}
                        classesWrapper="content-inputs__input-size"
                        optionSelect={documentTypesRender}
                        {...TOOLTIPS_PAGE.TYPE_DOCUMENT}
                        labelText="*Tipo de documento:"
                        selectIconType="arrowDownGreen"
                        valueSelect={supplier.document_name}
                        onChangeSelect={(_, selectedOption): void => handleSelect(selectedOption, FieldsName.DOCUMENT_NAME)}
                        name={FieldsName.DOCUMENT_NAME}
                        tooltipInfo
                        disabled={disabledInputs || !!IDSupplier}
                    />
                    <div className="flex content-inputs__input-size">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `create-supplier-document-number`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            required={submit && includeArray(supplierError, DOCUMENT_NUMBER)}
                            onBlur={(): void => {
                                modalWarning.handleBlur(supplier);
                            }}
                            classesWrapper={isTypeNit ? 'mr-2 w-full' : ' w-full'}
                            {...TOOLTIPS_PAGE.DOCUMENT_NUMBER}
                            labelText="*Número de documento:"
                            value={supplier.document_number}
                            name={FieldsName.DOCUMENT_NUMBER}
                            onChange={handleText}
                            placeholder="..."
                            maxLength={TWENTY}
                            type="text"
                            onlyNumbers
                            tooltipInfo
                            disabled={disabledInputs || !!IDSupplier}
                        />
                        {isTypeNit && (
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `create-supplier-dv`,
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
                </fieldset>
            </section>
            <section className="card-style">
                <h3>Información de contacto</h3>
                <fieldset className="content-inputs">
                    <RadioButton {...propsRadio} classesLabel="content-inputs__size-radio-buttons" />
                </fieldset>
                <fieldset className="content-inputs">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-address`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText={changeTitle(isYes, ADDRESS)}
                        classesWrapper="content-inputs__input-size"
                        required={submit && includeArray(supplierError, ADDRESS)}
                        {...TOOLTIPS_PAGE.ADDRESS}
                        disabled={disabledInputs}
                        value={supplier.address}
                        onChange={handleText}
                        maxLength={HUNDRED}
                        placeholder="..."
                        name={ADDRESS}
                        tooltipInfo
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-country`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        required={submit && includeArray(supplierError, FieldsName.COUNTRY_NAME)}
                        optionSelect={buildOptionsSearch(utilsData.countries)}
                        classesWrapper="content-inputs__input-size"
                        disabled={disabledInputs || isYes}
                        valueSelect={supplier.country_id}
                        selectIconType="arrowDownGreen"
                        onChangeSelect={(value, { name }): void => {
                            setSupplier({
                                ...supplier,
                                country_id: value,
                                country_name: name,
                                ...DEFAULT_FIELDS,
                            });
                        }}
                        {...TOOLTIPS_PAGE.COUNTRY}
                        labelText="*País:"
                        tooltipInfo
                    />
                    {isColombia ? (
                        <>
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `create-supplier-department`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                required={submit && includeArray(supplierError, DEPARTMENT_NAME)}
                                optionSelect={buildOptionsSearch(
                                    utilsData.departments?.filter(
                                        (item: IGenericRecord) => item.country_id === Number(supplier.country_id)
                                    )
                                )}
                                disabled={!supplier?.country_id || disabledInputs}
                                classesWrapper="content-inputs__input-size"
                                valueSelect={supplier.department_id}
                                selectIconType="arrowDownGreen"
                                {...TOOLTIPS_PAGE.DEPARTMENT}
                                onChangeSelect={(value, { name }): void => {
                                    setSupplier({
                                        ...supplier,
                                        ...DEFAULT_FIELDS,
                                        department_id: value,
                                        department_name: name,
                                    });
                                }}
                                labelText="*Departamento:"
                                tooltipInfo
                            />
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `create-supplier-city`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                required={submit && includeArray(supplierError, CITY_NAME)}
                                disabled={!supplier?.department_id || disabledInputs}
                                classesWrapper="content-inputs__input-size"
                                optionSelect={buildOptionsSearch(
                                    utilsData.cities?.filter(
                                        (item: IGenericRecord) => item.department_id === String(supplier.department_id)
                                    )
                                )}
                                selectIconType="arrowDownGreen"
                                valueSelect={String(supplier.city_id)}
                                {...TOOLTIPS_PAGE.CITY}
                                onChangeSelect={(value, { name }): void => {
                                    setSupplier({
                                        ...supplier,
                                        city_id: value,
                                        city_name: name,
                                    });
                                }}
                                labelText="*Ciudad:"
                                tooltipInfo
                            />
                        </>
                    ) : (
                        <>
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `create-supplier-department`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="content-inputs__input-size"
                                disabled={!isYes || disabledInputs}
                                value={supplier.department_name}
                                {...TOOLTIPS_PAGE.DEPARTMENT}
                                labelText="Departamento:"
                                name={DEPARTMENT_NAME}
                                onChange={handleText}
                                maxLength={HUNDRED}
                                placeholder="..."
                                tooltipInfo
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                    submodule: `create-supplier-city`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="content-inputs__input-size"
                                value={supplier.city_name}
                                disabled={disabledInputs}
                                {...TOOLTIPS_PAGE.CITY}
                                onChange={handleText}
                                labelText="*Ciudad:"
                                maxLength={HUNDRED}
                                placeholder="..."
                                name={CITY_NAME}
                                tooltipInfo
                            />
                        </>
                    )}
                    <TextInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-postal-code`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="content-inputs__input-size"
                        {...TOOLTIPS_PAGE.POSTAL_CODE}
                        value={supplier.postal_code}
                        labelText="Código postal:"
                        onChange={handleText}
                        name={POSTAL_CODE}
                        placeholder="..."
                        maxLength={HUNDRED}
                        integerNumbers
                        onlyNumbers
                        tooltipInfo
                        disabled={disabledInputs}
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-phone`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="content-inputs__input-size"
                        {...TOOLTIPS_PAGE.PHONE}
                        labelText="Teléfono:"
                        value={supplier.phone}
                        onChange={handleText}
                        placeholder="..."
                        integerNumbers
                        maxLength={isColombia ? InputFieldsLimits.Phone : InputFieldsLimits.ForeignPhone}
                        name={PHONE}
                        onlyNumbers
                        tooltipInfo
                        disabled={disabledInputs}
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-email`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        onBlur={(): void => {
                            handleBlurEmail(supplier.email, IDSupplier);
                        }}
                        classesWrapper="content-inputs__input-size"
                        required={emailValidation.required}
                        requiredText={emailValidation.text}
                        labelText="*Correo electronico:"
                        disabled={disabledInputs}
                        value={supplier.email}
                        onChange={handleText}
                        placeholder="..."
                        name={EMAIL}
                        type="email"
                        limitCharacters={false}
                    />
                </fieldset>
            </section>
            <section className="card-style">
                <h3>Detalles tributarios</h3>
                <fieldset className="content-inputs">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-type-taxpayer`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        required={submit && includeArray(supplierError, TYPE_TAXPAYER_NAME)}
                        classesWrapper="content-inputs__input-size"
                        labelText="*Tipo de contribuyente:"
                        valueSelect={supplier.type_taxpayer_name}
                        optionSelect={taxpayerOptionsRender}
                        onChangeSelect={(_, selectedOption): void => {
                            handleSelect(selectedOption, TYPE_TAXPAYER_NAME);
                            setTaxpayerSelected(selectedOption.value);
                        }}
                        selectIconType="arrowDownGreen"
                        {...TOOLTIPS_PAGE.TAXPAYER}
                        name={TYPE_TAXPAYER_NAME}
                        tooltipInfo
                        disabled={disabledInputs}
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.SUPPORT_DOCUMENT,
                            submodule: `create-supplier-tax-details`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        classesWrapper="content-inputs__input-size"
                        labelText="Detalle de impuesto:"
                        valueSelect={supplier.tax_details_name}
                        optionSelect={taxDetailsOptionsRender}
                        selectIconType="arrowDownGreen"
                        onChangeSelect={(_, selectedOption): void => {
                            handleSelect(selectedOption, TAX_DETAILS_NAME);
                        }}
                        {...TOOLTIPS_PAGE.TAXES}
                        name={TAX_DETAILS_NAME}
                        tooltipInfo
                        disabled={disabledInputs}
                    />
                </fieldset>
                <div className="flex flex-col gap-4.5 lg:px-2">
                    <div className="flex flex-col gap-4.5">
                        {supplier.fiscal_responsibilities.map(
                            (
                                { id_fiscal, name, withholdings, date = new Date(), number_resolution: resolutionNumber = '' },
                                index
                            ) => {
                                const requiresResolution = submit && !String(resolutionNumber);
                                return (
                                    <div key={`responsability-${index}`}>
                                        <div
                                            className={`flex flex-col lg:flex-row lg:items-${
                                                requiresResolution ? 'center' : 'end'
                                            }`}
                                        >
                                            <SelectSearchInput
                                                id={generateId({
                                                    module: ModuleApp.SUPPORT_DOCUMENT,
                                                    submodule: `create-supplier-fiscal-responsability-${index}`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.DRP,
                                                })}
                                                required={submit && !id_fiscal}
                                                optionSelect={fiscalResponsabilitiesOptionsRender}
                                                onChangeSelect={(_, option): void => handleFiscalResponsibility(option, index)}
                                                classesWrapper="content-inputs__input-size"
                                                {...TOOLTIPS_PAGE.FISCAL_RESPONSIBILITY}
                                                labelText="*Responsabilidad fiscal:"
                                                selectIconType="arrowDownGreen"
                                                valueSelect={name}
                                                tooltipInfo
                                                disabled={!supplier.type_taxpayer_name}
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
                                                            className="w-5 h-5 mt-auto mb-1"
                                                            hoverIcon="trashGreen"
                                                            {...(!disabledInputs && {
                                                                onClick: (): void => handleDeleteFiscal(index),
                                                            })}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {name === SELF_RETAINING && (
                                            <Withholdings
                                                selectRetention={(name): void => selectRetention(name, index)}
                                                validate={submit}
                                                withholdings={withholdings}
                                            />
                                        )}
                                    </div>
                                );
                            }
                        )}
                        <LinkAdd
                            id={generateId({
                                module: ModuleApp.SUPPORT_DOCUMENT,
                                submodule: `create-supplier-fiscal-responsability`,
                                action: ActionElementType.ADD,
                                elementType: ElementType.LNK,
                            })}
                            text="+Agregar adicional"
                            disabled={handleDisabledButton()}
                            onClick={handleAddFiscal}
                        />
                    </div>
                </div>
            </section>
        </Form>
    );
};
