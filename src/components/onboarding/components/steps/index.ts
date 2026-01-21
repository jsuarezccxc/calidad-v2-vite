import stepOneWebsite from '@assets/images/onboarding/stepOneWebsite.svg';
import stepTwoWebsite from '@assets/images/onboarding/stepTwoWebsite.svg';
import stepThreeWebsite from '@assets/images/onboarding/stepThreeWebsite.svg';
import stepFourWebsite from '@assets/images/onboarding/stepFourWebsite.svg';
import stepFiveWebsite from '@assets/images/onboarding/stepFiveWebsite.svg';
import stepSixWebsite from '@assets/images/onboarding/stepSixWebsite.svg';
import stepSevenWebsite from '@assets/images/onboarding/stepSevenWebsite.svg';
import stepEightWebsite from '@assets/images/onboarding/stepEightWebsite.svg';
import stepOneFE from '@assets/images/onboarding/stepOneFE.svg';
import stepTwoFE from '@assets/images/onboarding/stepTwoFE.svg';
import stepThreeFE from '@assets/images/onboarding/stepThreeFE.svg';
import stepFourFE from '@assets/images/onboarding/stepFourFE.svg';
import { IOnboardingData } from '@components/onboarding';

export const iconsMapOnboarding: Record<string, string> = {
    stepOneWebsite,
    stepTwoWebsite,
    stepThreeWebsite,
    stepFourWebsite,
    stepFiveWebsite,
    stepSixWebsite,
    stepSevenWebsite,
    stepEightWebsite,
    stepOneFE,
    stepTwoFE,
    stepThreeFE,
    stepFourFE,
};

/**
 * This interface is progress information card
 *
 * @typeParam id: string - id for the button
 * @typeParam module: string - module for step
 * @typeParam classes?: string - optional class for the button
 * @typeParam inactive?: boolean - optional if is inactive
 * @typeParam step: string - text step for the button
 * @typeParam subSteps?: boolean - optional if have subSteps
 * @typeParam action: string - action for the button
 * @typeParam icon: string - icon for the step
 * @typeParam completedSubStep?: boolean - optional If is completed
 */
export interface IStepsOnboarding {
    id: string;
    module: string;
    classes?: string;
    inactive?: boolean;
    step: string;
    subSteps?: IOnboardingData[];
    action: string;
    icon: string;
    route: string;
    completed: boolean;
    completedSubStep?: boolean;
}
