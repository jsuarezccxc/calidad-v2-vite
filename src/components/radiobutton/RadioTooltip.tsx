import React from 'react';
import usePopper from '@hooks/usePopper';
import { IGenericRecord } from '@models/GenericRecord';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';

export const RadioTooltip: React.FC<IGenericRecord> = ({ descTooltip, titleTooltip }) => {
    const { anchorEl, mouseProps } = usePopper();

    return (
        <div className="absolute flex items-center justify-center h-full right-3">
            <span {...mouseProps}>
                <Icon alt="Información" name="infoGreen" className="l-1.5 mb-1 cursor-pointer w-5" />
            </span>
            <Tooltip
                placement="bottom-start"
                anchorEl={anchorEl}
                iconName="infoBlue"
                description={descTooltip}
                title={titleTooltip}
            />
        </div>
    );
};
