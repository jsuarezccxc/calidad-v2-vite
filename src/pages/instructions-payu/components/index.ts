export * from './StepsCard';
export * from './CreateAccountPayuSteps';
export * from './EnableAccountPayuSteps';
export * from './SynchronizePayuInstructions';

/**
 * Constant for number minimum in steps
 */
export const NUMBER_MIN_OF_STEPS = 1;

/**
 * Constant for number maximum in steps of create account
 */
export const NUMBER_MAX_OF_STEPS_CREATE_ACCOUNT = 8;

/**
 * Constant for number maximum in steps of enable account
 */
export const NUMBER_MAX_OF_STEPS_ENABLE_ACCOUNT = 3;

/**
 * Constant for number maximum in steps of synchronize pay u
 */
export const NUMBER_MAX_OF_STEPS_SYNCHRONIZE_PAYU = 5;

/**
 * Constant for step where user pots his data of pay u
 */
export const NUMBER_OF_STEP_INPUT = 4;

/**
 * Constant for current number of step
 */
export enum NumberOfCurrentStep {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
}
