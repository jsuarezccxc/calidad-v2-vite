import React, { useState } from 'react';

// Vite dynamic imports for electronic-documents images
const edImages = import.meta.glob<{ default: string }>('/src/assets/images/electronic-documents/*.svg', { eager: true });
const getEdImage = (name: string): string => {
    const path = `/src/assets/images/electronic-documents/${name}.svg`;
    return edImages[path]?.default || '';
};
import { Button } from '@components/button';
import { CurrentStep, InstructionStep } from '@components/current-step';
import { PaginatorSteps } from '@components/paginator-steps';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { DIAN_REGISTER_STEPS, STEP_DATA, getText } from '@information-texts/EnableElectronicBiller';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Step } from '@models/EnableElectronicBiller';

export const DianRegistration: React.FC<{
    finalAction: () => void;
    returnStep: (option: boolean) => void;
    selectStep: (step: Step) => void;
}> = ({ finalAction, returnStep, selectStep }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);

    const handleStepChange = (step: number): void => setCurrentStep(step);

    const { bottomText, step, indication, image, topText, styles } = DIAN_REGISTER_STEPS[currentStep - 1];

    return (
        <div className="dian-registration">
            <CurrentStep {...STEP_DATA.DIAN_REGISTRATION} />
            <div className="dian-registration__step-content">
                {!!indication && <InstructionStep step={step} title={indication} />}
                <div className="flex-1 mt-4.5">
                    {topText && getText(topText)}
                    {image && (
                        <img
                            alt="Step"
                            className="mx-auto"
                            style={styles}
                            src={getEdImage(image)}
                        />
                    )}
                    {currentStep === DIAN_REGISTER_STEPS.length && (
                        <Button
                            id={generateId({
                                module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                submodule: `dian-registration-go-step-enablement`,
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.BTN,
                            })}
                            classes="dian-registration__end-button"
                            text="Paso 3: Habilitación como facturador electrónico en la DIAN"
                            onClick={finalAction}
                        />
                    )}
                    {bottomText && getText(bottomText)}
                </div>
                <PaginatorSteps
                    data={DIAN_REGISTER_STEPS}
                    currentPage={currentStep}
                    setCurrentPage={handleStepChange}
                    wrapperClassName="mx-auto"
                />
            </div>
            <PageButtonsFooter
                moduleId={ModuleApp.ELECTRONIC_DOCUMENTS}
                titleButtonLeft={STEP_DATA.BUTTON_BACK_DR}
                classNameBtnLeft="px-2.5"
                className="flex flex-row items-center justify-end"
                onClickButtonLeft={(): void => returnStep(false)}
                onClickButtonRight={(): void => {
                    selectStep(Step.Enablement);
                }}
                titleButtonRight={STEP_DATA.BUTTON_NEXT_DR}
            />
        </div>
    );
};
