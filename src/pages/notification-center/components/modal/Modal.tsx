import React from 'react';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { ModalCustom } from '@components/modal-custom';
import { IGenericRecord } from '@models/GenericRecord';
import { dataModal, IModalProps, MODULE } from '..';
import { PRODUCT_NAME } from '@constants/ProductName';

export const Modal: React.FC<IModalProps> = ({ translate, ...props }) => {
    return (
        <ModalCustom {...props} classesWrapper="terms-modal modal--full">
            <div className="m-auto terms-modal__content">
                <div className="flex items-center ">
                    <Icon name="infoBlue" />
                    <h3 className="relative ml-2 text-xl font-allerbold top-px text-blue">
                        {translate('modal.terms-definition')}
                    </h3>
                </div>
                {dataModal.map(({ label, text }: IGenericRecord) => (
                    <p className="mt-2 mb-3 text-gray-dark" key={text}>
                        {label === MODULE ? (
                            <>
                                <span className="font-allerbold"> {translate(`fields.${label}`)}: &nbsp;</span>
                                {translate(`company-profile.notification-center.${text}.first`)}{' '}
                                <strong className="font-allerbold">{PRODUCT_NAME} </strong>{' '}
                                {translate(`company-profile.notification-center.${text}.second`)}.
                            </>
                        ) : (
                            <>
                                <span className="font-allerbold"> {translate(`fields.${label}`)}: &nbsp;</span>
                                {translate(`company-profile.notification-center.${text}`)}.
                            </>
                        )}
                    </p>
                ))}
                <Button text="Atrás" onClick={props.showModal} classes="m-auto mt-4 xs:block hidden" />
            </div>
        </ModalCustom>
    );
};
