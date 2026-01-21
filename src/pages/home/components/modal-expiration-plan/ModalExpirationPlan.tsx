import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IModalExpirationPlan } from '.';
import './ModalExpirationPlan.scss';

export const ModalExpirationPlan: React.FC<IModalExpirationPlan> = ({
    show = false,
    showModal = (): void => {},
    handleMainAction = (): void => {},
    remembered = false,
}) => {
    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.HOME,
                submodule: 'expiration-plan',
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={show}
            showModal={showModal}
            classesWrapper="modal-expiration-plan"
            classesModal="modal-expiration-plan p-6.70"
        >
            <div className="information__expiration">
                <div className="information__expiration--header">
                    <Icon
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: 'expiration-plan',
                            action: ActionElementType.INFO,
                            elementType: ElementType.ICO,
                        })}
                        name="triangleInfoMulticolor"
                        classIcon="icon--alert"
                    />
                    <label className="title--modal">Vencimiento de plan de sitio web</label>
                </div>
                <div className="information__expiration--body">
                    <p className="description--modal">
                        Le recomendamos <span className="strong--purple">renovar su plan</span> de sitio web en &nbsp;
                        <strong className="font-allerbold">{PRODUCT_NAME}</strong> antes de la fecha de vencimiento para evitar la
                        interrupción de sus servicios.
                    </p>
                    <p className="mt-6 description--modal">
                        El dominio de su sitio web está programado para ser eliminado 5 días calendario después de la fecha de
                        vencimiento de su plan, a menos que realice la renovación.
                    </p>
                </div>
                <div className="information__expiration--footer">
                    <Button
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: 'expiration-plan',
                            action: ActionElementType.CLOSE,
                            elementType: ElementType.BTN,
                        })}
                        text={remembered ? 'Cerrar' : 'Recordar mas tarde'}
                        background="gray"
                        classes="button--shadow"
                        onClick={(): void => showModal()}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: 'expiration-plan',
                            action: ActionElementType.RENEW,
                            elementType: ElementType.BTN,
                        })}
                        text="Renovar plan"
                        classes="button--shadow"
                        onClick={(): void => handleMainAction()}
                    />
                </div>
            </div>
        </ModalCustom>
    );
};
