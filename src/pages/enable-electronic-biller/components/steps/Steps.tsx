import React from 'react';
import { useHistory } from 'react-router';
import aids from '@assets/images/electronic-documents/aids.svg';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { StepCard } from '@components/step-card';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { isEven } from '@utils/Number';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { INFORMATION } from '@information-texts/EnableElectronicBiller';
import { Step } from '@models/EnableElectronicBiller';
import { ELECTRONIC_BILLER_STEPS, AIDS, CARDS } from '.';

export const Steps: React.FC<{ stepsCompleted: number[]; selectStep: (step: Step) => void }> = ({
    stepsCompleted,
    selectStep,
}) => {
    const history = useHistory();

    const enterStep = (step: Step): void => {
        if (step === Step.CompanyInformation || stepsCompleted.includes(step - 1)) selectStep(step);
    };

    const redirection = (option: string): void => {
        if (option === CARDS.DEFINITIONS) history.push(`${getRoute(Routes.HELP_CENTER)}?name=definitions&words=true`);
        if (option === CARDS.ACCOMPANIMENT) history.push(`${getRoute(Routes.HELP_CENTER)}?name=contact`);
    };

    return (
        <div className="flex-1">
            <div className="steps">
                <div className="steps__cards">
                    <h3 className="mb-2 text-sm text-center text-blue font-allerbold lg:text-base lg:text-left">
                        {INFORMATION.STEPS}
                    </h3>
                    <p className="steps__instructions">{INFORMATION.INSTRUCTIONS}</p>
                    <div className="flex gap-4.5 flex-col">
                        {ELECTRONIC_BILLER_STEPS.map(item => {
                            const { step, title } = item;
                            return (
                                <StepCard
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `step-btn-${item.icon}`,
                                        action: ActionElementType.REDIRECT,
                                        elementType: ElementType.CRD,
                                    })}
                                    key={title}
                                    isComplete={stepsCompleted.includes(step)}
                                    handleClick={(): void => enterStep(step)}
                                    {...item}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="flex-1">
                    <img className="block mx-auto aid-image" src={aids} alt="Aids" />
                    <div className="flex flex-col gap-4.5 mt-4.5 items-center">
                        {AIDS.map((aid, index) => (
                            <div
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `help-${aid}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CRD,
                                })}
                                className={`${isEven(index + 1) ? '' : 'cursor-pointer'} electronic-biller__help-card`}
                                key={aid}
                                onClick={(): void => redirection(aid)}
                            >
                                {INFORMATION[aid]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.ELECTRONIC_DOCUMENTS, history, getRoute(Routes.NUMBER_RANGE), {
                    name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                })}
                onClickButtonRight={(): void =>
                    stepsCompleted.length === Step.Enablement
                        ? history.push(getRoute(Routes.NUMBER_RANGE))
                        : selectStep(stepsCompleted.length + 1)
                }
            />
        </div>
    );
};
