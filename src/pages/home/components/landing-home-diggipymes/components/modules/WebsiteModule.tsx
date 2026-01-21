import React from 'react';
import { Button } from '@components/button';
import websiteModule from '@assets/images/landing/website-page.svg';
import { PRODUCT_NAME } from '@constants/ProductName';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { useScrollToMemberships } from '../../hooks/useScrollToMemberships';
import { LandingHeader } from '../header-landing';
import './Modules.scss';

export const WebsiteModule: React.FC = () => {
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
                                submodule: 'website-module-title',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__title"
                        >
                            ¿Necesita ayuda para crear su sitio web sin ser un experto?
                        </h1>
                        <h2
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'website-module-subtitle',
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
                                submodule: 'website-module-description',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__description"
                        >
                            <span>Con solo arrastrar y soltar</span> diseñe y publique su sitio web
                        </p>
                    </div>

                    <div className="body-module">
                        <img src={websiteModule} alt="" />
                        <Button
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'website-module',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.BTN,
                            })}
                            text="Empiece ya su sitio web"
                            classes="body-module__custom-button"
                            onClick={handleScrollMemberships}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};
