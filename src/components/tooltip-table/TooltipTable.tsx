import React from 'react';
import { Tooltip } from '@mui/material';
import { Icon } from '@components/icon';
import triangle from '@assets/images/triangle.svg';
import { ITooltipTableProps, ITooltipTitleProps } from '.';

export const TooltipTable: React.FC<ITooltipTableProps> = ({ setTooltip, placement = 'bottom', ...props }) => (
    <Tooltip
        title={<TooltipTitle {...props} />}
        placement={placement}
        componentsProps={{
            tooltip: {
                className: 'custom-tooltip',
            },
        }}
    >
        <button className="cursor-pointer info-icon" onClick={(e): void => e.preventDefault()} onMouseOver={setTooltip}>
            <Icon name="infoGreen" classIcon="w-5.5 h-5.5" hoverIcon="infoGreen" />
        </button>
    </Tooltip>
);

const TooltipTitle: React.FC<ITooltipTitleProps> = ({ text = '', disabledDefinitionSection = false, className = '' }) => {
    return (
        <div className={className || 'tooltip-title tooltip-title--invested'}>
            {!disabledDefinitionSection && (
                <div className="relative flex items-center gap-2 mb-2 text-sm font-allerbold text-blue">
                    <Icon name="infoBlue" />
                    Definición de términos
                    <div className="triangle triangle--invested">
                        <img alt="triangle" className="triangle__icon" src={triangle} />
                        <div className="triangle__bg" />
                    </div>
                </div>
            )}
            {typeof text === 'string' ? <p>{text}</p> : text}
        </div>
    );
};
