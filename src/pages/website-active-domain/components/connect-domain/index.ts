import { REQUIRED_SUBDOMAIN, VERIFY_SUBDOMAIN } from '@constants/Domain';
import { IGenericRecord } from '@models/GenericRecord';
import { Dispatch, SetStateAction } from 'react';

export * from './ConnectDomain';

/**
 * Interface props from connect domain
 *
 * @typeParam isDomain: boolean - State to validate if it's domain
 * @typeParam commonProperties: IGenericRecord - Properties from domain
 * @typeParam domain: string - Current domain
 * @typeParam currentSubdomain: string - Current subdomain
 * @typeParam updateSecurityDomain: (domain: string) => Promise<void> - Action to update security by domain
 * @typeParam url: string - Url
 * @typeParam setUrl: Dispatch<SetStateAction<string>> - Set state action url
 * @typeParam message: string - Message input
 * @typeParam setMessage: Dispatch<SetStateAction<string>> - Set state action message
 * @typeParam setIsVerifiedParent: Dispatch<SetStateAction<boolean>> - Set state action verified parent
 */
export interface IConnectDomainProps {
    isDomain: boolean;
    commonProperties: IGenericRecord;
    domain: string;
    currentSubdomain: string;
    updateSecurityDomain: (domain: string) => Promise<void>;
    url: string;
    setUrl: Dispatch<SetStateAction<string>>;
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    setIsVerifiedParent: Dispatch<SetStateAction<boolean>>;
}

/**
 * Current step from screen
 */
export const CURRENT_STEP = {
    title: 'Paso 1: Conectar dominio con diggi pymes',
    description: 'Seleccione el nombre que quiere añadir a la extensión con diggi pymes',
};

/**
 * This returns the subdomain message
 *
 * @param subdomain: string - Subdomain
 * @param isVerified: boolean - This indicates if the subdomain is verified
 * @returns string
 */
export const getSubdomainMessage = (subdomain: string, isVerified: boolean): string => {
    if (!subdomain) return REQUIRED_SUBDOMAIN;
    if (!isVerified) return VERIFY_SUBDOMAIN;
    return '';
};

/**
 * This returns the verification message
 *
 * @param subdomain: string - Subdomain
 * @param isAvailable: boolean - This indicates if the subdomain is available
 * @returns string
 */
export const getVerificationMessage = (subdomain: string, isAvailable: boolean): string => {
    if (isAvailable) return `* Nombre "${subdomain}" disponible`;
    return `* El nombre ${subdomain} ya existe en Internet. Agregue un nombre diferente y seleccione nuevamente la opción verificar.`;
};
