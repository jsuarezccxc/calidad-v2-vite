import React from 'react';
import { SharedModal } from '@components/modal';
import { ModalType } from '@constants/Modal';
import { ModuleApp } from '@utils/GenerateId';
import type { IReportModalsProps } from '..';

export const ReportModals: React.FC<IReportModalsProps> = ({ modalStates, modalHandlers }) => {
    return (
        <>
            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-delete`}
                type={ModalType.Delete}
                open={modalStates.showDeleteModal}
                text={{
                    title: 'Eliminar cotizaciones',
                    description: '¿Está seguro que desea eliminar las cotizaciones seleccionadas?',
                }}
                finalAction={modalHandlers.onConfirmDelete}
                handleClosed={modalHandlers.onCloseDeleteModal}
            />

            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-success`}
                type={ModalType.Success}
                open={modalStates.showDownloadSuccessModal}
                text={{
                    title: 'Descarga exitosa',
                    description: 'El archivo se ha descargado correctamente.',
                }}
                finalAction={modalHandlers.onCloseDownloadModal}
            />
        </>
    );
};
