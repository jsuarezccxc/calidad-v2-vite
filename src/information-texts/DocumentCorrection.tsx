import React from 'react';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { ADJUSTMENT_NOTE, CREDIT_NOTE, DEBIT_NOTE, INVOICE, SUPPORTING_DOCUMENT } from '@constants/ElectronicInvoice';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute } from '@utils/Paths';
import { TYPE_NAVIGATION } from '@pages/consult-electronic-document';

export const TEXT_MODAL_OPTIONS = (history: IGenericRecord, handleModal: () => void, id: string): IGenericRecord => ({
    [INVOICE]: (
        <div className="correction-success-modal">
            <Icon name="successMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                ¡Su factura de venta se ha transmitido con éxito!
            </h4>
            <p className="text-gray-dark mb-2.5">
                Para conocer el estado de su factura haga click en el botón
                <span className="font-bold font-allerbold"> Siguiente</span> o si desea emitir una nueva factura haga click en el
                botón <span className="font-bold font-allerbold">generar nueva factura de venta.</span>
            </p>
            <div className="flex">
                <Button
                    text="Generar nueva factura de venta"
                    onClick={(): void => {
                        history.push(getRoute(Routes.GENERATE_SALES_INVOICE));
                        handleModal();
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    classes="flex items-center justify-center"
                    text="Siguiente"
                    onClick={(): void => {
                        history.push(
                            `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${id || ''}&type=${
                                TYPE_NAVIGATION.CREATED_INVOICE
                            }`
                        );
                        handleModal();
                    }}
                />
            </div>
        </div>
    ),
    [DEBIT_NOTE]: (
        <div className="correction-success-modal">
            <Icon name="successMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                ¡Su nota débito se ha transmitido con éxito!
            </h4>
            <p className="text-gray-dark mb-2.5">
                Para conocer el estado de su documento haga click en el botón
                <span className="font-bold font-allerbold"> Siguiente</span> o si desea generar una nueva nota débito haga click
                en el botón <span className="font-bold font-allerbold">Generar nueva nota débito.</span>
            </p>
            <div className="flex">
                <Button
                    text="Generar nueva nota débito"
                    onClick={(): void => {
                        history.push(getRoute(Routes.GENERATE_DEBIT_NOTE));
                        handleModal();
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    classes="flex items-center justify-center"
                    text="Siguiente"
                    onClick={(): void => {
                        history.push(
                            `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${id || ''}&type=${
                                TYPE_NAVIGATION.CREATED_DEBIT_NOTE
                            }`
                        );
                        handleModal();
                    }}
                />
            </div>
        </div>
    ),
    [CREDIT_NOTE]: (
        <div className="correction-success-modal">
            <Icon name="successMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                ¡Su nota crédito se ha transmitido con éxito!
            </h4>
            <p className="text-gray-dark mb-2.5">
                Para conocer el estado de su documento haga click en el botón
                <span className="font-bold font-allerbold"> Siguiente</span> o si desea generar una nueva nota crédito haga click
                en el botón <span className="font-bold font-allerbold">Generar nueva nota crédito.</span>
            </p>
            <div className="flex">
                <Button
                    text="Generar nueva nota crédito"
                    onClick={(): void => {
                        history.push(getRoute(Routes.GENERATE_CREDIT_NOTE));
                        handleModal();
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    classes="flex items-center justify-center"
                    text="Siguiente"
                    onClick={(): void => {
                        history.push(
                            `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${id || ''}&type=${
                                TYPE_NAVIGATION.CREATED_CREDIT_NOTE
                            }`
                        );
                        handleModal();
                    }}
                />
            </div>
        </div>
    ),
    [SUPPORTING_DOCUMENT]: (
        <div className="correction-success-modal">
            <Icon name="successMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                ¡Su documento soporte se ha transmitido con éxito!
            </h4>
            <p className="text-gray-dark mb-2.5">
                Para conocer el estado de su documento haga click en el botón
                <span className="font-bold font-allerbold"> Siguiente</span> o si desea generar un nuevo documento soporte a haga
                click en el botón <span className="font-bold font-allerbold">Generar nuevo documento soporte</span>
            </p>
            <div className="flex">
                <Button
                    text="Generar nuevo documento soporte"
                    onClick={(): void => {
                        history.push(getRoute(Routes.GENERATE_SUPPORT_DOCUMENT));
                        handleModal();
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    classes="flex items-center justify-center"
                    text="Siguiente"
                    onClick={(): void => {
                        history.push(
                            `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${id || ''}&type=${
                                TYPE_NAVIGATION.CREATED_SUPPORT_DOCUMENT
                            }`
                        );
                        handleModal();
                    }}
                />
            </div>
        </div>
    ),
    [ADJUSTMENT_NOTE]: (
        <div className="correction-success-modal">
            <Icon name="successMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                ¡Su nota de ajuste se ha transmitido con éxito!
            </h4>
            <p className="text-gray-dark mb-2.5">
                Para conocer el estado de su factura haga click en el botón
                <span className="font-bold font-allerbold"> Siguiente</span> o si desea generar una nueva nota de ajuste a haga
                click en el botón <span className="font-bold font-allerbold">Generar nueva nota de ajuste.</span>
            </p>
            <div className="flex">
                <Button
                    text="Generar nueva nota de ajuste"
                    onClick={(): void => {
                        history.push(getRoute(Routes.GENERATE_ADJUSTMENT_NOTE));
                        handleModal();
                    }}
                    classes="mr-2.5 flex items-center justify-center px-4.5"
                />
                <Button
                    classes="flex items-center justify-center"
                    text="Siguiente"
                    onClick={(): void => {
                        history.push(
                            `${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?id=${id || ''}&type=${
                                TYPE_NAVIGATION.CREATED_ADJUSTMENT_NOTE
                            }`
                        );
                        handleModal();
                    }}
                />
            </div>
        </div>
    ),
});

export const TEXT_MODAL_ERROR_DATA = (setShowErrorDataModal: React.Dispatch<React.SetStateAction<boolean>>): IGenericRecord => ({
    [INVOICE]: (
        <div className="correction-error-modal">
            <Icon name="cancelMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                Error en la transmisión de factura de venta
            </h4>
            <p className="text-gray-dark mb-2.5">
                No se pudo transmitir el documento electrónico con las correcciones. Espere unos minutos para continuar con el
                proceso.
            </p>
            <div className="flex">
                <Button
                    text="Aceptar"
                    onClick={(): void => setShowErrorDataModal(false)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [DEBIT_NOTE]: (
        <div className="correction-error-modal">
            <Icon name="cancelMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                Error en la transmisión de nota débito
            </h4>
            <p className="text-gray-dark mb-2.5">
                No se pudo transmitir el documento electrónico con las correcciones. Espere unos minutos para continuar con el
                proceso.
            </p>
            <div className="flex">
                <Button
                    text="Aceptar"
                    onClick={(): void => setShowErrorDataModal(false)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [CREDIT_NOTE]: (
        <div className="correction-error-modal">
            <Icon name="cancelMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                Error en la transmisión de nota crédito
            </h4>
            <p className="text-gray-dark mb-2.5">
                No se pudo transmitir el documento electrónico con las correcciones. Espere unos minutos para continuar con el
                proceso.
            </p>
            <div className="flex">
                <Button
                    text="Aceptar"
                    onClick={(): void => setShowErrorDataModal(false)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [SUPPORTING_DOCUMENT]: (
        <div className="correction-error-modal">
            <Icon name="cancelMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                Error en la transmisión de documento soporte
            </h4>
            <p className="text-gray-dark mb-2.5">
                No se pudo transmitir el documento electrónico con las correcciones. Espere unos minutos para continuar con el
                proceso.
            </p>
            <div className="flex">
                <Button
                    text="Aceptar"
                    onClick={(): void => setShowErrorDataModal(false)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
    [ADJUSTMENT_NOTE]: (
        <div className="correction-error-modal">
            <Icon name="cancelMulticolor" />
            <h4 className="mb-2 text-xl font-bold leading-6 text-center font-allerbold text-blue">
                Error en la transmisión de nota de ajuste
            </h4>
            <p className="text-gray-dark mb-2.5">
                No se pudo transmitir el documento electrónico con las correcciones. Espere unos minutos para continuar con el
                proceso.
            </p>
            <div className="flex">
                <Button
                    text="Aceptar"
                    onClick={(): void => setShowErrorDataModal(false)}
                    classes="flex items-center justify-center px-4.5"
                />
            </div>
        </div>
    ),
});

export const DELETE_PRODUCT_MODAL = (
    deleteProductsBusiness: () => void,
    handleDeleteModal: (show: boolean) => void,
    showModalDelete: boolean
): IGenericRecord => (
    <div className="delete-product-modal">
        <Icon name="trashMulticolor" className="mb-2" />
        <p className="mb-2 text-xl text-center w-65 font-allerbold text-blue">Eliminar producto/ servicio</p>
        <p className="w-full text-center mb-7 text-gray-dark">¿Está seguro que desea eliminar los elementos seleccionados?</p>
        <div className="flex">
            <Button
                text="Cancelar"
                onClick={(): void => handleDeleteModal(!showModalDelete)}
                classes="mr-2.5 flex items-center justify-center px-4.5"
            />
            <Button
                text="Eliminar"
                onClick={(): void => {
                    deleteProductsBusiness();
                    handleDeleteModal(!showModalDelete);
                }}
                classes="flex items-center justify-center"
            />
        </div>
    </div>
);
