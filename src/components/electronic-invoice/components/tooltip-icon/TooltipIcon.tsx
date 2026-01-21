import React from 'react';
import { Tooltip } from '@mui/material';
import { Icon } from '@components/icon';
import { TooltipTitle } from '..';
import { ITooltipIconProps } from '.';

export const TooltipIcon: React.FC<ITooltipIconProps> = ({
    setTooltip,
    tooltip,
    invest = false,
    classTooltip = '',
    titleInfo = '',
}) => (
    <Tooltip
        title={<TooltipTitle invest={invest} tooltip={tooltip} classTooltip={classTooltip} titleInfo={titleInfo} />}
        componentsProps={{
            tooltip: {
                className: 'custom-tooltip',
            },
        }}
    >
        <button className="cursor-pointer info-icon" onClick={(e): void => e.preventDefault()} onMouseOver={setTooltip}>
            <Icon name="infoGreen" hoverIcon="infoGreen" />
        </button>
    </Tooltip>
);
