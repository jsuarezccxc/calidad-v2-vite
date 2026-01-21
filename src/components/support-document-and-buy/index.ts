/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { IGenericRecord } from '@models/GenericRecord';
import { ISupportDocumentForm } from '@models/SupportDocument';
import { IOptionsForm } from '@models/CorrectCancelElectronicDocument';
import { IErrorsTableRetention, IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { COLOMBIA_ID } from '@constants/Location';
import { NA } from '@constants/ElectronicInvoice';
import { keysSupplier } from '@constants/Supplier';
import { CONSUMPTION, IVA } from '@constants/BuildProduct';
import { CREDIT } from '@constants/CancellationElectronic';
import { assignValue } from '@utils/Json';
import { currentDateInUnix } from '@utils/Date';
import { lengthEqualToZero } from '@utils/Length';
import { calculatePercentage } from '@utils/Number';
import { formatInitialNumber } from '@utils/Decimals';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { IOptionSelect } from '@components/input';
import { IDataTableTotals } from '@components/table-totals';
import { ChangeEvent, IEntity } from '@components/radiobutton';
import { IRequiredFieldsTable } from '@components/table-invoice';
import { ITotalInvoiceTablesProps } from '@components/electronic-document';
import { TYPE_MODAL } from './components';

export * from './SupportDocumentAndBuy';

/**
 * This interface is options supplier
 * 
 * @typeParam suppliers: IOptionSelect[] - Options supplier
 */
export interface IOptionsSupportForm extends IOptionsForm {
    suppliers: IOptionSelect[];
}

/**
 * This interface is props support document
 * 
 * @typeParam products: IGenericRecord[] - Products stock
 * @typeParam className?: string - Custom class
 * @typeParam fieldsValues: ISupportDocumentForm - State fields values
 * @typeParam setFieldsValues: Dispatch<SetStateAction<ISupportDocumentForm>> - Dispatch state fields values 
 * @typeParam tableDetail: IInvoiceDetails[] - State table detail
 * @typeParam setTableDetail: Dispatch<SetStateAction<IInvoiceDetails[]>> - Dispatch state table detail
 * @typeParam tableRetention: ITableTaxesAndRetention[] - State table retention
 * @typeParam setTableTaxes: Dispatch<SetStateAction<ITableTaxesAndRetention[]>> - Dispatch state table taxes
 * @typeParam setTableRetention: Dispatch<SetStateAction<ITableTaxesAndRetention[]>> - Dispatch state table retentions
 * @typeParam tableTotals: IDataTableTotals[] - State table totals
 * @typeParam setTableTotals: Dispatch<SetStateAction<IDataTableTotals[]>> - Dispatch state table totals
 * @typeParam optionsForm: IOptionsSupportForm - Options form
 * @typeParam errorsCustom: string[] - Errors form
 * @typeParam errorsTableProduct: IRequiredFieldsTable - Errors table details
 * @typeParam errorsTableRetention: IErrorsTableRetention - Errors retentions
 * @typeParam isSubmit: boolean - If submit event
 */
export interface ISupportDocumentProps {
    products: IGenericRecord[];
    className?: string;
    fieldsValues: ISupportDocumentForm;
    setFieldsValues: Dispatch<SetStateAction<ISupportDocumentForm>>;
    tableDetail: IInvoiceDetails[];
    setTableDetail: Dispatch<SetStateAction<IInvoiceDetails[]>>;
    tableRetention: ITableTaxesAndRetention[];
    setTableTaxes: Dispatch<SetStateAction<ITableTaxesAndRetention[]>>;
    setTableRetention: Dispatch<SetStateAction<ITableTaxesAndRetention[]>>;
    tableTotals: IDataTableTotals[];
    setTableTotals: Dispatch<SetStateAction<IDataTableTotals[]>>;
    optionsForm: IOptionsSupportForm;
    errorsCustom: string[];
    errorsTableProduct: IRequiredFieldsTable;
    errorsTableRetention: IErrorsTableRetention;
    isSubmit: boolean;
}

//It is type Modals
export interface IStateModal {
    show: boolean;
    typeInfo: TYPE_MODAL;
}

// It is type tables
export enum typeTableSupport {
    PRODUCT = 'PRODUCT',
    SERVICE = 'SERVICE',
    PRODUCT_SERVICE = 'PRODUCT_SERVICE',
}

/**
 * Option that represents the max lenght of description input
 */
export const MAX_LENGHT_PERCENTAGE = 4;

//it is option products and services
export const optionsSelectProdSer = [
    {
        key: uuid(),
        value: 'Productos',
        id: typeTableSupport.PRODUCT,
        code: uuid(),
    },
    {
        key: uuid(),
        value: 'Servicios',
        id: typeTableSupport.SERVICE,
        code: uuid(),
    },
    {
        key: uuid(),
        value: 'Productos y servicios',
        id: typeTableSupport.PRODUCT_SERVICE,
        code: uuid(),
    },
];

//This constant is the initial state for the products and services table
export const initialDataTable = (index: number, isProduct: boolean): IGenericRecord => {
    return {
        number: formatInitialNumber(index),
        id: uuid(),
        total_buy: 0,
        reference: null,
        unit_cost: 0,
        sku_internal: '',
        unique_product_name: '',
        unique_products_id: '',
        warehouse_id: '',
        warehouse_name: '',
        batch: '',
        batch_id: null,
        batch_id_temp: uuid(),
        input_date_expiration: null,
        batch_detail_id: null,
        date_expiration: currentDateInUnix(),
        description: '',
        quantity: 0,
        unit_measurements_id: '',
        unit_value: 0,
        percentage_discount: 0,
        discount: 0,
        delivery_cost: 0,
        iva: '',
        ciiu_id: 2,
        is_product: isProduct,
        percentage: 0,
        check: false,
        checkBatch: false,
        checkWarehouse: false,
        is_inventoriable: false,
        total_stock: 0,
        quantityWarehouse: 0,
        maxQuantityWarehouse: 'N/A',
    };
};

// Validate Fields Support
export const validateFieldsSupport = (fieldInputs: IGenericRecord): boolean => {
    if (
        fieldInputs?.product_classification !== typeTableSupport.SERVICE &&
        !fieldInputs.isVariousWarehouse &&
        !fieldInputs.warehouseInput.id
    ) {
        return false;
    }
    if (!fieldInputs?.date_limit && fieldInputs?.payment_type_name === CREDIT) {
        return false;
    }
    return !(
        !fieldInputs?.payment_method_name ||
        !fieldInputs?.prefix_id ||
        !fieldInputs?.payment_type_id ||
        !fieldInputs?.document_number
    );
};

// Validate Products Table
export const validateProductsSupport = (products: IGenericRecord[]): boolean => {
    let validate = true;
    if (lengthEqualToZero(products)) {
        validate = false;
    }
    products?.forEach((product: IGenericRecord) => {
        if (
            !product?.sku_internal ||
            (!product?.taxes_invoice && !product?.taxes) ||
            !product?.unique_product_name ||
            !product?.unit_cost ||
            !product?.quantity
        ) {
            validate = false;
        }
        if (stringToFloat(product?.discount) > stringToFloat(product?.unit_value)) validate = false;
        if (product?.is_product && product?.is_inventoriable) {
            if (!product?.batch || !product?.input_date_expiration || !product?.quantityWarehouse || !product?.warehouse_id)
                validate = false;
        }
    });

    return validate;
};

/**
 * Data in radio button options
 */
export const dataRadioButton: IEntity[] = [
    {
        name: 'yes',
        label: 'SI',
    },
    {
        name: 'no',
        label: 'NO',
    },
];

//it is types RadioButton
export enum typeRadioButtonBuy {
    YES = 'yes',
    NO = 'no',
}

export const validateDistributionWarehouse = (products: IGenericRecord[] = []): IGenericRecord => {
    const uniqueProducts: {
        batchId: string;
        quantityBatch: number;
        batch: string;
        warehouse: string;
        warehouse_id: string;
        quantityWarehouse: number;
    }[] = [];
    const errors: { message: string; batchId: string }[] = [];
    products?.forEach((product: IGenericRecord) => {
        if (product.is_product && product.is_inventoriable) {
            const existArray = uniqueProducts.findIndex((item: IGenericRecord) => item.batchId === product.batch_id_temp);
            if (existArray !== -1) uniqueProducts[existArray].quantityWarehouse += stringToFloat(product.quantityWarehouse);
            if (existArray === -1) {
                uniqueProducts.push({
                    batchId: product.batch_id_temp,
                    quantityBatch: product.quantity,
                    batch: product.batch,
                    warehouse: product.warehouse_name,
                    quantityWarehouse: stringToFloat(product.quantityWarehouse),
                    warehouse_id: product.warehouse_id,
                });
            }
        }
    });
    uniqueProducts.forEach(item => {
        if (item.quantityWarehouse > item.quantityBatch)
            errors.push({ message: `*Has superado la cantidad del lote ${item.batch}`, batchId: item.batchId });
        if (item.quantityWarehouse < item.quantityBatch)
            errors.push({ message: `*Te faltan cantidades del lote ${item.batch} por distribuir`, batchId: item.batchId });
    });
    return {
        errors,
        validateError: lengthEqualToZero(errors),
    };
};

export const formatSupportDocument = (dataSupport: IGenericRecord): IGenericRecord => {
    const { products } = dataSupport;
    return {
        ...dataSupport,
        ...assignValue(keysSupplier, dataSupport),
        products: products?.map((product: IGenericRecord, index: number) => {
            const taxIVA = product.product_taxes?.find((tax: IGenericRecord) => tax?.tax?.type === 'IVA');
            const taxConsumption = product.product_taxes?.find((tax: IGenericRecord) => tax?.tax?.type === 'CONSUMPTION');

            const ivaObject = taxIVA
                ? {
                      tax_id: taxIVA.tax.id,
                      tax_name: taxIVA.tax.name,
                      tax_percentage: taxIVA.tax.percentage,
                      tax_type: IVA,
                  }
                : {};

            const consumptionObject = taxConsumption
                ? {
                      tax_id: taxConsumption.tax.id,
                      tax_name: taxConsumption.tax.name,
                      tax_percentage: taxConsumption.tax.percentage,
                      tax_type: CONSUMPTION,
                  }
                : {};
            return {
                ...initialDataTable(index + 1, product.is_product),
                ...product,
                taxes: product.product_taxes?.map((tax: IGenericRecord) => {
                    return {
                        tax_id: tax?.tax_id,
                    };
                }),
                batch: product.batch_number || product.is_inventoriable ? product.batch_number : NA,
                input_date_expiration: product.date_expiration || product.is_inventoriable ? product.date_expiration : NA,
                percentage_discount: calculatePercentage(stringToFloat(product.unit_value), stringToFloat(product.discount)),
                measurement: product.unit_measurement_name,
                percentage: taxConsumption?.tax.name,
                ivaObject,
                percentageOject: consumptionObject,
            };
        }),
    };
};

export const formatTaxesData = (taxesStructure: IGenericRecord[], withholdings: IGenericRecord[]): IGenericRecord[] =>
    taxesStructure?.map((tax: IGenericRecord) => {
        if (tax?.isEditNew) {
            return {
                ...tax,
            };
        }
        const { base: value, value: other_value = 0, percentage = 0 } =
            withholdings?.find((withholding: IGenericRecord) => withholding.title === tax.title) || {};
        return {
            ...tax,
            value,
            other_value,
            percentage,
        };
    });

export const defaultDataTotals: IGenericRecord[] = [
    {
        title: 'Total compra',
        field: 'total_sale',
        symbol: '',
        value: 0,
        className: '',
        disabled: true,
    },
    {
        title: 'Total descuento',
        field: 'total_discount',
        symbol: '-',
        value: 0,
        className: '',
        disabled: true,
    },
    {
        title: 'Costo de entrega',
        field: 'shipping_cost',
        symbol: '',
        value: 0,
        className: '',
        disabled: false,
    },
    {
        title: 'Total valor compra',
        field: 'total_sale_value',
        symbol: '',
        value: 0,
        className: '',
        disabled: true,
    },
    {
        title: 'Total IVA',
        field: 'total_iva',
        symbol: '',
        value: 0,
        className: '',
        disabled: true,
    },
    {
        title: 'Retefuente',
        field: 'retefuente',
        symbol: '-',
        value: 0,
        className: '',
        disabled: true,
    },
    {
        title: 'Reteica',
        field: 'reteica',
        symbol: '-',
        value: 0,
        className: '',
        disabled: true,
    },
    {
        title: 'Reteiva',
        field: 'reteiva',
        symbol: '-',
        value: 0,
        className: '',
        disabled: true,
    },
    {
        title: 'Total',
        field: 'total',
        symbol: '',
        value: 0,
        className: '',
        disabled: true,
    },
];

interface ITableTotals {
    onChangeProductTable: (e: ChangeEvent, item: IGenericRecord, index?: number) => void;
    setDataTaxes: (taxes: IGenericRecord[]) => void;
    fiscalResponsibilitiesOptions: IGenericRecord[];
    handleTotals: (e: ChangeEvent) => void;
    fields_tax_table: IGenericRecord;
    dataTotals: IGenericRecord[];
    dataTaxes: IGenericRecord[];
    totalsValues: IGenericRecord;
    fieldsInputs: IGenericRecord;
    totalIva: number;
}

export const propsTableTotals = (moreProps: ITableTotals): ITotalInvoiceTablesProps => ({
    ...moreProps,
    editableTotals: false,
    totalValues: false,
    isView: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBorder = (item: any): string => (!item || item === 0 || item === '0' ? 'border-purple' : '');

export const validateInfoSupplier = ({ department_id, city_id, country_id, document_type }: IGenericRecord): string => {
    if (!document_type || (country_id === COLOMBIA_ID && (!department_id || !city_id)))
        return '*Complete la información del proveedor';
    return '';
};

export const valueAssign = (options: IOptionSelect[], id: string): string => {
    const { value = '' } = options.find(option => option.id === id) || {};
    return value;
};

export const formatRequestProduct = (products: IGenericRecord[]): IGenericRecord[] =>
    products.map((product, index) => {
        if (!product.is_product || !product.is_inventoriable) return { ...product, discount: stringToFloat(product.discount) };
        const total = stringToFloat(product.quantityWarehouse) * stringToFloat(product.unit_cost);
        let discount = parseFloat((stringToFloat(product.discount) / stringToFloat(product.quantity)).toFixed(2));
        if (products.length - 1 === index) {
            discount =
                stringToFloat(product.discount) -
                discount * (stringToFloat(product.quantity) - stringToFloat(product.quantityWarehouse));
        } else {
            discount = discount * stringToFloat(product.quantityWarehouse);
        }
        const total_buy = total - discount;
        return { ...product, quantity: stringToFloat(product.quantityWarehouse), total_buy, unit_value: total, discount };
    });

/**
 * This const is for validate retention
 */
export const RETE_IVA = 'reteiva';

/**
 * This const is for validate total
 */
export const TOTAL = 'Total'; 
