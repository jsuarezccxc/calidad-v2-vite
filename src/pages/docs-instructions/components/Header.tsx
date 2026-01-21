import React, { useContext } from 'react';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { DOCS_INSTRUCTION } from '@information-texts/DocsInstruction';
import { Modal } from '@components/modal';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { DocsInstructionContext, TypeDoc } from '../context';
import { getRoutes } from '..';

export const Header: React.FC = () => {
    const { doc, step, handleShowModal, showModal } = useContext(DocsInstructionContext);

    const { TITLE, PAGE_CONTENT, ROUTE } = DOCS_INSTRUCTION(doc as TypeDoc, step);
    return (
        <>
            <Modal handleClose={(): void => handleShowModal()} open={showModal}>
                <div className="success-modal">
                    <Icon name="cancelMulticolor" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl text-center leading-xl text-blue font-allerbold w-65">
                        Hubo un error en la sincronización
                    </p>
                    <p className="text-base text-center text-gray-dark">
                        No se pudo sincronizar la información de los rangos de numeración. Espere unos minutos para continuar con
                        el proceso.
                    </p>
                    <div className="flex justify-center w-full mt-7">
                        <Button onClick={(): void => handleShowModal()} text="Aceptar" classes="shadow-templateDesign" />
                    </div>
                </div>
            </Modal>
            <PageTitle pageContent={SUPPORT_DOCUMENTS_SUBTITLE} title={PAGE_CONTENT} />
            <BreadCrumb routes={getRoutes(ROUTE)} />
            <h2 className="text-26lg font-allerbold text-center w-full pb-4.5 text-blue">{TITLE}</h2>
        </>
    );
};
