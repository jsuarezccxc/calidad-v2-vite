import { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { IRadioButtons } from '@hooks/useRadioButton';
import { lengthEqualOne, lengthEqualToZero } from '@utils/Length';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { COUNTED, FormNameInputs } from '@constants/CancellationElectronic';
import { YES } from '@constants/RadioButtonOptions';
import { NATURAL_PERSON, OTHERS, SIMPLE_REGIMEN } from '@constants/DynamicRequest';
import { radioButtonKeys } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { EMPTY } from '@pages/correction-business-document';
import { IOptionSelect } from '@components/input';
import { codeReasonRejection } from '@components/electronic-note';


export const handleChangeClientOrSupplier = (
    option: IOptionSelect,
    setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
    clientsOrSuppliers: IGenericRecord[],
    fieldInputs: IGenericRecord,
    isSupportDocument: boolean
): void => {
    const selectedCustomerOrSupplier = clientsOrSuppliers.find(clientOrSupplier => option.key === clientOrSupplier.id);
    setFieldInputs({
        ...fieldInputs,
        ...(isSupportDocument
            ? { supplier_name: { value: selectedCustomerOrSupplier?.name, required: false }, person: selectedCustomerOrSupplier?.person, person_id: selectedCustomerOrSupplier?.person_id }
            : { customer_name: { value: selectedCustomerOrSupplier?.name, required: false },  client_id: selectedCustomerOrSupplier?.client_id }),
        email: { value: selectedCustomerOrSupplier?.email, required: false },
        address: {
            value: selectedCustomerOrSupplier?.address || selectedCustomerOrSupplier?.person?.address || '',
            required: false,
        },
        phone: { value: selectedCustomerOrSupplier?.phone, required: false },
        customer_document_number: {
            required: false,
            value: selectedCustomerOrSupplier?.document_number,
        },
        customer_document_type: {
            id: selectedCustomerOrSupplier?.document_type,
            value: selectedCustomerOrSupplier?.document_name,
        },
    });
};

export const assignCustomerFields = (
    invoiceCorrection: IGenericRecord,
    setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
    fieldInputs: IGenericRecord
): void => {
    if (lengthEqualToZero(Object.keys(invoiceCorrection))) return;
    setFieldInputs({
        ...fieldInputs,
        customer_name: {
            required: false,
            value: invoiceCorrection.person.customer.name,
        },
        customer_document_type: {
            ...fieldInputs.customer_document_type,
            id: invoiceCorrection.person.document_type,
            value: invoiceCorrection.person.document_type_name,
        },
        customer_document_number: {
            required: false,
            value: invoiceCorrection.person.document_number,
        },
        tax_detail: {
            ...fieldInputs.tax_detail,
            id: invoiceCorrection.person.customer.tax_details_code,
            value: invoiceCorrection.person.customer.tax_details_name,
        },
        fiscal_responsibility: {
            value: invoiceCorrection.person.fiscal_responsibilities,
        },
    });
};

export const handleChangeSelectMandate = (
    option: IOptionSelect,
    fieldInputs: IGenericRecord,
    setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
    name: string
): void => {
    setFieldInputs({
        ...fieldInputs,
        [name]: {
            value: option.id,
        },
    });
};

export const handleChangeSelect = (
    option: IOptionSelect,
    fieldInputs: IGenericRecord,
    setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
    utilsData: IGenericRecord,
    isDebitNote: boolean,
    setTaxpayerSelected: Dispatch<SetStateAction<string>>,
    name: string,
    item?: IGenericRecord
): void => {
    const isReasonRejection = name === FormNameInputs.REASON_REJECTION;
    const isTypeTaxpayer = name === FormNameInputs.TYPE_TAXPAYER;
    const isNaturalPerson = option.value === NATURAL_PERSON;
    const fiscalResponsibilitiesByNatural = isNaturalPerson
        ? fieldInputs?.fiscal_responsibility?.value?.filter((item: IGenericRecord) =>
              [SIMPLE_REGIMEN, OTHERS].includes(item.fiscal_responsibility_name)
          )
        : [];
    setFieldInputs({
        ...fieldInputs,
        ...(name === FormNameInputs.PAYMENT_TYPE &&
            option.value === COUNTED && {
                due_date: fieldInputs.date_issue,
            }),
        [name]: option.value
            ? {
                  ...fieldInputs[name],
                  value: option.value,
                  id: option.id,
                  required: isReasonRejection ? false : !option.value,
                  ...(isReasonRejection
                      ? codeReasonRejection(option.id || '', utilsData?.reason_rejections || [], isDebitNote)
                      : {}),
              }
            : { ...fieldInputs[name], value: option, name: item?.name },
        ...(isTypeTaxpayer && {
            fiscal_responsibility: {
                value: lengthEqualOne(fiscalResponsibilitiesByNatural)
                    ? fiscalResponsibilitiesByNatural
                    : isNaturalPerson
                    ? [{ id: uuid(), fiscal_responsibility_name: '', fiscal_responsibility_id: '' }]
                    : fieldInputs?.fiscal_responsibility?.value,
            },
        }),
    });
    isTypeTaxpayer && setTaxpayerSelected(option.value);
    if (option.value === EMPTY) {
        const nameInput =
            name === FormNameInputs.SELLER_TYPE_DOCUMENT
                ? FormNameInputs.SELLER_DOCUMENT_NUMBER
                : FormNameInputs.PURCHASE_NUMBER_DOCUMENT_NUMBER;
        setFieldInputs({
            ...fieldInputs,
            [nameInput]: {
                ...fieldInputs[nameInput],
                required: false,
                value: '',
            },
            [name]: {
                ...fieldInputs[name],
                id: '',
                value: '',
            },
        });
    }
};

export const handleErrorStock = (tableMain: IGenericRecord[], products: IGenericRecord[]): string[] => {
    const errorsQuantity: string[] = [];
    tableMain.forEach((item: IGenericRecord) => {
        const { is_product = false } =
            products.find((itemProduct: IGenericRecord) => itemProduct.sku_internal === item.sku_internal.value) || {};
        if (item.quantity && is_product && stringToFloat(item.quantity) > stringToFloat(item.quantityMax)) {
            errorsQuantity.push(
                `Ingrese máximo ${Intl.NumberFormat().format(stringToFloat(item.quantityMax))} cantidades del producto ${
                    item.sku
                }`
            );
        }
    });
    return errorsQuantity;
};

export const assignValuesRadioButton = (
    radioButtons: IRadioButtons,
    changeRadioButton: string,
    setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
    fieldInputs: IGenericRecord
): void => {
    const isActive = radioButtons[changeRadioButton] === YES;
    setFieldInputs({ ...fieldInputs, [radioButtonKeys[changeRadioButton]]: isActive });
};
