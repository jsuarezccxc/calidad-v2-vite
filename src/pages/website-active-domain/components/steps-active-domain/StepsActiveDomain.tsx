import React from 'react';
import { useHistory } from 'react-router-dom';
import { OptionCard } from '@components/option-card';
import { InformationAlert } from '@components/information-alert';
import { InformationCard } from '@components/information-card';
import { SubStepSelection } from '@constants/Domain';
import { lengthGreaterThanZero } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { IStepsActiveDomainProps, STEPS, USER_HELP } from '.';
import './StepsActiveDomain.scss';

export const StepsActiveDomain: React.FC<IStepsActiveDomainProps> = ({ handleSelectSubStep, stepsCompleted }) => {
    const history = useHistory();

    const handleAllowSelectStep = (step: SubStepSelection): boolean => {
        switch (step) {
            case SubStepSelection.CONNECT_DOMAIN:
                return true;
            case SubStepSelection.CONFIG_DNS:
                return lengthGreaterThanZero(stepsCompleted) && stepsCompleted.includes(SubStepSelection.CONNECT_DOMAIN);
            case SubStepSelection.ACTIVE_DOMAIN:
                return lengthGreaterThanZero(stepsCompleted) && stepsCompleted.includes(SubStepSelection.CONFIG_DNS);
            default:
                return false;
        }
    };

    return (
        <div className="steps-active-domain">
            <div className="steps-active-domain__title">
                <h3 className="title">Cómo escoger y activar el dominio</h3>
            </div>
            <div className="steps-active-domain__content">
                <div className="description__container">
                    <label className="description--title description--bold">Cómo escoger y activar el dominio propio</label>
                    <div className="steps-domain__container">
                        {STEPS.map((option, index) => (
                            <div
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `${index}-step`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.CRD,
                                })}
                                key={`${index}-step`}
                                className="flex"
                            >
                                <OptionCard
                                    icon={option.icon}
                                    title={option.title}
                                    description={option.description}
                                    completed={stepsCompleted.includes(option.step)}
                                    onClick={
                                        handleAllowSelectStep(option.step)
                                            ? (): void => handleSelectSubStep(option.step)
                                            : (): void => {}
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="helps__container">
                    <div className="alert__container">
                        <InformationAlert />
                    </div>
                    {USER_HELP.map((help, index) => (
                        <div
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${index}-help`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CRD,
                            })}
                            key={`${index}-help`}
                            className="cursor-pointer definition"
                        >
                            <InformationCard description={help.description} onClick={(): void => history.push(help.url)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
