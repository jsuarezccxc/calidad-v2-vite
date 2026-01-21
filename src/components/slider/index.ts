export * from './Slider';

/**
 * This describes the slider limits
 *
 * @typeParam min: number - Minimum value
 * @typeParam max: number - Maximum value
 */
interface ILimits {
    min: number;
    max: number;
}

/**
 * This describes the props of the slider
 *
 * @typeParam className: string - Optional className
 * @typeParam handleChange: (value: number | number[]) => void - Function to handle value change
 * @typeParam limits: ILimits - Slider limits
 * @typeParam unit: string - Slider unit
 * @typeParam value: number - Slider value
 */
export interface ISliderProps {
    className?: string;
    handleChange: (value: number | number[]) => void;
    limits?: ILimits;
    unit?: string;
    value: number;
}

/**
 * Default limits
 */
export const DEFAULT_LIMITS: ILimits = { min: 1, max: 100 };
