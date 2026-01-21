import { ChangeEvent, IOptionSelect } from '@components/input';
import { IConsultClient, IConsultClientResponse } from '@models/ImportClient';

export * from './ContentModal';

/**
 * This interface defines the properties for the ConsultClient component.
 * 
 * @typeParam isSubmit: boolean - Indicates if the form is being submitted.
 * @typeParam options: IOptionSelect[] - An array of options for the select input.
 * @typeParam fieldValue: IConsultClient - The current values of the form fields.
 * @typeParam onClickLeft: () => void - Function to handle the left button click.
 * @typeParam onClickRight: () => void - Function to handle the right button click.
 * @typeParam handleText: (e: ChangeEvent) => void - Function to handle text input changes.
 * @typeParam handleSelect: (option: IOptionSelect, name?: string) => void - Function to handle select input changes.
 */
export interface IConsultClientProps {
    isSubmit: boolean;
    options: IOptionSelect[];
    fieldValue: IConsultClient;
    onClickLeft: () => void;
    onClickRight: () => void,
    handleText: (e: ChangeEvent) => void;
    handleSelect: (option: IOptionSelect, name?: string) => void;
}

/**
 * This interface defines the properties for the Error component.
 * 
 * @typeParam onClick: () => void - Function to handle the click event, typically to close the error modal.
 */
export interface IErrorProps {
    onClick: () => void;
}

/**
 * This interface defines the properties for the Warning component.
 * 
 * @typeParam onClickLeft: () => void - Function to handle the left button click, typically to close the warning modal.
 * @typeParam onClickRight: () => void - Function to handle the right button click, typically to proceed with an action.
 */
export interface IWarningProps {
    onClickLeft: () => void;
    onClickRight: () => void;
}

/**
 * This interface defines the properties for the ImportClient component.
 * 
 * @typeParam isSubmit: boolean - Indicates if the form is being submitted.
 * @typeParam fieldValue: IConsultClientResponse - The response data from the client consultation.
 * @typeParam onClickLeft: () => void - Function to handle the left button click, typically to close the modal.
 * @typeParam onClickRight: () => void - Function to handle the right button click, typically to proceed with an action.
 * @typeParam handleText: (e: ChangeEvent) => void - Function to handle text input changes.
 */
export interface IImportClientProps {
    isSubmit: boolean;
    fieldValue: IConsultClientResponse;
    onClickLeft: () => void;
    onClickRight: () => void;
    handleText: (e: ChangeEvent) => void;
}
