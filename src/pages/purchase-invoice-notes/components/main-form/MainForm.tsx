import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { NameInputs } from '@constants/PurchaseInvoiceNotes';
import { TOOLTIPS_FORM } from '@information-texts/PurchaseNote';
import { Form } from '@components/form';
import { SelectSearchInput } from '@components/input';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { IMainFormProps, UTILS } from '.';

export const MainForm: React.FC<IMainFormProps> = ({ mainForm, submit, handleMainForm }) => {
    const { utils, documents } = useSelector((state: RootState) => ({
        utils: state.utils.utils,
        documents: state.electronicInvoice.responseList.data,
    }));

    return (
        <Form className="main-form">
            <fieldset className="main-form__group">
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-invoice-type`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    onChangeSelect={handleMainForm(NameInputs.InvoiceType)}
                    required={submit && !mainForm.invoice_type}
                    valueSelect={mainForm.invoice_type}
                    optionSelect={UTILS.optionsType}
                    selectIconType="arrowDownGreen"
                    classesWrapper="input-style"
                    labelText="*Tipo de nota:"
                />
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.PURCHASE_INVOICE_NOTES,
                        submodule: `form-invoice-id`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    onChangeSelect={handleMainForm(NameInputs.InvoiceId)}
                    optionSelect={UTILS.buildOptionsDocuments(documents)}
                    required={submit && !mainForm.invoice_id}
                    valueSelect={mainForm.invoice_id}
                    labelText="*Documento asociado:"
                    selectIconType="arrowDownGreen"
                    classesWrapper="input-style"
                />
            </fieldset>
            <SelectSearchInput
                id={generateId({
                    module: ModuleApp.PURCHASE_INVOICE_NOTES,
                    submodule: `form-reason-rejected`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                optionSelect={UTILS.buildOptionsReason(utils?.reason_rejections, mainForm.invoice_type)}
                onChangeSelect={handleMainForm(NameInputs.ReasonRejectionId)}
                required={submit && !mainForm.reason_rejection_description}
                valueSelect={mainForm.reason_rejection_id}
                selectIconType="arrowDownGreen"
                classesWrapper="input-style"
                {...TOOLTIPS_FORM.REASON}
                labelText="*Motivo:"
            />
        </Form>
    );
};
