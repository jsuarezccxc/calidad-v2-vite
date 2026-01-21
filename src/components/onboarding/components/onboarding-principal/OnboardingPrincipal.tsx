import React from 'react';
import { NavLink } from 'react-router-dom';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import arrowBlue from '@assets/images/sidebar/arrow-blue.svg';
import { IOnboardingPrincipal } from '.';
import './OnboardingPrincipal.scss';

export const OnboardingPrincipal: React.FC<IOnboardingPrincipal> = ({ classes, hasWebsite, hasElectronicDocuments }) => {
    return (
        <div
            id={generateId({
                module: ModuleApp.DASHBOARD,
                submodule: 'onboarding-principal',
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="my-6 onboarding-principal__card_container"
        >
            {hasElectronicDocuments && (
                <NavLink
                    to={getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT)}
                    className={`onboarding-principal ${classes} h-8.2 xs:h-full onboarding-principal__documents`}
                >
                    <p className="onboarding-principal__title">
                        Complete los siguientes pasos para conocer y aprovechar las herramientas de &nbsp;
                        <span className="font-allerbold">Documentos electrónicos</span> que diggi pymes tiene para su negocio.
                    </p>
                    <img className="onboarding-principal__arrow" src={arrowBlue} alt="Arrow" />
                </NavLink>
            )}
            {hasWebsite && (
                <NavLink
                    to={getRoute(Routes.WEBSITE_DASHBOARD)}
                    className={`onboarding-principal ${classes} h-8.2 xs:h-full onboarding-principal__website`}
                >
                    <p className="onboarding-principal__title">
                        Complete los siguientes pasos para conocer y aprovechar las herramientas de &nbsp;
                        <span className="font-allerbold">Sitio web y tienda diggital</span> que diggi pymes tiene para su negocio.
                    </p>
                    <img className="onboarding-principal__arrow" src={arrowBlue} alt="Arrow" />
                </NavLink>
            )}
        </div>
    );
};
