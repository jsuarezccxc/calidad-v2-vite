import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDynamicData } from '@redux/warehouses/actions';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { IDIANEvent } from '@models/ElectronicInvoice';
import { ONE } from '@constants/ElectronicInvoice';
import { CLAIM_TYPES } from '@constants/UtilsConstants';
import { REQUIRED_FIELD } from '@constants/FieldsValidation';
import { TypeEventDian, TYPE_EVENT_DIAN_LABEL } from '@constants/DianEvents';
import { RootState } from '@redux/rootReducer';
import { postSaveEvent } from '@redux/purchase-report/actions';
import { INFORMATION_MODAL } from '@information-texts/DIANEvents';
import { Form } from '@components/form';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { ChangeEvent, RadioButton } from '@components/radiobutton';
import { SelectInput, TextArea } from '@components/input';
import { buildOptions } from '@utils/Company';
import { getDateAnyFormat } from '@utils/Date';
import { isCorrectResponse } from '@utils/Response';
import { DEFAULT_EVENT, ENTITIES_RADIO, handleTypeModal } from '.';

export const Invoice: React.FC = React.memo(() => {
    const [dispatch, { ACCEPTANCE_CLAIM }] = [useDispatch(), TypeEventDian];
    const {
        electronicDocument: { status_history_document = [], ...electronicDocument },
        claimTypes,
    } = useSelector(({ cancellationElectronicDocuments, warehouses }: RootState) => ({
        electronicDocument: cancellationElectronicDocuments.document,
        claimTypes: warehouses.getDynamicRequest?.claim_types || [],
    }));
    const [dianEvent, setDIANEvent] = useState<IDIANEvent>({ ...DEFAULT_EVENT });
    const [submit, setSubmit] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<{ [key: string]: boolean }>({
        receiptDocument: false,
        status: false,
    });
    const [statusError, setStatusError] = useState(false);

    const saveReceiptDocument = async (): Promise<void> => {
        setSubmit(true);
        if (ACCEPTANCE_CLAIM && dianEvent.nextCase) {
            if (!dianEvent.case) return;
            if (dianEvent.case === TypeEventDian.CLAIM_FE && !dianEvent.claim_code) return;
        }
        const statusCode: unknown = await dispatch(postSaveEvent({ ...dianEvent }));
        const isResponse = isCorrectResponse(Number(statusCode));
        setShowModal({ ...showModal, receiptDocument: false, status: !isResponse });
        if (isResponse) dispatch(getSpecificDocument(electronicDocument?.id));
        setStatusError(!isResponse);
        setDIANEvent({ ...DEFAULT_EVENT });
        setSubmit(false);
    };

    const handleEvent = (eventToTransmit: string): void => {
        setDIANEvent({
            ...dianEvent,
            nextCase: eventToTransmit,
            case: eventToTransmit === ACCEPTANCE_CLAIM ? '' : eventToTransmit,
            invoice_id: electronicDocument?.id || electronicDocument.invoice_id,
            document_uuid: electronicDocument?.cufe || '',
        });
        setShowModal({ ...showModal, receiptDocument: true });
    };

    const handleReceiptModal = (): void => setShowModal({ ...showModal, receiptDocument: !showModal.receiptDocument });
    const handleStatusModal = (): void => setShowModal({ ...showModal, status: !showModal.status });

    useEffect(() => {
        dispatch(getDynamicData([CLAIM_TYPES]));
    }, []);

    return (
        <>
            <Modal open={showModal?.receiptDocument} handleClose={handleReceiptModal} modalClassName="shared-modal">
                <div className="modal-receipt-document shared-modal__content">
                    <Icon name="advertisementMulticolor" className="modal-receipt-document__icon" />
                    <h3 className="modal-receipt-document__title">Información</h3>
                    {INFORMATION_MODAL[dianEvent.nextCase]}
                    {ACCEPTANCE_CLAIM === dianEvent.nextCase && (
                        <Form className="modal-receipt-document__form">
                            <RadioButton
                                setSelected={(event): void => setDIANEvent({ ...dianEvent, case: event })}
                                entities={ENTITIES_RADIO}
                                selected={dianEvent.case}
                                classesLabel="h-8"
                            />
                            {submit && !dianEvent.case && (
                                <span className="modal-receipt-document__form--required-text">{REQUIRED_FIELD}</span>
                            )}
                            {dianEvent.case === TypeEventDian.CLAIM_FE && (
                                <>
                                    <SelectInput
                                        classesWrapper="w-73 xs:w-full"
                                        labelText="*Concepto de reclamo:"
                                        value={dianEvent.claim_name || ''}
                                        options={buildOptions(claimTypes, true)}
                                        optionSelected={({ value, id = '' }): void =>
                                            setDIANEvent({ ...dianEvent, claim_name: value, claim_code: id })
                                        }
                                        required={submit && !dianEvent.claim_code}
                                    />
                                    <TextArea
                                        maxLength={500}
                                        labelText="Para agregar observaciones sobre el rechazo inclúyalas en este campo:"
                                        classesWrapper="w-73 xs:w-full"
                                        classesInput="h-20 max-h-20"
                                        onChange={(e: ChangeEvent): void =>
                                            setDIANEvent({ ...dianEvent, observations: e.target.value })
                                        }
                                        value={dianEvent.observations || ''}
                                    />
                                </>
                            )}
                        </Form>
                    )}
                    <div className="modal-receipt-document__footer">
                        <Button text="Cancelar" onClick={handleReceiptModal} classes="modal-receipt-document__footer--button" />
                        <Button
                            text="Enviar"
                            classes="modal-receipt-document__footer--button"
                            onClick={(): Promise<void> => saveReceiptDocument()}
                        />
                    </div>
                </div>
            </Modal>
            <Modal open={showModal.status} handleClose={handleStatusModal}>
                <div className="modal-status">
                    <Icon name={statusError ? 'advertisementMulticolor' : 'checkMulticolor'} className="mb-2" />
                    <p className="mb-2 text-xl font-allerbold text-blue">Información</p>
                    <p className="text-center text-gray-dark mb-7">
                        {statusError ? 'No se ha podido enviar el evento' : '¡El evento ha sido enviado con éxito!'}
                    </p>
                    <div className="flex">
                        <Button text="Aceptar" onClick={handleStatusModal} classes="flex items-center justify-center px-4.5" />
                    </div>
                </div>
            </Modal>
            <ol className="list-decimal">
                {status_history_document.map(({ answer_dian, ...event }, index) => {
                    const isUltimate = index === status_history_document.length - ONE;
                    const nextEvent = handleTypeModal(answer_dian || '');
                    return (
                        <div className="event-status" key={index}>
                            <div className="event-status__content-step">
                                <div className="event-status__content-step--icon">
                                    <Icon name="checkBlue" className="m-1 w-9 h-9" />
                                </div>
                                {!isUltimate && <span className="step-divider" />}
                            </div>
                            <li className="event-status__content-list">
                                <p className="text-base leading-19.38px text-blue">
                                    {TYPE_EVENT_DIAN_LABEL[answer_dian || TypeEventDian.NO_EVENTS]}
                                </p>
                                <p className="actions__input-date">{getDateAnyFormat(event.date)}</p>
                                {electronicDocument.cufe &&
                                    isUltimate &&
                                    ![TypeEventDian.CLAIM_FE, TypeEventDian.ACCEPTATION_EXPRESS].includes(
                                        answer_dian as TypeEventDian
                                    ) && (
                                        <div className="event-status__button" onClick={(): void => handleEvent(nextEvent)}>
                                            <Icon name="infoGreen" className="event-status__button--icon" />
                                            <label className="event-status__button--label">
                                                {TYPE_EVENT_DIAN_LABEL[nextEvent]}
                                            </label>
                                        </div>
                                    )}
                            </li>
                        </div>
                    );
                })}
            </ol>
        </>
    );
});
