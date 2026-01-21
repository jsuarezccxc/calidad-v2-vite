import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { RootState } from '@redux/rootReducer';
import { assignValue } from '@utils/Json';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { multiOptionsSelect } from '@utils/ElectronicNote';
import { calculatorDetail } from '@utils/ElectronicInvoice';
import { discardUntaxed, unitCostToDetails, validateTypeProduct } from '@utils/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { DEFAULT_BATCH, DEFAULT_DATE } from '@constants/ElectronicNote';
import { INIT_VALUE_PERCENTAGE } from '@constants/CancellationElectronic';
import { CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER } from '@constants/PurchaseInvoiceNotes';
import { InvoiceTableKeys, KEYS_ASSIGN_DETAIL, KEYS_HANDLE } from '@constants/TableInvoice';
import { CREDIT_NOTE, DEBIT_NOTE, INVOICE, MaxLengthFields, NA } from '@constants/ElectronicInvoice';
import { IHandleParam, ITableInvoiceProps, buildOptionsTable, ADD_PRODUCT_SERVICE } from '@components/table-invoice';
import usePermissions from './usePermissions';

/**
 * Hook to manage invoice details in an electronic invoice system.
 * 
 * @typeParam invoiceType: string - The type of invoice (e.g., DEBIT_NOTE, CREDIT_NOTE).
 * @typeParam foreignExchangeRate: number - The foreign exchange rate to apply to unit values.
 * @typeParam handleModal: () => void - Function to handle modal display for deletions.
 * @typeParam updateInvoiceDetails: (invoiceDetails: IInvoiceDetails[]) => void - Function to update invoice details in parent state.
 */
interface IParamsToHook {
    invoiceType: string;
    foreignExchangeRate: number;
    handleModal: () => void;
    updateInvoiceDetails: (invoiceDetails: IInvoiceDetails[]) => void;
}

/**
 * Return type of the useInvoiceDetails hook.
 * 
 * @typeParam invoiceDetails: IInvoiceDetails[] - The current list of invoice details.
 * @typeParam propsComponent: ITableInvoiceProps - Props to be passed to the TableInvoice component.
 * @typeParam handleDeleteDetail: () => void - Function to handle deletion of selected invoice details.
 * @typeParam setInvoiceDetails: Dispatch<SetStateAction<IInvoiceDetails[]>> - State setter for invoice details.
 */
interface IUseInvoiceDetails {
    invoiceDetails: IInvoiceDetails[];
    propsComponent: ITableInvoiceProps;
    handleDeleteDetail: () => void;
    setInvoiceDetails: Dispatch<SetStateAction<IInvoiceDetails[]>>;
}

/**
 * Custom hook to manage invoice details in an electronic invoice system.
 * 
 * @param param0: IParamsToHook - Parameters for the hook including invoice type, foreign exchange rate, modal handler, and update function.
 * @returns IUseInvoiceDetails
 */
