import React, { useContext } from 'react';
import { DocsInstructionContext } from '../context';
import { DocSelector, Steps, stepsUrl } from '../pages';

export const ContentWrapper: React.FC = () => {
    const { step, currentStep = null } = useContext(DocsInstructionContext);
    return <>{!step ? <DocSelector /> : step === stepsUrl.MENU ? <Steps /> : currentStep ? currentStep.content() : ''}</>;
};
