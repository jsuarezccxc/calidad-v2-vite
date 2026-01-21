import React, { useContext, useEffect, useState } from 'react';
import { STRING } from '@utils/File';
import { PaginatorSteps } from '@components/paginator-steps';
import { ONE } from '@constants/Numbers';
import { DocsInstructionContext } from '../context';
import { Animation, EMPTY_STEP, IStepSlider } from '.';

export const StepSlider: React.FC<IStepSlider> = ({ steps = [], stepNumber = 1 }) => {
    const { saveCompleteStep } = useContext(DocsInstructionContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLastStep, setIsLastStep] = useState<boolean>(false);
    const [animationClass, setAnimationClass] = useState<string>(Animation.FADE_IN);

    useEffect(() => {
        setIsLastStep(false);
        setAnimationClass(Animation.FADE_IN);
    }, [steps, stepNumber]);

    useEffect(() => {
        setIsLastStep(currentPage - 1 === steps.length - 1);
    }, [currentPage]);

    const handleStepChange = (step: number): void => setCurrentPage(step);

    useEffect(() => {
        if (isLastStep) saveCompleteStep();
    }, [isLastStep]);

    useEffect(() => {
        setCurrentPage(ONE);
    }, [steps.length]);

    const { description, content } = steps[currentPage - 1] ? steps[currentPage - 1] : EMPTY_STEP;

    return (
        <div className="flex flex-col gap-4.5 justify-center">
            <div className="relative h-500 flex flex-col justify-center items-center bg-white pt-4.5 w-full">
                <div
                    className={`w-full flex flex-col justify-center items-center transition-opacity duration-200 ${animationClass}`}
                >
                    {!isLastStep && (
                        <div className="header-steps">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-6 w-14 h-14 border-green">
                                {stepNumber}.{currentPage}
                            </p>
                            {typeof description === STRING ? (
                                <p className="text-white font-allerbold">{description}</p>
                            ) : (
                                description
                            )}
                        </div>
                    )}
                    <div className="content-steps">{content()}</div>
                </div>
                <PaginatorSteps
                    data={steps}
                    currentPage={currentPage}
                    setCurrentPage={handleStepChange}
                    wrapperClassName="mx-auto"
                />
            </div>
        </div>
    );
};
