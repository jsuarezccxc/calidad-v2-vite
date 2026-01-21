import React from 'react';
import { Button } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { Icon } from '@components/icon';
import { IModalSave } from '.';

const ModalSaveNext: React.FC<IModalSave> = ({
    id,
    show = false,
    closeIcon,
    showModal = (): void => {},
    setOpenShowModal = (): void => {},
    data,
    onClick,
}) => {
    return (
        <ModalCustom
            id={id}
            show={show}
            closeIcon={closeIcon}
            showModal={showModal}
            classesWrapper="w-min-mi xs:h-full xs:w-full"
        >
            <div className="modal--response">
                <div className="flex flex-col mb-2">
                    <div className="flex justify-start w-full mb-2">
                        <Icon name="infoBlue" onClick={(): void => {}} className="header__icon" alt="info-modal" />
                        <h3 className="text-xl font-bold leading-xl text-blue">Información</h3>
                    </div>
                    <p className="text-gray-dark">¿Desea guardar la información antes de continuar?</p>
                    <br />
                    <p className="text-gray-dark">
                        Si desea guardar la información, haga click en Guardar, de lo contrario, haga click en Siguiente.
                    </p>
                </div>
            </div>
            <div className="flex justify-around mt-5 mr-4 xs:mx-16 xs:mb-10">
                <Button
                    id={`${id}-save-btn`}
                    text="Guardar"
                    onClick={(): void => {
                        data();
                        setOpenShowModal();
                        showModal();
                    }}
                />
                <Button id={`${id}-next-btn`} text="Siguiente" classes="px-2" onClick={onClick} />
            </div>
        </ModalCustom>
    );
};

export default ModalSaveNext;
