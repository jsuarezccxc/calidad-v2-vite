import React from 'react';
import { SharedModal } from '@components/modal';
import { ModalType } from '@constants/Modal';
import { ModuleApp } from '@utils/GenerateId';
import type { IReportModalsProps } from '..';

export const ReportModals: React.FC<IReportModalsProps> = ({
    modalStates,
    modalHandlers
}) => {
    return (
        <SharedModal
            moduleId={`${ModuleApp.QUOTES}-delete-quotes`}
            type={ModalType.Delete}
            open={modalStates.showDeleteModal}
            text={{
                title: "Eliminar cotización",
                description: "¿Está seguro que desea eliminar los elementos seleccionados?"
            }}
            finalAction={modalHandlers.onConfirmDelete}
            handleClosed={modalHandlers.onCloseDeleteModal}
        />
    );
};

