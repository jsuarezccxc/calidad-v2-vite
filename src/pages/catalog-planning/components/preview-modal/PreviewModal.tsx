import React from 'react';
import { Button } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { IGenericRecord } from '@models/GenericRecord';
import { CalendarOne } from './CalendarOne';
import { BLUE } from '.';

export const PreviewModal: React.FC<IGenericRecord> = ({ showModal, toggleModal }) => {
    return (
        <ModalCustom
            show={showModal}
            showModal={toggleModal}
            classesWrapper="modal--full"
            classesModal="modal--full items-center"
            classAdditional="z-50"
        >
            <div className="flex flex-col justify-between overflow-y-scroll bg-green-scrollbar h-123">
                <CalendarOne
                    preview
                    params={{ title: 'Agenda aquí tu próxima cita', description: '' }}
                    styles={{ primaryColor: '', secondaryColor: BLUE }}
                />
                <Button
                    text="Cerrar"
                    classes="m-auto md:hidden mt-8.4"
                    onClick={(): void => {
                        toggleModal(!showModal);
                    }}
                    style={{ height: '2.5rem !important' }}
                />
            </div>
        </ModalCustom>
    );
};
