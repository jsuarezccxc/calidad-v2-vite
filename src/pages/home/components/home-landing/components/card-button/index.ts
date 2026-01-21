export * from './CardButton'

/* Defining the interface for the props that the component will receive. */
export interface ICardButton {
    title: string;
    onClick: ()=>void;
}