import React from 'react';
import parse from 'html-react-parser';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { MODULES } from '../../constants/modules';
import './ModulesLanding.scss';

export const ModulesLanding: React.FC = () => {
    return (
        <section className="landing-modules">
            <div
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'modules-landing-title',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="landing-modules__container--section-title text-normal text-blue"
            >
                <span className="text-gradient">diggi</span>
                <span>talice</span> su empresa usando estos módulos
            </div>
            <div className="landing-modules__container--section-modules">
                {MODULES.map(({ image, title, hash }) => (
                    <div
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `section-${hash}`,
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.BTN,
                        })}
                        className="card"
                        key={title}
                        onClick={(): void => {
                            window.location.hash = `#${hash}`;
                        }}
                    >
                        <img src={image} alt={title} />
                        {parse(`<p>${title}</p>`)}
                    </div>
                ))}
            </div>
        </section>
    );
};
