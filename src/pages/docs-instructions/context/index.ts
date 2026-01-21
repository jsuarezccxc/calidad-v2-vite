import { createContext } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { IRadioCard } from '../components';
import { stepsUrl } from '../pages';
import { IStep } from '..';

/**
 * Types of tabs to navigate
 */
export enum TypeDoc {
    EI = 'electronic-invoice',
    SD = 'support-document',
    CI = 'contingency-invoice',
}

/**
 * Name to doc query param
 */
export const DOC = 'doc';

/**
 * Query param to know if show instructions
 */
export const INSTRUCTION = 'instructions';

/**
 * Query param to know if show menu
 */
export const MENU = 'menu';

/**
 * Name to step query param
 */
export const STEP = 'step';

/**
 * This interface describes the value provided by the DocsInstructionProvider context
 *
 * @typeParam cardsOptions: IGenericRecord[] - Array of card options, with each card having properties such as title, icon, and whether it is selected
 * @typeParam doc: string - The current document type as derived from the URL query parameters
 * @typeParam step: string - The current step as derived from the URL query parameters
 * @typeParam getNextStepRoute: () => void - Function that returns the route for the next step based on the current step and document type
 * @typeParam docSteps: IStep[] - Array of steps for the current document type
 * @typeParam currentStep: IStep | undefined - The current step object based on the URL query parameters, or undefined if not found
 * @typeParam stepInstructions: IGenericRecord | null - Record of step instructions for each document type, including completed steps and completion status
 * @typeParam saveCompleteStep: () => void - Function to mark the current step as complete and update the state accordingly
 * @typeParam handleValidateSelectedDocument: () => void - Function update validate state
 * @typeParam validateSelectedDoc: boolean - Validate or not the document selected
 * @typeParam handleSelectDoc: () => void - Function to handle selected document
 * @typeParam handleSelectStep: () => void - Function to handle selected step isntructions
 * @typeParam handleShowModal: () => void - Function to show modal sync
 * @typeParam showModal: boolean - State to show modal
 */
export interface IDocsInstructionContextValue {
    cardsOptions: IRadioCard[];
    doc: string;
    step: string;
    getNextStepRoute: (direction?: Direction) => void;
    docSteps: IStep[];
    currentStep: IStep | undefined;
    stepInstructions: IGenericRecord | null;
    saveCompleteStep: () => void;
    handleValidateSelectedDocument: (value?: boolean) => void;
    validateSelectedDoc: boolean;
    handleSelectDoc: (value: TypeDoc) => void;
    handleSelectStep: (value: stepsUrl) => void;
    handleShowModal: () => void;
    showModal: boolean;
}

/**
 * Documents instructions context
 */
export const DocsInstructionContext = createContext<IDocsInstructionContextValue>({
    cardsOptions: [],
    doc: '',
    step: '',
    getNextStepRoute: () => {},
    docSteps: [],
    currentStep: undefined,
    stepInstructions: null,
    saveCompleteStep: () => {},
    handleValidateSelectedDocument: () => {},
    validateSelectedDoc: false,
    handleSelectDoc: () => {},
    handleSelectStep: () => {},
    handleShowModal: () => {},
    showModal: false,
});

/**
 * Direction to navigate
 */
export enum Direction {
    NEXT = 'next',
    PREV = 'previous',
}
