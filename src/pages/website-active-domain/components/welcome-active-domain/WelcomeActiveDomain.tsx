import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import { OptionCard } from '@components/option-card';
import { InformationAlert } from '@components/information-alert';
import { InformationCard } from '@components/information-card';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { DEFINITIONS, IWelcomeActiveDomain, OPTIONS } from '.';
import './WelcomeActiveDomain.scss';

export const WelcomeActiveDomain: React.FC<IWelcomeActiveDomain> = ({ handleSelectOption }) => {
    return (
        <div className="welcome-active-domain">
            <div className="welcome-active-domain__title">
                <h3 className="title">¡Bienvenido al módulo de Sitio web y tienda diggital!</h3>
            </div>
            <div className="welcome-active-domain__content">
                <div className="description__container">
                    <label className="description--title description--bold">¿Cómo escoger el dominio?</label>
                    <p className="description--bold">
                        Lo acompañamos en el proceso para armar fácil y rápido su sitio web en {PRODUCT_NAME}
                    </p>
                    <p className="description--text">
                        Siga las instrucciones para escoger y activar su dominio. A continuación, escoja si va a utilizar un
                        dominio propio o el de {PRODUCT_NAME}.
                    </p>

                    <div className="options-domain__container">
                        {OPTIONS.map((option, index) => (
                            <div
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `${index}-option`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CRD,
                                })}
                                key={`${index}-option`}
                                className="option"
                            >
                                <OptionCard
                                    icon={option.icon}
                                    title={option.title}
                                    onClick={(): void => handleSelectOption(option.type)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="definitions__container">
                    <div className="alert__container">
                        <InformationAlert />
                    </div>
                    {DEFINITIONS.map((definition, index) => (
                        <div key={`${index}-definition`} className="definition">
                            <InformationCard
                                title={definition.title}
                                description={definition.description}
                                onClick={(): void => {}}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
