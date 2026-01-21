//--- Libraries ---//
import React, { useState } from 'react';
import { History } from 'history';
import { ClickAwayListener } from '@mui/material';
//--- Components ---//
import { Tooltip } from '@components/tooltip';
//--- Assets ---//
import help from '@assets/images/help-center.svg';
//--- Constants ---//
import { Routes } from '@constants/Paths';
//--- Models ---//
import { Help } from '@models/HelpCenter';
//--- Utils ---//
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
//--- Root ---//
import { HELP_CENTER_OPTIONS } from '.';

export const HelpCenterItem: React.FC<{ history: History }> = ({ history }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>): void => setAnchorEl(anchorEl ? null : event.currentTarget);

    const handleClickAway = (): void => setAnchorEl(null);

    const goToMainRoute = (): void => {
        handleClickAway();
        history.push(getRoute(Routes.HELP_CENTER));
    };

    const goToHelp = (queryParam: Help): void => {
        handleClickAway();
        history.push(`${getRoute(Routes.HELP_CENTER)}?name=${queryParam}`);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div
                id={generateId({
                    module: ModuleApp.HEADER,
                    submodule: 'help-center',
                    action: ActionElementType.CONTAINER,
                    elementType: ElementType.CONT,
                })}
                className="flex content-center tooltip"
            >
                <img className="w-5 cursor-pointer" alt="Help center" onClick={handleClick} src={help} />
                <Tooltip
                    id={generateId({
                        module: ModuleApp.HEADER,
                        submodule: 'help-center',
                        action: ActionElementType.CONTAINER,
                        elementType: ElementType.TOOL,
                    })}
                    wrapperClassName="help-tooltip"
                    anchorEl={anchorEl}
                    placement="bottom"
                >
                    <h3 className="cursor-pointer help-tooltip__title" onClick={goToMainRoute}>
                        Centro de ayuda
                    </h3>
                    <div className="flex flex-col flex-1">
                        {HELP_CENTER_OPTIONS.map(({ name, queryParam }) => (
                            <button
                                id={generateId({
                                    module: ModuleApp.HEADER,
                                    submodule: `help-center-${name}`,
                                    action: ActionElementType.ACTION,
                                    elementType: ElementType.BTN,
                                })}
                                key={name}
                                className="help-tooltip__option"
                                onClick={(): void => goToHelp(queryParam)}
                            >
                                <svg className="w-5.5 h-5.5" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M16.2182 4.35834H14.606V3.62983C14.606 3.39413 14.3515 3.28701 14.1182 3.28701H12.8667C12.5697 2.42993 11.8273 2.00139 10.9788 2.00139C10.1397 1.96952 9.37641 2.48927 9.09094 3.28701H7.86065C7.62731 3.28701 7.39398 3.39413 7.39398 3.62983V4.35834H5.78182C4.82648 4.36863 4.0449 5.12991 4 6.09391V18.3716C4 19.3144 4.84848 20 5.78182 20H16.2182C17.1515 20 18 19.3144 18 18.3716V6.09395C17.9551 5.12991 17.1735 4.36863 16.2182 4.35834ZM8.24242 4.14409H9.40909C9.61275 4.11899 9.77633 3.96249 9.81214 3.75841C9.93776 3.2058 10.4177 2.80913 10.9788 2.7942C11.5347 2.81122 12.0075 3.20913 12.1243 3.75841C12.1623 3.96954 12.3367 4.12805 12.5485 4.14409H13.7576V5.85825H8.24242V4.14409ZM9.36664 11.5795C9.20753 11.4101 8.94338 11.4005 8.77269 11.5581L7.41511 12.8651L6.84239 12.2651C6.68327 12.0957 6.41912 12.0862 6.24843 12.2437C6.08412 12.4176 6.08412 12.6912 6.24843 12.8651L7.11811 13.765C7.19338 13.8502 7.30211 13.8973 7.41507 13.8936C7.52696 13.892 7.6337 13.8458 7.71202 13.765L9.36656 12.1795C9.53059 12.0275 9.54155 11.7699 9.39105 11.6043C9.38333 11.5956 9.37517 11.5874 9.36664 11.5795ZM10.5758 12.5006H15.4546C15.6889 12.5006 15.8788 12.6924 15.8788 12.9291C15.8788 13.1658 15.6889 13.3577 15.4546 13.3577H10.5758C10.3415 13.3577 10.1516 13.1658 10.1516 12.9291C10.1516 12.6924 10.3415 12.5006 10.5758 12.5006ZM9.36664 8.15078C9.20753 7.98136 8.94338 7.9718 8.77269 8.12937L7.41511 9.4364L6.84239 8.83643C6.68327 8.667 6.41912 8.65745 6.24843 8.81502C6.08412 8.98891 6.08412 9.26251 6.24843 9.4364L7.11811 10.3363C7.19338 10.4215 7.30211 10.4686 7.41507 10.4649C7.52696 10.4633 7.6337 10.4171 7.71202 10.3363L9.36656 8.75075C9.53059 8.59876 9.54155 8.3412 9.39105 8.17555C9.38333 8.1669 9.37517 8.15865 9.36664 8.15078ZM10.5758 9.07235H15.4546C15.6889 9.07235 15.8788 9.26421 15.8788 9.50089C15.8788 9.73758 15.6889 9.92943 15.4546 9.92943H10.5758C10.3415 9.92943 10.1516 9.73758 10.1516 9.50089C10.1516 9.26421 10.3415 9.07235 10.5758 9.07235ZM9.36664 15.0077C9.20753 14.8383 8.94338 14.8288 8.77269 14.9863L7.41511 16.2933L6.84239 15.6933C6.68327 15.5239 6.41912 15.5144 6.24843 15.6719C6.08412 15.8458 6.08412 16.1194 6.24843 16.2933L7.11811 17.1933C7.19338 17.2784 7.30211 17.3255 7.41507 17.3218C7.52696 17.3202 7.6337 17.274 7.71202 17.1933L9.36656 15.6077C9.53059 15.4557 9.54155 15.1981 9.39105 15.0325C9.38333 15.0239 9.37517 15.0156 9.36664 15.0077ZM10.5758 15.9293H15.4546C15.6889 15.9293 15.8788 16.1211 15.8788 16.3578C15.8788 16.5945 15.6889 16.7864 15.4546 16.7864H10.5758C10.3415 16.7864 10.1516 16.5945 10.1516 16.3578C10.1516 16.1211 10.3415 15.9293 10.5758 15.9293Z"
                                        fill="#0B2C4C"
                                    />
                                </svg>
                                <p className="help-tooltip__option-name">{name}</p>
                            </button>
                        ))}
                    </div>
                </Tooltip>
                <span className={`${!anchorEl ? 'tooltip-item -left-5' : 'tooltip-item-menu'}`}>Centro de ayuda</span>
            </div>
        </ClickAwayListener>
    );
};
