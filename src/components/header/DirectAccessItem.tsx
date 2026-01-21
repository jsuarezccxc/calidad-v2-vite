//--- Libraries ---//
import React, { useState } from 'react';
import { ClickAwayListener } from '@mui/material';
//--- Components ---//
import { Tooltip } from '@components/tooltip';
//--- Utils ---//
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
//--- Assets ---//
import add from '@assets/images/add.svg';
//--- Root ---//
import { OPTIONS, SHORTCUTS_OPTIONS } from '.';

export const DirectAccessItem: React.FC<{
    validatePath: (item?: string, module?: string, path?: string) => boolean;
}> = ({ validatePath }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>): void => setAnchorEl(anchorEl ? null : event.currentTarget);

    const handleClickAway = (): void => setAnchorEl(null);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div
                id={generateId({
                    module: ModuleApp.HEADER,
                    submodule: 'shortcuts',
                    action: ActionElementType.CONTAINER,
                    elementType: ElementType.CONT,
                })}
                className="flex content-center tooltip"
            >
                <img className="cursor-pointer tooltip--icon-width" alt={OPTIONS.SHORTCUTS} onClick={handleClick} src={add} />
                <Tooltip
                    id={generateId({
                        module: ModuleApp.HEADER,
                        submodule: 'shortcuts',
                        action: ActionElementType.CONTAINER,
                        elementType: ElementType.TOOL,
                    })}
                    wrapperClassName="help-tooltip"
                    anchorEl={anchorEl}
                    placement="bottom"
                >
                    <h3 className="cursor-pointer help-tooltip__title">{OPTIONS.SHORTCUTS}</h3>
                    <div className="flex flex-col flex-1">
                        {SHORTCUTS_OPTIONS.map(({ name, module, path }) => (
                            <button
                                id={generateId({
                                    module: ModuleApp.HEADER,
                                    submodule: `shortcuts-${name}`,
                                    action: ActionElementType.ACTION,
                                    elementType: ElementType.BTN,
                                })}
                                key={name}
                                className="help-tooltip__option"
                                onClick={(): boolean => {
                                    handleClickAway();
                                    return validatePath(name, module, path);
                                }}
                            >
                                <p className="help-tooltip__option-name">{name}</p>
                            </button>
                        ))}
                    </div>
                </Tooltip>
                <span className={`${!anchorEl ? 'tooltip-item -left-5' : 'tooltip-item-menu'}`}>{OPTIONS.SHORTCUTS}</span>
            </div>
        </ClickAwayListener>
    );
};
