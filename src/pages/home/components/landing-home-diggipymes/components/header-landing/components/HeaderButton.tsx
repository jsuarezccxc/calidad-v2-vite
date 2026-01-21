import React, { useState } from 'react';
import usePopper from '@hooks/usePopper';
import { Icon, IconsNames } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { HEADER_BUTTONS_TOOLTIP } from '..';
import '../LandingHeader.scss';

/**
 * Represents the properties required for a button in the header component.
 *
 * @typeParam darkMode - Indicates whether the button should be styled for dark mode.
 * @typeParam buttonText - The text displayed on the button.
 * @typeParam onClick - A callback function triggered when the button is clicked.
 * @typeParam id - Id for recognize header button.
 */
export interface IHeaderButton {
    darkMode: boolean;
    buttonText: string;
    onClick: () => void;
    id: string
}

export const HeaderButton: React.FC<IHeaderButton> = ({ darkMode, buttonText, onClick, id }) => {
    const [hoverIcon, setHoverIcon] = useState<IconsNames>(darkMode ? 'infoWhite' : 'infoGreen');
    const { anchorEl, mouseProps } = usePopper();

    return (
        <div
            id={id}
            className="cursor-pointer buttons__container--account-created xs:w-full xs:h-10 xs:justify-center"
            onClick={onClick}
            onMouseOver={(): void => setHoverIcon('infoWhite')}
            onMouseLeave={(): void => setHoverIcon(darkMode ? 'infoWhite' : 'infoGreen')}
        >
            <span {...mouseProps}>
                <Icon
                    id={`${id}-information-ico`}
                    alt="Información"
                    name={hoverIcon}
                    className="l-1.5 cursor-pointer w-4"
                    hoverIcon="infoWhite"
                />
            </span>
            <Tooltip
                id={`${id}-information-tool`}
                placement="bottom-start"
                anchorEl={anchorEl}
                iconName="infoBlue"
                description={HEADER_BUTTONS_TOOLTIP}
                wrapperClassName="rounded"
            />
            <span className="button-text">{buttonText}</span>
        </div>
    );
};
