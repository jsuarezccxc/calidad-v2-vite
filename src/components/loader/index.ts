export { default } from './Loader';
export { TopProgressBar } from './TopProgressBar';

/**
 * This interface describes props for loader component
 * @typeParam classes: string - classes for changing style in loader component
 */
export interface ILoaderProps {
    classes?: string;
}

// Constants for loader behavior
export const MAX_PROGRESS_BEFORE_COMPLETION = 90;

// How much to increment the progress bar each interval
export const INCREMENT_STEP = 2;

// Interval delay in milliseconds
export const INTERVAL_DELAY_MS = 5;

// Maximum time to force hide the loader in milliseconds
export const FORCE_HIDE_TIMEOUT_MS = 15000;

// Delay before hiding the loader after completion in milliseconds
export const COMPLETE_HIDE_DELAY_MS = 700;
