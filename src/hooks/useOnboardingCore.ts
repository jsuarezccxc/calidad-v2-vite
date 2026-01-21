import { useEffect, useMemo, useState } from 'react';
import { IOnboarding, IOnboardingData } from '@components/onboarding';
import { STEPS_COMPLETED_PERCENTAGE, THREE_STEPS } from '@constants/Onboarding';

/**
 * Core onboarding state and actions
 *
 * @typeParam hasFinishedAllSteps: boolean - Indicates whether all steps have been completed
 * @typeParam incompleteSteps: IOnboardingData[] - The incomplete steps in the onboarding
 * @typeParam isNearFinalStep: boolean - Indicates if near the final step of onboarding
 * @typeParam isOnboardingVisible: boolean - Indicates if the onboarding is visible
 * @typeParam toggleOnboarding: () => void - Function to toggle onboarding visibility
 */
interface IUseOnboardingCore {
    hasFinishedAllSteps: boolean;
    incompleteSteps: IOnboardingData[];
    isNearFinalStep: boolean;
    isOnboardingVisible: boolean;
    toggleOnboarding: () => void;
}

const useOnboardingCore = ({ percentage, steps = [] }: IOnboarding): IUseOnboardingCore => {
    const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

    const hasFinishedAllSteps = percentage !== STEPS_COMPLETED_PERCENTAGE;

    useEffect(() => {
        setIsOnboardingVisible(!hasFinishedAllSteps);
    }, [hasFinishedAllSteps]);

    const toggleOnboarding = (): void => {
        setIsOnboardingVisible(prev => !prev);
    };

    const incompleteSteps = useMemo(() => steps.map(item => ({ ...item, completed: false })).filter(step => !step.completed), [
        steps,
    ]);

    const isNearFinalStep = incompleteSteps.length <= THREE_STEPS;

    return {
        hasFinishedAllSteps,
        incompleteSteps,
        isNearFinalStep,
        isOnboardingVisible,
        toggleOnboarding,
    };
};

export default useOnboardingCore;
