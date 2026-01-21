import React, { useState } from 'react';
import { ZERO } from '@constants/Numbers';
import { VALIDATION_CUDE } from '@constants/FieldsValidation';
import { MaxLengthFields, NameInputs } from '@constants/PurchaseInvoiceNotes';
import { Form } from '@components/form';
import CollapseJsx from '@components/Collapse-jsx/CollapseJsx';
import { DatePickerDayInput, MoneyInput, SelectInput, TextInput } from '@components/input';
import { InputSelectTime } from '@components/form-invoice-purchase/components/input-select-time';
import { TOOLTIPS_FORM } from '@information-texts/PurchaseNote';
import { anyDateToUnix } from '@utils/Date';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { INoteFormProps, PROPS_TO_INPUTS } from '.';

export const NoteForm: React.FC<INoteFormProps> = ({
    submit,
    customErrors,
    formPurchaseNote: { supplier, ...formPurchaseNote },
    handleText,
    handleDate,
    handleTime,
    handleNumber,
}) => {
    const [openTime, setOpenTime] = useState<boolean>(false);

    return (
        <Form className="note-form">
            <TextInput
                id={generateId({
                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                    submodule: `form-cude`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                required={submit && customErrors.includes(NameInputs.DocumentUuid)}
                value={formPurchaseNote.document_uuid}
                classesWrapper="input-style__large"
                maxLength={MaxLengthFields.Cude}
                requiredText={VALIDATION_CUDE}
                name={NameInputs.DocumentUuid}
                alphanumericNoWhitespace
                {...TOOLTIPS_FORM.CUDE}
                onChange={handleText}
                labelText="CUDE:"
            />
            <SelectInput
                id={generateId({
                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                    submodule: `form-number-supplier-invoice`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                value={formPurchaseNote.supplier_invoice_number || ''}
                labelText="Número de factura de compra asociada:"
                {...TOOLTIPS_FORM.NUMBER_SUPPLIER_INVOICE}
                {...PROPS_TO_INPUTS}
            />
            <fieldset className="note-form__group">
                <TextInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-prefix`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    required={submit && !formPurchaseNote.prefix}
                    maxLength={MaxLengthFields.Prefix}
                    value={formPurchaseNote.prefix}
                    classesWrapper="input-style"
                    name={NameInputs.Prefix}
                    {...TOOLTIPS_FORM.PREFIX}
                    labelText="*Prefijo:"
                    onChange={handleText}
                    lettersWithAccent
                />
                <MoneyInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-number`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    required={submit && !formPurchaseNote.number}
                    onChange={handleNumber(NameInputs.Number)}
                    labelText="*Número nota débito:"
                    value={formPurchaseNote.number}
                    classesWrapper="input-style"
                    withIcon={false}
                    decimals={ZERO}
                />
            </fieldset>
            <fieldset className="note-form__group">
                <DatePickerDayInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-date`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    selected={anyDateToUnix(formPurchaseNote.date)}
                    classesWrapper="note-form__input-date"
                    labelText="*Fecha de emisión"
                    onChangeDate={handleDate}
                    maxDate={new Date()}
                    name="date"
                />
                <InputSelectTime
                    setTimeValue={({ time_issue }): void => handleTime(time_issue)}
                    timeValue={formPurchaseNote}
                    setTimePicker={setOpenTime}
                    timePicker={openTime}
                    className="margin-0"
                />
                <DatePickerDayInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-date-limit`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    selected={anyDateToUnix(formPurchaseNote.date_limit)}
                    classesWrapper="note-form__input-date"
                    labelText="*Fecha de vencimiento"
                    onChangeDate={handleDate}
                    name="date_limit"
                />
            </fieldset>
            <h3 className="text-base font-allerbold text-gray-dark">Información de su proveedor:</h3>
            <fieldset className="note-form__group">
                <TextInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-supplier`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    {...TOOLTIPS_FORM.SUPPLIER}
                    labelText="*Proveedor:"
                    value={supplier.name}
                    {...PROPS_TO_INPUTS}
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-supplier-document-type`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    {...TOOLTIPS_FORM.DOCUMENT_TYPE}
                    labelText="*Tipo de documento:"
                    value={supplier.document_name}
                    {...PROPS_TO_INPUTS}
                />
            </fieldset>
            <fieldset className="note-form__group">
                <TextInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-supplier-document-number`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    {...TOOLTIPS_FORM.DOCUMENT_NUMBER}
                    labelText="*Número de documento:"
                    value={supplier.document_number}
                    {...PROPS_TO_INPUTS}
                />
                <SelectInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-supplier-taxpayer-type`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    value={supplier.type_taxpayer_name}
                    labelText="*Tipo de contribuyente:"
                    {...TOOLTIPS_FORM.TAXPAYER_TYPE}
                    {...PROPS_TO_INPUTS}
                />
            </fieldset>
            <TextInput
                id={generateId({
                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                    submodule: `form-payment-type`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                value={formPurchaseNote.payment_type_name}
                {...TOOLTIPS_FORM.PAYMENT_TYPE}
                labelText="*Forma de pago:"
                {...PROPS_TO_INPUTS}
            />
            <fieldset className="note-form__group">
                <TextInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-payment-method`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    value={formPurchaseNote.payment_method}
                    {...TOOLTIPS_FORM.PAYMENT_METHOD}
                    labelText="*Medio de pago:"
                    {...PROPS_TO_INPUTS}
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-foreign-currency`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    value={formPurchaseNote.foreign_exchange_name}
                    {...TOOLTIPS_FORM.FOREIGN_CURRENCY}
                    {...PROPS_TO_INPUTS}
                    labelText="*Divisa:"
                />
            </fieldset>
            {!!formPurchaseNote.foreign_exchange_rate && (
                <MoneyInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-foreign-exchange-rate`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    value={formPurchaseNote.foreign_exchange_rate}
                    labelText="*Tasa de cambio:"
                    {...PROPS_TO_INPUTS}
                    withIcon={false}
                />
            )}
            <CollapseJsx
                wrapperClass="note-form__collapse"
                title="Información opcional"
                data={
                    <section className="flex flex-col gap-y-4.5">
                        <fieldset className="note-form__group">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                                    submodule: `form-number-purchase-order`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={formPurchaseNote.number_purchase_order}
                                labelText="Número de orden de compra:"
                                {...PROPS_TO_INPUTS}
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                                    submodule: `form-purchase-manager`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={formPurchaseNote.purchasing_manager || ''}
                                labelText="Encargado de la compra:"
                                {...PROPS_TO_INPUTS}
                            />
                        </fieldset>
                        <fieldset className="note-form__group">
                            <SelectInput
                                id={generateId({
                                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                                    submodule: `form-purchase-manager-document-type`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                value={formPurchaseNote.document_type_purchasing_manager_name || ''}
                                labelText="Tipo de documento encargado de la compra:"
                                {...PROPS_TO_INPUTS}
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                                    submodule: `form-purchase-manager-document-number`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                labelText="Número de documento del encargado de la compra:"
                                value={formPurchaseNote.document_number_purchasing_manager}
                                {...PROPS_TO_INPUTS}
                            />
                        </fieldset>
                    </section>
                }
            />
        </Form>
    );
};
