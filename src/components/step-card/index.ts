export * from './StepCard';

/**
 * This interface describes the props of the card
 *
 * @typeParam icon: string - Card icon
 * @typeParam title: string - Card title
 * @typeParam description: string - Card description
 * @typeParam step: number - Card step
 */
export interface ICard {
    icon: string;
    title: string;
    description: string;
    step: number;
}

/**
 * This interface describes the props of the step card
 *
 * @typeParam id: string - Id for recognize card
 * @typeParam handleClick: () => void - Function to manage the card link
 * @typeParam informationWidth: number - Optional information width
 * @typeParam isComplete: number - This is optional and indicates if the step is complete
 */
export interface IStepCardProps extends ICard {
    id: string;
    informationWidth?: number;
    isComplete?: boolean;
    handleClick: () => void;
}

/**
 * Default width of card information
 */
export const DEFAULT_INFORMATION_WIDTH = 28.375;
