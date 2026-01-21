import { IGenericRecord } from '@models/GenericRecord';

export * from './CurrentStep';

/**
 * Interface props from current step component
 *
 * @typeParam title: string - Title step
 * @typeParam description: string - Optional description step
 * @typeParam titleTooltip: string | Optional prop for title of tooltip
 * @typeParam descTooltip: string | Optional prop for description of tooltip
 */
export interface ICurrentStepProps {
    title: string;
    description?: string;
    titleTooltip?: string;
    descTooltip?: string;
}

/**
 * Interface props from instruction step component
 *
 * @typeParam step: string - Step instruction
 * @typeParam title: string | JSX.Element - Title step
 * @typeParam titleTooltip: string | Optional prop for title of tooltip
 * @typeParam descTooltip: string | Optional prop for description of tooltip
 */
export interface IInstructionStepProps {
    step: string;
    title: string | JSX.Element | ((props:IGenericRecord) => JSX.Element);
    titleTooltip?: string;
    descTooltip?: string;
}
