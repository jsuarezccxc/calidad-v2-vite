import { ChangeEvent, IPropsInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

export { OptionalInvoiceFields } from './OptionalInvoiceFields';

/**
 * This interface describes the props of the form fields
 *
 * @typeParam data: IGenericRecord - Form data
 * @typeParam utils: IGenericRecord - Utility data
 * @typeParam handleValueChange: (e: ChangeEvent) => void - Function to update invoice data
 * @typeParam updateData: (data: IGenericRecord) => void - Function to update invoice data
 */
export interface IOptionalInvoiceFieldsProps {
    data: IGenericRecord;
    utils: IGenericRecord;
    handleValueChange: (e: ChangeEvent) => void;
    updateData: (data: IGenericRecord) => void;
}

/**
 * Field names
 */
enum FieldName {
    PurchaseOrderNumber = 'number_purchase_order',
    SalesManager = 'sales_manager',
    ManagerDocumentNumber = 'document_number_sales_manager',
    ManagerDocumentType = 'document_type_purchasing_manager',
    SalesManagerDocumentTypeId = 'document_type_sales_manager',
}

/**
 * This returns the props of each field
 *
 * @param data: IGenericRecord - Invoice data
 * @returns { [key: string]: IPropsInput }
 */
export const getFieldProps = (data: IGenericRecord): { [key: string]: IPropsInput } => {
    const {
        SalesManager,
        ManagerDocumentType,
        PurchaseOrderNumber,
        ManagerDocumentNumber,
        SalesManagerDocumentTypeId,
    } = FieldName;
    return {
        [PurchaseOrderNumber]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-purchase-order-number`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Número de orden de compra:',
            name: PurchaseOrderNumber,
            classesWrapper: 'form-field',
            value: data?.[PurchaseOrderNumber],
            onlyNumbers: true,
            placeholder: '...',
            maxLength: 100,
        },
        [SalesManager]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-sales-manager`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Encargado de la venta:',
            name: SalesManager,
            classesWrapper: 'form-field',
            value: data?.[SalesManager],
            placeholder: '...',
            maxLength: 240,
        },
        [ManagerDocumentNumber]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-document-number-manager`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Número de documento del encargado de la venta:',
            name: ManagerDocumentNumber,
            classesWrapper: 'form-field',
            value: data?.[ManagerDocumentNumber],
            placeholder: '...',
            onlyNumbers: true,
            maxLength: 10,
        },
        [ManagerDocumentType]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-document-type-manager`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Tipo de documento encargado de la venta:',
            name: ManagerDocumentType,
            classesWrapper: 'form-field',
            value: data?.[ManagerDocumentType],
        },
        [SalesManagerDocumentTypeId]: {
            id: generateId({
                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                submodule: `${ModuleApp.ELECTRONIC_INVOICE}-document-type-manager`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            }),
            labelText: 'Tipo de documento encargado de la venta:',
            name: SalesManagerDocumentTypeId,
            classesWrapper: 'form-field',
            value: data?.[SalesManagerDocumentTypeId],
        },
    };
};
