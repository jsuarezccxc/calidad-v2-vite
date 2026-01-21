import React from 'react';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ICurrentStepProps, IInstructionStepProps } from '.';
import './CurrentStep.scss';

export const CurrentStep: React.FC<ICurrentStepProps> = ({ title, description, titleTooltip, descTooltip }) => {
    const { anchorEl, mouseProps } = usePopper();
    return (
        <div className="current-step">
            <label className="current-step--title">{title}</label>
            {description && (
                <p className="current-step--description">
                    {description}
                    {(titleTooltip || descTooltip) && (
                        <>
                            <span className="inline-block ml-1" {...mouseProps}>
                                <Icon alt="Información" name="infoGreen" className="l-1.5 mb-1 cursor-pointer w-4 inline-block" />
                            </span>
                            <Tooltip
                                id={generateId({
                                    module: ModuleApp.OTHERS,
                                    submodule: `step-tooltip`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.TOOL,
                                })}
                                placement="bottom-start"
                                anchorEl={anchorEl}
                                iconName="infoBlue"
                                description={descTooltip}
                                title={titleTooltip}
                                wrapperClassName="rounded"
                            />
                        </>
                    )}
                </p>
            )}
        </div>
    );
};

export const InstructionStep: React.FC<IInstructionStepProps> = ({ step, title, titleTooltip, descTooltip }) => {
    const { anchorEl, mouseProps } = usePopper();
    return (
        <div className="main__container">
            <div className="instruction-step">
                <div className="instruction-step__current-step">{step}</div>
                <div className="instruction-step__information">
                    <label className="contents instruction">{title}</label>
                    {(titleTooltip || descTooltip) && (
                        <>
                            <span className="inline-block ml-1" {...mouseProps}>
                                <Icon
                                    alt="Información"
                                    name="infoBlue"
                                    className={`l-1.5 mb-1 cursor-pointer w-4 inline-block`}
                                />
                            </span>
                            <Tooltip
                                id={generateId({
                                    module: ModuleApp.OTHERS,
                                    submodule: `instructions-tooltip`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.TOOL,
                                })}
                                placement="bottom-start"
                                anchorEl={anchorEl}
                                iconName="infoBlue"
                                description={descTooltip}
                                title={titleTooltip}
                                wrapperClassName="rounded"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
