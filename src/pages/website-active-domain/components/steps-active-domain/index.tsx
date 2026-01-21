import React from 'react';
import { IconsNames } from '@components/icon';
import { SubStepSelection } from '@constants/Domain';
import { PRODUCT_NAME } from '@constants/ProductName';

export * from './StepsActiveDomain';

/**
 * Interface props for steps active domain screen
 *
 * @typeParam handleSelectSubStep: (subStep: SubStepSelection) => void - Handle action to select sub step
 * @typeParam stepsCompleted: LIST_STEPS[] - List of steps completed
 */
export interface IStepsActiveDomainProps {
    handleSelectSubStep: (subStep: SubStepSelection) => void;
    stepsCompleted: SubStepSelection[];
}

/**
 * Option steps to active domain
 */
export const STEPS = [
    {
        icon: 'navigationMulticolor' as IconsNames,
        title: 'Paso 1: Conectar dominio propio',
        description: '',
        step: SubStepSelection.CONNECT_DOMAIN,
    },
    {
        icon: 'dnsMulticolor' as IconsNames,
        title: 'Paso 2: Copiar los DNS en el proveedor del dominio',
        description: '',
        step: SubStepSelection.CONFIG_DNS,
    },
    {
        icon: 'websiteMulticolor' as IconsNames,
        title: 'Paso 3: Activar dominio',
        step: SubStepSelection.ACTIVE_DOMAIN,
    },
];

/**
 * Options to help user
 */
export const USER_HELP = [
    {
        description: (
            <p className="text-center text">
                <span className="text--bold">Definiciones cortas</span> y claras de los términos que encontrará en cómo escoger y
                activar el dominio y que usted podría no conocer
            </p>
        ),
        url: '/help-center?name=definitions&words=true',
    },
    {
        description: (
            <p className="text-center text">
                <span className="text--bold">Acompañamiento</span> de un experto en Sitio web y tienda virtual de &nbsp;
                <span className="text--bold">{PRODUCT_NAME}</span> para entender cómo escoger y activar el dominio propio.
            </p>
        ),
        url: '/help-center?name=advisory',
    },
];
