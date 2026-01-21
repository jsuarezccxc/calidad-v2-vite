import React from 'react';
import growth from '@assets/images/growth.svg';
import business from '@assets/images/boost-business.svg';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';

export const INFORMATION = {
    WITHOUT_PLAN: (goToPaymentPlans: () => void): JSX.Element => (
        <div
            id={generateId({
                module: ModuleApp.DASHBOARD,
                submodule: 'banner-without-plan',
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="plans-card"
        >
            <div>
                <div className="flex flex-col justify-end h-full">
                    <p className="text-sm text-white mb-4.5">Haga click en “Planes de pago”</p>
                    <button
                        id={generateId({
                            module: ModuleApp.DASHBOARD,
                            submodule: 'banner-without-plan',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.BTN,
                        })}
                        className="plans-card__button plans-card__button--long"
                        onClick={goToPaymentPlans}
                    >
                        Planes de pago
                    </button>
                </div>
            </div>
            <img src={growth} alt="Grow" />
        </div>
    ),
    INTERMEDIATE_PLANS: (goToPaymentPlans: () => void): JSX.Element => (
        <div
            id={generateId({
                module: ModuleApp.DASHBOARD,
                submodule: 'banner-intermediate-plans',
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="plans-card"
        >
            <div>
                <div className="flex flex-col h-full">
                    <p className="flex-1 text-white text-2lg">
                        ¡Cumpla con las regulaciones de la <span className="text-green">DIAN</span>, adquiera y genere documentos
                        electrónicos para llevar su negocio al futuro <span className="text-green">digital</span>!
                    </p>
                    <p className="text-sm text-white mb-4.5">Haga click en “Planes de pago”</p>
                    <button
                        id={generateId({
                            module: ModuleApp.DASHBOARD,
                            submodule: 'banner-intermediate-plans',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.BTN,
                        })}
                        className="plans-card__button plans-card__button--long"
                        onClick={goToPaymentPlans}
                    >
                        Planes de pago Documentos Electrónicos
                    </button>
                </div>
            </div>
            <img src={growth} alt="Grow" />
        </div>
    ),
    ADVANCED_PLANS: (goToPaymentPlans: () => void): JSX.Element => (
        <div
            id={generateId({
                module: ModuleApp.DASHBOARD,
                submodule: 'banner-advanced-plans',
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="plans-card plans-card--basic"
        >
            <div className="flex flex-col h-full">
                <h2 className="text-green font-allerbold text-2lg">!Impluse su negocio!</h2>
                <p className="text-lg text-white mt-7">
                    Con una tienda virtual, aumente sus ventas y oportunidades de negocios, generando documentos electrónicos a
                    sus clientes.
                </p>
                <p className="my-2 text-sm text-white"> Empiece ahora haciendo click aquí</p>
                <button
                    id={generateId({
                        module: ModuleApp.DASHBOARD,
                        submodule: 'banner-advanced-plans',
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    className="plans-card__button"
                    onClick={goToPaymentPlans}
                >
                    Planes de pago
                </button>
            </div>
            <img className="plans-card__business-image" src={business} alt="Boost business" />
        </div>
    ),
    ELECTRONIC_DOCUMENTS: (goToPaymentPlans: () => void): JSX.Element => (
        <div
            id={generateId({
                module: ModuleApp.DASHBOARD,
                submodule: 'banner-electronic-documents',
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="plans-card"
        >
            <div className="flex flex-col justify-between h-full">
                <div>
                    <h2 className="text-green font-allerbold text-1.5xl">!Aumente sus ventas!</h2>
                    <p className="text-white mt-1.5 text-1.5xl leading-7">
                        ¡Diga hola al éxito en internet con una tienda virtual!
                    </p>
                </div>
                <div>
                    <p className="my-2 text-sm text-white">Adquierala haciendo click aquí</p>
                    <button
                        id={generateId({
                            module: ModuleApp.DASHBOARD,
                            submodule: 'banner-electronic-documents',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.BTN,
                        })}
                        className="plans-card__button"
                        onClick={goToPaymentPlans}
                    >
                        Planes de pago
                    </button>
                </div>
            </div>
            <img className="plans-card__business-image" src={business} alt="Boost business" />
        </div>
    ),
    DISABLED_TEXT: 'Planes de pago que se ajustan a su negocio',
};
