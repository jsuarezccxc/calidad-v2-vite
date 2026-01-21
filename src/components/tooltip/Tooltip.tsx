import React from 'react';
import { Popper as WrapperTooltip } from '@mui/material';
import { Icon } from '@components/icon';
import usePopper from '@hooks/usePopper';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { ITooltipButtonProps, ITooltipProps } from '.';
import './Tooltip.scss';

export const Tooltip: React.FC<ITooltipProps> = ({
    anchorEl,
    wrapperClassName = '',
    classTitle = '',
    placement = 'bottom-end',
    title,
    description,
    isCustom = false,
    iconName,
    element,
    children,
    textStyles = 'text-sm',
    id = generateId({
        module: ModuleApp.TOOLTIP,
        submodule: 'default-id',
        action: ActionElementType.INFO,
        elementType: ElementType.TOOL,
    }),
}) => (
    <WrapperTooltip
        id={id}
        anchorEl={anchorEl}
        className={`${isCustom ? '' : 'material-tooltip '} ${iconName ? '' : 'material-tooltip__small'} ${wrapperClassName}`}
        open={Boolean(anchorEl)}
        placement={placement}
    >
        {isCustom || children ? (
            element ?? children
        ) : (
            <div className="flex">
                {iconName && (
                    <Icon
                        id={generateId({
                            module: ModuleApp.TOOLTIP,
                            submodule: id,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ICO,
                        })}
                        name={iconName}
                        className="w-5.5 h-5.5 mr-2.5"
                    />
                )}
                <div className="text-sm text-blue font-aller text-tooltip leading-16.95px">
                    <p className={textStyles}>
                        <span className={`${!classTitle ? 'font-allerbold' : ''} ${!iconName ? 'block' : ''}`}>{title} </span>
                        {description}
                    </p>
                </div>
            </div>
        )}
    </WrapperTooltip>
);

export const TooltipButton: React.FC<ITooltipButtonProps> = ({ tooltipProps, iconName }) => {
    const { mouseProps, anchorEl } = usePopper();

    return (
        <>
            <button {...mouseProps} type="button">
                <Tooltip anchorEl={anchorEl} {...tooltipProps} />
                <Icon
                    id={generateId({
                        module: ModuleApp.TOOLTIP,
                        submodule: ModuleApp.BUTTONS,
                        action: ActionElementType.INFO,
                        elementType: ElementType.ICO,
                    })}
                    name={iconName}
                />
            </button>
        </>
    );
};
