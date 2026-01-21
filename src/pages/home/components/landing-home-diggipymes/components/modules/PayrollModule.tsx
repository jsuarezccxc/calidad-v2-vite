import React from 'react';
import { Button } from '@components/button';
import electronicPayroll from '@assets/images/landing/electronic-payroll-page.svg';
import { PRODUCT_NAME } from '@constants/ProductName';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { useScrollToMemberships } from '../../hooks/useScrollToMemberships';
import { LandingHeader } from '../header-landing';
import './Modules.scss';

export const PayrollModule: React.FC = () => {
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
                                submodule: 'payroll-module-title',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__title"
                        >
                            ¿Gestionar su nómina es un enredo?
                        </h1>
                        <h2
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'payroll-module-subtitle',
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
                                submodule: 'payroll-module-description',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__description"
                        >
                            Con la nómina electrónica desenredamos su problema
                        </p>
                    </div>

                    <div className="body-module">
                        <img src={electronicPayroll} alt="electronic-payroll" />
                        <Button
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'payroll-module',
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
