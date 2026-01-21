import { SelectSearchOption } from 'react-select-search';
import { sortArrayAlphabetically } from '@utils/Array';
import { IGenericRecord } from '@models/GenericRecord';
import { MaxLengthFields } from '@constants/ElectronicInvoice';
import { VALIDATIONS_INVOICES } from '@information-texts/ElectronicInvoice';
import { IBUA } from '@constants/BuildProduct';
import { stringToFloat } from '@utils/ElectronicInvoice';
export { TableWarehouse } from './table-warehouse/TableWarehouse';
export { FooterTotal } from './footer-total/FooterTotal';
export { changeBodyModal } from './change-body-modal/ChangeBodyModal';

interface ISelectSearchOption extends SelectSearchOption {
    key?: string;
}

export const headersTableWarehouse = [
    {
        title: 'Producto',
        wrapperClassName: 'table-cell header__w-209',
        className: 'w-full',
    },
    {
        title: 'Unidad de medida',
        wrapperClassName: 'table-cell header__w-192',
        className: 'w-full',
    },
    {
        title: 'Lote',
        wrapperClassName: 'table-cell header__w-160',
        className: 'w-full',
    },
    {
        title: 'Fecha de vencimiento',
        wrapperClassName: 'table-cell header__w-160',
        className: 'w-full',
    },
    {
        title: 'Bodega',
        wrapperClassName: 'table-cell header__w-211',
        className: 'w-full',
    },
    {
        title: 'Cantidades disponibles en bodega',
        wrapperClassName: 'table-cell header__w-165',
        className: 'w-full',
    },
    {
        title: 'Capacidad máxima en la bodega',
        wrapperClassName: 'table-cell header__w-165',
        className: 'w-full',
    },
    {
        title: 'Cantidades para distribuir en la bodega',
        wrapperClassName: 'table-cell header__w-175',
        className: 'w-full',
    },
    {
        title: '',
    },
];

export enum TYPE_MODAL {
    INFO_PAGE_SUPPORT = 'INFO_PAGE_SUPPORT',
    NEW_SUPPLIER = 'NEW_SUPPLIER',
    TABLE = 'TABLE',
}

export enum typeDeleteItemTable {
    BATCH = 'BATCH',
    WAREHOUSE = 'WAREHOUSE',
}

/**
 * Constant for uneditable elements
 */
export const UNEDITABLE = 'uneditable';

/**
 * Constant for editable elements
 */
export const EDITABLE = 'editable';

export const optionsTable = (
    listOptionsTable: ISelectSearchOption[],
    product: IGenericRecord,
    key = 'unique_product_name',
    keyId = 'unique_product_name'
): ISelectSearchOption[] => onSearchOptions(sortArrayAlphabetically(listOptionsTable || []), product, key, keyId);

const onSearchOptions = (
    options: ISelectSearchOption[],
    item: IGenericRecord,
    key = 'unique_product_name',
    keyId = 'unique_product_name'
): ISelectSearchOption[] => {
    if (item?.[keyId]) {
        return [
            ...options,
            {
                name: item?.[key],
                value: item?.[keyId],
                key: item.unique_products_id,
            },
        ];
    }
    return options;
};

const fieldsNumberValidation = ['unit_cost', 'quantity'];
const messagesForValidation: IGenericRecord = {
    unit_cost: VALIDATIONS_INVOICES.UNIT_COST,
    quantity: VALIDATIONS_INVOICES.QUANTITY_ZERO,
    percentage_discount: VALIDATIONS_INVOICES.PERCENTAGE_DISCOUNT,
};

export const validationTables = (dataTable: IGenericRecord[]): string[] => {
    const messagesValidation: string[] = [];
    dataTable.forEach((item: IGenericRecord) => {
        if (
            item.percentage_discount > MaxLengthFields.PERCENTAGE_DISCOUNT &&
            !messagesValidation.includes(messagesForValidation.percentage_discount)
        )
            messagesValidation.push(messagesForValidation.percentage_discount);
        Object.keys(item).forEach(key => {
            if (fieldsNumberValidation.includes(key) && (!item[key] || item[key] <= MaxLengthFields.ZERO)) {
                !messagesValidation.includes(messagesForValidation[key]) && messagesValidation.push(messagesForValidation[key]);
            }
        });
    });
    return messagesValidation;
};

export const classFields = (is_inventoriable: boolean, isAnnulation: boolean): string =>
    !is_inventoriable || isAnnulation ? UNEDITABLE : EDITABLE;

export const countTableFooter = (data: IGenericRecord[]): IGenericRecord => {
    let discount = 0;
    let total = 0;
    let taxes = 0;
    data.forEach(({ discount: itemDiscount, total_buy, taxes_invoice, quantity, product_taxes }: IGenericRecord) => {
        discount += stringToFloat(itemDiscount);
        total += stringToFloat(total_buy);
        const selectedTaxOrigin = taxes_invoice || product_taxes;
        selectedTaxOrigin?.forEach(({ tax_name, tax_value, tax_rate }: IGenericRecord) => {
            taxes += tax_name === IBUA ? Number(quantity) * tax_value : (total_buy * tax_rate) / 100;
        });
    });

    return {
        discount,
        total,
        taxes,
    };
};
