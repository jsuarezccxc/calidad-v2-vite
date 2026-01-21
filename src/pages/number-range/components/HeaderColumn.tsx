import React from 'react';
import usePopper from '@hooks/usePopper';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { IHeaderColumn } from '.';

export const HeaderColumn: React.FC<IHeaderColumn> = ({
    label,
    titleTooltip,
    description,
    className = '',
    placement = 'bottom-start',
}) => {
    const { anchorEl, mouseProps } = usePopper();

    return (
        <th
            className={`box-border px-2 header-table text-sm leading-4 field-header--uneditable text-blue font-allerbold bg-green bg-opacity-20 ${className}`}
        >
            <div className="flex flex-row items-center w-full h-full p-0 m-0">
                {description && (
                    <div {...mouseProps}>
                        <Icon name="infoGreen" classIcon="inline w-4.5 mr-1" />
                    </div>
                )}
                <span className="text-left">{label}</span>
                {description && anchorEl && (
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorEl}
                        description={description}
                        title={`${titleTooltip ?? label}:`}
                        placement={placement ?? ''}
                        wrapperClassName="rounded"
                    />
                )}
            </div>
        </th>
    );
};
