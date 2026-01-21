import React from 'react';
import plan from '@assets/images/plan.svg';
import { Icon } from '@components/icon';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IWebsiteCardProps, CardDisabled } from '.';

export const WebsiteCard: React.FC<IWebsiteCardProps> = ({ activePlan, disable, domain }) => (
    <div
        id={generateId({
            module: ModuleApp.DASHBOARD,
            submodule: 'website-chart',
            action: ActionElementType.INFO,
            elementType: ElementType.CRD,
        })}
        className="website-card"
    >
        <h2 className="website-card__title">{activePlan.name.split('-')[1]}</h2>
        <div className="flex flex-col lg:flex-row gap-4.5">
            <img src={plan} alt="Plan" className="icon-webiste-card" />
            <div className="overflow-hidden">
                <p className="flex w-full">
                    <span className="text-lg font-allerbold text-blue">Dominio:</span>
                    <span className="inline ml-2 text-sm truncate text-gray-dark">{domain}</span>
                </p>
                <p className="my-2">
                    <Icon
                        id={generateId({
                            module: ModuleApp.DASHBOARD,
                            submodule: 'website-chart-published',
                            action: ActionElementType.INFO,
                            elementType: ElementType.ICO,
                        })}
                        className="inline"
                        name="successMulticolor"
                        classIcon="icon-state"
                    />
                    <span className="pl-0.5 text-sm text-green">Publicado</span>
                    <button
                        id={generateId({
                            module: ModuleApp.DASHBOARD,
                            submodule: 'website-chart-build',
                            action: ActionElementType.ACTION,
                            elementType: ElementType.BTN,
                        })}
                        className="website-card__button"
                    >
                        <Icon
                            id={generateId({
                                module: ModuleApp.DASHBOARD,
                                submodule: 'website-chart-build',
                                action: ActionElementType.INFO,
                                elementType: ElementType.ICO,
                            })}
                            name="editWhite"
                            className="icon-button-card"
                        />
                        Armar sitio web
                    </button>
                    <button
                        id={generateId({
                            module: ModuleApp.DASHBOARD,
                            submodule: 'website-chart-go',
                            action: ActionElementType.ACTION,
                            elementType: ElementType.BTN,
                        })}
                        className="website-card__button mt-4.5"
                    >
                        <Icon
                            id={generateId({
                                module: ModuleApp.DASHBOARD,
                                submodule: 'website-chart-go',
                                action: ActionElementType.INFO,
                                elementType: ElementType.ICO,
                            })}
                            name="editWhite"
                            className="icon-button-card"
                        />
                        Ir al sitio web
                    </button>
                </p>
            </div>
        </div>
        {disable && <CardDisabled />}
    </div>
);
