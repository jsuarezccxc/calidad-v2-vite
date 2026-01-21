import React from 'react';
import { Button } from '@components/button';
import marketModule from '@assets/images/landing/market-page.svg';
import { PRODUCT_NAME } from '@constants/ProductName';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { useScrollToMemberships } from '../../hooks/useScrollToMemberships';
import { LandingHeader } from '../header-landing';
import './Modules.scss';

export const MarketModule: React.FC = () => {
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
                                submodule: 'market-module-title',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__title"
                        >
                            ¿Quiere un vendedor diggital en su tienda física?
                        </h1>
                        <h2
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'market-module-subtitle',
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
                                submodule: 'market-module-description',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="header-module__description"
                        >
                            Y venda más con menor esfuerzo
                        </p>
                    </div>

                    <div className="body-module">
                        <img src={marketModule} alt="market-module" />
                        <Button
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: 'market-module',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.BTN,
                            })}
                            text="Empiece a vender ya"
                            classes="body-module__custom-button"
                            onClick={handleScrollMemberships}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};
