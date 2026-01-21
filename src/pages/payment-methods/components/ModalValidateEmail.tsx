import React from 'react';
import { ModalCustom } from '@components/modal-custom';
import { IGenericRecord } from '@models/GenericRecord';
import { VALIDATE_EMAIL_INVOICE } from '@information-texts/CreateElectronicInvoice';

export const ModalValidateEmail: React.FC<IGenericRecord> = ({
    showModalSave,
    setShowModalSave,
    onValidateEmailSubmit,
    previousEmail,
    currentEmail,
    onBackAction = (): void => {},
}) => {
    return (
        <ModalCustom
            show={showModalSave}
            showModal={(): void => {
                setShowModalSave(false);
            }}
            classesWrapper="lg:w-40 modal--full"
            classesModal="modal--full"
        >
            {VALIDATE_EMAIL_INVOICE(previousEmail, currentEmail)}
            <div className="flex flex-row justify-between mt-7">
                <div className="flex justify-center flex-1">
                    <button
                        className="footer__button--blue"
                        onClick={(): void => {
                            setShowModalSave(false);
                            onBackAction();
                        }}
                    >
                        Atrás
                    </button>
                </div>
                <div className="flex justify-center flex-1">
                    <button
                        className="footer__button--blue"
                        onClick={(): void => {
                            onValidateEmailSubmit({ email: currentEmail });
                            setShowModalSave(false);
                        }}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </ModalCustom>
    );
};
