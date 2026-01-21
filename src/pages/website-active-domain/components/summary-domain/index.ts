import { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
export * from './SummaryDomain';

/**
 * Interface props for summary domain
 *
 * @typeParam domain: string - Current domain by user
 * @typeParam subdomain: string - Current subdomain by user
 * @typeParam commonProperties: IGenericRecord - common properties to get information from domain
 * @typeParam handleAction: (isDomain: boolean) => void - Action to redirect screen
 * @typeParam updateSecurityDomain: (domain: string) => Promise<void> - Action to update security by domain
 * @typeParam isEditActionModal: boolean - Flag edit action modal
 * @typeParam setIsEditActionModal:  Dispatch<SetStateAction<boolean>> - Set action edit modal
 * @typeParam setNewDomainEdit: Dispatch<SetStateAction<string>> - Set new domain edit
 */
export interface ISummaryDomainProps {
    domain: string;
    subdomain: string;
    commonProperties: IGenericRecord;
    handleAction: (isDomain: boolean) => void;
    updateSecurityDomain: (domain: string) => Promise<void>;
    isEditActionModal: boolean;
    setIsEditActionModal: Dispatch<SetStateAction<boolean>>;
    setNewDomainEdit: Dispatch<SetStateAction<string>>;
}

/**
 * Options protocol url
 */
export const urlProtocols = ['http', 'https'];

/**
 * Validation message for domain
 */
export const INVALID_DOMAIN_MESSAGE = '* Use únicamente letras, números y guiones (-). El subdominio no puede tener espacios, empezar ni finalizar con guión.';
