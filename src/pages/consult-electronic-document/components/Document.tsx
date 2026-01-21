import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { rebroadcastDocument } from '@redux/correction-business-document/actions';
import usePopper from '@hooks/usePopper';
import { DIAN_RESPONSE, DocumentTraceability, ONE } from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import {
    CCXC_TRACEABILITY_INFORMATION,
    CLIENT_TRACEABILITY_INFORMATION,
    COMPANY_TRACEABILITY_INFORMATION,
    DIAN_TRACEABILITY_INFORMATION,
    ERROR_MODAL,
    REJECTED_DIAN_MODAL,
    SUCCESS_MODAL,
} from '@information-texts/ConsultElectronicDocument';
import { IStatusHistoryDocument } from '@models/AdjustmentNote';
import { IDocumentTraceabilityInformation } from '@models/ConsultElectronicDocument';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { Tooltip } from '@components/tooltip';
import { getRoute } from '@utils/Paths';
import { getDateAnyFormat } from '@utils/Date';
import { isCorrectResponse } from '@utils/Response';
import { getEnum } from '.';

export const Document: React.FC = () => {
    const {
        document: { status_history_document = [], ...electronicDocument },
    } = useSelector(({ cancellationElectronicDocuments }: RootState) => cancellationElectronicDocuments);
    const history = useHistory();
    const dispatch = useDispatch();
    const { anchorEl, mouseProps } = usePopper();

    const [modalStates, setModalStates] = useState({
        showModal: false,
        rejectedDian: false,
        error: false,
        data: {},
    });

    const handleRebroadcastDocument = async (): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { statusCode, data }: any = await dispatch(
            rebroadcastDocument(electronicDocument.id || electronicDocument.invoice_id)
        );
        if (isCorrectResponse(statusCode)) {
            setModalStates({
                ...modalStates,
                error: false,
                showModal: true,
                rejectedDian: getEnum(DIAN_RESPONSE, data?.answer_dian) === DIAN_RESPONSE.REJECTED_DIAN,
            });
            return;
        }
        setModalStates({
            ...modalStates,
            error: true,
            showModal: true,
        });
    };

    const textToEvent = ({
        answer_ccxc,
        answer_client,
        answer_company,
        answer_dian,
    }: IStatusHistoryDocument): IDocumentTraceabilityInformation => {
        let traceability: IDocumentTraceabilityInformation = DIAN_TRACEABILITY_INFORMATION.IN_VERIFICATION;
        if (answer_dian) traceability = DIAN_TRACEABILITY_INFORMATION[answer_dian];
        if (answer_ccxc) traceability = CCXC_TRACEABILITY_INFORMATION[answer_ccxc];
        if (answer_client) traceability = CLIENT_TRACEABILITY_INFORMATION[answer_client];
        if (answer_company) traceability = COMPANY_TRACEABILITY_INFORMATION[answer_company];
        return traceability;
    };

    const handleClick = ({ answer_dian, ...status }: IStatusHistoryDocument, index: number): void => {
        if (answer_dian === DocumentTraceability.IN_VERIFICATION) {
            handleRebroadcastDocument();
            return;
        }
        if (answer_dian === DocumentTraceability.REJECTED_DIAN && DocumentTraceability.ERROR_CCXC === status.answer_ccxc)
            return history.push(`${getRoute(Routes.DOCUMENT_CORRECTION_CCXC)}`);
        const verificationBeforeStatus = status_history_document?.find((item, indexStatus) => indexStatus === index - ONE);
        const isActionCompany = status.answer_company === DocumentTraceability.IN_VERIFICATION;
        if (isActionCompany && verificationBeforeStatus?.answer_client === DocumentTraceability.REJECTED_CLIENT)
            return history.push(`${getRoute(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER)}?invoice_id=${status.invoice_id}`);
        if (isActionCompany && verificationBeforeStatus?.answer_dian === DocumentTraceability.REJECTED_DIAN)
            return history.push(`${getRoute(Routes.CORRECTION_BUSINESS_DOCUMENT)}?id=${status.invoice_id}`);
    };

    return (
        <>
            <Modal open={modalStates.showModal} handleClose={(): void => setModalStates({ ...modalStates, showModal: false })}>
                {modalStates.error
                    ? ERROR_MODAL(modalStates, setModalStates)[electronicDocument.invoice_type as keyof typeof SUCCESS_MODAL]
                    : modalStates.rejectedDian
                    ? REJECTED_DIAN_MODAL(modalStates, setModalStates, history, electronicDocument)[
                          electronicDocument.invoice_type as keyof typeof SUCCESS_MODAL
                      ]
                    : SUCCESS_MODAL(history)[electronicDocument.invoice_type as keyof typeof SUCCESS_MODAL]}
            </Modal>
            <ol className="list-decimal">
                {status_history_document?.map((status, index) => {
                    const isUltimate = index === status_history_document.length - ONE;
                    const labels = textToEvent(status);
                    return (
                        <div className="event-status" key={index}>
                            <div className="event-status__content-step">
                                <div className="event-status__content-step--icon">
                                    <Icon name={labels.iconName} className="m-1 w-9 h-9" />
                                </div>
                                {!isUltimate && <span className="step-divider" />}
                            </div>
                            <li className="event-status__content-list">
                                <p className="text-base leading-19.38px text-blue">{labels.label}</p>
                                <p className="actions__input-date">{getDateAnyFormat(status.date)}</p>
                                {DocumentTraceability.ACCEPTED_NO_EMAIL_SENT === status.answer_dian && (
                                    <p className="text-purple -ml-5 leading-16.95px text-sm">Pendiente envío a cliente</p>
                                )}
                                {isUltimate && labels.tooltip && (
                                    <button className="event-status__button" onClick={(): void => handleClick(status, index)}>
                                        <div {...mouseProps}>
                                            <Icon name="infoGreen" className="event-status__button--icon" />
                                            <Tooltip iconName="infoBlue" anchorEl={anchorEl} {...labels.tooltip} />
                                        </div>
                                        <label className="event-status__button--label">{labels.buttonLabel}</label>
                                    </button>
                                )}
                            </li>
                        </div>
                    );
                })}
            </ol>
        </>
    );
};
