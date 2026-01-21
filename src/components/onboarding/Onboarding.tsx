import React, { useMemo, useState } from 'react';
import { Information } from '@components/information';
import { THREE_STEPS } from '@constants/Onboarding';
import { WEBSITE } from '@constants/Plans';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { ProgressInformation } from './components/progress-information/ProgressInformation';
import { Steps } from './components/steps/Steps';
import { OnboardingPrincipal } from './components/onboarding-principal/OnboardingPrincipal';
import { INFORMATION_ELECTRONIC_DOCUMENT, IOnboarding, TITLE_ONBOARDING } from '.';
import './Onboarding.scss';

export const Onboarding: React.FC<IOnboarding> = ({
    module = '',
    percentage = '',
    steps = [],
    setToggleOnboarding,
    principalOnboarding = false,
    hasWebsite = false,
    hasElectronicDocuments = false,
    isNearFinalStep,
}) => {
    const [areStepsVisible, setAreStepsVisible] = useState<boolean>(true);

    const handleToggleOnboarding = (): void => {
        setToggleOnboarding(prevState => !prevState);
    };

    const handleToggleSteps = (): void => {
        setAreStepsVisible(prevState => !prevState);
    };

    const isWebsite = useMemo(() => module === WEBSITE, [module]);

    return (
        <>
            {principalOnboarding ? (
                <OnboardingPrincipal hasWebsite={hasWebsite} hasElectronicDocuments={hasElectronicDocuments} />
            ) : (
                <div
                    id={generateId({
                        module: ModuleApp.OTHERS,
                        submodule: 'onboarding',
                        action: ActionElementType.INFO,
                        elementType: ElementType.CRD,
                    })}
                    className="onboarding"
                    onClick={isNearFinalStep ? handleToggleSteps : undefined}
                >
                    {steps.length > THREE_STEPS && (
                        <div className="onboarding__information">
                            <Information
                                title={TITLE_ONBOARDING}
                                color="blue"
                                description={INFORMATION_ELECTRONIC_DOCUMENT(isWebsite)}
                            />
                        </div>
                    )}
                    <div className="onboarding__banner-container">
                        <ProgressInformation
                            module={module}
                            percentage={percentage}
                            threeSteps={isNearFinalStep}
                            isShowingSteps={areStepsVisible}
                            classes={isNearFinalStep ? 'cursor-pointer' : ''}
                        />
                    </div>
                    <div className={`onboarding__steps onboarding__steps--${areStepsVisible ? 'visible' : 'hidden'}`}>
                        {steps.map((step, index) => (
                            <Steps
                                id={generateId({
                                    module: ModuleApp.OTHERS,
                                    submodule: `onboarding-step-${step.id}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CRD,
                                })}
                                key={index}
                                step={step.step}
                                action={step.action}
                                icon={step.icon || ''}
                                inactive={step.inactive}
                                subSteps={step.substeps}
                                module={module}
                                route={step.route || ''}
                                completed={step.completed}
                            />
                        ))}
                    </div>
                    {!isNearFinalStep && (
                        <div className="onboarding__skip">
                            Para omitir el paso a paso de {module} &nbsp;
                            <a className="onboarding__skip--link" onClick={handleToggleOnboarding}>
                                haga clic aquí.
                            </a>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
