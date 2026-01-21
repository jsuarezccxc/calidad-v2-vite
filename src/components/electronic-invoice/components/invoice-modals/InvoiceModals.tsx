import React, { useMemo } from 'react';
import { IModalUpdateCustomer, IModalUpdateDocumentNumber, tableEditCustomer, validateNumber } from '.';
import { TitleButtons } from '@constants/Buttons';
import { Button } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { TypeNamesInputs } from '@components/electronic-invoice';
import { CUSTOMER_UPDATE_MODAL } from '@information-texts/CreateElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import './InvoiceModals.scss';

export const ModalUpdateCustomer: React.FC<IModalUpdateCustomer> = ({
    showModal,
    setShowModal,
    updateFields,
    fieldInput,
    customerInformation,
    discardChanges,
    saveAndSend,
    isQuote,
}) => {
    const { name = '', documentNumber = '' } = customerInformation;
    const isGreaterThanSix = useMemo(() => updateFields.length > validateNumber.six, [updateFields]);
    const tableEdit = useMemo(() => tableEditCustomer.filter(({ value }) => updateFields.includes(value)), [
        tableEditCustomer,
        updateFields,
    ]);

    const fiscalResponsibilityValue = (fiscalResponsibilities: IGenericRecord[]): string =>
        fiscalResponsibilities.map(item => item.name ?? item.fiscal_responsibility_name).join(' / ');

    return (
        <ModalCustom
            show={showModal}
            showModal={(): void => {
                setShowModal(false);
            }}
            classesWrapper={`modal--full ${isGreaterThanSix ? 'modal-update lg:w-40' : ''}`}
            classesModal={`modal--full xs:p-24 ${isGreaterThanSix ? 'w-max' : 'w-min'}`}
        >
            {CUSTOMER_UPDATE_MODAL.TITLE}
            {CUSTOMER_UPDATE_MODAL.UPDATE(documentNumber, false, name, isQuote)}
            <div className={`flex ${!isGreaterThanSix ? 'justify-center' : ''} w-full my-2`}>
                <div className="container-update-customer">
                    {tableEdit.map((item, index) => (
                        <div
                            key={index}
                            className={`container-update-customer__row-title ${
                                index === validateNumber.five ? 'container-update-customer__row-title--border-button' : ''
                            }`}
                        >
                            <div className="container-update-customer__row-title__style-title">
                                <p className="break-words container-update-customer__paragraph-text">{item.name}</p>
                            </div>
                            <div className="container-update-customer__row-title__style-value">
                                <p className="break-all container-update-customer__paragraph-text">
                                    {TypeNamesInputs.FISCAL_RESPONSIBILITIES_SNAKE === item.value
                                        ? fiscalResponsibilityValue(fieldInput[item.value])
                                        : fieldInput[item.update]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {CUSTOMER_UPDATE_MODAL.DESCRIPTION(isQuote)}
            <div className="flex flex-row justify-center mt-7 gap-7">
                <Button classes="modal__button--blue" onClick={discardChanges} text={TitleButtons.DISCARD_CHANGE} />
                <Button
                    classes="modal__button--blue"
                    onClick={saveAndSend}
                    text={isQuote ? TitleButtons.SAVE : TitleButtons.SAVE_SEND}
                />
            </div>
        </ModalCustom>
    );
};

export const ModalUpdateDocumentNumber: React.FC<IModalUpdateDocumentNumber> = ({
    showModal,
    setShowModal,
    documentNumber,
    discardChange,
    saveAndSend,
}) => {
    return (
        <ModalCustom
            show={showModal}
            showModal={(): void => setShowModal(false)}
            classesWrapper="modal--full"
            classesModal="modal--full xs:justify-center"
        >
            <>
                <div className="w-87 xs:w-full">
                    {CUSTOMER_UPDATE_MODAL.TITLE}
                    {CUSTOMER_UPDATE_MODAL.UPDATE(documentNumber, true)}
                </div>
                <div className="flex flex-row justify-center mt-7 gap-7">
                    <Button classes="modal__button--blue" onClick={discardChange} text={TitleButtons.DISCARD_CHANGE} />
                    <Button classes="modal__button--blue" onClick={saveAndSend} text={TitleButtons.SAVE_SEND} />
                </div>
            </>
        </ModalCustom>
    );
};
