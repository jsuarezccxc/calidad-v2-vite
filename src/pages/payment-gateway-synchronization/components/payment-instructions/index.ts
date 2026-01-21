export { PaymentInstructions } from './PaymentInstructions';

/**
 * This interface define structure props to component
 * 
 * @typeParam type: string - Type payment
 * @typeParam step: string - Number step
 */
export interface IInstructionsProps {
    type: string;
    step: string;
}

/**
 * This const is default instruction
 */
const DEFAULT_INSTRUCTION = {
    ID: 0,
    TITLE: '',
    INSTRUCTIONS: [],
    TITLE_BUTTON_lEFT: '',
    TITLE_BUTTON_RIGHT: '',
}

/**
 * This const is page's utils
 */
export const UTILS = {
    LAST: 'last',
    DEFAULT_INSTRUCTION,
};
