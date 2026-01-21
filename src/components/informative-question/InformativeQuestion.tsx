import React from 'react';
import lightBulb from '@assets/images/light-bulb.svg';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import { IInformativeQuestionProps } from '.';

export const InformativeQuestion: React.FC<IInformativeQuestionProps> = ({ answer, question }) => {
    const { anchorEl, togglePopper } = usePopper();
    return (
        <button className="flex items-center gap-2 my-2" onClick={togglePopper} onMouseLeave={togglePopper}>
            <img alt="Light bulb" src={lightBulb} className="w-5.5 h-5.5" />
            <p className="text-left underline lg:text-center text-purple">{question}</p>
            <Tooltip
                anchorEl={anchorEl}
                iconName="blueLightBulb"
                description={answer}
                wrapperClassName="rounded"
                placement="bottom-start"
            />
        </button>
    );
};
