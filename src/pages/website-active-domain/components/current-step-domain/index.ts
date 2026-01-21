import { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { IHostedZone } from '@models/WebsiteNode';

export * from './CurrentStepDomain';

/**
 * Interface props for current step domain
 *
 * @typeParam domain: string - current domain by user
 * @typeParam subdomain: string - current subdomain by user
 * @typeParam commonProperties: IGenericRecord - common properties from domain info
 * @typeParam hostedZone: IHostedZone - hosted zone from domain
 * @typeParam currentSubStep: number - Substep selection
 * @typeParam updateSecurityDomain: (domain: string) => Promise<void> - action to updated security domain
 * @typeParam newDomain: string  - new domain value
 * @typeParam setNewDomain: Dispatch<SetStateAction<string>>  - set state action new domain
 * @typeParam emptyDomain: boolean  - flag empty domain
 * @typeParam setEmptyDomain: Dispatch<SetStateAction<boolean>> - set state action empty domain
 * @typeParam isConnected: boolean  - flag connected domain
 * @typeParam setEmptyDomain: Dispatch<SetStateAction<boolean>> - set state action connected domain
 * @typeParam invalidDomain: boolean  - flag invalid domain
 * @typeParam setInvalidDomain: Dispatch<SetStateAction<boolean>> - set state action invalid domain
 */
export interface ICurrentStepDomainProps {
    domain: string;
    subdomain: string;
    commonProperties: IGenericRecord;
    hostedZone: IHostedZone;
    currentSubStep: number;
    updateSecurityDomain: (domain: string) => Promise<void>;
    newDomain: string;
    setNewDomain: Dispatch<SetStateAction<string>>;
    emptyDomain: boolean;
    setEmptyDomain: Dispatch<SetStateAction<boolean>>;
    isConnected: boolean;
    setIsConnected: Dispatch<SetStateAction<boolean>>;
    invalidDomain: boolean;
    setInvalidDomain: Dispatch<SetStateAction<boolean>>;
}

/**
 * Type data screenshot
 */
export type Screenshot = {
    image: string;
    height: number;
};

/**
 * Interface information steps
 *
 * @typeParam title: string - Title main step
 * @typeParam description: string - Optional description main step
 * @typeParam step: string - Optional number for substeps by step
 * @typeParam instruction: string | JSX.Element - Optional instruction substep by step
 * @typeParam descriptionStep: string - Optional description in steps with screenshot
 * @typeParam screenshots: Screenshot[] - List of screenshots by substep
 */
export interface IInformationSteps {
    title: string;
    description?: string;
    step?: string;
    instruction?: string | JSX.Element;
    descriptionStep?: string;
    screenshots?: Screenshot[];
}

/**
 * Steps carrousel
 */
export enum MAIN_STEP_PAGINATOR {
    FIRST_PAGE = 1,
    SECOND_PAGE = 2,
    EIGHTH_PAGE = 3,
    NINTH_PAGE = 4,
}

/**
 * Steps by second step
 */
export enum STEP_SECOND_PAGINATOR {
    FIRST_PAGE = 1,
    SECOND_PAGE = 2,
    THIRD_PAGE = 3,
    FOURTH_PAGE = 4,
    FIFTH_PAGE = 5,
    SIXTH_PAGE = 6,
}
