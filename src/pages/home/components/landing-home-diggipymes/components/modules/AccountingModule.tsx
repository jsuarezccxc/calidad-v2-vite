import React from 'react';
import accountingModule from '@assets/images/landing/accounting-page.svg';
import { Button } from '@components/button';
import { PRODUCT_NAME } from '@constants/ProductName';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { useScrollToMemberships } from '../../hooks/useScrollToMemberships';
import { LandingHeader } from '../header-landing';
import './Modules.scss';

export const AccountingModule: React.FC = () => {
    const { handleScrollMemberships } = useScrollToMemberships();

    return (
        <>
            <LandingHeader darkMode={false} />
            <section className="modules">
                <div className="modules__container">
                    <div className="header-module">
                        <h1
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'accounting-module-title',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__title"
                        >
                            ¿Le estresa manejar sus finanzas?
                        </h1>
                        <h2
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'accounting-module-subtitle',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__subtitle"
                        >
                            ¡Pásate a {PRODUCT_NAME}!
                        </h2>
                        <p
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'accounting-module-description',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__description"
                        >
                            Estamos trabajando para quitarle el estrés
                        </p>
                    </div>

                    <div className="body-module">
                        <img src={accountingModule} alt="accounting-module" />
                        <Button
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'accounting-module',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.BTN,
                            })}
                            text="Conozca los planes de pago"
                            classes="body-module__custom-button"
                            onClick={handleScrollMemberships}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};
