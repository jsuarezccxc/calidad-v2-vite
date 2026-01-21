/**
 * This interface is principal onboarding
 *
 * @typeParam classes: string - optional class for the container
 * @typeParam hasWebsite: boolean -  if this has website
 * @typeParam hasElectronicDocuments: boolean - if this has electronic documents
 */
export interface IOnboardingPrincipal{
    classes?: string;
    hasWebsite: boolean;
    hasElectronicDocuments: boolean;
}
