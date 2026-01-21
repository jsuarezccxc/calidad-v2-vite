import React from 'react';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE, INVOICE, SUPPORTING_DOCUMENT } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { IDocumentTraceabilityInformation } from '@models/ConsultElectronicDocument';
import { ZERO } from '@pages/website-editor';
import { Button } from '@components/button';
import { Icon } from '@components/icon';

export const SUCCESS_MODAL = (history: IGenericRecord): IGenericRecord => ({
    [INVOICE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="successMulticolor" />
            <h4 className="consult-electronic-document__modal--title">¡Su Factura venta se ha retransmitido con éxito!</h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para conocer el estado de su documento haga click en el botón <span className="font-allerbold">siguiente.</span>
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Siguiente"
                    onClick={(): void => history.go(ZERO)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [DEBIT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="successMulticolor" />
            <h4 className="consult-electronic-document__modal--title">¡Su nota débito se ha retransmitido con éxito!</h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para conocer el estado de su documento haga click en el botón <span className="font-allerbold">siguiente.</span>
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Siguiente"
                    onClick={(): void => history.go(ZERO)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [CREDIT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="successMulticolor" />
            <h4 className="consult-electronic-document__modal--title">¡Su nota crédito se ha retransmitido con éxito!</h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para conocer el estado de su documento haga click en el botón <span className="font-allerbold">siguiente.</span>
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Siguiente"
                    onClick={(): void => history.go(ZERO)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [SUPPORTING_DOCUMENT]: (
        <div className="consult-electronic-document__modal">
            <Icon name="successMulticolor" />
            <h4 className="consult-electronic-document__modal--title">¡Su Documento soporte se ha retransmitido con éxito!</h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para conocer el estado de su documento haga click en el botón <span className="font-allerbold">siguiente.</span>
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Siguiente"
                    onClick={(): void => history.go(ZERO)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [ADJUSTMENT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="successMulticolor" />
            <h4 className="consult-electronic-document__modal--title">¡Su nota de ajuste se ha retransmitido con éxito!</h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para conocer el estado de su documento haga click en el botón <span className="font-allerbold">siguiente.</span>
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Siguiente"
                    onClick={(): void => history.go(ZERO)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
});

export const ERROR_MODAL = (
    modalStates: {
        showModal: boolean;
        rejectedDian: boolean;
        error: boolean;
        data: IGenericRecord;
    },
    setModalStates: React.Dispatch<
        React.SetStateAction<{
            showModal: boolean;
            rejectedDian: boolean;
            error: boolean;
            data: IGenericRecord;
        }>
    >
): IGenericRecord => ({
    [INVOICE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="cancelMulticolor" />
            <h4 className="consult-electronic-document__modal--title">Error en la retransmisión de factura de venta</h4>
            <p className="consult-electronic-document__modal--subtitle">
                No se pudo retransmitir el documento electrónico. Espere unos minutos para continuar con el proceso.
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [DEBIT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="cancelMulticolor" />
            <h4 className="consult-electronic-document__modal--title">Error en la retransmisión de nota débito</h4>
            <p className="consult-electronic-document__modal--subtitle">
                No se pudo retransmitir el documento electrónico. Espere unos minutos para continuar con el proceso.
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [CREDIT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="cancelMulticolor" />
            <h4 className="consult-electronic-document__modal--title">Error en la retransmisión de nota crédito</h4>
            <p className="consult-electronic-document__modal--subtitle">
                No se pudo retransmitir el documento electrónico. Espere unos minutos para continuar con el proceso.
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [SUPPORTING_DOCUMENT]: (
        <div className="consult-electronic-document__modal">
            <Icon name="cancelMulticolor" />
            <h4 className="consult-electronic-document__modal--title">Error en la retransmisión de Documento soporte</h4>
            <p className="consult-electronic-document__modal--subtitle">
                No se pudo retransmitir el documento electrónico. Espere unos minutos para continuar con el proceso.
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [ADJUSTMENT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="cancelMulticolor" />
            <h4 className="consult-electronic-document__modal--title">Error en la retransmisión de nota de ajuste</h4>
            <p className="consult-electronic-document__modal--subtitle">
                No se pudo retransmitir el documento electrónico. Espere unos minutos para continuar con el proceso.
            </p>
            <div className="flex items-center justify-center">
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
});

export const REJECTED_DIAN_MODAL = (
    modalStates: {
        showModal: boolean;
        rejectedDian: boolean;
        error: boolean;
        data: IGenericRecord;
    },
    setModalStates: React.Dispatch<
        React.SetStateAction<{
            showModal: boolean;
            rejectedDian: boolean;
            error: boolean;
            data: IGenericRecord;
        }>
    >,
    history: IGenericRecord,
    document: IGenericRecord
): IGenericRecord => ({
    [INVOICE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="advertisementMulticolor" />
            <h4 className="consult-electronic-document__modal--title">
                ¡Su factura retransmitida ha sido rechazada por la DIAN!
            </h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para ver el motivo del rechazo y corregirlo, haga click en el botón &nbsp;
                <span className="font-allerbold">Corregir.</span>
            </p>
            <div className="flex ">
                <Button
                    text="Corregir"
                    onClick={(): void => history.push(`/correction-business-document?id=${document?.id ?? document?.invoice_id}`)}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [DEBIT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="advertisementMulticolor" />
            <h4 className="consult-electronic-document__modal--title">
                Su nota débito retransmitida ha sido rechazada por la DIAN
            </h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para ver el motivo del rechazo y corregirlo, haga click en el botón &nbsp;
                <span className="font-allerbold">Corregir.</span>
            </p>
            <div className="flex ">
                <Button
                    text="Corregir"
                    onClick={(): void => history.push(`/correction-business-document?id=${document?.id ?? document?.invoice_id}`)}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [CREDIT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="advertisementMulticolor" />
            <h4 className="consult-electronic-document__modal--title">
                Su nota crédito retransmitida ha sido rechazada por la DIAN
            </h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para ver el motivo del rechazo y corregirlo, haga click en el botón &nbsp;
                <span className="font-allerbold">Corregir.</span>
            </p>
            <div className="flex ">
                <Button
                    text="Corregir"
                    onClick={(): void => history.push(`/correction-business-document?id=${document?.id ?? document?.invoice_id}`)}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [SUPPORTING_DOCUMENT]: (
        <div className="consult-electronic-document__modal">
            <Icon name="advertisementMulticolor" />
            <h4 className="consult-electronic-document__modal--title">
                ¡Su Documento soporte retransmitido ha sido rechazado por la DIAN!
            </h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para ver el motivo del rechazo y corregirlo, haga click en el botón &nbsp;
                <span className="font-allerbold">Corregir.</span>
            </p>
            <div className="flex ">
                <Button
                    text="Corregir"
                    onClick={(): void => history.push(`/correction-business-document?id=${document?.id ?? document?.invoice_id}`)}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [ADJUSTMENT_NOTE]: (
        <div className="consult-electronic-document__modal">
            <Icon name="advertisementMulticolor" />
            <h4 className="consult-electronic-document__modal--title">
                ¡Su nota de ajuste retransmitida ha sido rechazada por la DIAN!
            </h4>
            <p className="consult-electronic-document__modal--subtitle">
                Para ver el motivo del rechazo y corregirlo, haga click en el botón &nbsp;
                <span className="font-allerbold">Corregir.</span>
            </p>
            <div className="flex ">
                <Button
                    text="Corregir"
                    onClick={(): void => history.push(`/correction-business-document?id=${document?.id ?? document?.invoice_id}`)}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    text="Aceptar"
                    onClick={(): void => {
                        setModalStates({ ...modalStates, showModal: false });
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
});

export const CONSULT_ELECTRONIC_DOCUMENT = {
    CONSULT_DOCUMENT: 'Consulte los documentos electrónicos generados',
    PURCHASE_VIEW: 'Visualización factura de compra',
    STATE_DOCUMENT: 'Estado del documento',
    PURCHASE_DETAILS: 'A continuación, visualice a detalle la factura de compra y haga click en la acción que necesite.',
    STATE_PURCHASE: 'A continuación, visualice a detalle el estado de su documento y haga click en la acción que necesite',
    REVIEW_REJECTION:
        'Es cuando no se acepta el documento electrónico por parte de la DIAN o el cliente. El empresario debe corregirla hasta que sea aprobada por la DIAN o el cliente.',
    IN_VERIFICATION: 'permite retransmitir el documento electrónico a la DIAN manualmente.',
};

export const INFORMATION_PAGE: { LINK: { [key: string]: JSX.Element } } = {
    LINK: {
        [SUPPORTING_DOCUMENT]: (
            <>
                Para consultar en el portal de la DIAN la información del Documento soporte o la Nota de ajuste y los eventos
                asociados, haga click en el link del <span className="font-allerbold">CUDS.</span>
            </>
        ),
        [DEBIT_NOTE]: (
            <>
                Para consultar en el portal de la DIAN la información de la Nota crédito/débito y los eventos asociados, haga
                click en el link del <span className="font-allerbold">CUDE.</span>
            </>
        ),
        [ADJUSTMENT_NOTE]: (
            <>
                Para consultar en el portal de la DIAN la información del Documento soporte o la Nota de ajuste y los eventos
                asociados, haga click en el link del <span className="font-allerbold">CUDS.</span>
            </>
        ),
        [CREDIT_NOTE]: (
            <>
                Para consultar en el portal de la DIAN la información de la Nota crédito/débito y los eventos asociados, haga
                click en el link del <span className="font-allerbold">CUDE.</span>
            </>
        ),
        [INVOICE]: (
            <>
                Para consultar en el portal de la DIAN la información de la factura electrónica y los eventos asociados a ella,
                haga click en el link del <span className="font-allerbold">CUFE.</span>
            </>
        ),
    },
};

export const DIAN_TRACEABILITY_INFORMATION: { [key: string]: IDocumentTraceabilityInformation } = {
    IN_VERIFICATION: {
        iconName: 'checkBlue',
        label: (
            <>
                Respuesta DIAN: <span className="text-purple">En verificación</span>
            </>
        ),
        buttonLabel: 'Retransmitir Documento',
        tooltip: {
            title: 'Retransmitir documento',
            description: 'permite retransmitir el documento electrónico a la DIAN manualmente.',
        },
    },
    ACCEPTED_NO_EMAIL_SENT: {
        iconName: 'checkBlue',
        label: (
            <>
                Respuesta DIAN: <span className="text-purple">Aceptada</span>
            </>
        ),
    },
    REJECTED_DIAN: {
        iconName: 'cancelBlue',
        label: (
            <>
                Respuesta DIAN: <span className="text-purple">Rechazada</span>
            </>
        ),
    },
    ACCEPTED: {
        iconName: 'checkBlue',
        label: (
            <>
                Respuesta DIAN: <span className="text-purple">Aceptada</span>
            </>
        ),
    },
};

export const CLIENT_TRACEABILITY_INFORMATION: { [key: string]: IDocumentTraceabilityInformation } = {
    IN_VERIFICATION: {
        iconName: 'eyeFullBlue',
        label: (
            <>
                Respuesta cliente: <span className="text-purple">En verificación</span>
            </>
        ),
    },
    REJECTED_CLIENT: {
        iconName: 'cancelBlue',
        label: (
            <>
                Respuesta cliente: <span className="text-purple">Rechazada</span>
            </>
        ),
    },
    ACCEPTED: {
        iconName: 'checkBlue',
        label: (
            <>
                Respuesta cliente: <span className="text-purple">Aceptada</span>
            </>
        ),
    },
};

export const COMPANY_TRACEABILITY_INFORMATION: { [key: string]: IDocumentTraceabilityInformation } = {
    IN_VERIFICATION: {
        iconName: 'checkBlue',
        label: (
            <>
                Acción del empresario: <span className="text-purple">Revisión</span>
            </>
        ),
        buttonLabel: 'Revisar rechazo',
        tooltip: {
            title: 'Revisar rechazo',
            description:
                'Es cuando no se acepta el documento electrónico por parte de la DIAN o el cliente. El empresario debe corregirla hasta que sea aprobada por la DIAN o el cliente.',
        },
    },
    CORRECTED: {
        iconName: 'checkBlue',
        label: (
            <>
                Acción del empresario: <span className="text-purple">Corregida</span>
            </>
        ),
    },
};

export const CCXC_TRACEABILITY_INFORMATION: { [key: string]: IDocumentTraceabilityInformation } = {
    ERROR_CCXC: {
        iconName: 'eyeFullBlue',
        label: (
            <>
                Acción de CCxC: <span className="text-purple">Revisión</span>
            </>
        ),
        buttonLabel: 'Revisar rechazo',
        tooltip: {
            title: 'Revisar rechazo',
            description:
                'Es cuando no se acepta el documento electrónico por parte de la DIAN o el cliente. El empresario debe corregirla hasta que sea aprobada por la DIAN o el cliente.',
        },
    },
};
