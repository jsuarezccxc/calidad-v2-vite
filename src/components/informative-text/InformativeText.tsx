import React from 'react';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import information from '@assets/images/info-green.svg';
import { IInformativeTextProps } from '.';

export const InformativeText: React.FC<IInformativeTextProps> = ({
    description,
    text,
    textClassName,
    wrapperClassName,
    title,
}) => {
    const { anchorEl, mouseProps } = usePopper();

    return (
        <p className={`flex items-center gap-2 ${wrapperClassName}`}>
            <img alt="Information" className="w-5.5 h-5.5 cursor-pointer" src={information} {...mouseProps} />
            <span className={textClassName}>{text}</span>
            <Tooltip anchorEl={anchorEl} iconName="infoBlue" description={description} placement="bottom-start" title={title} />
        </p>
    );
};
