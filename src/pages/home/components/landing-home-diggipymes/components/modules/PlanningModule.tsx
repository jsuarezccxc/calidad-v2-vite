import React from 'react';
import { Button } from '@components/button';
import planningModule from '@assets/images/landing/planning-page.svg';
import { PRODUCT_NAME } from '@constants/ProductName';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { useScrollToMemberships } from '../../hooks/useScrollToMemberships';
import './Modules.scss';
import { LandingHeader } from '../header-landing';

export const PlanningModule: React.FC = () => {
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
                                submodule: 'planning-module-title',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__title header-module__nowrapline"
                        >
                            ¿Siente que no tiene suficiente tiempo?
                        </h1>
                        <h2
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'planning-module-subtitle',
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
                                submodule: 'planning-module-description',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__description"
                        >
                            Y haga un mejor uso de su tiempo
                        </p>
                    </div>

                    <div className="body-module">
                        <img src={planningModule} alt="planning-module" />
                        <Button
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'planning-module',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.BTN,
                            })}
                            text="Empiece su planeación GRATIS"
                            classes="body-module__custom-button"
                            onClick={handleScrollMemberships}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};
