import React from 'react';

import { Button } from '@components/button';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import rocket from '@assets/images/landing/rocket.png';
import clouds from '@assets/images/landing/clouds.png';

import { IModalMigrationAccountProps, URL_REDIRECT } from '.';
import './ModalMigrationAccount.scss';

export const ModalMigrationAccount: React.FC<IModalMigrationAccountProps> = ({ isOpen, handleOpenModalMigration }) => {
    const redirectOldDomain = (): void => {
        handleOpenModalMigration();
        window.location.href = URL_REDIRECT;
    };

    if (!isOpen) return null;

    return (
        <div
            id={generateId({
                module: ModuleApp.HOME,
                submodule: `${ModuleApp.MODALS}-migration-account`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            className="main"
        >
            <div className="modal--container">
                <div className="image--container">
                    <img src={rocket} alt="cohete" className="image--container__rocket" />
                    <img src={clouds} alt="nubes" className="image--container__cloud" />
                </div>
                <h2 className="title">¡Estamos en proceso de migración de su información!</h2>
                <p className="first--text">
                    Pronto podrá disfrutar de nuevas funcionalidades para mejorar su experiencia. Le avisaremos cuando la
                    migración esté lista.
                </p>
                <p className="second--text">
                    Mientras tanto, siga usando <strong>diggi pymes</strong> haciendo click en el botón
                </p>
                <div className="button--container">
                    <Button
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: `${ModuleApp.MODALS}-migration-account`,
                            action: ActionElementType.NEXT,
                            elementType: ElementType.BTN,
                        })}
                        text="Ir a diggi pymes"
                        onClick={(): void => redirectOldDomain()}
                    />
                </div>
            </div>
        </div>
    );
};
