export * from './InformationCardLanding'

/* Defining the interface for the component. */
export interface IInformationCardLanding {
    title: string;
    information: string | number;
    subtitle?: string
    date?: string;
}