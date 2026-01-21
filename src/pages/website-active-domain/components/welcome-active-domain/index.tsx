import React from 'react';
import { IconsNames } from '@components/icon';
import { PRODUCT_NAME } from '@constants/ProductName';
import { DOMAIN, MainStepSelection } from '@constants/Domain';

export * from './WelcomeActiveDomain';

/**
 * Interface props for welcome active domain
 *
 * @typeParam handleSelectOption: (step: MainStepSelection) => void - Handle action to select main step
 */
export interface IWelcomeActiveDomain {
    handleSelectOption: (step: MainStepSelection) => void;
}

/**
 * Options domain to select from user
 */
export const OPTIONS = [
    {
        icon: 'urlMulticolor' as IconsNames,
        title: 'Dominio propio',
        type: MainStepSelection.OWN_DOMAIN,
    },
    {
        icon: 'urlMulticolor' as IconsNames,
        title: `Dominio con ${PRODUCT_NAME}`,
        type: MainStepSelection.DIGGIPYMES_DOMAIN,
    },
];

/**
 * Definitions welcome screen
 */
export const DEFINITIONS = [
    {
        title: '¿Qué es un dominio propio?',
        description: (
            <p className="text">
                Un dominio propio es el <span className="text--bold">nombre único e irrepetible</span> de un sitio en Internet
                para que las empresas sean identificadas de forma facil y rapida por los usuarios y sus clientes
            </p>
        ),
    },
    {
        title: `¿Qué es un dominio ${PRODUCT_NAME}?`,
        description: (
            <p className="text">
                Un dominio diggipymes es el nombre único e irrepetible de un sitio web en internet y que se le da completamente
                gratis y en la url se incluye <span className="text--bold">{DOMAIN}</span> ejemplo: zapatos.diggipymes.com.
            </p>
        ),
    },
];