const useInvoiceDetails = ({
    invoiceType,
    foreignExchangeRate,
    updateInvoiceDetails,
    handleModal,
}: IParamsToHook): IUseInvoiceDetails => {
    const { SKU, BATCH, WAREHOUSE, WAREHOUSE_ID, BATCH_ID, MANDATE } = InvoiceTableKeys;
    const { getPermissions } = usePermissions();
    const DoYouHaveWarehouse = getPermissions(
        getRouteName(Routes.WAREHOUSE_INVENTORY_CONTROL),
        getRouteName(Routes.HOME)
    );

    const { productsStock, suppliers, purchaseProducts, documentInvoiceDetails } = useSelector(
        ({ electronicInvoice, ...state }: RootState) => ({
            productsStock: electronicInvoice.products,
            suppliers: state.suppliers.suppliers?.data,
            purchaseProducts: state.reportNotesPurchase.invoice?.product || [],
            documentInvoiceDetails: electronicInvoice.document?.invoice_details || [],
        })
    );

    const [invoiceDetails, setInvoiceDetails] = useState<IInvoiceDetails[]>([]);
    const [selected, setSelected] = useState<{ id: string }[]>([]);

    const addMoreProducts = useMemo(() => {
        return [DEBIT_NOTE, INVOICE, DEBIT_NOTE_SUPPLIER].includes(invoiceType);
    }, [invoiceType]);
    const isAnyCreditNote = useMemo(() => {
        if (invoiceType === CREDIT_NOTE) {
            return invoiceDetails.length !== documentInvoiceDetails?.length;
        }
        if (invoiceType === CREDIT_NOTE_SUPPLIER) {
            return invoiceDetails.length !== purchaseProducts?.length;
        }
        return false;
    }, [invoiceType, invoiceDetails.length, documentInvoiceDetails?.length, purchaseProducts?.length]);
    const productsFromDocument = useMemo(() => {
        switch (invoiceType) {
            case CREDIT_NOTE:
                return documentInvoiceDetails || [];
            case CREDIT_NOTE_SUPPLIER:
                return purchaseProducts || [];
            default:
                return [];
        }
    }, [invoiceType, documentInvoiceDetails, purchaseProducts]);

    const buildDataProduct = (item: IInvoiceDetails, value: IGenericRecord): IInvoiceDetails => {
        const product = productsStock.find(product => product.id === value) || {};
        const uniqueProductTaxes = discardUntaxed(product.unique_product_taxes);
        let unit_value = unitCostToDetails(product, uniqueProductTaxes);
        if (foreignExchangeRate) unit_value = unit_value / foreignExchangeRate;
        return {
            ...item,
            ...validateTypeProduct(product),
            ...assignValue(KEYS_ASSIGN_DETAIL, product),
            ciiu_id: product.product.ciiu_id || '2',
            impoconsumption: INIT_VALUE_PERCENTAGE,
            iva: INIT_VALUE_PERCENTAGE,
            unit_value,
            quantity: 0,
            discount: 0,
            delivery_cost: 0,
            sale: unit_value,
            unit_cost: unit_value,
            total_buy: unit_value,
            percentage_discount: 0,
            product_taxes: uniqueProductTaxes,
            taxes: uniqueProductTaxes.map(({ company_tax_id, tax_value }) => ({ company_tax_id, tax_value })),
        };
    };

    const buildDataBatch = (item: IInvoiceDetails, field: string, id: string, value: IGenericRecord): IInvoiceDetails => {
        const assignValue = { ...item, [WAREHOUSE === field ? WAREHOUSE_ID : BATCH_ID]: id, [field]: value };
        const {
            multiBatch: [batch],
            batchDetailId,
        } = multiOptionsSelect(productsStock, [assignValue]);
        const currentBatch = lengthEqualToZero(batch)
            ? { batch_number: NA, date_expiration: NA }
            : { ...DEFAULT_BATCH, ...DEFAULT_DATE };
        return {
            ...assignValue,
            ...(BATCH === field && { batch_detail_id: batchDetailId, date_expiration: '' }),
            ...(WAREHOUSE === field ? currentBatch : {}),
        };
    };

    const handleOptionSelected = ({ field, index, target: { value = '', id = '' } }: IHandleParam): void => {
        setInvoiceDetails(
            invoiceDetails.map((item, indexState) => {
                if (indexState === index) {
                    if (field === SKU) {
                        return buildDataProduct(item, value);
                    }
                    if ([WAREHOUSE, BATCH].includes(field as InvoiceTableKeys)) {
                        return buildDataBatch(item, field, id, value);
                    }
                    if (field === MANDATE) {
                        return {
                            ...item,
                            [MANDATE]: id,
                            is_mandate: true,
                            mandate: suppliers.find((item: IGenericRecord) => item.id === id) || null,
                        };
                    }
                    return {
                        ...item,
                        [field]: value,
                        [`${field}_id`]: id,
                    };
                }
                return item;
            })
        );
    };

    const handleNumberInputs = ({ field, index, target: { floatValue } }: IHandleParam): void => {
        const updateState = invoiceDetails.map((item, indexState) => {
            if (indexState === index) {
                const update = {
                    ...item,
                    [field]:
                        field === InvoiceTableKeys.PERCENTAGE_DISCOUNT && (floatValue || 0) > MaxLengthFields.PERCENTAGE_DISCOUNT
                            ? item.percentage_discount
                            : floatValue,
                };
                return {
                    ...update,
                    ...calculatorDetail(update),
                };
            }
            return item;
        });
        updateInvoiceDetails(updateState);
        setInvoiceDetails(updateState);
    };

    const handleInputsTable = ({ field, index, target }: IHandleParam): void => {
        setInvoiceDetails(
            invoiceDetails.map((item, indexState) => {
                if (indexState === index) {
                    return {
                        ...item,
                        [field]: target.value,
                    };
                }
                return item;
            })
        );
    };

    const deleteProduct = (): void => {
        if (lengthGreaterThanZero(selected)) handleModal();
    };

    const handleDeleteDetail = (): void => {
        const updatedProducts = invoiceDetails.filter(product => !selected.some(item => item.id === product.id));
        setSelected([]);
        updateInvoiceDetails(updatedProducts);
        setInvoiceDetails(updatedProducts);
    };

    const addProductService = (): void => {
        const productsNote = [
            ...invoiceDetails,
            {
                ...ADD_PRODUCT_SERVICE,
                id: uuid(),
                new_product: false,
            },
        ];
        setSelected([]);
        setInvoiceDetails(productsNote);
    };

    const onChangeTable = (param: IHandleParam): void => {
        const { field } = param;
        if (KEYS_HANDLE.CHANGE_OPTIONS.includes(field as InvoiceTableKeys)) handleOptionSelected(param);
        if (KEYS_HANDLE.CHANGES_NUMBERS.includes(field as InvoiceTableKeys)) handleNumberInputs(param);
        if (KEYS_HANDLE.CHANGES_TEXT.includes(field as InvoiceTableKeys)) handleInputsTable(param);
    };

    return {
        invoiceDetails,
        propsComponent: {
            selected,
            symbol: '$',
            isMandate: false,
            data: invoiceDetails,
            options: buildOptionsTable({
                invoiceDetails: productsFromDocument,
                noteDetails: invoiceDetails,
                products: productsStock,
                addMoreProducts,
                suppliers,
            }),
            warningsStock: DoYouHaveWarehouse ? [] : [],
            redirectRoute: getRoute(Routes.HOME),
            showAddProduct: addMoreProducts || isAnyCreditNote,
            setSelected,
            onChangeTable,
            deleteProduct,
            addProductService,
        },
        setInvoiceDetails,
        handleDeleteDetail,
    };
};

export default useInvoiceDetails;
