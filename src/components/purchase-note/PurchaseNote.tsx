import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import usePermissions from '@hooks/usePermissions';
import useFiscalResponsibilities from '@hooks/useFiscalResponsibility';
import { TitleButtons } from '@constants/Buttons';
import { VALUE_ZERO } from '@constants/Memberships';
import { RootState } from '@redux/rootReducer';
import { getDynamicData } from '@redux/warehouses/actions';
import { getInformationCompany } from '@redux/company/actions';
import { getInvoicePurchase, saveEditNotePurchase } from '@redux/report-note-purchase/actions';
import { getPrefixPurchaseByCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { IGenericRecord } from '@models/GenericRecord';
import { IProductValues } from '@models/InvoiceProduct';
import { PURCHASE_NOTE } from '@information-texts/PurchaseNote';
import { MODAL_INFORMATION } from '@information-texts/Modal';
import { FormInvoicePurchase } from '@components/form-invoice-purchase/FormInvoicePurchase';
import { INPUT_NAME, IPropsRequired, getDocumentTypeName } from '@components/form-invoice-purchase';
import { ModalType } from '@components/modal-custom';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { removeThousandsPoint } from '@utils/Decimals';
import { validateEmail } from '@utils/Validation';
import { currentDateInUnix, getDateFromUnix, getDateToString, getTimePicker } from '@utils/Date';
import { ModuleApp } from '@utils/GenerateId';
import { TableNoteSupplier } from './components/table-note-supplier/TableNoteSupplier';
import {
    CREDIT,
    FIELDS_REQUIRED,
    INITIAL_VALUES,
    INVOICE_PREFIX,
    IPurchaseNoteProps,
    NO_QUANTITY_ERROR,
    REQUEST_FIELDS,
    allFieldsDisabled,
    dynamicData,
    fieldsDisabled,
    formatDataNote,
} from '.';

export const PurchaseNote: React.FC<IPurchaseNoteProps> = ({ invoiceSelected, setInvoice, typeNote, isEdit }) => {
    const dispatch = useDispatch();
    const [totalsNote, setTotalsNote] = useState<IGenericRecord>({});
    const [validate, setValidate] = useState<boolean>(false);
    const [emptyFieldsError, setEmptyFieldsError] = useState<boolean>(false);
    const [discountError, setDiscountError] = useState<boolean>(false);
    const [quantityError, setQuantityError] = useState<IGenericRecord>(NO_QUANTITY_ERROR);
    const [fieldsWithError, setFieldsWithError] = useState<string[]>([]);
    const [showTrashModal, setShowTrashModal] = useState<boolean>(false);
    const [checkSelect, setCheckSelect] = useState<IGenericRecord[]>([]);
    const [requiredFields, setRequiredFields] = useState<IPropsRequired>(FIELDS_REQUIRED);
    const [invoiceValue, setInvoiceValue] = useState<IProductValues>(INITIAL_VALUES);
    const [productsNote, setProductsNote] = useState<IGenericRecord[]>([]);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [productOptions, setProductOptions] = useState<IGenericRecord[]>([]);
    const [formFieldsDisabled, setFormFieldsDisabled] = useState(fieldsDisabled);

    const { disabledInputs } = usePermissions();

    const getDataInvoiceProduct = async (): Promise<void> => {
        await Promise.all([
            dispatch(getDynamicData(dynamicData)),
            dispatch(getInvoicePurchase(invoiceSelected.id)),
            dispatch(getPrefixPurchaseByCompanyAction(INVOICE_PREFIX)),
            dispatch(getInformationCompany()),
        ]);
    };

    const {
        reportNotesPurchase: { invoice },
        warehouses: { getDynamicRequest },
        parameterizationInvoice: { storePrefix },
        company: { information },
    } = useSelector((state: RootState) => state);

    useEffect(() => {
        getDataInvoiceProduct();
    }, []);

    useEffect(() => {
        if (Object.entries(invoice).length) {
            setInvoiceValue(mappingDataInvoice());
            addInvoiceProducts();
        }
    }, [invoice]);

    useEffect(() => {
        if (typeNote === CREDIT && invoice?.products) {
            setProductOptions(
                invoice?.products?.filter((row: IGenericRecord) => !productsNote.some(item => item.product_id === row.id))
            );
        } else {
            setProductOptions(
                invoice?.products?.reduce((accumulator: IGenericRecord[], item: IGenericRecord) => {
                    if (!accumulator.some(row => row.unique_products_id === item.unique_products_id)) {
                        accumulator.push(item);
                    }
                    return accumulator;
                }, [])
            );
        }
    }, [productsNote]);

    useEffect(() => {
        setAnnulateFields(!!invoiceValue.is_annulled);
    }, [invoiceValue.is_annulled]);

    const setAnnulateFields = (is_annulled: boolean): void => {
        if (is_annulled) {
            setFormFieldsDisabled(allFieldsDisabled);
            return;
        }
        setFormFieldsDisabled(fieldsDisabled);
    };
    const mappingDataInvoice = (): IProductValues => {
        const { person } = invoice;
        return {
            associated_invoice_number: invoice?.number || '',
            associated_issuance_date: invoice?.date || '',
            hour_associated_issuance_time: getTimePicker(
                getDateToString(`${getDateFromUnix(invoice.time_issue, 'YYYY/MM/DD HH:MM:SS').dateFormat}`),
                true
            ),
            is_annulled: false,
            time_issue: invoice.time_issue,
            prefix: isEdit ? getDocumentTypeName(storePrefix, invoiceValue.prefix_id) : '',
            number: isEdit ? invoice.number : '',
            cude: isEdit ? invoice.document_uuid : '',
            prefix_note: isEdit ? invoice.supplier_invoice_number : '',
            prefix_id: isEdit ? invoice.prefix : '',
            foreign_exchange_id: invoice?.foreign_exchange_id || '',
            foreign_exchange_name: invoice?.foreign_exchange_name || '',
            foreign_exchange_rate: invoice?.foreign_exchange_rate || '',
            date: isEdit ? invoice.date : currentDateInUnix(),
            date_limit: isEdit ? invoice.date_limit : 0,
            number_purchase_order: invoice?.number_purchase_order || '',
            sales_manager: invoice?.sales_manager || '',
            document_type_sales_manager: '',
            document_number_sales_manager: '',
            purchasing_manager: invoice?.purchasing_manager,
            document_type_purchasing_manager: '',
            document_number_purchasing_manager: '',
            days_payment: VALUE_ZERO,
            payment_method_id: invoice?.payment_method_id || '',
            payment_type_id: invoice?.payment_type_id || '',
            payment_type_name: invoice?.payment_type_name || '',
            type_taxpayer_name: '',
            taxes_details_id: getDynamicRequest?.tax_details?.find(
                (row: IGenericRecord) => row.name === person.supplier.tax_details_name
            )?.id,
            taxes_details: person.supplier?.tax_details_name || '',
            note: '',
            send_address: invoice.send_address,
            is_paid: invoice.is_paid,
            total_sale: parseInt(VALUE_ZERO),
            total_discount: parseInt(VALUE_ZERO),
            sending_charge: parseInt(VALUE_ZERO),
            total_sale_value: parseInt(VALUE_ZERO),
            total_iva: parseInt(VALUE_ZERO),
            retefuente: parseInt(VALUE_ZERO),
            reteica: parseInt(VALUE_ZERO),
            reteiva: parseInt(VALUE_ZERO),
            total: parseInt(VALUE_ZERO),
            total_impoconsumption: parseInt(VALUE_ZERO),
            total_invoice: parseInt(VALUE_ZERO),
            supplier: {
                id: person.supplier.id || '',
                name: person.supplier.name || '',
                address: person.address,
                document_type: person.document_type,
                document_name: person.document_type_name || '',
                document_number: person.document_number || '',
                person_id: person.id || '',
                email: person.email,
                phone: person.phone,
                country_id: person.country_id,
                country_name: person.country_name,
                department_id: person.department_id,
                department_name: person.department_name,
                city_id: person.city_id,
                city_name: person.city_name,
                postal_code: person.postal_code,
                fiscal_responsibilities: person.fiscal_responsibilities || [],
                type_taxpayer_id: person.type_taxpayer_id,
                type_taxpayer_name: person.type_taxpayer_name,
            },
        };
    };

    const cleanData = (): IProductValues => {
        return {
            associated_invoice_number: '',
            is_annulled: false,
            associated_issuance_date: 0,
            hour_associated_issuance_time: undefined,
            time_issue: '',
            prefix: '',
            prefix_id: '',
            number: '',
            cude: '',
            foreign_exchange_id: '',
            foreign_exchange_name: '',
            foreign_exchange_rate: '',
            date: 0,
            date_limit: 0,
            number_purchase_order: '',
            sales_manager: '',
            document_type_sales_manager: '',
            document_number_sales_manager: '',
            purchasing_manager: '',
            document_type_purchasing_manager: '',
            document_number_purchasing_manager: '',
            days_payment: '',
            payment_method_id: '',
            payment_type_id: '',
            payment_type_name: '',
            type_taxpayer_name: '',
            taxes_details_id: '',
            taxes_details: '',
            note: '',
            send_address: '',
            is_paid: false,
            total_sale: parseInt(VALUE_ZERO),
            total_discount: parseInt(VALUE_ZERO),
            sending_charge: parseInt(VALUE_ZERO),
            total_sale_value: parseInt(VALUE_ZERO),
            total_iva: parseInt(VALUE_ZERO),
            retefuente: parseInt(VALUE_ZERO),
            reteica: parseInt(VALUE_ZERO),
            reteiva: parseInt(VALUE_ZERO),
            total: parseInt(VALUE_ZERO),
            total_impoconsumption: parseInt(VALUE_ZERO),
            total_invoice: parseInt(VALUE_ZERO),
            supplier: {
                id: '',
                name: '',
                address: '',
                document_type_id: '',
                document_type: '',
                document_name: '',
                document_number: '',
                person_id: '',
                email: '',
                phone: '',
                country_id: '',
                country_name: '',
                department_id: '',
                department_name: '',
                city_id: 0,
                city_name: '',
                postal_code: '',
                fiscal_responsibilities: [],
                type_taxpayer_id: 0,
                type_taxpayer_name: '',
            },
        };
    };

    const { fiscalResponsibilitiesOptions, taxpayerSelected, setTaxpayerSelected } = useFiscalResponsibilities(
        getDynamicRequest?.fiscal_responsibilities || []
    );

    const addInvoiceProducts = (): void => {
        const products = invoice.products.map((row: IGenericRecord, index: number) => ({
            No: (index + 1).toString().padStart(3, '0'),
            product_id: row.id,
            id: uuid(),
            key: uuid(),
            product_sku: row.sku_internal,
            unique_product_name: row.unique_product_name,
            quantity: row.quantity,
            unit_cost: row.unit_cost,
            discount: row.discount * row.quantity || VALUE_ZERO,
            iva: row.iva || VALUE_ZERO + '%',
            unit_measurements_id: row.unit_measurements_id || '',
            isNewProduct: false,
        }));

        setProductsNote(products);
    };

    useMemo(() => {
        const { totalDiscount, totalBuy, totalTax } = productsNote.reduce(
            (accumulatedValues, product) => {
                const parsedDiscount = product.discount || 0;
                const parsedUnitCost = product.unit_cost;
                const quantity = parseFloat(product.quantity);
                const taxPercentage = parseFloat(product.iva) / 100;
                const taxAmount = (parsedUnitCost * quantity - parsedDiscount) * taxPercentage;

                return {
                    totalDiscount: accumulatedValues.totalDiscount + parsedDiscount,
                    totalBuy: accumulatedValues.totalBuy + parsedUnitCost * quantity,
                    totalTax: accumulatedValues.totalTax + taxAmount,
                };
            },
            {
                totalDiscount: 0,
                totalBuy: 0,
                totalTax: 0,
            }
        );

        const total = totalBuy + totalTax - totalDiscount;

        setTotalsNote({
            totalDiscount,
            totalBuy,
            totalTax,
            total,
        });
    }, [productsNote]);

    const deleteRowTables = (): void => {
        setProductsNote(productsNote.filter((row: IGenericRecord) => !row.isChecked));
        setShowTrashModal(false);
        setCheckSelect([]);
    };

    const fieldsValidation = (): boolean => {
        const arrayFieldsError: boolean[] = [];
        const arrayDiscountError: boolean[] = [];
        const arrayQuantityError: IGenericRecord[] = [];
        const validations = productsNote.map((row: IGenericRecord) => {
            const withError = REQUEST_FIELDS.filter(field => !String(row[field]));
            /* Required fields Validation */
            if (withError.length) {
                setFieldsWithError([...fieldsWithError, ...withError]);

                arrayFieldsError.push(true);
            } else {
                arrayFieldsError.push(false);
            }
            /* Discount Validation */
            if (parseInt(removeThousandsPoint(row.unit_cost)) * row.quantity < row.discount) {
                withError.push('discount');
                arrayDiscountError.push(true);
            } else {
                arrayDiscountError.push(false);
            }
            /* Quantity on credit note validation */
            if (typeNote === CREDIT) {
                const sameProducts = productsNote.filter(same => same.product_id === row.product_id);
                const totalQuantity = sameProducts.reduce((prevQuantity, row) => prevQuantity + row.quantity, 0);
                const invoiceProduct = invoice.products.find(
                    (invoiceProduct: IGenericRecord) => invoiceProduct.id === row.product_id
                );

                if (totalQuantity > invoiceProduct?.quantity) {
                    withError.push('quantity');
                    arrayQuantityError.push({
                        flag: true,
                        product_name: row.unique_product_name,
                        max_quantity: invoice.products.find(
                            (invoiceProduct: IGenericRecord) => invoiceProduct.id === row.product_id
                        ).quantity,
                    });
                } else {
                    arrayQuantityError.push(NO_QUANTITY_ERROR);
                }
            }
            return { ...row, fieldsWithError: withError };
        });
        const fieldsErrorFlag = arrayFieldsError.includes(true);
        const DiscountErrorFlag = arrayDiscountError.includes(true);
        const QuantityErrorFlag = arrayQuantityError.find((row: IGenericRecord) => row.flag);

        const error = fieldsErrorFlag || DiscountErrorFlag || QuantityErrorFlag?.flag;

        setValidate(error);
        setEmptyFieldsError(fieldsErrorFlag);
        setDiscountError(DiscountErrorFlag);
        setQuantityError(QuantityErrorFlag || NO_QUANTITY_ERROR);

        setProductsNote(validations);

        return error;
    };

    const validateForm = (): boolean => {
        const { supplier } = invoiceValue;

        const fieldStatus = {
            prefix_note: !invoiceValue.prefix_note,
            prefix: !invoiceValue.prefix,
            prefix_id: !invoiceValue.prefix_id,
            number: !invoiceValue.number,
            foreign_exchange_id: !invoiceValue.foreign_exchange_id,
            date_limit: !invoiceValue.date_limit,
            name: !supplier.name,
            document_name: !supplier.document_name,
            document_number: !supplier.document_number,
            email: !validateEmail(supplier.email),
            address: !invoiceValue.supplier.address,
            country_id: false,
            country_name: !supplier.country_name,
            department_id: false,
            department_name: !supplier.department_name,
            city_id: false,
            city_name: !supplier.city_name,
            postal_code: !supplier.postal_code,
            phone: !supplier.phone,
            days_payment: !invoiceValue.days_payment,
            payment_type_id: !invoiceValue.payment_type_id,
            payment_method_id: !invoiceValue.payment_method_id,
            type_taxpayer_name: !supplier.type_taxpayer_name,
            fiscal_responsibilities: supplier.fiscal_responsibilities.length > 1 && !supplier.fiscal_responsibilities,
            taxes_details: !invoiceValue.taxes_details,
            number_purchase_order: !invoiceValue.number_purchase_order,
            foreign_exchange_rate:
                !invoiceValue.foreign_exchange_id ||
                (invoiceValue.foreign_exchange_id !== INPUT_NAME.EXCHANGE_ID && !invoiceValue.foreign_exchange_rate),
        };

        setRequiredFields(fieldStatus);
        return Object.values(fieldStatus).some((value: boolean) => value);
    };

    const onValidate = (): boolean[] => {
        const errors: boolean[] = [];

        errors.push(validateForm());
        errors.push(fieldsValidation());

        return errors;
    };

    const saveNote = async (isEdit: boolean): Promise<void> => {
        const errors: boolean[] = onValidate();

        if (errors.some((value: boolean) => value)) return;

        dispatch(
            saveEditNotePurchase(
                formatDataNote(invoice, invoiceValue, invoiceSelected.invoiceId, productsNote, totalsNote, typeNote, isEdit),
                isEdit,
                invoiceSelected.id || ''
            )
        );
        cleanData();

        setShowSuccess(true);
    };

    return (
        <>
            <ModalType
                show={showSuccess}
                showModal={(): void => {
                    setShowSuccess(!showSuccess);
                    setInvoice({ ...invoiceSelected, id: '', typeNote: '' });
                }}
                type="save"
                mainAction={(): void => setInvoice({ ...invoiceSelected, id: '', typeNote: '' })}
                title="Información guardada"
                withUpdateMessage={false}
                text="¡Su información ha sido guardada con éxito!"
            />
            <ModalType
                show={showTrashModal}
                showModal={(): void => setShowTrashModal(!showTrashModal)}
                type="delete"
                title={MODAL_INFORMATION.DELETE_TITLE}
                text={
                    <div className="space-y-4">
                        <p>
                            ¿Está seguro que desea eliminar los &nbsp;
                            {productsNote.filter((item: IGenericRecord) => item.isChecked)?.length} elementos seleccionados?
                        </p>
                        <p>Los elementos eliminados son llevados a la papelera.</p>
                    </div>
                }
                mainAction={deleteRowTables}
            />
            <FormInvoicePurchase
                optionsPrefix={storePrefix}
                fieldsDisabled={formFieldsDisabled}
                isNote
                isEdit={isEdit}
                typeNote={typeNote}
                invoiceValue={invoiceValue}
                setInvoiceValue={setInvoiceValue}
                requiredFields={requiredFields}
                setRequiredFields={setRequiredFields}
                modalSupplier={false}
                taxpayerSelected={taxpayerSelected}
                setTaxpayerSelected={setTaxpayerSelected}
                getDynamicRequest={getDynamicRequest}
                validateFiscalRepeated={false}
                requiredTextFiscalRepeated={[]}
                fiscalResponsibilitiesOptions={fiscalResponsibilitiesOptions}
                validateFiscalResponsibilities={false}
                handleModalSupplier={(): void => {}}
                setValidateSupplier={(): void => {}}
                validateRepeatFiscal={(): boolean => false}
                information={information}
                validateForm={validateForm}
            />

            {PURCHASE_NOTE.TABLE_DESCRIPTION}

            <TableNoteSupplier
                is_annulled={!!invoiceValue.is_annulled}
                productsInvoice={productOptions || []}
                productsNote={productsNote}
                setProductsNote={setProductsNote}
                totals={totalsNote}
                checkSelect={checkSelect}
                setCheckSelect={setCheckSelect}
                showTrashModal={showTrashModal}
                setShowTrashModal={setShowTrashModal}
                validate={validate}
                emptyFieldsError={emptyFieldsError}
                discountError={discountError}
                quantityError={quantityError}
                isCredit={typeNote === CREDIT}
            />

            <PageButtonsFooter
                moduleId={ModuleApp.ELECTRONIC_INVOICE}
                titleButtonLeft={TitleButtons.BACK}
                titleButtonRight={TitleButtons.SAVE}
                onClickButtonLeft={(): void => {
                    cleanData();
                    setInvoice({ ...invoiceSelected, id: '', typeNote: '' });
                }}
                onClickButtonRight={(): void => {
                    saveNote(isEdit);
                }}
                disabledRight={disabledInputs}
            />
        </>
    );
};
